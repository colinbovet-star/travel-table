'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Input, Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import type { Referral } from '@/lib/types'

export default function ReferralsPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [emails, setEmails] = useState<string[]>(['', '', ''])
  const [personalNote, setPersonalNote] = useState('')
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)

      const { data } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false })

      if (data) setReferrals(data)
    }
    load()
  }, [])

  function addEmailField() {
    setEmails(prev => [...prev, ''])
  }

  function updateEmail(index: number, value: string) {
    setEmails(prev => prev.map((e, i) => (i === index ? value : e)))
  }

  async function handleSend() {
    setSending(true)
    setSent(false)
    setError(null)

    const validEmails = emails.filter(e => e.trim() && e.includes('@'))
    if (!validEmails.length) {
      setError('Please enter at least one valid email address.')
      setSending(false)
      return
    }

    const res = await fetch('/api/resend/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emails: validEmails, personalNote }),
    })

    if (!res.ok) {
      setError('Something went wrong. Please try again.')
    } else {
      setSent(true)
      setEmails(['', '', ''])
      setPersonalNote('')

      // Refresh referrals list
      const supabase = createClient()
      const { data } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', userId)
        .order('created_at', { ascending: false })
      if (data) setReferrals(data)
    }
    setSending(false)
  }

  const referralLink = userId
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/signup?ref=${userId}`
    : ''

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl text-[var(--text)] mb-1">Refer a friend</h1>
        <p className="text-sm text-[var(--text-light)]">
          Know any single women who'd love this community? Invite them below.
        </p>
      </div>

      {/* Referral link */}
      {referralLink && (
        <div className="bg-white border border-[var(--tan)] rounded-2xl p-5">
          <p className="text-xs font-medium text-[var(--text-light)] uppercase tracking-wider mb-2">
            Your referral link
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs bg-[var(--cream)] rounded-lg px-3 py-2 text-[var(--olive)] break-all">
              {referralLink}
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(referralLink)}
              className="text-xs text-[var(--blush)] hover:underline flex-shrink-0"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      {/* Invite form */}
      <div className="bg-white border border-[var(--tan)] rounded-2xl p-6 flex flex-col gap-5">
        <p className="text-sm font-medium text-[var(--text)]">Invite by email</p>
        {emails.map((email, i) => (
          <Input
            key={i}
            type="email"
            placeholder={`friend@example.com`}
            value={email}
            onChange={e => updateEmail(i, e.target.value)}
          />
        ))}
        <button
          type="button"
          onClick={addEmailField}
          className="text-xs text-[var(--blush)] hover:underline self-start"
        >
          + Add another email
        </button>

        <Textarea
          label="Personal note (optional)"
          placeholder="Add a personal message to your invite..."
          rows={3}
          value={personalNote}
          onChange={e => setPersonalNote(e.target.value)}
        />

        {sent && <p className="text-sm text-[var(--blush)]">✓ Invites sent!</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button onClick={handleSend} loading={sending} className="self-start">
          Send invites
        </Button>
      </div>

      {/* Referral status */}
      {referrals.length > 0 && (
        <div>
          <h3 className="text-base font-medium text-[var(--text)] mb-3">Your invites</h3>
          <div className="bg-white border border-[var(--tan)] rounded-2xl overflow-hidden">
            {referrals.map((ref, i) => (
              <div
                key={ref.id}
                className={`flex items-center justify-between px-5 py-3.5 ${
                  i < referrals.length - 1 ? 'border-b border-[var(--tan-light)]' : ''
                }`}
              >
                <span className="text-sm text-[var(--text-mid)]">{ref.invitee_email}</span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  ref.status === 'Completed'
                    ? 'bg-[var(--blush-light)] text-[var(--blush)]'
                    : ref.status === 'Signed Up'
                    ? 'bg-[var(--tan-light)] text-[var(--olive)]'
                    : 'bg-[var(--cream-dark)] text-[var(--text-light)]'
                }`}>
                  {ref.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
