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
import PasswordStrength from '@/components/auth/PasswordStrength'

const schema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    ageConfirmed: z.boolean().refine((v) => v, 'You must confirm you are 30 or over'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

export default function SignupForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [duplicateEmail, setDuplicateEmail] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  })

  const password = watch('password', '')

  async function onSubmit(data: FormData) {
    setServerError(null)
    setDuplicateEmail(false)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { first_name: data.firstName },
      },
    })

    if (error) {
      if (error.message.toLowerCase().includes('already registered')) {
        setDuplicateEmail(true)
      } else {
        setServerError(error.message)
      }
      return
    }

    router.push('/onboarding/step-1')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <GoogleButton />

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[var(--pink-mid)]" />
        <span className="text-xs text-[var(--text-light)]">or</span>
        <div className="flex-1 h-px bg-[var(--pink-mid)]" />
      </div>

      <Input
        label="First name"
        placeholder="Your first name"
        error={errors.firstName?.message}
        {...register('firstName')}
      />

      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      {duplicateEmail && (
        <p className="text-sm text-red-500 -mt-2">
          An account with this email already exists.{' '}
          <Link href="/auth/signin" className="underline hover:text-[var(--pink)]">
            Sign in →
          </Link>
        </p>
      )}

      <div>
        <Input
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register('password')}
        />
        <PasswordStrength password={password} />
      </div>

      <Input
        label="Confirm password"
        type="password"
        placeholder="Repeat your password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          className="mt-0.5 w-4 h-4 accent-[var(--green)] flex-shrink-0"
          {...register('ageConfirmed')}
        />
        <span className="text-sm text-[var(--text-mid)]">
          I confirm I am 30 or over
        </span>
      </label>
      {errors.ageConfirmed && (
        <p className="text-xs text-red-500 -mt-3">{errors.ageConfirmed.message}</p>
      )}

      {serverError && (
        <p className="text-sm text-red-500">{serverError}</p>
      )}

      <Button
        type="submit"
        variant="primary"
        loading={isSubmitting}
        disabled={!isValid || isSubmitting}
        className="w-full mt-1"
      >
        Create account
      </Button>

      <p className="text-center text-sm text-[var(--text-light)]">
        Already have an account?{' '}
        <Link href="/auth/signin" className="text-[var(--green)] font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
