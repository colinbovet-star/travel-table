import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    return NextResponse.next({ request: req })
  }

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

  const { data: { user } } = await supabase.auth.getUser()

  const isAuthRoute = path.startsWith('/auth')
  const isProfileBuilder = path.startsWith('/profile-builder')
  const isDashboard = path.startsWith('/dashboard')
  const isDirectory = path.startsWith('/directory')

  // Unauthenticated → redirect to signup for protected routes
  if (!user && (isProfileBuilder || isDashboard || isDirectory)) {
    return NextResponse.redirect(new URL('/auth/signup', req.nextUrl))
  }

  if (user) {
    // Redirect away from auth pages
    if (isAuthRoute) {
      const { data: member } = await supabase
        .from('members')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single()

      return NextResponse.redirect(
        new URL(member?.onboarding_completed ? '/dashboard' : '/profile-builder', req.nextUrl)
      )
    }

    // Redirect to profile builder if onboarding not done
    if (isDashboard || isDirectory) {
      const { data: member } = await supabase
        .from('members')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single()

      if (!member?.onboarding_completed) {
        return NextResponse.redirect(new URL('/profile-builder', req.nextUrl))
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/auth/:path*',
    '/profile-builder/:path*',
    '/dashboard/:path*',
    '/directory/:path*',
  ],
}
