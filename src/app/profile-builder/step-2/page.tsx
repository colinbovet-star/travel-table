'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import StepProgress from '@/components/profile-builder/StepProgress'
import { Input, Textarea, Select } from '@/components/ui/Input'
import PillSelect from '@/components/ui/PillSelect'
import Button from '@/components/ui/Button'

const schema = z.object({
  age_min: z.number({ error: 'Required' }).min(18).max(100),
  age_max: z.number({ error: 'Required' }).min(18).max(100),
  travel_distance: z.string().min(1, 'Please choose an option'),
  open_to_relocate: z.string().min(1, 'Please choose an option'),
  want_marriage: z.string().min(1, 'Please choose an option'),
  want_children: z.string().min(1, 'Please choose an option'),
  has_children: z.string().min(1, 'Please choose an option'),
  religion: z.string().min(1, 'Please choose an option'),
  religion_importance: z.string().min(1, 'Please choose an option'),
  politics: z.string().min(1, 'Please choose an option'),
  deal_breakers: z.string().optional(),
}).refine(d => d.age_max >= d.age_min, {
  message: 'Max age must be ≥ min age',
  path: ['age_max'],
})

type FormData = z.infer<typeof schema>

const DISTANCE_OPTIONS = ['Same city', 'Within 1 hour', 'Within 2–3 hours', 'Open to long distance']
const RELOCATE_OPTIONS = ['Yes', 'Maybe', 'No']
const MARRIAGE_OPTIONS = ['Yes', 'Unsure', 'No']
const CHILDREN_WANT_OPTIONS = ['Yes', 'Open', 'No']
const RELIGION_IMPORTANCE_OPTIONS = ['Very important', 'Somewhat', 'Not important']

export default function Step2Page() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const { handleSubmit, control, register, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      age_min: undefined,
      age_max: undefined,
      travel_distance: '',
      open_to_relocate: '',
      want_marriage: '',
      want_children: '',
      has_children: '',
      religion: '',
      religion_importance: '',
      politics: '',
      deal_breakers: '',
    },
  })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('members')
        .select('age_min,age_max,travel_distance,open_to_relocate,want_marriage,want_children,has_children,religion,religion_importance,politics,deal_breakers')
        .eq('id', user.id)
        .single()

      if (data) {
        if (data.age_min) setValue('age_min', data.age_min)
        if (data.age_max) setValue('age_max', data.age_max)
        if (data.travel_distance) setValue('travel_distance', data.travel_distance)
        if (data.open_to_relocate) setValue('open_to_relocate', data.open_to_relocate)
        if (data.want_marriage) setValue('want_marriage', data.want_marriage)
        if (data.want_children) setValue('want_children', data.want_children)
        if (data.has_children !== null) setValue('has_children', data.has_children ? 'Yes' : 'No')
        if (data.religion) setValue('religion', data.religion)
        if (data.religion_importance) setValue('religion_importance', data.religion_importance)
        if (data.politics) setValue('politics', data.politics)
        if (data.deal_breakers) setValue('deal_breakers', data.deal_breakers)
      }
    }
    load()
  }, [setValue])

  async function onSubmit(data: FormData) {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('members').update({
      age_min: data.age_min,
      age_max: data.age_max,
      travel_distance: data.travel_distance,
      open_to_relocate: data.open_to_relocate,
      want_marriage: data.want_marriage,
      want_children: data.want_children,
      has_children: data.has_children === 'Yes',
      religion: data.religion,
      religion_importance: data.religion_importance,
      politics: data.politics,
      deal_breakers: data.deal_breakers || null,
    }).eq('id', user.id)

    router.push('/profile-builder/step-3')
  }

  return (
    <div>
      <StepProgress currentStep={2} totalSteps={5} />

      <h1 className="text-3xl text-[var(--text)] mb-2">Who you're open to meeting</h1>
      <p className="text-sm text-[var(--text-light)] mb-8">
        Help us understand your preferences so we can find great matches.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7">

        {/* Age range */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-[var(--text)]">Age range you're open to dating</p>
          <div className="flex items-center gap-3">
            <Input type="number" placeholder="Min" error={errors.age_min?.message} {...register('age_min', { valueAsNumber: true })} className="w-28" />
            <span className="text-[var(--text-light)] text-sm">to</span>
            <Input type="number" placeholder="Max" error={errors.age_max?.message} {...register('age_max', { valueAsNumber: true })} className="w-28" />
          </div>
        </div>

        {/* Travel distance */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-[var(--text)]">How far are you willing to travel?</p>
          <Controller name="travel_distance" control={control} render={({ field }) => (
            <PillSelect options={DISTANCE_OPTIONS} value={field.value} onChange={field.onChange} error={errors.travel_distance?.message} />
          )} />
        </div>

        {/* Relocate */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-[var(--text)]">Open to relocating for the right person?</p>
          <Controller name="open_to_relocate" control={control} render={({ field }) => (
            <PillSelect options={RELOCATE_OPTIONS} value={field.value} onChange={field.onChange} error={errors.open_to_relocate?.message} />
          )} />
        </div>

        {/* Marriage */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-[var(--text)]">Do you want marriage?</p>
          <Controller name="want_marriage" control={control} render={({ field }) => (
            <PillSelect options={MARRIAGE_OPTIONS} value={field.value} onChange={field.onChange} error={errors.want_marriage?.message} />
          )} />
        </div>

        {/* Children */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-[var(--text)]">Do you want children?</p>
          <Controller name="want_children" control={control} render={({ field }) => (
            <PillSelect options={CHILDREN_WANT_OPTIONS} value={field.value} onChange={field.onChange} error={errors.want_children?.message} />
          )} />
        </div>

        {/* Has children */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-[var(--text)]">Do you have children?</p>
          <Controller name="has_children" control={control} render={({ field }) => (
            <PillSelect options={['Yes', 'No']} value={field.value} onChange={field.onChange} error={errors.has_children?.message} />
          )} />
        </div>

        {/* Religion */}
        <Controller name="religion" control={control} render={({ field }) => (
          <Select label="Religion" placeholder="Select..." error={errors.religion?.message} value={field.value} onChange={field.onChange}>
            <option value="Practicing">Practicing</option>
            <option value="Spiritual">Spiritual</option>
            <option value="Not religious">Not religious</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </Select>
        )} />

        {/* Religion importance */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-[var(--text)]">How important is religion in a partner?</p>
          <Controller name="religion_importance" control={control} render={({ field }) => (
            <PillSelect options={RELIGION_IMPORTANCE_OPTIONS} value={field.value} onChange={field.onChange} error={errors.religion_importance?.message} />
          )} />
        </div>

        {/* Politics */}
        <Controller name="politics" control={control} render={({ field }) => (
          <Select label="Politics" placeholder="Select..." error={errors.politics?.message} value={field.value} onChange={field.onChange}>
            <option value="Conservative">Conservative</option>
            <option value="Moderate">Moderate</option>
            <option value="Liberal">Liberal</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </Select>
        )} />

        {/* Deal breakers */}
        <Textarea
          label="Top 3 deal breakers (optional)"
          placeholder="e.g. smoker, no ambition, different values..."
          rows={3}
          {...register('deal_breakers')}
        />

        <div className="flex gap-3 mt-2">
          <Button type="button" variant="ghost" onClick={() => router.push('/profile-builder/step-1')}>
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
