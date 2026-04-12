import Link from 'next/link'

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--cream)] flex flex-col">
      <header className="px-8 py-5 flex items-center border-b border-[var(--pink-mid)] bg-[var(--cream)]">
        <Link
          href="/"
          className="text-lg font-normal tracking-[0.04em] text-[var(--text)] hover:text-[var(--pink)] transition-colors"
          style={{ fontFamily: 'var(--font-cormorant), "Cormorant Garamond", serif' }}
        >
          Travel <span className="text-[var(--pink)]">Table</span>
        </Link>
      </header>
      <main className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          {children}
        </div>
      </main>
    </div>
  )
}
