import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname

  // If Supabase env vars aren't configured yet, pass through without auth checks
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    return NextResponse.next({ request: req })
  }

  // Build a Supabase client that can read/write cookies in the proxy context
  let response = NextResponse.next({ request: req })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          response = NextResponse.next({ request: req })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh the session — important to keep it alive
  const { data: { user } } = await supabase.auth.getUser()

  const isAuthRoute = path.startsWith('/auth')
  const isOnboardingRoute = path.startsWith('/onboarding')
  const isDashboardRoute = path.startsWith('/dashboard')

  // Not logged in → redirect to signup when trying to access protected routes
  if (!user && (isOnboardingRoute || isDashboardRoute)) {
    return NextResponse.redirect(new URL('/auth/signup', req.nextUrl))
  }

  // Logged in → check onboarding status
  if (user) {
    // Redirect away from auth pages
    if (isAuthRoute) {
      // Check onboarding_completed
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single()

      if (profile?.onboarding_completed) {
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
      } else {
        return NextResponse.redirect(new URL('/onboarding/step-1', req.nextUrl))
      }
    }

    // Logged in but onboarding incomplete → redirect to onboarding
    if (isDashboardRoute) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single()

      if (!profile?.onboarding_completed) {
        return NextResponse.redirect(new URL('/onboarding/step-1', req.nextUrl))
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/auth/:path*',
    '/onboarding/:path*',
    '/dashboard/:path*',
  ],
}
