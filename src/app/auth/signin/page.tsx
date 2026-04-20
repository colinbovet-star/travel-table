'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import GoogleButton from '@/components/auth/GoogleButton'

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type FormData = z.infer<typeof schema>

export default function SigninPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')
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

    const { error } = await supabase.auth.signInWithOtp({
      email: data.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: false,
      },
    })

    if (error) {
      if (error.message.toLowerCase().includes('rate limit')) {
        setServerError('Too many attempts. Please wait a few minutes and try again.')
      } else if (error.message.toLowerCase().includes('user not found') || error.status === 400) {
        setServerError("We couldn't find an account with that email. Try signing up instead.")
      } else {
        setServerError(error.message)
      }
      return
    }

    setSubmittedEmail(data.email)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--cream)] flex flex-col">
        <header className="px-8 py-5">
          <Link href="/" className="text-lg font-medium text-[var(--olive)] tracking-wide">
            Dating <span className="text-[var(--blush)]">Table</span>
          </Link>
        </header>
        <main className="flex-1 flex items-center justify-center px-4 pb-12">
          <div className="w-full max-w-md text-center">
            <div className="text-4xl mb-6">💌</div>
            <h1 className="text-3xl text-[var(--text)] mb-3">Check your email</h1>
            <p className="text-[var(--text-mid)] mb-2">We sent a magic link to</p>
            <p className="font-medium text-[var(--olive)] mb-6">{submittedEmail}</p>
            <p className="text-sm text-[var(--text-light)]">
              Click the link in your email to sign in. You can close this tab.
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--cream)] flex flex-col">
      <header className="px-8 py-5">
        <Link href="/" className="text-lg font-medium text-[var(--olive)] tracking-wide">
          Dating <span className="text-[var(--blush)]">Table</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl text-[var(--text)] mb-3">Welcome back</h1>
            <p className="text-sm text-[var(--text-light)]">
              Enter your email and we'll send you a magic link
            </p>
          </div>

          <div className="bg-white border border-[var(--tan)] rounded-2xl p-8 shadow-sm">
            <div className="mb-5">
              <GoogleButton />
            </div>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-[var(--tan-light)]" />
              <span className="text-xs text-[var(--text-light)]">or sign in with email</span>
              <div className="flex-1 h-px bg-[var(--tan-light)]" />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
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
                Send magic link
              </Button>

              <p className="text-center text-sm text-[var(--text-light)]">
                New here?{' '}
                <Link href="/auth/signup" className="text-[var(--olive)] font-medium hover:underline">
                  Create an account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
