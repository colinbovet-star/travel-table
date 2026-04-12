'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import GoogleButton from '@/components/auth/GoogleButton'

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type FormData = z.infer<typeof schema>

export default function SigninPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  })

  async function onSubmit(data: FormData) {
    setServerError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setServerError('Invalid email or password. Please try again.')
      return
    }

    // Check onboarding status
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single()

    if (profile?.onboarding_completed) {
      router.push('/dashboard')
    } else {
      router.push('/onboarding/step-1')
    }
  }

  return (
    <div className="min-h-screen bg-[var(--cream)] flex flex-col">
      <header className="px-8 py-5 flex items-center">
        <Link
          href="/"
          className="text-lg font-normal tracking-[0.04em] text-[var(--text)] hover:text-[var(--pink)] transition-colors"
          style={{ fontFamily: 'var(--font-cormorant), "Cormorant Garamond", serif' }}
        >
          Travel <span className="text-[var(--pink)]">Table</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1
              className="text-4xl font-light text-[var(--text)] mb-3"
              style={{ fontFamily: 'var(--font-cormorant), "Cormorant Garamond", serif' }}
            >
              Welcome back
            </h1>
            <p className="text-sm text-[var(--text-light)]">
              Sign in to your Travel Table account
            </p>
          </div>

          <div className="bg-white border border-[var(--pink-mid)] rounded-2xl p-8 shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <GoogleButton />

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[var(--pink-mid)]" />
                <span className="text-xs text-[var(--text-light)]">or</span>
                <div className="flex-1 h-px bg-[var(--pink-mid)]" />
              </div>

              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Your password"
                error={errors.password?.message}
                {...register('password')}
              />

              {serverError && (
                <p className="text-sm text-red-500">{serverError}</p>
              )}

              <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
                className="w-full mt-1"
              >
                Sign in
              </Button>

              <p className="text-center text-sm text-[var(--text-light)]">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="text-[var(--green)] font-medium hover:underline">
                  Create one
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
