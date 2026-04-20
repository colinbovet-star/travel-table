import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const CSV_COLUMNS = [
  'id', 'first_name', 'email', 'phone', 'member_type',
  'referral_source', 'referred_by_name',
  'age', 'city', 'state', 'relationship_status',
  'how_long_single', 'dating_activity',
  'age_min', 'age_max', 'travel_distance', 'open_to_relocate',
  'want_marriage', 'want_children', 'has_children',
  'religion', 'religion_importance', 'politics',
  'cinqe_interest', 'cinqe_opt_in', 'membership_interest',
  'table_experiences', 'instagram_handle',
  'profile_completion', 'onboarding_completed', 'created_at',
]

function escapeCSV(val: unknown): string {
  if (val === null || val === undefined) return ''
  const str = Array.isArray(val) ? val.join('; ') : String(val)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export async function GET() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')?.value
  if (!process.env.ADMIN_PASSWORD || session !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase
    .from('members')
    .select(CSV_COLUMNS.join(', '))
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const header = CSV_COLUMNS.join(',')
  const rows = (data ?? []).map((row) =>
    CSV_COLUMNS.map((col) => escapeCSV((row as unknown as Record<string, unknown>)[col])).join(',')
  )
  const csv = [header, ...rows].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="members-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
