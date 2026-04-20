import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProfileBuilderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signup')

  return (
    <div className="min-h-screen bg-[var(--cream)] flex flex-col">
      <header className="px-6 py-4 bg-white border-b border-[var(--tan)] flex items-center justify-between">
        <Link href="/" className="text-base font-medium text-[var(--olive)] tracking-wide">
          Dating <span className="text-[var(--blush)]">Table</span>
        </Link>
        <span className="text-xs text-[var(--text-light)]">Build your profile</span>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          {children}
        </div>
      </main>
    </div>
  )
}
