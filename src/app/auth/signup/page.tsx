'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input, Select } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import GoogleButton from '@/components/auth/GoogleButton'

const schema = z.object({
  first_name: z.string().min(2, 'Please enter your first name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  referral_source: z.string().min(1, 'Please choose an option'),
  referred_by_name: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function SignupPage() {
  const searchParams = useSearchParams()
  const refParam = searchParams.get('ref') // referral link UUID
  const [submitted, setSubmitted] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: '',
      email: '',
      phone: '',
      referral_source: '',
      referred_by_name: '',
    },
  })

  const referralSource = watch('referral_source')
  const showReferredBy = referralSource === 'Referral' || referralSource === 'Friend'

  async function onSubmit(data: FormData) {
    setServerError(null)
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithOtp({
      email: data.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          first_name: data.first_name,
          phone: data.phone || null,
          referral_source: data.referral_source,
          referred_by_name: data.referred_by_name || null,
          referred_by_user_id: refParam || null,
        },
      },
    })

    if (error) {
      if (error.message.toLowerCase().includes('rate limit')) {
        setServerError('Too many attempts. Please wait a few minutes and try again.')
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
            <p className="text-[var(--text-mid)] mb-2">
              We sent a magic link to
            </p>
            <p className="font-medium text-[var(--olive)] mb-6">{submittedEmail}</p>
            <p className="text-sm text-[var(--text-light)]">
              Click the link in your email to complete your signup. You can close this tab.
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
            <h1 className="text-4xl text-[var(--text)] mb-3">
              Join the Dating Table
            </h1>
            <p className="text-sm text-[var(--text-light)]">
              A curated community for single women dating with intention
            </p>
          </div>

          <div className="bg-white border border-[var(--tan)] rounded-2xl p-8 shadow-sm">
            <div className="mb-5">
              <GoogleButton />
            </div>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-[var(--tan-light)]" />
              <span className="text-xs text-[var(--text-light)]">or continue with email</span>
              <div className="flex-1 h-px bg-[var(--tan-light)]" />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <Input
                label="First name"
                placeholder="Your first name"
                error={errors.first_name?.message}
                {...register('first_name')}
              />

              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Phone (optional)"
                type="tel"
                placeholder="+1 (555) 000-0000"
                {...register('phone')}
              />

              <Controller
                name="referral_source"
                control={control}
                render={({ field }) => (
                  <Select
                    label="How did you hear about us?"
                    placeholder="Select one..."
                    error={errors.referral_source?.message}
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="Referral">Referral</option>
                    <option value="Friend">Friend</option>
                    <option value="Matchmaker">Matchmaker</option>
                    <option value="Other">Other</option>
                  </Select>
                )}
              />

              {showReferredBy && (
                <Input
                  label="Who referred you?"
                  placeholder="Their name or email"
                  {...register('referred_by_name')}
                />
              )}

              {serverError && (
                <p className="text-sm text-red-500">{serverError}</p>
              )}

              <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
                className="w-full mt-1"
              >
                Send my magic link
              </Button>

              <p className="text-center text-sm text-[var(--text-light)]">
                Already a member?{' '}
                <Link href="/auth/signin" className="text-[var(--olive)] font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
