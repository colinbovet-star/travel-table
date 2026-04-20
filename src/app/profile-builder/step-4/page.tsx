'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import StepProgress from '@/components/profile-builder/StepProgress'
import { Input } from '@/components/ui/Input'
import PillSelect from '@/components/ui/PillSelect'
import Button from '@/components/ui/Button'

const schema = z.object({
  membership_interest: z.array(z.string()).min(1, 'Please select at least one'),
  cinqe_interest: z.string().min(1, 'Please choose an option'),
  instagram_handle: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const MEMBERSHIP_OPTIONS = [
  'Structured 3-week Dating Table ($33/month)',
  'Free Monthly Open Table',
  'Both',
]

export default function Step4Page() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [cinqeEmailSent, setCinqeEmailSent] = useState(false)

  const { handleSubmit, control, register, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      membership_interest: [],
      cinqe_interest: '',
      instagram_handle: '',
    },
  })

  const cinqeInterest = watch('cinqe_interest')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('members')
        .select('membership_interest,cinqe_interest,instagram_handle,cinqe_opt_in')
        .eq('id', user.id)
        .single()

      if (data) {
        if (data.membership_interest?.length) setValue('membership_interest', data.membership_interest)
        if (data.cinqe_interest) setValue('cinqe_interest', data.cinqe_interest)
        if (data.instagram_handle) setValue('instagram_handle', data.instagram_handle)
        if (data.cinqe_opt_in) setCinqeEmailSent(true)
      }
    }
    load()
  }, [setValue])

  async function onSubmit(data: FormData) {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Determine member type from membership selection
    const isVip = data.membership_interest.includes('Structured 3-week Dating Table ($33/month)')
    const memberType = isVip ? 'vip' : 'intro'

    await supabase.from('members').update({
      membership_interest: data.membership_interest,
      cinqe_interest: data.cinqe_interest,
      instagram_handle: data.instagram_handle || null,
      member_type: memberType,
    }).eq('id', user.id)

    // Send Cinqe email if opted in and not already sent
    if (data.cinqe_interest === 'Yes, send me the private Cinqe profile link' && !cinqeEmailSent) {
      await fetch('/api/resend/cinqe', { method: 'POST' })
      setCinqeEmailSent(true)
    }

    router.push('/profile-builder/step-5')
  }

  return (
    <div>
      <StepProgress currentStep={4} totalSteps={5} />

      <h1 className="text-3xl text-[var(--text)] mb-2">Membership & community</h1>
      <p className="text-sm text-[var(--text-light)] mb-8">
        Choose how you'd like to be part of the Dating Table.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7">

        {/* Membership interest */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-[var(--text)]">Interested in:</p>
          <Controller name="membership_interest" control={control} render={({ field }) => (
            <PillSelect
              options={MEMBERSHIP_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              multiSelect
              error={errors.membership_interest?.message}
            />
          )} />
        </div>

        {/* Cinqe */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-[var(--text)]">Private matchmaking through our network</p>
          <p className="text-xs text-[var(--text-light)] mb-1">
            Would you like to be considered for private matchmaking through Cinqe?
          </p>
          <Controller name="cinqe_interest" control={control} render={({ field }) => (
            <PillSelect
              options={['Yes, send me the private Cinqe profile link', 'No, just the Dating Table']}
              value={field.value}
              onChange={field.onChange}
              error={errors.cinqe_interest?.message}
            />
          )} />
          {cinqeInterest === 'Yes, send me the private Cinqe profile link' && !cinqeEmailSent && (
            <p className="text-xs text-[var(--blush)] mt-1">
              💌 We'll email you the private Cinqe link when you save this step.
            </p>
          )}
          {cinqeEmailSent && (
            <p className="text-xs text-[var(--text-light)] mt-1">
              ✓ Cinqe link sent to your email
            </p>
          )}
        </div>

        {/* Instagram */}
        <Input
          label="Instagram handle (optional)"
          placeholder="@yourhandle"
          {...register('instagram_handle')}
          hint="Shown on your profile in the member directory"
        />

        <div className="flex gap-3 mt-2">
          <Button type="button" variant="ghost" onClick={() => router.push('/profile-builder/step-3')}>
            ← Back
          </Button>
          <Button type="submit" loading={saving} className="flex-1">
            Save & continue
          </Button>
        </div>
      </form>
    </div>
  )
}
