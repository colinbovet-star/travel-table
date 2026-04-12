'use client'

function getStrength(password: string): { label: string; level: number; color: string } {
  if (!password) return { label: '', level: 0, color: '' }
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 2) return { label: 'Weak', level: 1, color: '#EF4444' }
  if (score <= 3) return { label: 'Good', level: 2, color: '#F59E0B' }
  return { label: 'Strong', level: 3, color: '#22C55E' }
}

export default function PasswordStrength({ password }: { password: string }) {
  const { label, level, color } = getStrength(password)
  if (!password) return null

  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex gap-1 flex-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ background: i <= level ? color : 'var(--cream-dark)' }}
          />
        ))}
      </div>
      <span className="text-xs font-medium" style={{ color }}>
        {label}
      </span>
    </div>
  )
}
