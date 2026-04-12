'use client'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  onPrev?: () => void
  onNext?: () => void
}

const stepLabels = ['About you', 'Travel style', 'Travel plans', 'Final step']

export default function StepIndicator({ currentStep, totalSteps, onPrev, onNext }: StepIndicatorProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onPrev}
            disabled={!onPrev}
            aria-label="Previous step"
            className="w-7 h-7 flex items-center justify-center rounded-full border border-[var(--pink-mid)] text-[var(--text-mid)] hover:border-[var(--pink)] hover:text-[var(--pink)] transition-colors disabled:opacity-0 disabled:pointer-events-none"
          >
            ←
          </button>
          <span className="text-xs text-[var(--text-light)] font-medium tracking-wide uppercase">
            Step {currentStep} of {totalSteps}
          </span>
          <button
            type="button"
            onClick={onNext}
            disabled={!onNext}
            aria-label="Next step"
            className="w-7 h-7 flex items-center justify-center rounded-full border border-[var(--pink-mid)] text-[var(--text-mid)] hover:border-[var(--pink)] hover:text-[var(--pink)] transition-colors disabled:opacity-0 disabled:pointer-events-none"
          >
            →
          </button>
        </div>
        <span className="text-xs text-[var(--text-light)]">
          {stepLabels[currentStep - 1]}
        </span>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i + 1 <= currentStep ? 'bg-[var(--pink)]' : 'bg-[var(--cream-dark)]'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
