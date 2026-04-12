'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import StepIndicator from '@/components/onboarding/StepIndicator'
import StyleSlider from '@/components/onboarding/StyleSlider'
import PillSelect from '@/components/onboarding/PillSelect'
import Button from '@/components/ui/Button'

const schema = z.object({
  travel_style_score: z.number().min(1).max(5),
  solo_comfort: z.string().min(1, 'Please choose an option'),
  budget_range: z.string().min(1, 'Please choose an option'),
  trip_type_tags: z.array(z.string()).min(1, 'Please select at least one trip type'),
  looking_for: z.array(z.string()).optional(),
  travel_frequency: z.string().min(1, 'Please choose an option'),
  group_size_pref: z.string().min(1, 'Please choose an option'),
})

type FormData = z.infer<typeof schema>

const SOLO_OPTIONS = ["I love solo travel", "I prefer a companion", "Either works for me"]
const BUDGET_OPTIONS = ["Budget", "Mid-range", "Flexible", "Luxury"]
const TRAVEL_FREQUENCY_OPTIONS = ["0–1 trips", "2–4 trips", "5–8 trips", "Nomadic"]
const GROUP_SIZE_OPTIONS = ["Solo", "1–3 people", "4–5 people", "6–10 people", "More than 10"]
const TRIP_TYPE_OPTIONS = [
  "Beach & sun", "Culture & history", "Food & wine", "Hiking & nature",
  "City breaks", "Wellness & retreat", "Adventure sports", "Off the beaten path",
]
const LOOKING_FOR_OPTIONS = [
  "A travel companion for a specific trip",
  "Travel friends to plan future trips with",
  "Inspiration and community",
  "All of the above",
]

export default function Step2Page() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      travel_style_score: 3,
      solo_comfort: '',
      budget_range: '',
      trip_type_tags: [],
      looking_for: [],
      travel_frequency: '',
      group_size_pref: '',
    },
  })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('travel_style_score, solo_comfort, budget_range, trip_type_tags, looking_for, travel_frequency, group_size_pref')
        .eq('id', user.id)
        .single()

      if (data) {
        if (data.travel_style_score) setValue('travel_style_score', data.travel_style_score)
        if (data.solo_comfort) setValue('solo_comfort', data.solo_comfort)
        if (data.budget_range) setValue('budget_range', data.budget_range)
        if (data.trip_type_tags?.length) setValue('trip_type_tags', data.trip_type_tags)
        if (data.looking_for?.length) setValue('looking_for', data.looking_for)
        if (data.travel_frequency) setValue('travel_frequency', data.travel_frequency)
        if (data.group_size_pref) setValue('group_size_pref', data.group_size_pref)
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
        travel_style_score: values.travel_style_score || null,
        solo_comfort: values.solo_comfort || null,
        budget_range: values.budget_range || null,
        trip_type_tags: values.trip_type_tags || [],
        looking_for: values.looking_for || [],
        travel_frequency: values.travel_frequency || null,
        group_size_pref: values.group_size_pref || null,
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
        travel_style_score: data.travel_style_score,
        solo_comfort: data.solo_comfort,
        budget_range: data.budget_range,
        trip_type_tags: data.trip_type_tags,
        looking_for: data.looking_for || [],
        travel_frequency: data.travel_frequency,
        group_size_pref: data.group_size_pref,
      })
      .eq('id', user.id)

    router.push('/onboarding/step-3')
  }

  return (
    <div className="flex flex-col gap-8">
      <StepIndicator
        currentStep={2}
        totalSteps={4}
        onPrev={() => savePartial('/onboarding/step-1')}
        onNext={() => savePartial('/onboarding/step-3')}
      />

      <div>
        <h1
          className="text-3xl font-light text-[var(--text)] mb-2"
          style={{ fontFamily: 'var(--font-cormorant), "Cormorant Garamond", serif' }}
        >
          How do you travel?
        </h1>
        <p className="text-sm text-[var(--text-mid)]">
          This helps us find women who travel like you do
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7">
        {/* Travel style slider */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-[var(--text)]">Travel style</p>
          <Controller
            name="travel_style_score"
            control={control}
            render={({ field }) => (
              <StyleSlider
                value={field.value}
                onChange={field.onChange}
                error={errors.travel_style_score?.message}
              />
            )}
          />
        </div>

        {/* Solo comfort */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-[var(--text)]">Solo travel comfort</p>
          <Controller
            name="solo_comfort"
            control={control}
            render={({ field }) => (
              <PillSelect
                options={SOLO_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                error={errors.solo_comfort?.message}
              />
            )}
          />
        </div>

        {/* Budget range */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-[var(--text)]">Budget range</p>
          <Controller
            name="budget_range"
            control={control}
            render={({ field }) => (
              <PillSelect
                options={BUDGET_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                error={errors.budget_range?.message}
              />
            )}
          />
        </div>

        {/* Trip types */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-[var(--text)]">
            Trip types <span className="text-[var(--text-light)] font-normal">(select all that apply)</span>
          </p>
          <Controller
            name="trip_type_tags"
            control={control}
            render={({ field }) => (
              <PillSelect
                options={TRIP_TYPE_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                multiSelect
                minSelect={1}
                error={errors.trip_type_tags?.message}
              />
            )}
          />
        </div>

        {/* Travel frequency */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-[var(--text)]">How often do you travel per year?</p>
          <Controller
            name="travel_frequency"
            control={control}
            render={({ field }) => (
              <PillSelect
                options={TRAVEL_FREQUENCY_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                error={errors.travel_frequency?.message}
              />
            )}
          />
        </div>

        {/* Group size preference */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-[var(--text)]">What size group do you like to travel with?</p>
          <Controller
            name="group_size_pref"
            control={control}
            render={({ field }) => (
              <PillSelect
                options={GROUP_SIZE_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                error={errors.group_size_pref?.message}
              />
            )}
          />
        </div>

        {/* Looking for */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-[var(--text)]">
            What I'm looking for <span className="text-[var(--text-light)] font-normal">(optional)</span>
          </p>
          <Controller
            name="looking_for"
            control={control}
            render={({ field }) => (
              <PillSelect
                options={LOOKING_FOR_OPTIONS}
                value={field.value ?? []}
                onChange={field.onChange}
                multiSelect
              />
            )}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/onboarding/step-1')}
          >
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
