'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import StepProgress from '@/components/profile-builder/StepProgress'
import { Input, Textarea } from '@/components/ui/Input'
import PhotoUpload from '@/components/ui/PhotoUpload'
import PillSelect from '@/components/ui/PillSelect'
import Button from '@/components/ui/Button'

const schema = z.object({
  age: z.number({ error: 'Must be a number' }).min(18, 'Must be at least 18').max(100),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  relationship_status: z.string().min(1, 'Please choose an option'),
  headshot_url: z.string().min(1, 'A headshot photo is required'),
  photo_2_url: z.string().nullable().optional(),
  photo_3_url: z.string().nullable().optional(),
  how_long_single: z.string().min(1, 'Please choose an option'),
  dating_activity: z.string().min(1, 'Please choose an option'),
  exciting_about_dating: z.string().optional(),
  hoping_to_gain: z.array(z.string()).min(1, 'Please select at least one'),
  topics_to_discuss: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const RELATIONSHIP_OPTIONS = ['Yes', 'Recently single', 'Taking a break from dating']
const HOW_LONG_OPTIONS = ['Less than 6 months', '6–12 months', '1+ years']
const DATING_ACTIVITY_OPTIONS = [
  'Very active, going on dates regularly',
  'Occasionally dating',
  'Taking a break but open to meeting someone',
  'Not interested in dating right now, joining for community',
]
const HOPING_TO_GAIN_OPTIONS = [
  'Building confidence in dating',
  'Connecting with other single friends',
  'Feeling supported while dating',
  'Learning healthier dating habits',
  'Having a space to talk',
  'Finding a partner',
  'Accountability to keep going on dates',
]

function calcCompletion(data: Partial<FormData>): number {
  const fields: (keyof FormData)[] = ['age', 'city', 'state', 'relationship_status', 'headshot_url', 'dating_activity', 'hoping_to_gain']
  const filled = fields.filter(f => {
    const v = data[f]
    return v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)
  }).length
  // Step 1 covers ~50% of total completion; steps 2+ fill the rest
  return Math.round((filled / fields.length) * 50)
}

export default function Step1Page() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const { handleSubmit, control, register, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      age: undefined,
      city: '',
      state: '',
      relationship_status: '',
      headshot_url: '',
      photo_2_url: null,
      photo_3_url: null,
      how_long_single: '',
      dating_activity: '',
      exciting_about_dating: '',
      hoping_to_gain: [],
      topics_to_discuss: '',
    },
  })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('members')
        .select('age,city,state,relationship_status,headshot_url,photo_2_url,photo_3_url,how_long_single,dating_activity,exciting_about_dating,hoping_to_gain,topics_to_discuss')
        .eq('id', user.id)
        .single()

      if (data) {
        if (data.age) setValue('age', data.age)
        if (data.city) setValue('city', data.city)
        if (data.state) setValue('state', data.state)
        if (data.relationship_status) setValue('relationship_status', data.relationship_status)
        if (data.headshot_url) setValue('headshot_url', data.headshot_url)
        if (data.photo_2_url) setValue('photo_2_url', data.photo_2_url)
        if (data.photo_3_url) setValue('photo_3_url', data.photo_3_url)
        if (data.how_long_single) setValue('how_long_single', data.how_long_single)
        if (data.dating_activity) setValue('dating_activity', data.dating_activity)
        if (data.exciting_about_dating) setValue('exciting_about_dating', data.exciting_about_dating)
        if (data.hoping_to_gain?.length) setValue('hoping_to_gain', data.hoping_to_gain)
        if (data.topics_to_discuss) setValue('topics_to_discuss', data.topics_to_discuss)
      }
    }
    load()
  }, [setValue])

  async function onSubmit(data: FormData) {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const completion = calcCompletion(data)

    await supabase.from('members').update({
      age: data.age,
      city: data.city,
      state: data.state,
      relationship_status: data.relationship_status,
      headshot_url: data.headshot_url,
      photo_2_url: data.photo_2_url || null,
      photo_3_url: data.photo_3_url || null,
      how_long_single: data.how_long_single,
      dating_activity: data.dating_activity,
      exciting_about_dating: data.exciting_about_dating || null,
      hoping_to_gain: data.hoping_to_gain,
      topics_to_discuss: data.topics_to_discuss || null,
      profile_completion: completion,
    }).eq('id', user.id)

    router.push('/profile-builder/step-2')
  }

  return (
    <div>
      <StepProgress currentStep={1} totalSteps={5} />

      <h1 className="text-3xl text-[var(--text)] mb-2">About you</h1>
      <p className="text-sm text-[var(--text-light)] mb-8">
        Tell us a little about yourself so we can find the right table for you.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7">

        {/* Age + Location */}
        <div className="flex gap-4">
          <div className="w-24">
            <Input label="Age" type="number" placeholder="32" error={errors.age?.message} {...register('age', { valueAsNumber: true })} />
          </div>
          <div className="flex-1">
            <Input label="City" placeholder="New York" error={errors.city?.message} {...register('city')} />
          </div>
          <div className="w-20">
            <Input label="State" placeholder="NY" maxLength={2} error={errors.state?.message} {...register('state')} />
          </div>
        </div>

        {/* Relationship status */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-[var(--text)]">Are you currently single?</p>
          <Controller name="relationship_status" control={control} render={({ field }) => (
            <PillSelect options={RELATIONSHIP_OPTIONS} value={field.value} onChange={field.onChange} error={errors.relationship_status?.message} />
          )} />
        </div>

        {/* Photos */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-[var(--text)]">Your photos</p>
          <p className="text-xs text-[var(--text-light)]">
            Add up to 3 photos. The first is your main profile photo. You can add more from your dashboard later.
          </p>
          <div className="grid grid-cols-3 gap-4">
            <Controller name="headshot_url" control={control} render={({ field }) => (
              <PhotoUpload slot="headshot" value={field.value || null} onChange={(url) => field.onChange(url ?? '')} label="Main photo *" />
            )} />
            <Controller name="photo_2_url" control={control} render={({ field }) => (
              <PhotoUpload slot="photo_2" value={field.value ?? null} onChange={field.onChange} label="Photo 2" />
            )} />
            <Controller name="photo_3_url" control={control} render={({ field }) => (
              <PhotoUpload slot="photo_3" value={field.value ?? null} onChange={field.onChange} label="Photo 3" />
            )} />
          </div>
          {errors.headshot_url && <p className="text-xs text-red-500">{errors.headshot_url.message}</p>}
        </div>

        {/* How long single */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-[var(--text)]">How long have you been single?</p>
          <Controller name="how_long_single" control={control} render={({ field }) => (
            <PillSelect options={HOW_LONG_OPTIONS} value={field.value} onChange={field.onChange} error={errors.how_long_single?.message} />
          )} />
        </div>

        {/* Dating activity */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-[var(--text)]">How actively are you dating?</p>
          <Controller name="dating_activity" control={control} render={({ field }) => (
            <PillSelect options={DATING_ACTIVITY_OPTIONS} value={field.value} onChange={field.onChange} error={errors.dating_activity?.message} />
          )} />
        </div>

        {/* Exciting about dating */}
        <Textarea
          label="What feels most exciting about dating right now? (optional)"
          placeholder="Share what's got you feeling hopeful..."
          rows={3}
          {...register('exciting_about_dating')}
        />

        {/* Hoping to gain */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-[var(--text)]">What are you hoping to gain from the Dating Table?</p>
          <Controller name="hoping_to_gain" control={control} render={({ field }) => (
            <PillSelect options={HOPING_TO_GAIN_OPTIONS} value={field.value} onChange={field.onChange} multiSelect error={errors.hoping_to_gain?.message} />
          )} />
        </div>

        {/* Topics */}
        <Textarea
          label="What topics would you love to talk about at the table? (optional)"
          placeholder="Dating apps, first dates, red flags, communication styles..."
          rows={3}
          {...register('topics_to_discuss')}
        />

        <Button type="submit" loading={saving} className="w-full mt-2">
          Save & continue
        </Button>
      </form>
    </div>
  )
}
