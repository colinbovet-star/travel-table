'use client'

interface StyleSliderProps {
  value: number
  onChange: (val: number) => void
  error?: string
}

export default function StyleSlider({ value, onChange, error }: StyleSliderProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 appearance-none rounded-full cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--pink) 0%, var(--pink) ${(value - 1) * 25}%, var(--cream-dark) ${(value - 1) * 25}%, var(--cream-dark) 100%)`,
          }}
        />
        <style>{`
          input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: var(--green);
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            cursor: pointer;
          }
          input[type=range]::-moz-range-thumb {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: var(--green);
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            cursor: pointer;
          }
        `}</style>
      </div>
      <div className="flex justify-between text-xs text-[var(--text-light)]">
        <span>Fully relaxed</span>
        <span>Very active</span>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
