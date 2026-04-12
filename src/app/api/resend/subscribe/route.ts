import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { addToResendAudience } from '@/lib/resend'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { email, firstName } = await req.json()
  const audienceId = process.env.RESEND_WEEKLY_CALLS_AUDIENCE_ID

  if (!audienceId) {
    return NextResponse.json({ ok: true })
  }

  await addToResendAudience(email, firstName, audienceId)
  return NextResponse.json({ ok: true })
}
