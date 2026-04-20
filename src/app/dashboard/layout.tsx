import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signup')

  return (
    <div className="min-h-screen bg-[var(--cream)] flex flex-col">
      <header className="bg-white border-b border-[var(--tan)] px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-base font-medium text-[var(--olive)] tracking-wide">
          Dating <span className="text-[var(--blush)]">Table</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm text-[var(--text-mid)] hover:text-[var(--olive)] transition-colors">
            Dashboard
          </Link>
          <Link href="/directory" className="text-sm text-[var(--text-mid)] hover:text-[var(--olive)] transition-colors">
            Directory
          </Link>
          <Link href="/dashboard/referrals" className="text-sm text-[var(--text-mid)] hover:text-[var(--olive)] transition-colors">
            Referrals
          </Link>
        </nav>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
        {children}
      </main>
    </div>
  )
}
