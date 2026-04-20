'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import StepProgress from '@/components/profile-builder/StepProgress'
import PillSelect from '@/components/ui/PillSelect'
import Button from '@/components/ui/Button'

const schema = z.object({
  table_experiences: z.array(z.string()).min(1, 'Please select at least one'),
})

type FormData = z.infer<typeof schema>

const TABLE_EXPERIENCE_OPTIONS = [
  'Virtual Dating Tables',
  'In-Person Small Tables',
  'Large Conferences',
  'Singles Ladies Vacations',
]

export default function Step3Page() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const { handleSubmit, control, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { table_experiences: [] },
  })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('members')
        .select('table_experiences')
        .eq('id', user.id)
        .single()

      if (data?.table_experiences?.length) {
        setValue('table_experiences', data.table_experiences)
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
      table_experiences: data.table_experiences,
    }).eq('id', user.id)

    router.push('/profile-builder/step-4')
  }

  return (
    <div>
      <StepProgress currentStep={3} totalSteps={5} />

      <h1 className="text-3xl text-[var(--text)] mb-2">Table preferences</h1>
      <p className="text-sm text-[var(--text-light)] mb-8">
        Which Dating Table experiences are you open to?
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-[var(--text)]">Select all that apply</p>
          <Controller name="table_experiences" control={control} render={({ field }) => (
            <PillSelect
              options={TABLE_EXPERIENCE_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              multiSelect
              error={errors.table_experiences?.message}
            />
          )} />
        </div>

        <div className="flex gap-3 mt-2">
          <Button type="button" variant="ghost" onClick={() => router.push('/profile-builder/step-2')}>
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
