export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'practitioner' | 'admin' | 'referrer'
export type APStatus = 'pending' | 'verified' | 'inactive'
export type ProfileStatus = 'draft' | 'active' | 'suspended'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          email_verified: boolean
          role: UserRole
          ahpra_number: string | null
          ahpra_verified: boolean
          ahpra_verified_at: string | null
          created_at: string
          updated_at: string
          last_login_at: string | null
        }
        Insert: {
          id?: string
          email: string
          email_verified?: boolean
          role?: UserRole
          ahpra_number?: string | null
          ahpra_verified?: boolean
          ahpra_verified_at?: string | null
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          email_verified?: boolean
          role?: UserRole
          ahpra_number?: string | null
          ahpra_verified?: boolean
          ahpra_verified_at?: string | null
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
        }
      }
      practitioners: {
        Row: {
          id: string
          user_id: string
          slug: string
          title: string | null
          first_name: string
          last_name: string
          photo_url: string | null
          bio: string | null
          ahpra_number: string
          qualifications: string[]
          ap_status: APStatus
          ap_tga_number: string | null
          ap_verified_at: string | null
          ap_conditions: string[]
          ap_substances: string[]
          clinic_name: string | null
          website: string | null
          contact_email: string | null
          contact_phone: string | null
          accepting_patients: boolean
          waitlist_weeks: number | null
          telehealth: boolean
          funding_medicare: boolean
          funding_dva: boolean
          funding_ndis: boolean
          funding_private: boolean
          funding_workcover: boolean
          referral_process: string | null
          referral_form_url: string | null
          referral_email: string | null
          referral_phone: string | null
          profile_status: ProfileStatus
          profile_completeness: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          slug: string
          title?: string | null
          first_name: string
          last_name: string
          photo_url?: string | null
          bio?: string | null
          ahpra_number: string
          qualifications?: string[]
          ap_status?: APStatus
          ap_tga_number?: string | null
          ap_verified_at?: string | null
          ap_conditions?: string[]
          ap_substances?: string[]
          clinic_name?: string | null
          website?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          accepting_patients?: boolean
          waitlist_weeks?: number | null
          telehealth?: boolean
          funding_medicare?: boolean
          funding_dva?: boolean
          funding_ndis?: boolean
          funding_private?: boolean
          funding_workcover?: boolean
          referral_process?: string | null
          referral_form_url?: string | null
          referral_email?: string | null
          referral_phone?: string | null
          profile_status?: ProfileStatus
          profile_completeness?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          slug?: string
          title?: string | null
          first_name?: string
          last_name?: string
          photo_url?: string | null
          bio?: string | null
          ahpra_number?: string
          qualifications?: string[]
          ap_status?: APStatus
          ap_tga_number?: string | null
          ap_verified_at?: string | null
          ap_conditions?: string[]
          ap_substances?: string[]
          clinic_name?: string | null
          website?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          accepting_patients?: boolean
          waitlist_weeks?: number | null
          telehealth?: boolean
          funding_medicare?: boolean
          funding_dva?: boolean
          funding_ndis?: boolean
          funding_private?: boolean
          funding_workcover?: boolean
          referral_process?: string | null
          referral_form_url?: string | null
          referral_email?: string | null
          referral_phone?: string | null
          profile_status?: ProfileStatus
          profile_completeness?: number
          created_at?: string
          updated_at?: string
        }
      }
      practitioner_locations: {
        Row: {
          id: string
          practitioner_id: string
          name: string | null
          address: string | null
          suburb: string | null
          state: string
          postcode: string | null
          latitude: number | null
          longitude: number | null
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          practitioner_id: string
          name?: string | null
          address?: string | null
          suburb?: string | null
          state: string
          postcode?: string | null
          latitude?: number | null
          longitude?: number | null
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          practitioner_id?: string
          name?: string | null
          address?: string | null
          suburb?: string | null
          state?: string
          postcode?: string | null
          latitude?: number | null
          longitude?: number | null
          is_primary?: boolean
          created_at?: string
        }
      }
      training_records: {
        Row: {
          id: string
          practitioner_id: string
          provider: string
          program: string
          completed_at: string | null
          certificate_id: string | null
          verified: boolean
          verified_at: string | null
          verified_by: string | null
          is_pi_graduate: boolean
          pi_student_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          practitioner_id: string
          provider: string
          program: string
          completed_at?: string | null
          certificate_id?: string | null
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
          is_pi_graduate?: boolean
          pi_student_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          practitioner_id?: string
          provider?: string
          program?: string
          completed_at?: string | null
          certificate_id?: string | null
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
          is_pi_graduate?: boolean
          pi_student_id?: string | null
          created_at?: string
        }
      }
      conditions: {
        Row: {
          id: string
          name: string
          description: string | null
          display_order: number
        }
        Insert: {
          id: string
          name: string
          description?: string | null
          display_order?: number
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          display_order?: number
        }
      }
      states: {
        Row: {
          code: string
          name: string
          display_order: number
        }
        Insert: {
          code: string
          name: string
          display_order?: number
        }
        Update: {
          code?: string
          name?: string
          display_order?: number
        }
      }
    }
    Views: {
      active_practitioners: {
        Row: {
          id: string
          slug: string
          title: string | null
          first_name: string
          last_name: string
          photo_url: string | null
          clinic_name: string | null
          ap_conditions: string[]
          accepting_patients: boolean
          waitlist_weeks: number | null
          telehealth: boolean
          funding_medicare: boolean
          funding_dva: boolean
          funding_ndis: boolean
          funding_private: boolean
          state: string | null
          suburb: string | null
          postcode: string | null
          training_providers: string[] | null
          pi_trained: boolean
        }
      }
    }
    Functions: {
      add_pi_graduate: {
        Args: {
          p_email: string
          p_first_name: string
          p_last_name: string
          p_ahpra_number: string
          p_program: string
          p_completed_at: string
          p_student_id: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types for common use
export type User = Database['public']['Tables']['users']['Row']
export type Practitioner = Database['public']['Tables']['practitioners']['Row']
export type PractitionerLocation = Database['public']['Tables']['practitioner_locations']['Row']
export type TrainingRecord = Database['public']['Tables']['training_records']['Row']
export type Condition = Database['public']['Tables']['conditions']['Row']
export type State = Database['public']['Tables']['states']['Row']
export type ActivePractitioner = Database['public']['Views']['active_practitioners']['Row']

// Types with relations
export type PractitionerWithRelations = Practitioner & {
  locations: PractitionerLocation[]
  training_records: TrainingRecord[]
}
