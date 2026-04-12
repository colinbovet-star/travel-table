'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import StepIndicator from '@/components/onboarding/StepIndicator'
import Toggle from '@/components/ui/Toggle'
import Button from '@/components/ui/Button'
import GuidelinesModal from '@/components/onboarding/GuidelinesModal'

const schema = z.object({
  guidelines_agreed: z.boolean().refine((v) => v, 'You must agree to the community guidelines'),
  weekly_call_emails: z.boolean(),
  discovery_emails: z.boolean(),
})

type FormData = z.infer<typeof schema>

export default function Step4Page() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [guidelinesOpen, setGuidelinesOpen] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      guidelines_agreed: false,
      weekly_call_emails: true,
      discovery_emails: true,
    },
  })

  const guidelinesAgreed = watch('guidelines_agreed')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('weekly_call_emails, discovery_emails')
        .eq('id', user.id)
        .single()

      if (data) {
        if (data.weekly_call_emails !== undefined) setValue('weekly_call_emails', data.weekly_call_emails)
        if (data.discovery_emails !== undefined) setValue('discovery_emails', data.discovery_emails)
      }
    }
    load()
  }, [setValue])

  async function onSubmit(data: FormData) {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('profiles')
      .update({
        weekly_call_emails: data.weekly_call_emails,
        discovery_emails: data.discovery_emails,
        onboarding_completed: true,
      })
      .eq('id', user.id)

    // Add to Resend audience if opted in
    if (data.weekly_call_emails) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single()

      await fetch('/api/resend/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          firstName: profile?.display_name || '',
          audience: 'weekly-calls',
        }),
      })
    }

    router.push('/dashboard?welcome=1')
  }

  return (
    <div className="flex flex-col gap-8">
      <StepIndicator
        currentStep={4}
        totalSteps={4}
        onPrev={() => router.push('/onboarding/step-3')}
      />

      <div>
        <h1
          className="text-3xl font-light text-[var(--text)] mb-2"
          style={{ fontFamily: 'var(--font-cormorant), "Cormorant Garamond", serif' }}
        >
          You're almost in!
        </h1>
        <p className="text-sm text-[var(--text-mid)]">A couple of quick things</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Community guidelines */}
        <div className="bg-white border border-[var(--pink-mid)] rounded-xl p-4 flex flex-col gap-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-0.5 w-4 h-4 accent-[var(--green)] flex-shrink-0"
              {...register('guidelines_agreed')}
            />
            <span className="text-sm text-[var(--text-mid)]">
              I've read and agree to the{' '}
              <button
                type="button"
                onClick={() => setGuidelinesOpen(true)}
                className="text-[var(--green)] font-medium underline underline-offset-2 hover:text-[var(--text)]"
              >
                community guidelines
              </button>
            </span>
          </label>
          {errors.guidelines_agreed && (
            <p className="text-xs text-red-500 pl-7">{errors.guidelines_agreed.message}</p>
          )}
        </div>

        {/* Email preferences */}
        <div className="bg-white border border-[var(--pink-mid)] rounded-xl p-4 flex flex-col gap-4">
          <p className="text-sm font-medium text-[var(--text)]">Email preferences</p>
          <Controller
            name="weekly_call_emails"
            control={control}
            render={({ field }) => (
              <Toggle
                checked={field.value}
                onChange={field.onChange}
                label="Send me weekly call invites by email"
              />
            )}
          />
          <Controller
            name="discovery_emails"
            control={control}
            render={({ field }) => (
              <Toggle
                checked={field.value}
                onChange={field.onChange}
                label="Send me occasional travel inspiration and community updates"
              />
            )}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/onboarding/step-3')}
          >
            ← Back
          </Button>
          <Button
            type="submit"
            variant="pink"
            loading={saving}
            disabled={!guidelinesAgreed || saving}
            className="flex-1"
          >
            Complete my profile →
          </Button>
        </div>
      </form>

      {guidelinesOpen && <GuidelinesModal onClose={() => setGuidelinesOpen(false)} />}
    </div>
  )
}
