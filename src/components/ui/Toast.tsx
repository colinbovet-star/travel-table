'use client'

import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  onDismiss?: () => void
  durationMs?: number
}

export default function Toast({ message, onDismiss, durationMs = 5000 }: ToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setVisible(true))

    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onDismiss?.(), 300)
    }, durationMs)

    return () => clearTimeout(timer)
  }, [durationMs, onDismiss])

  return (
    <div
      className={`
        fixed bottom-6 left-1/2 -translate-x-1/2 z-50
        bg-[var(--green)] text-white text-sm font-medium
        px-6 py-3.5 rounded-full shadow-lg
        transition-all duration-300
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      {message}
    </div>
  )
}
