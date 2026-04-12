'use client'

interface PillSelectProps {
  options: string[]
  value: string | string[]
  onChange: (val: string | string[]) => void
  multiSelect?: boolean
  minSelect?: number
  error?: string
}

export default function PillSelect({
  options,
  value,
  onChange,
  multiSelect = false,
  error,
}: PillSelectProps) {
  const selected = multiSelect
    ? (value as string[])
    : value
    ? [value as string]
    : []

  function toggle(option: string) {
    if (multiSelect) {
      const current = value as string[]
      if (current.includes(option)) {
        onChange(current.filter((v) => v !== option))
      } else {
        onChange([...current, option])
      }
    } else {
      onChange(option === value ? '' : option)
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option)
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              className={`
                px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-150
                ${isSelected
                  ? 'bg-[var(--green)] border-[var(--green)] text-white'
                  : 'bg-[var(--cream)] border-[var(--green-mid)] text-[var(--text-mid)] hover:bg-[var(--cream-dark)] hover:border-[var(--green)] hover:text-[var(--green)]'
                }
              `}
            >
              {option}
            </button>
          )
        })}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
