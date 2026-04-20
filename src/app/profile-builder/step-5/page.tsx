'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import StepProgress from '@/components/profile-builder/StepProgress'
import { Input, Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function Step5Page() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [emails, setEmails] = useState<string[]>(['', '', ''])
  const [personalNote, setPersonalNote] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function updateEmail(index: number, value: string) {
    setEmails(prev => prev.map((e, i) => (i === index ? value : e)))
  }

  async function handleComplete(sendInvites: boolean) {
    setSaving(true)
    setError(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Mark onboarding complete and set final profile_completion to 100
    await supabase.from('members').update({
      onboarding_completed: true,
      profile_completion: 100,
    }).eq('id', user.id)

    if (sendInvites) {
      const validEmails = emails.filter(e => e.trim() && e.includes('@'))
      if (validEmails.length > 0) {
        const res = await fetch('/api/resend/invite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emails: validEmails, personalNote }),
        })
        if (!res.ok) {
          setError('Invites sent but some may have failed. You can retry from your dashboard.')
        } else {
          setSent(true)
        }
      }
    }

    router.push('/dashboard?welcome=1')
  }

  return (
    <div>
      <StepProgress currentStep={5} totalSteps={5} />

      <h1 className="text-3xl text-[var(--text)] mb-2">Refer a friend</h1>
      <p className="text-sm text-[var(--text-light)] mb-1">
        Know any single women who'd love this community?
      </p>
      <p className="text-xs text-[var(--text-light)] mb-8">
        This is completely optional — you can always invite friends from your dashboard.
      </p>

      <div className="flex flex-col gap-5">
        {emails.map((email, i) => (
          <Input
            key={i}
            label={i === 0 ? "Friend's email" : undefined}
            type="email"
            placeholder={`friend${i + 1}@example.com`}
            value={email}
            onChange={e => updateEmail(i, e.target.value)}
          />
        ))}

        <Textarea
          label="Personal note (optional)"
          placeholder="Write a short message to include in the invite email..."
          rows={3}
          value={personalNote}
          onChange={e => setPersonalNote(e.target.value)}
        />

        {sent && (
          <p className="text-sm text-[var(--blush)]">
            ✓ Invites sent! You can send more from your dashboard.
          </p>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex flex-col gap-3 mt-2">
          <Button
            type="button"
            loading={saving}
            onClick={() => handleComplete(true)}
            className="w-full"
          >
            Send invites & go to dashboard
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => handleComplete(false)}
            className="w-full text-center"
          >
            Skip for now → go to dashboard
          </Button>
        </div>

        <div className="flex items-center gap-3 mt-1">
          <div className="flex-1 h-px bg-[var(--tan-light)]" />
          <Button type="button" variant="ghost" onClick={() => router.push('/profile-builder/step-4')} className="text-xs">
            ← Back
          </Button>
          <div className="flex-1 h-px bg-[var(--tan-light)]" />
        </div>
      </div>
    </div>
  )
}
