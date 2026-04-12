'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import StepIndicator from '@/components/onboarding/StepIndicator'
import PhotoUpload from '@/components/onboarding/PhotoUpload'
import PillSelect from '@/components/onboarding/PillSelect'
import { Input, Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const schema = z.object({
  display_name: z.string().min(1, 'Display name is required').max(50),
  location: z.string().min(1, 'Please enter where you are based').max(100),
  age: z.number({ error: 'Please enter your age' }).min(30, { error: 'The Travel Table is for women 30 and over' }).max(99),
  bio: z.string().max(200, 'Bio must be 200 characters or less').optional(),
  languages: z.array(z.string()).optional(),
  avatar_url: z.string().nullable().optional(),
})

type FormData = z.infer<typeof schema>

const LANGUAGE_OPTIONS = [
  'English', 'French', 'Spanish', 'Portuguese', 'German',
  'Italian', 'Mandarin', 'Japanese', 'Arabic', 'Other',
]

export default function Step1Page() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { languages: [] },
  })

  const bio = watch('bio', '')
  const location = watch('location', '')

  // Load saved progress
  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('display_name, location, age, bio, languages, avatar_url')
        .eq('id', user.id)
        .single()

      if (data) {
        if (data.display_name) setValue('display_name', data.display_name)
        if (data.location) setValue('location', data.location)
        if (data.age) setValue('age', data.age)
        if (data.bio) setValue('bio', data.bio)
        if (data.languages) setValue('languages', data.languages)
        if (data.avatar_url) setValue('avatar_url', data.avatar_url)
      }
    }
    load()
  }, [setValue])

  async function savePartial(destination: string) {
    const values = getValues()
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push(destination); return }

    await supabase
      .from('profiles')
      .update({
        display_name: values.display_name || null,
        location: values.location || null,
        age: values.age || null,
        bio: values.bio || null,
        languages: values.languages || [],
        avatar_url: values.avatar_url || null,
      })
      .eq('id', user.id)

    router.push(destination)
  }

  async function onSubmit(data: FormData) {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('profiles')
      .update({
        display_name: data.display_name,
        location: data.location,
        age: data.age,
        bio: data.bio || null,
        languages: data.languages || [],
        avatar_url: data.avatar_url || null,
      })
      .eq('id', user.id)

    router.push('/onboarding/step-2')
  }

  return (
    <div className="flex flex-col gap-8">
      <StepIndicator
        currentStep={1}
        totalSteps={4}
        onNext={() => savePartial('/onboarding/step-2')}
      />

      <div>
        <h1
          className="text-3xl font-light text-[var(--text)] mb-2"
          style={{ fontFamily: 'var(--font-cormorant), "Cormorant Garamond", serif' }}
        >
          Let&apos;s set up your profile
        </h1>
        <p className="text-sm text-[var(--text-mid)]">Tell us a little about yourself</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Photo */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-[var(--text)]">
            Profile photo <span className="text-[var(--text-light)] font-normal">(recommended)</span>
          </p>
          <Controller
            name="avatar_url"
            control={control}
            render={({ field }) => (
              <PhotoUpload
                value={field.value ?? null}
                onChange={field.onChange}
                circular
              />
            )}
          />
        </div>

        <Input
          label="Display name"
          placeholder="Your name or preferred name"
          error={errors.display_name?.message}
          {...register('display_name')}
        />

        <div className="flex flex-col gap-2">
          <Input
            label="Where are you based?"
            placeholder="City, Country"
            error={errors.location?.message}
            {...register('location')}
          />
          {location !== 'Remote' && (
            <button
              type="button"
              onClick={() => setValue('location', 'Remote', { shouldValidate: true })}
              className="self-start text-xs text-[var(--pink)] border border-[var(--pink-mid)] rounded-full px-3 py-1 hover:bg-[var(--pink-light)] transition-colors"
            >
              I&apos;m remote / no fixed base
            </button>
          )}
        </div>

        <Input
          label="Age"
          type="number"
          placeholder="30"
          min={30}
          max={99}
          error={errors.age?.message}
          {...register('age', { valueAsNumber: true })}
        />

        <div>
          <Textarea
            label="Short bio"
            placeholder="A little about you and your love of travel..."
            rows={3}
            error={errors.bio?.message}
            {...register('bio')}
          />
          <p className="text-xs text-[var(--text-light)] text-right mt-1">
            {(bio ?? '').length}/200
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-[var(--text)]">
            Languages spoken <span className="text-[var(--text-light)] font-normal">(optional)</span>
          </p>
          <Controller
            name="languages"
            control={control}
            render={({ field }) => (
              <PillSelect
                options={LANGUAGE_OPTIONS}
                value={field.value ?? []}
                onChange={field.onChange}
                multiSelect
              />
            )}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={saving} className="flex-1">
            Save & continue
          </Button>
        </div>
      </form>
    </div>
  )
}
