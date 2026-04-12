'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'pink'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', loading, disabled, children, className = '', ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-sans font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2'

    const variants = {
      primary: 'bg-[var(--green)] text-white rounded-[40px] px-8 py-3.5 text-sm tracking-[0.03em] hover:bg-[var(--text)] active:scale-[0.98]',
      pink: 'bg-[var(--pink)] text-white rounded-[40px] px-8 py-3.5 text-sm tracking-[0.03em] hover:bg-[var(--pink-dark)] active:scale-[0.98]',
      ghost: 'bg-transparent text-[var(--text-mid)] text-sm hover:text-[var(--pink)]',
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
