'use client'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

const stepLabels = ['About you', 'Travel style', 'Travel plans', 'Final step']

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--text-light)] font-medium tracking-wide uppercase">
          Step {currentStep} of {totalSteps}
        </span>
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
