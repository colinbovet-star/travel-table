'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Toast from '@/components/ui/Toast'

interface Profile {
  display_name: string | null
  location: string | null
  avatar_url: string | null
}

export default function DashboardContent() {
  const searchParams = useSearchParams()
  const showWelcome = searchParams.get('welcome') === '1'
  const [showToast, setShowToast] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    if (showWelcome) {
      setTimeout(() => setShowToast(true), 300)
    }
  }, [showWelcome])

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return

    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('display_name, location, avatar_url')
        .eq('id', user.id)
        .single()

      if (data) setProfile(data)
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <header className="px-8 py-5 flex items-center justify-between border-b border-[var(--pink-mid)] bg-white">
        <span
          className="text-lg font-normal tracking-[0.04em] text-[var(--text)]"
          style={{ fontFamily: 'var(--font-cormorant), "Cormorant Garamond", serif' }}
        >
          Travel <span className="text-[var(--pink)]">Table</span>
        </span>
        {profile && (
          <div className="flex items-center gap-3">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name ?? ''}
                className="w-9 h-9 rounded-full object-cover border border-[var(--pink-mid)]"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[var(--green-light)] border border-[var(--pink-mid)] flex items-center justify-center text-[var(--green)] font-medium text-sm">
                {profile.display_name?.[0] ?? '?'}
              </div>
            )}
            <span className="text-sm text-[var(--text-mid)]">
              {profile.display_name}
            </span>
          </div>
        )}
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center py-20 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[var(--pink-light)] flex items-center justify-center text-3xl">
            🌍
          </div>
          <h1
            className="text-4xl font-light text-[var(--text)]"
            style={{ fontFamily: 'var(--font-cormorant), "Cormorant Garamond", serif' }}
          >
            {profile?.display_name ? `Welcome, ${profile.display_name}` : 'Your dashboard'}
          </h1>
          <p className="text-[var(--text-mid)] max-w-sm">
            Your profile is live. The full dashboard is coming soon — stay tuned for member matches, trip planning, and weekly calls.
          </p>
        </div>
      </main>

      {showToast && (
        <Toast
          message="Welcome to the Travel Table! 🌍 Your profile is live."
          onDismiss={() => setShowToast(false)}
          durationMs={5000}
        />
      )}
    </div>
  )
}
