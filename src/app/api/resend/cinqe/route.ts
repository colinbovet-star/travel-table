import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendCinqeEmail } from '@/lib/resend'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: member } = await supabase
    .from('members')
    .select('email, first_name')
    .eq('id', user.id)
    .single()

  if (!member?.email) return NextResponse.json({ error: 'Member not found' }, { status: 404 })

  await sendCinqeEmail(member.email, member.first_name ?? 'there')

  await supabase
    .from('members')
    .update({ cinqe_opt_in: true })
    .eq('id', user.id)

  return NextResponse.json({ ok: true })
}
