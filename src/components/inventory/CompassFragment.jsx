import { Compass } from 'lucide-react'

export function CompassFragment({ collected }) {
  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
        collected ? 'border-gold-500 bg-gold-400/20 text-gold-600' : 'border-ink-900/15 bg-ink-900/5 text-ink-900/25'
      }`}
    >
      <Compass size={20} />
    </div>
  )
}
