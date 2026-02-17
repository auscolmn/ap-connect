// @ts-nocheck
// TODO: Fix Supabase types when env vars are available at build time
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Database, Practitioner, PractitionerLocation, TrainingRecord } from '@/types/database'

type PractitionerInsert = Database['public']['Tables']['practitioners']['Insert']
type PractitionerUpdate = Database['public']['Tables']['practitioners']['Update']
type LocationInsert = Database['public']['Tables']['practitioner_locations']['Insert']
type TrainingInsert = Database['public']['Tables']['training_records']['Insert']

// Get current user
export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Create initial practitioner profile
export async function createPractitionerProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const ahpraNumber = formData.get('ahpraNumber') as string
  const title = formData.get('title') as string

  // Generate slug
  const baseSlug = `${firstName}-${lastName}`.toLowerCase().replace(/[^a-z0-9-]/g, '')
  
  const { data: existing } = await supabase
    .from('practitioners')
    .select('slug')
    .like('slug', `${baseSlug}%`)

  let slug = baseSlug
  if (existing && existing.length > 0) {
    slug = `${baseSlug}-${existing.length + 1}`
  }

  const insertData: PractitionerInsert = {
    user_id: user.id,
    first_name: firstName,
    last_name: lastName,
    ahpra_number: ahpraNumber,
    title: title || null,
    slug,
    profile_status: 'draft',
    ap_status: 'pending'
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('practitioners') as any).insert(insertData)

  if (error) {
    console.error('Error creating profile:', error)
    throw new Error('Failed to create profile')
  }

  revalidatePath('/dashboard')
  redirect('/dashboard/profile')
}

// Update practitioner profile
export async function updatePractitionerProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  // Get current practitioner
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: practitioner } = await (supabase.from('practitioners') as any).select('id').eq('user_id', user.id).single() as { data: { id: string } | null }

  if (!practitioner) {
    throw new Error('Practitioner profile not found')
  }

  const updates: PractitionerUpdate = {
    title: formData.get('title') as string || null,
    first_name: formData.get('firstName') as string,
    last_name: formData.get('lastName') as string,
    bio: formData.get('bio') as string || null,
    ahpra_number: formData.get('ahpraNumber') as string,
    qualifications: (formData.get('qualifications') as string)?.split(',').map(q => q.trim()).filter(Boolean) || [],
    clinic_name: formData.get('clinicName') as string || null,
    website: formData.get('website') as string || null,
    contact_email: formData.get('contactEmail') as string || null,
    contact_phone: formData.get('contactPhone') as string || null,
    ap_conditions: formData.getAll('conditions') as string[],
    telehealth: formData.get('telehealth') === 'on',
    funding_medicare: formData.get('fundingMedicare') === 'on',
    funding_dva: formData.get('fundingDva') === 'on',
    funding_ndis: formData.get('fundingNdis') === 'on',
    funding_private: formData.get('fundingPrivate') === 'on',
    funding_workcover: formData.get('fundingWorkcover') === 'on',
    referral_process: formData.get('referralProcess') as string || null,
    referral_email: formData.get('referralEmail') as string || null,
    referral_phone: formData.get('referralPhone') as string || null,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('practitioners') as any).update(updates).eq('id', practitioner.id)

  if (error) {
    console.error('Error updating profile:', error)
    throw new Error('Failed to update profile')
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/profile')
}

// Update availability
export async function updateAvailability(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const acceptingPatients = formData.get('acceptingPatients') === 'on'
  const waitlistWeeks = formData.get('waitlistWeeks')

  const { error } = await supabase
    .from('practitioners')
    .update({
      accepting_patients: acceptingPatients,
      waitlist_weeks: waitlistWeeks ? parseInt(waitlistWeeks as string) : null
    })
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating availability:', error)
    throw new Error('Failed to update availability')
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/availability')
}

// Add location
export async function addLocation(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { data: practitioner } = await supabase
    .from('practitioners')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!practitioner) {
    throw new Error('Practitioner profile not found')
  }

  const isPrimary = formData.get('isPrimary') === 'on'

  // If setting as primary, unset other primaries first
  if (isPrimary) {
    await supabase
      .from('practitioner_locations')
      .update({ is_primary: false })
      .eq('practitioner_id', practitioner.id)
  }

  const locationData: LocationInsert = {
    practitioner_id: practitioner.id,
    name: formData.get('name') as string || null,
    address: formData.get('address') as string || null,
    suburb: formData.get('suburb') as string || null,
    state: formData.get('state') as string,
    postcode: formData.get('postcode') as string || null,
    is_primary: isPrimary
  }

  const { error } = await supabase
    .from('practitioner_locations')
    .insert(locationData)

  if (error) {
    console.error('Error adding location:', error)
    throw new Error('Failed to add location')
  }

  revalidatePath('/dashboard/locations')
}

// Delete location
export async function deleteLocation(locationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  // Verify ownership through practitioner
  const { data: practitioner } = await supabase
    .from('practitioners')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!practitioner) {
    throw new Error('Practitioner profile not found')
  }

  const { error } = await supabase
    .from('practitioner_locations')
    .delete()
    .eq('id', locationId)
    .eq('practitioner_id', practitioner.id)

  if (error) {
    console.error('Error deleting location:', error)
    throw new Error('Failed to delete location')
  }

  revalidatePath('/dashboard/locations')
}

// Add training record
export async function addTrainingRecord(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { data: practitioner } = await supabase
    .from('practitioners')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!practitioner) {
    throw new Error('Practitioner profile not found')
  }

  const trainingData: TrainingInsert = {
    practitioner_id: practitioner.id,
    provider: formData.get('provider') as string,
    program: formData.get('program') as string,
    completed_at: formData.get('completedAt') as string || null,
    certificate_id: formData.get('certificateId') as string || null,
    is_pi_graduate: (formData.get('provider') as string)?.toLowerCase().includes('psychedelic institute'),
    verified: false
  }

  const { error } = await supabase
    .from('training_records')
    .insert(trainingData)

  if (error) {
    console.error('Error adding training:', error)
    throw new Error('Failed to add training record')
  }

  revalidatePath('/dashboard/training')
}

// Submit profile for verification
export async function submitForVerification() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  // Check if profile is complete enough
  const { data: practitioner } = await supabase
    .from('practitioners')
    .select('*, practitioner_locations(*)')
    .eq('user_id', user.id)
    .single()

  if (!practitioner) {
    throw new Error('Practitioner profile not found')
  }

  // Basic validation
  const errors: string[] = []
  if (!practitioner.first_name || !practitioner.last_name) errors.push('Name is required')
  if (!practitioner.ahpra_number) errors.push('AHPRA number is required')
  if (!practitioner.ap_conditions || practitioner.ap_conditions.length === 0) errors.push('At least one condition must be selected')
  if (!practitioner.practitioner_locations || practitioner.practitioner_locations.length === 0) errors.push('At least one location is required')

  if (errors.length > 0) {
    throw new Error(`Cannot submit: ${errors.join(', ')}`)
  }

  // Update status
  const { error } = await supabase
    .from('practitioners')
    .update({
      profile_status: 'draft', // remains draft until admin approves
      ap_status: 'pending'
    })
    .eq('id', practitioner.id)

  if (error) {
    console.error('Error submitting for verification:', error)
    throw new Error('Failed to submit for verification')
  }

  revalidatePath('/dashboard')
}
