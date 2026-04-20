'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface DirectoryMember {
  id: string
  first_name: string | null
  city: string | null
  state: string | null
  headshot_url: string | null
  instagram_handle: string | null
  member_type: string | null
  table_experiences: string[] | null
}

export default function DirectoryPage() {
  const [members, setMembers] = useState<DirectoryMember[]>([])
  const [loading, setLoading] = useState(true)
  const [cityFilter, setCityFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [tableFilter, setTableFilter] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('members')
        .select('id, first_name, city, state, headshot_url, instagram_handle, member_type, table_experiences')
        .eq('onboarding_completed', true)
        .order('created_at', { ascending: false })

      if (data) setMembers(data)
      setLoading(false)
    }
    load()
  }, [])

  const filtered = members.filter(m => {
    if (cityFilter && !m.city?.toLowerCase().includes(cityFilter.toLowerCase())) return false
    if (typeFilter && m.member_type !== typeFilter) return false
    if (tableFilter && !m.table_experiences?.includes(tableFilter)) return false
    return true
  })

  return (
    <div className="min-h-screen bg-[var(--cream)] flex flex-col">
      <header className="bg-white border-b border-[var(--tan)] px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-base font-medium text-[var(--olive)] tracking-wide">
          Dating <span className="text-[var(--blush)]">Table</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm text-[var(--text-mid)] hover:text-[var(--olive)]">Dashboard</Link>
          <Link href="/directory" className="text-sm text-[var(--olive)] font-medium">Directory</Link>
          <Link href="/dashboard/referrals" className="text-sm text-[var(--text-mid)] hover:text-[var(--olive)]">Referrals</Link>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto w-full px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl text-[var(--text)] mb-1">Member Directory</h1>
          <p className="text-sm text-[var(--text-light)]">Browse fellow Dating Table members.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <input
            type="text"
            placeholder="Filter by city..."
            value={cityFilter}
            onChange={e => setCityFilter(e.target.value)}
            className="border border-[var(--tan)] rounded-xl px-4 py-2 text-sm bg-white outline-none focus:border-[var(--blush)] transition-colors"
          />
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="border border-[var(--tan)] rounded-xl px-4 py-2 text-sm bg-white outline-none focus:border-[var(--blush)] appearance-none"
          >
            <option value="">All member types</option>
            <option value="intro">Intro Member</option>
            <option value="vip">VIP Member</option>
          </select>
          <select
            value={tableFilter}
            onChange={e => setTableFilter(e.target.value)}
            className="border border-[var(--tan)] rounded-xl px-4 py-2 text-sm bg-white outline-none focus:border-[var(--blush)] appearance-none"
          >
            <option value="">All table types</option>
            <option value="Virtual Dating Tables">Virtual</option>
            <option value="In-Person Small Tables">In-Person</option>
            <option value="Large Conferences">Conferences</option>
            <option value="Singles Ladies Vacations">Vacations</option>
          </select>
          {(cityFilter || typeFilter || tableFilter) && (
            <button
              onClick={() => { setCityFilter(''); setTypeFilter(''); setTableFilter('') }}
              className="text-xs text-[var(--text-light)] hover:text-[var(--blush)] underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20 text-[var(--text-light)]">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-[var(--text-light)]">No members found.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filtered.map(member => (
              <div key={member.id} className="bg-white border border-[var(--tan)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Photo */}
                <div className="aspect-square w-full overflow-hidden bg-[var(--blush-light)]">
                  {member.headshot_url ? (
                    <img
                      src={member.headshot_url}
                      alt={member.first_name ?? ''}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl text-[var(--blush)]">
                      {member.first_name?.[0] ?? '?'}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-sm font-medium text-[var(--text)] truncate">{member.first_name}</p>
                  {member.city && (
                    <p className="text-xs text-[var(--text-light)] truncate">
                      {member.city}{member.state ? `, ${member.state}` : ''}
                    </p>
                  )}
                  {member.instagram_handle && (
                    <p className="text-xs text-[var(--blush)] truncate mt-0.5">{member.instagram_handle}</p>
                  )}
                  <span className={`mt-2 inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
                    member.member_type === 'vip'
                      ? 'bg-[var(--blush)] text-white'
                      : 'bg-[var(--tan-light)] text-[var(--olive)]'
                  }`}>
                    {member.member_type === 'vip' ? 'VIP' : 'Intro'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
