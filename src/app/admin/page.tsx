'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Member } from '@/lib/types'

type FilterState = {
  city: string
  member_type: string
  table_experience: string
  want_marriage: string
  want_children: string
  cinqe: string
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    city: '', member_type: '', table_experience: '',
    want_marriage: '', want_children: '', cinqe: '',
  })

  // Check if already authed via cookie
  useEffect(() => {
    fetch('/api/admin/members').then(r => {
      if (r.ok) { setAuthed(true); loadMembers() }
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setAuthError('')
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      setAuthed(true)
      loadMembers()
    } else {
      setAuthError('Incorrect password.')
    }
  }

  const loadMembers = useCallback(async (f?: FilterState) => {
    setLoading(true)
    const params = new URLSearchParams()
    const active = f ?? filters
    if (active.city) params.set('city', active.city)
    if (active.member_type) params.set('member_type', active.member_type)
    if (active.table_experience) params.set('table_experience', active.table_experience)
    if (active.want_marriage) params.set('want_marriage', active.want_marriage)
    if (active.want_children) params.set('want_children', active.want_children)
    if (active.cinqe) params.set('cinqe', active.cinqe)

    const res = await fetch(`/api/admin/members?${params.toString()}`)
    const data = await res.json()
    setMembers(data.members ?? [])
    setLoading(false)
  }, [filters])

  function updateFilter(key: keyof FilterState, val: string) {
    const next = { ...filters, [key]: val }
    setFilters(next)
    if (authed) loadMembers(next)
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white border border-[var(--tan)] rounded-2xl p-8 shadow-sm">
          <h1 className="text-2xl text-[var(--text)] mb-6">Admin access</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="border border-[var(--tan)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--blush)] transition-colors"
            />
            {authError && <p className="text-xs text-red-500">{authError}</p>}
            <button
              type="submit"
              className="bg-[var(--olive)] text-white rounded-full px-6 py-3 text-sm font-medium hover:bg-[var(--text)] transition-colors"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <header className="bg-white border-b border-[var(--tan)] px-6 py-4 flex items-center justify-between">
        <span className="text-base font-medium text-[var(--olive)]">
          Dating <span className="text-[var(--blush)]">Table</span>{' '}
          <span className="text-xs text-[var(--text-light)] font-normal">Admin</span>
        </span>
        <a
          href="/api/admin/export"
          className="text-xs bg-[var(--olive)] text-white px-4 py-2 rounded-full hover:bg-[var(--text)] transition-colors"
        >
          Export CSV
        </a>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl text-[var(--text)] mb-1">Members</h1>
          <p className="text-sm text-[var(--text-light)]">{members.length} member{members.length !== 1 ? 's' : ''} found</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="City..."
            value={filters.city}
            onChange={e => updateFilter('city', e.target.value)}
            className="border border-[var(--tan)] rounded-xl px-3 py-2 text-sm bg-white outline-none focus:border-[var(--blush)]"
          />
          {[
            { key: 'member_type' as const, opts: [['', 'All types'], ['intro', 'Intro'], ['vip', 'VIP']] },
            { key: 'want_marriage' as const, opts: [['', 'Marriage: all'], ['Yes', 'Wants marriage'], ['Unsure', 'Unsure'], ['No', 'No marriage']] },
            { key: 'want_children' as const, opts: [['', 'Children: all'], ['Yes', 'Wants children'], ['Open', 'Open'], ['No', 'No children']] },
            { key: 'table_experience' as const, opts: [['', 'All tables'], ['Virtual Dating Tables', 'Virtual'], ['In-Person Small Tables', 'In-Person'], ['Large Conferences', 'Conferences'], ['Singles Ladies Vacations', 'Vacations']] },
            { key: 'cinqe' as const, opts: [['', 'All'], ['true', 'Cinqe opt-in only']] },
          ].map(({ key, opts }) => (
            <select
              key={key}
              value={filters[key]}
              onChange={e => updateFilter(key, e.target.value)}
              className="border border-[var(--tan)] rounded-xl px-3 py-2 text-sm bg-white outline-none focus:border-[var(--blush)] appearance-none"
            >
              {opts.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
            </select>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-sm text-[var(--text-light)]">Loading...</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[var(--tan)] bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--tan)] text-left">
                  {['Name', 'Email', 'Phone', 'City', 'Age', 'Type', 'Referral', 'Marriage', 'Children', 'Cinqe', 'Completion', 'Joined'].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-medium text-[var(--text-light)] uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.map((m, i) => (
                  <tr key={m.id} className={`${i < members.length - 1 ? 'border-b border-[var(--tan-light)]' : ''} hover:bg-[var(--cream)]`}>
                    <td className="px-4 py-3 font-medium text-[var(--text)] whitespace-nowrap">{m.first_name ?? '—'}</td>
                    <td className="px-4 py-3 text-[var(--text-mid)]">{m.email ?? '—'}</td>
                    <td className="px-4 py-3 text-[var(--text-mid)] whitespace-nowrap">{m.phone ?? '—'}</td>
                    <td className="px-4 py-3 text-[var(--text-mid)] whitespace-nowrap">{m.city ?? '—'}{m.state ? `, ${m.state}` : ''}</td>
                    <td className="px-4 py-3 text-[var(--text-mid)]">{m.age ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m.member_type === 'vip' ? 'bg-[var(--blush)] text-white' : 'bg-[var(--tan-light)] text-[var(--olive)]'}`}>
                        {m.member_type ?? 'intro'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-mid)] whitespace-nowrap">{m.referral_source ?? '—'}</td>
                    <td className="px-4 py-3 text-[var(--text-mid)]">{m.want_marriage ?? '—'}</td>
                    <td className="px-4 py-3 text-[var(--text-mid)]">{m.want_children ?? '—'}</td>
                    <td className="px-4 py-3">
                      {m.cinqe_opt_in
                        ? <span className="text-xs bg-[var(--blush-light)] text-[var(--blush)] px-2 py-0.5 rounded-full font-medium">Yes</span>
                        : <span className="text-[var(--text-light)]">—</span>}
                    </td>
                    <td className="px-4 py-3 text-[var(--text-mid)]">{m.profile_completion ?? 0}%</td>
                    <td className="px-4 py-3 text-[var(--text-light)] whitespace-nowrap text-xs">
                      {m.created_at ? new Date(m.created_at).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
                {members.length === 0 && (
                  <tr>
                    <td colSpan={12} className="px-4 py-8 text-center text-[var(--text-light)]">No members found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
