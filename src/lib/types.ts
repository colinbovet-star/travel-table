export type MemberType = 'intro' | 'member' | 'vip'

export interface Member {
  id: string
  email: string | null
  first_name: string | null
  phone: string | null
  referral_source: string | null
  referred_by_name: string | null
  referred_by_user_id: string | null
  member_type: MemberType
  profile_completion: number
  cinqe_opt_in: boolean

  // Step 1 — About You
  age: number | null
  city: string | null
  state: string | null
  relationship_status: string | null
  headshot_url: string | null
  photo_2_url: string | null
  photo_3_url: string | null
  how_long_single: string | null
  dating_activity: string | null
  exciting_about_dating: string | null
  hoping_to_gain: string[] | null
  topics_to_discuss: string | null

  // Step 2 — Who You're Open to Meeting
  age_min: number | null
  age_max: number | null
  travel_distance: string | null
  open_to_relocate: string | null
  want_marriage: string | null
  want_children: string | null
  has_children: boolean | null
  religion: string | null
  religion_importance: string | null
  politics: string | null
  deal_breakers: string | null

  // Step 3 — Table Preferences
  table_experiences: string[] | null

  // Step 4 — Membership + Community
  membership_interest: string[] | null
  cinqe_interest: string | null
  instagram_handle: string | null

  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export interface Referral {
  id: string
  referrer_id: string
  invitee_email: string
  status: 'Invited' | 'Signed Up' | 'Completed'
  created_at: string
}
