'use client'

import { useRef, useState } from 'react'

interface PhotoUploadProps {
  value: string | null
  onChange: (url: string | null) => void
  slot: 'headshot' | 'photo_2' | 'photo_3'
  label?: string
  hint?: string
  circular?: boolean
}

export default function PhotoUpload({
  value,
  onChange,
  slot,
  label,
  hint,
  circular = false,
}: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      setError('Please upload a JPG, PNG, or WEBP image.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB.')
      return
    }

    setError(null)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch(`/api/upload?slot=${slot}`, { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Upload failed')

      const { url } = await res.json()
      onChange(url)
    } catch {
      setError('Upload failed — please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && <p className="text-sm font-medium text-[var(--text)]">{label}</p>}
      <div
        onClick={() => inputRef.current?.click()}
        className={`
          relative cursor-pointer border-2 border-dashed border-[var(--tan)]
          bg-[var(--cream)] hover:bg-[var(--tan-light)] transition-colors
          flex items-center justify-center overflow-hidden
          ${circular ? 'w-32 h-32 rounded-full' : 'w-full h-40 rounded-2xl'}
        `}
      >
        {value ? (
          <img
            src={value}
            alt="Photo"
            className={`w-full h-full object-cover ${circular ? 'rounded-full' : 'rounded-2xl'}`}
          />
        ) : uploading ? (
          <span className="w-6 h-6 border-2 border-[var(--blush)] border-t-transparent rounded-full animate-spin" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-center px-3">
            <span className="text-2xl">📷</span>
            <span className="text-xs text-[var(--text-light)]">Click to upload</span>
          </div>
        )}
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onChange(null)
            }}
            className="absolute top-2 right-2 w-6 h-6 bg-black/50 text-white rounded-full text-xs flex items-center justify-center hover:bg-black/70"
          >
            ×
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
      {hint && !error && <p className="text-xs text-[var(--text-light)]">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
