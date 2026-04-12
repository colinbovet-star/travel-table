import Link from 'next/link'
import SignupForm from '@/components/auth/SignupForm'

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[var(--cream)] flex flex-col">
      {/* Minimal header */}
      <header className="px-8 py-5 flex items-center">
        <Link
          href="/"
          className="font-[var(--font-cormorant),'Cormorant_Garamond',serif] text-lg font-normal tracking-[0.04em] text-[var(--text)] hover:text-[var(--pink)] transition-colors"
          style={{ fontFamily: 'var(--font-cormorant), "Cormorant Garamond", serif' }}
        >
          Travel <span className="text-[var(--pink)]">Table</span>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1
              className="text-4xl font-light text-[var(--text)] mb-3"
              style={{ fontFamily: 'var(--font-cormorant), "Cormorant Garamond", serif' }}
            >
              Create your account
            </h1>
            <p className="text-sm text-[var(--text-light)]">
              Join a community of women who love to travel
            </p>
          </div>

          <div className="bg-white border border-[var(--pink-mid)] rounded-2xl p-8 shadow-sm">
            <SignupForm />
          </div>
        </div>
      </main>
    </div>
  )
}
