// @ts-nocheck
// TODO: Fix Supabase types when env vars are available at build time
import { createClient, createServiceClient } from '@/lib/supabase/server'
import type { Practitioner, User, TrainingRecord } from '@/types/database'

export interface PendingPractitioner extends Practitioner {
  user: User
  training_records: TrainingRecord[]
  locations: { state: string; suburb: string }[]
}

// Get all practitioners pending verification (admin only)
export async function getPendingPractitioners(): Promise<PendingPractitioner[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('practitioners')
    .select(`
      *,
      user:users!practitioners_user_id_fkey(*),
      training_records(*),
      locations:practitioner_locations(state, suburb)
    `)
    .eq('ap_status', 'pending')
    .eq('profile_status', 'draft')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching pending practitioners:', error)
    return []
  }

  return data as PendingPractitioner[]
}

// Get all practitioners (admin view)
export async function getAllPractitioners(): Promise<any[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('practitioners')
    .select(`
      *,
      user:users!practitioners_user_id_fkey(email, role),
      locations:practitioner_locations(state, suburb, is_primary)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching practitioners:', error)
    return []
  }

  return data || []
}

// Verify a practitioner (admin only)
export async function verifyPractitioner(practitionerId: string, adminId: string) {
  const supabase = await createServiceClient()

  const { error } = await supabase
    .from('practitioners')
    .update({
      ap_status: 'verified',
      ap_verified_at: new Date().toISOString(),
      profile_status: 'active'
    })
    .eq('id', practitionerId)

  if (error) {
    console.error('Error verifying practitioner:', error)
    throw new Error('Failed to verify practitioner')
  }

  return true
}

// Reject/suspend a practitioner
export async function suspendPractitioner(practitionerId: string, reason?: string) {
  const supabase = await createServiceClient()

  const { error } = await supabase
    .from('practitioners')
    .update({
      profile_status: 'suspended',
      ap_status: 'inactive'
    })
    .eq('id', practitionerId)

  if (error) {
    console.error('Error suspending practitioner:', error)
    throw new Error('Failed to suspend practitioner')
  }

  return true
}

// Verify training record
export async function verifyTrainingRecord(trainingId: string, adminId: string) {
  const supabase = await createServiceClient()

  const { error } = await supabase
    .from('training_records')
    .update({
      verified: true,
      verified_at: new Date().toISOString(),
      verified_by: adminId
    })
    .eq('id', trainingId)

  if (error) {
    console.error('Error verifying training:', error)
    throw new Error('Failed to verify training record')
  }

  return true
}

// Get dashboard stats
export async function getAdminStats() {
  const supabase = await createClient()

  const [
    { count: totalPractitioners },
    { count: activePractitioners },
    { count: pendingVerification },
    { count: pendingTraining }
  ] = await Promise.all([
    supabase.from('practitioners').select('*', { count: 'exact', head: true }),
    supabase.from('practitioners').select('*', { count: 'exact', head: true })
      .eq('profile_status', 'active').eq('ap_status', 'verified'),
    supabase.from('practitioners').select('*', { count: 'exact', head: true })
      .eq('ap_status', 'pending'),
    supabase.from('training_records').select('*', { count: 'exact', head: true })
      .eq('verified', false)
  ])

  return {
    totalPractitioners: totalPractitioners || 0,
    activePractitioners: activePractitioners || 0,
    pendingVerification: pendingVerification || 0,
    pendingTraining: pendingTraining || 0
  }
}
