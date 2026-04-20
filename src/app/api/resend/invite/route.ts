import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendReferralInvite } from '@/lib/resend'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { emails, personalNote } = await req.json() as {
    emails: string[]
    personalNote?: string
  }

  if (!emails?.length) return NextResponse.json({ error: 'No emails provided' }, { status: 400 })

  const { data: member } = await supabase
    .from('members')
    .select('first_name')
    .eq('id', user.id)
    .single()

  const referrerName = member?.first_name ?? 'A friend'
  const origin = req.headers.get('origin') ?? ''
  const referralLink = `${origin}/auth/signup?ref=${user.id}`

  // Insert referral rows + send invite emails
  const inserts = emails.map((email: string) => ({
    referrer_id: user.id,
    invitee_email: email,
    status: 'Invited',
  }))

  await supabase.from('referrals').insert(inserts)

  await Promise.all(
    emails.map((email: string) =>
      sendReferralInvite(email, referrerName, personalNote ?? null, referralLink)
    )
  )

  return NextResponse.json({ ok: true, count: emails.length })
}
