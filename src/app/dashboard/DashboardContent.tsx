'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Member } from '@/lib/types'

export default function DashboardContent() {
  const [member, setMember] = useState<Partial<Member> | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('members')
        .select('first_name, city, state, headshot_url, member_type, profile_completion')
        .eq('id', user.id)
        .single()

      if (data) setMember(data)
    }
    load()
  }, [])

  const completion = member?.profile_completion ?? 0
  const memberTypeBadge = member?.member_type === 'vip'
    ? { label: 'VIP Member', color: 'bg-[var(--blush)] text-white' }
    : { label: 'Intro Member', color: 'bg-[var(--tan-light)] text-[var(--olive)]' }

  return (
    <div className="flex flex-col gap-8">
      {/* Profile card */}
      <div className="bg-white border border-[var(--tan)] rounded-2xl p-6 shadow-sm flex items-start gap-5">
        {/* Avatar */}
        {member?.headshot_url ? (
          <img
            src={member.headshot_url}
            alt={member.first_name ?? ''}
            className="w-20 h-20 rounded-full object-cover border-2 border-[var(--blush-mid)] flex-shrink-0"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-[var(--blush-light)] border-2 border-[var(--blush-mid)] flex items-center justify-center text-[var(--blush)] text-2xl font-medium flex-shrink-0">
            {member?.first_name?.[0] ?? '?'}
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h2 className="text-xl text-[var(--text)]">
              {member?.first_name ?? 'Welcome!'}
            </h2>
            {member && (
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${memberTypeBadge.color}`}>
                {memberTypeBadge.label}
              </span>
            )}
          </div>
          {member?.city && (
            <p className="text-sm text-[var(--text-light)]">
              {member.city}{member.state ? `, ${member.state}` : ''}
            </p>
          )}

          {/* Completion bar */}
          {completion < 100 && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[var(--text-light)]">Profile completion</span>
                <span className="text-xs font-medium text-[var(--blush)]">{completion}%</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--cream-dark)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--blush)] rounded-full transition-all duration-500"
                  style={{ width: `${completion}%` }}
                />
              </div>
              <Link
                href="/profile-builder/step-1"
                className="text-xs text-[var(--blush)] hover:underline mt-1.5 inline-block"
              >
                Complete your profile →
              </Link>
            </div>
          )}
        </div>

        <Link
          href="/profile-builder/step-1"
          className="text-xs text-[var(--text-light)] hover:text-[var(--olive)] border border-[var(--tan)] rounded-lg px-3 py-1.5 transition-colors flex-shrink-0"
        >
          Edit profile
        </Link>
      </div>

      {/* Upcoming Tables (static placeholder) */}
      <div>
        <h3 className="text-lg text-[var(--text)] mb-4">Upcoming Tables</h3>
        <div className="bg-white border border-[var(--tan)] rounded-2xl p-6 text-center">
          <div className="text-3xl mb-3">🌹</div>
          <p className="text-[var(--text-mid)] text-sm">
            Your first table is coming soon.
          </p>
          <p className="text-[var(--text-light)] text-xs mt-1">
            We'll notify you by email when a table opens in your area.
          </p>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/directory"
          className="bg-white border border-[var(--tan)] rounded-2xl p-5 hover:border-[var(--blush)] transition-colors group"
        >
          <div className="text-2xl mb-2">👩‍❤️‍👩</div>
          <p className="text-sm font-medium text-[var(--text)] group-hover:text-[var(--blush)] transition-colors">
            Member Directory
          </p>
          <p className="text-xs text-[var(--text-light)] mt-0.5">Browse other members</p>
        </Link>
        <Link
          href="/dashboard/referrals"
          className="bg-white border border-[var(--tan)] rounded-2xl p-5 hover:border-[var(--blush)] transition-colors group"
        >
          <div className="text-2xl mb-2">💌</div>
          <p className="text-sm font-medium text-[var(--text)] group-hover:text-[var(--blush)] transition-colors">
            Refer a Friend
          </p>
          <p className="text-xs text-[var(--text-light)] mt-0.5">Invite women you love</p>
        </Link>
      </div>
    </div>
  )
}
