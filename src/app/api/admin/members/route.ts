import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

function isAdminAuthed(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const session = cookieStore.get('admin_session')?.value
  return !!process.env.ADMIN_PASSWORD && session === process.env.ADMIN_PASSWORD
}

export async function GET(req: NextRequest) {
  const cookieStore = await cookies()
  if (!isAdminAuthed(cookieStore)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const url = new URL(req.url)
  const city = url.searchParams.get('city')
  const memberType = url.searchParams.get('member_type')
  const tableExp = url.searchParams.get('table_experience')
  const cinqe = url.searchParams.get('cinqe')
  const marriage = url.searchParams.get('want_marriage')
  const children = url.searchParams.get('want_children')

  let query = supabase.from('members').select('*').order('created_at', { ascending: false })

  if (city) query = query.ilike('city', `%${city}%`)
  if (memberType) query = query.eq('member_type', memberType)
  if (tableExp) query = query.contains('table_experiences', [tableExp])
  if (cinqe === 'true') query = query.eq('cinqe_opt_in', true)
  if (marriage) query = query.eq('want_marriage', marriage)
  if (children) query = query.eq('want_children', children)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ members: data })
}
