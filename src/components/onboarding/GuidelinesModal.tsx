'use client'

import Button from '@/components/ui/Button'

export default function GuidelinesModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-8 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2
            className="text-2xl font-light text-[var(--text)]"
            style={{ fontFamily: 'var(--font-cormorant), "Cormorant Garamond", serif' }}
          >
            Community Guidelines
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--text-light)] hover:text-[var(--text)] text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-4 text-sm text-[var(--text-mid)] leading-relaxed">
          <p>
            The Travel Table is a community built on trust, respect, and a shared love of exploration. To keep this a safe and welcoming space, we ask all members to commit to the following:
          </p>
          <div>
            <p className="font-medium text-[var(--text)] mb-1">Be respectful</p>
            <p>Treat every member with kindness and respect, regardless of their background, travel style, or preferences.</p>
          </div>
          <div>
            <p className="font-medium text-[var(--text)] mb-1">Be honest</p>
            <p>Represent yourself authentically. Use a genuine photo and accurate information in your profile.</p>
          </div>
          <div>
            <p className="font-medium text-[var(--text)] mb-1">Stay safe</p>
            <p>Exercise your own judgment when meeting other members. Always meet in public places first and trust your instincts.</p>
          </div>
          <div>
            <p className="font-medium text-[var(--text)] mb-1">No spam or solicitation</p>
            <p>This is a space for genuine connection, not promotion. Do not use the platform to advertise services or products.</p>
          </div>
          <div>
            <p className="font-medium text-[var(--text)] mb-1">Age requirement</p>
            <p>Membership is open to women aged 30 and over. Misrepresenting your age will result in removal.</p>
          </div>
        </div>

        <Button variant="primary" onClick={onClose} className="w-full mt-2">
          Got it
        </Button>
      </div>
    </div>
  )
}
