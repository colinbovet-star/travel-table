'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import StepIndicator from '@/components/onboarding/StepIndicator'
import PillSelect from '@/components/onboarding/PillSelect'
import Toggle from '@/components/ui/Toggle'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const schema = z.object({
  dream_regions: z.array(z.string()).min(1, 'Please select at least one region'),
  travel_months: z.array(z.string()).optional(),
  has_upcoming_trip: z.boolean(),
  upcoming_trip_destination: z.string().optional(),
  upcoming_trip_start: z.string().optional(),
  upcoming_trip_end: z.string().optional(),
  open_to_buddy: z.boolean(),
})

type FormData = z.infer<typeof schema>

const REGION_OPTIONS = [
  "Western Europe", "Eastern Europe", "Southeast Asia", "East Asia",
  "South Asia", "Middle East", "North Africa", "Sub-Saharan Africa",
  "North America", "Central America", "South America", "Caribbean",
  "Pacific Islands", "Australia & NZ",
]

const MONTH_OPTIONS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

export default function Step3Page() {
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
    defaultValues: {
      dream_regions: [],
      travel_months: [],
      has_upcoming_trip: false,
      open_to_buddy: true,
    },
  })

  const hasUpcomingTrip = watch('has_upcoming_trip')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('dream_regions, travel_months, upcoming_trip_destination, upcoming_trip_start, upcoming_trip_end, open_to_buddy')
        .eq('id', user.id)
        .single()

      if (data) {
        if (data.dream_regions?.length) setValue('dream_regions', data.dream_regions)
        if (data.travel_months?.length) setValue('travel_months', data.travel_months)
        if (data.upcoming_trip_destination) {
          setValue('has_upcoming_trip', true)
          setValue('upcoming_trip_destination', data.upcoming_trip_destination)
        }
        if (data.upcoming_trip_start) setValue('upcoming_trip_start', data.upcoming_trip_start)
        if (data.upcoming_trip_end) setValue('upcoming_trip_end', data.upcoming_trip_end)
        if (data.open_to_buddy !== undefined) setValue('open_to_buddy', data.open_to_buddy)
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
        dream_regions: values.dream_regions || [],
        travel_months: values.travel_months || [],
        upcoming_trip_destination: values.has_upcoming_trip ? values.upcoming_trip_destination || null : null,
        upcoming_trip_start: values.has_upcoming_trip ? values.upcoming_trip_start || null : null,
        upcoming_trip_end: values.has_upcoming_trip ? values.upcoming_trip_end || null : null,
        open_to_buddy: values.open_to_buddy,
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
        dream_regions: data.dream_regions,
        travel_months: data.travel_months || [],
        upcoming_trip_destination: data.has_upcoming_trip ? data.upcoming_trip_destination || null : null,
        upcoming_trip_start: data.has_upcoming_trip ? data.upcoming_trip_start || null : null,
        upcoming_trip_end: data.has_upcoming_trip ? data.upcoming_trip_end || null : null,
        open_to_buddy: data.open_to_buddy,
      })
      .eq('id', user.id)

    router.push('/onboarding/step-4')
  }

  return (
    <div className="flex flex-col gap-8">
      <StepIndicator
        currentStep={3}
        totalSteps={4}
        onPrev={() => savePartial('/onboarding/step-2')}
        onNext={() => savePartial('/onboarding/step-4')}
      />

      <div>
        <h1
          className="text-3xl font-light text-[var(--text)] mb-2"
          style={{ fontFamily: 'var(--font-cormorant), "Cormorant Garamond", serif' }}
        >
          Where are you headed?
        </h1>
        <p className="text-sm text-[var(--text-mid)]">
          Share your dream destinations and upcoming plans
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7">
        {/* Dream regions */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-[var(--text)]">
            Dream regions <span className="text-[var(--text-light)] font-normal">(select all that interest you)</span>
          </p>
          <Controller
            name="dream_regions"
            control={control}
            render={({ field }) => (
              <PillSelect
                options={REGION_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                multiSelect
                minSelect={1}
                error={errors.dream_regions?.message}
              />
            )}
          />
        </div>

        {/* Travel months */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-[var(--text)]">
            Travel months <span className="text-[var(--text-light)] font-normal">(next 12 months, optional)</span>
          </p>
          <Controller
            name="travel_months"
            control={control}
            render={({ field }) => (
              <PillSelect
                options={MONTH_OPTIONS}
                value={field.value ?? []}
                onChange={field.onChange}
                multiSelect
              />
            )}
          />
        </div>

        {/* Upcoming trip toggle */}
        <div className="flex flex-col gap-4">
          <Controller
            name="has_upcoming_trip"
            control={control}
            render={({ field }) => (
              <Toggle
                checked={field.value}
                onChange={field.onChange}
                label="I have an upcoming trip I'd love a companion for"
              />
            )}
          />

          {hasUpcomingTrip && (
            <div className="flex flex-col gap-4 pl-4 border-l-2 border-[var(--pink-mid)]">
              <Input
                label="Trip destination"
                placeholder='E.g. "Vietnam — Hoi An & Hanoi"'
                {...register('upcoming_trip_destination')}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="From (month/year)"
                  placeholder="E.g. March 2026"
                  {...register('upcoming_trip_start')}
                />
                <Input
                  label="To (month/year)"
                  placeholder="E.g. April 2026"
                  {...register('upcoming_trip_end')}
                />
              </div>
            </div>
          )}
        </div>

        {/* Open to buddy */}
        <Controller
          name="open_to_buddy"
          control={control}
          render={({ field }) => (
            <Toggle
              checked={field.value}
              onChange={field.onChange}
              label="Show me as open to a travel buddy"
            />
          )}
        />

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/onboarding/step-2')}
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
