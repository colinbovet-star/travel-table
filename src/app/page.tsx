import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--cream)] flex flex-col">
      <header className="px-8 py-5 flex items-center justify-between border-b border-[var(--tan)] bg-white">
        <span className="text-lg font-medium text-[var(--olive)] tracking-wide">
          Dating <span className="text-[var(--blush)]">Table</span>
        </span>
        <Link
          href="/auth/signin"
          className="text-sm text-[var(--text-mid)] hover:text-[var(--olive)] transition-colors"
        >
          Sign in
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-20 text-center">
        <div className="max-w-xl">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-[var(--blush)] mb-4">
            A curated community
          </p>
          <h1 className="text-5xl text-[var(--text)] mb-5 leading-tight">
            Date with intention.
            <br />
            <span className="italic text-[var(--blush)]">Find your person.</span>
          </h1>
          <p className="text-[var(--text-mid)] mb-10 max-w-md mx-auto">
            The Dating Table brings together single women who are ready to put themselves out there — with community, support, and a little structure.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center bg-[var(--olive)] text-white rounded-full px-10 py-4 text-sm font-medium tracking-[0.05em] uppercase hover:bg-[var(--text)] transition-colors"
          >
            Join the Dating Table
          </Link>
          <p className="text-xs text-[var(--text-light)] mt-5">
            By application only · Members are vetted
          </p>
        </div>
      </main>
    </div>
  )
}
