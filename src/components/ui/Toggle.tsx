'use client'

import { useId } from 'react'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  id?: string
}

export default function Toggle({ checked, onChange, label, description, id }: ToggleProps) {
  const generatedId = useId()
  const toggleId = id || `toggle-${generatedId}`

  return (
    <label htmlFor={toggleId} className="flex items-start gap-3 cursor-pointer group">
      <div className="relative flex-shrink-0 mt-0.5">
        <input
          id={toggleId}
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={`w-10 h-6 rounded-full transition-colors duration-200 ${
            checked ? 'bg-[var(--green)]' : 'bg-[var(--cream-dark)] border border-[var(--pink-mid)]'
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
              checked ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </div>
      </div>
      {(label || description) && (
        <div>
          {label && <p className="text-sm font-medium text-[var(--text)]">{label}</p>}
          {description && <p className="text-xs text-[var(--text-light)] mt-0.5">{description}</p>}
        </div>
      )}
    </label>
  )
}
