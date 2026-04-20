'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'blush'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', loading, disabled, children, className = '', ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2'

    const variants = {
      primary:
        'bg-[var(--olive)] text-white rounded-[40px] px-8 py-3.5 text-sm tracking-[0.05em] uppercase hover:bg-[var(--text)] active:scale-[0.98]',
      blush:
        'bg-[var(--blush)] text-white rounded-[40px] px-8 py-3.5 text-sm tracking-[0.05em] uppercase hover:bg-[var(--blush-mid)] active:scale-[0.98]',
      ghost:
        'bg-transparent text-[var(--text-mid)] text-sm hover:text-[var(--blush)] underline-offset-2',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${base} ${variants[variant]} ${className}`}
        {...props}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
