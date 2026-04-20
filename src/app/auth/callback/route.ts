import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Sync metadata from magic link (first_name, phone, referral, etc.)
        const meta = user.user_metadata || {}
        const updatePayload: Record<string, unknown> = {}

        if (meta.first_name) updatePayload.first_name = meta.first_name
        if (meta.phone) updatePayload.phone = meta.phone
        if (meta.referral_source) updatePayload.referral_source = meta.referral_source
        if (meta.referred_by_name) updatePayload.referred_by_name = meta.referred_by_name
        if (meta.referred_by_user_id) updatePayload.referred_by_user_id = meta.referred_by_user_id

        if (Object.keys(updatePayload).length > 0) {
          await supabase
            .from('members')
            .update(updatePayload)
            .eq('id', user.id)
        }

        // Check if profile builder is complete
        const { data: member } = await supabase
          .from('members')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single()

        if (member?.onboarding_completed) {
          return NextResponse.redirect(`${origin}/dashboard`)
        } else {
          return NextResponse.redirect(`${origin}/profile-builder`)
        }
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/signup?error=auth`)
}
