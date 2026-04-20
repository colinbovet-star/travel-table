'use client'

interface StepProgressProps {
  currentStep: number
  totalSteps: number
  title?: string
}

const STEP_LABELS = [
  'About You',
  'Who You\'re Open to',
  'Table Preferences',
  'Membership',
  'Refer a Friend',
]

export default function StepProgress({ currentStep, totalSteps, title }: StepProgressProps) {
  const pct = Math.round(((currentStep - 1) / totalSteps) * 100)

  return (
    <div className="flex flex-col gap-3 mb-8">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--text-light)] tracking-widest uppercase">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-xs text-[var(--text-light)]">
          {title ?? STEP_LABELS[currentStep - 1]}
        </span>
      </div>
      <div className="h-1 w-full bg-[var(--cream-dark)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--blush)] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
