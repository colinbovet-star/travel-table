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
  location: z.string().min(1, 'Location is required').max(100),
  age: z.number({ error: 'Please enter your age' }).min(30, { error: 'The Travel Table is for women 30 and over' }).max(99),
  bio: z.string().max(200, 'Bio must be 200 characters or less').optional(),
  languages: z.array(z.string()).optional(),
  avatar_url: z.string().nullable().optional(),
  photo_urls: z.array(z.string()).optional(),
})

type FormData = z.infer<typeof schema>

const LANGUAGE_OPTIONS = [
  'English', 'French', 'Spanish', 'Portuguese', 'German',
  'Italian', 'Mandarin', 'Japanese', 'Arabic', 'Other',
]

export default function Step1Page() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [extraPhotos, setExtraPhotos] = useState<(string | null)[]>([null, null])

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { languages: [], photo_urls: [] },
  })

  const bio = watch('bio', '')

  // Load saved progress
  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('display_name, location, age, bio, languages, avatar_url, photo_urls')
        .eq('id', user.id)
        .single()

      if (data) {
        if (data.display_name) setValue('display_name', data.display_name)
        if (data.location) setValue('location', data.location)
        if (data.age) setValue('age', data.age)
        if (data.bio) setValue('bio', data.bio)
        if (data.languages) setValue('languages', data.languages)
        if (data.avatar_url) setValue('avatar_url', data.avatar_url)
        if (data.photo_urls?.length) {
          setValue('photo_urls', data.photo_urls)
          setExtraPhotos([data.photo_urls[0] ?? null, data.photo_urls[1] ?? null])
        }
      }
    }
    load()
  }, [setValue])

  async function onSubmit(data: FormData) {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const photoUrls = extraPhotos.filter(Boolean) as string[]

    await supabase
      .from('profiles')
      .update({
        display_name: data.display_name,
        location: data.location,
        age: data.age,
        bio: data.bio || null,
        languages: data.languages || [],
        avatar_url: data.avatar_url || null,
        photo_urls: photoUrls,
      })
      .eq('id', user.id)

    router.push('/onboarding/step-2')
  }

  return (
    <div className="flex flex-col gap-8">
      <StepIndicator currentStep={1} totalSteps={4} />

      <div>
        <h1
          className="text-3xl font-light text-[var(--text)] mb-2"
          style={{ fontFamily: 'var(--font-cormorant), "Cormorant Garamond", serif' }}
        >
          Let's set up your profile
        </h1>
        <p className="text-sm text-[var(--text-mid)]">Tell us a little about yourself</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Photos */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-[var(--text)]">
            Profile photo <span className="text-[var(--text-light)] font-normal">(recommended)</span>
          </p>
          <div className="flex gap-4 items-end">
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
            <div className="flex gap-3">
              {[0, 1].map((i) => (
                <PhotoUpload
                  key={i}
                  value={extraPhotos[i]}
                  onChange={(url) => {
                    const updated = [...extraPhotos]
                    updated[i] = url
                    setExtraPhotos(updated)
                  }}
                  hint="Optional"
                />
              ))}
            </div>
          </div>
        </div>

        <Input
          label="Display name"
          placeholder="Your name or preferred name"
          error={errors.display_name?.message}
          {...register('display_name')}
        />

        <Input
          label="Location"
          placeholder="City, Country"
          error={errors.location?.message}
          {...register('location')}
        />

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
