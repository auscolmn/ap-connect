// @ts-nocheck
// TODO: Fix Supabase types when env vars are available at build time
import { createClient } from '@/lib/supabase/server'
import type { 
  Practitioner, 
  PractitionerLocation, 
  TrainingRecord,
  ActivePractitioner,
  Condition,
  State
} from '@/types/database'

export interface SearchFilters {
  state?: string
  condition?: string
  acceptingOnly?: boolean
  telehealthOnly?: boolean
  piTrainedOnly?: boolean
  query?: string
}

export interface PractitionerWithDetails extends Practitioner {
  locations: PractitionerLocation[]
  training_records: TrainingRecord[]
}

// Search active practitioners with filters
export async function searchPractitioners(filters: SearchFilters = {}) {
  const supabase = await createClient()
  
  let query = supabase
    .from('active_practitioners')
    .select('*')

  // Apply filters
  if (filters.state && filters.state !== 'all') {
    query = query.eq('state', filters.state)
  }

  if (filters.condition && filters.condition !== 'all') {
    query = query.contains('ap_conditions', [filters.condition.toUpperCase()])
  }

  if (filters.acceptingOnly) {
    query = query.eq('accepting_patients', true)
  }

  if (filters.telehealthOnly) {
    query = query.eq('telehealth', true)
  }

  if (filters.piTrainedOnly) {
    query = query.eq('pi_trained', true)
  }

  // Text search on name/clinic
  if (filters.query) {
    query = query.or(
      `first_name.ilike.%${filters.query}%,last_name.ilike.%${filters.query}%,clinic_name.ilike.%${filters.query}%`
    )
  }

  // Order by accepting patients first, then by name
  query = query
    .order('accepting_patients', { ascending: false })
    .order('last_name', { ascending: true })

  const { data, error } = await query

  if (error) {
    console.error('Error searching practitioners:', error)
    return []
  }

  return data as ActivePractitioner[]
}

// Get a single practitioner by slug (public profile)
export async function getPractitionerBySlug(slug: string): Promise<PractitionerWithDetails | null> {
  const supabase = await createClient()

  // First get the practitioner
  const { data: practitioner, error: practitionerError } = await supabase
    .from('practitioners')
    .select('*')
    .eq('slug', slug)
    .eq('profile_status', 'active')
    .eq('ap_status', 'verified')
    .single()

  if (practitionerError || !practitioner) {
    return null
  }

  // Get locations
  const { data: locations } = await supabase
    .from('practitioner_locations')
    .select('*')
    .eq('practitioner_id', practitioner.id)
    .order('is_primary', { ascending: false })

  // Get verified training records
  const { data: training } = await supabase
    .from('training_records')
    .select('*')
    .eq('practitioner_id', practitioner.id)
    .eq('verified', true)
    .order('completed_at', { ascending: false })

  return {
    ...practitioner,
    locations: locations || [],
    training_records: training || []
  }
}

// Get practitioner by user ID (for dashboard)
export async function getPractitionerByUserId(userId: string): Promise<PractitionerWithDetails | null> {
  const supabase = await createClient()

  const { data: practitioner, error } = await supabase
    .from('practitioners')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error || !practitioner) {
    return null
  }

  // Get locations
  const { data: locations } = await supabase
    .from('practitioner_locations')
    .select('*')
    .eq('practitioner_id', practitioner.id)
    .order('is_primary', { ascending: false })

  // Get all training records (including unverified for own profile)
  const { data: training } = await supabase
    .from('training_records')
    .select('*')
    .eq('practitioner_id', practitioner.id)
    .order('completed_at', { ascending: false })

  return {
    ...practitioner,
    locations: locations || [],
    training_records: training || []
  }
}

// Get conditions list
export async function getConditions(): Promise<Condition[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('conditions')
    .select('*')
    .order('display_order')

  if (error) {
    console.error('Error fetching conditions:', error)
    return []
  }

  return data as Condition[]
}

// Get states list
export async function getStates(): Promise<State[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('states')
    .select('*')
    .order('display_order')

  if (error) {
    console.error('Error fetching states:', error)
    return []
  }

  return data as State[]
}
