import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

// Falls back to an emoji glyph if the image 404s/is blocked — the whole
// point of carrying `fallbackEmoji` alongside every external URL.
function CardVisual({ imageSrc, fallbackEmoji, emoji, alt }) {
  const [failed, setFailed] = useState(false)

  if (emoji) return <span className="text-5xl leading-none sm:text-6xl">{emoji}</span>
  if (!imageSrc || failed) return <span className="text-5xl leading-none sm:text-6xl">{fallbackEmoji ?? '🖼️'}</span>
  return (
    <img
      src={imageSrc}
      alt={alt ?? ''}
      onError={() => setFailed(true)}
      loading="lazy"
      className="h-20 w-full rounded-lg object-cover sm:h-24"
    />
  )
}

// state: 'idle' | 'dimmed' | 'correct' | 'wrong'
export function QuizCard({ letter, emoji, imageSrc, imageFallback, imageAlt, label, state, onSelect, disabled }) {
  const hasVisual = Boolean(emoji || imageSrc)

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      whileHover={!disabled ? { y: -6, scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.96 } : {}}
      animate={
        state === 'wrong'
          ? { x: [0, -5, 5, -3, 3, 0] }
          : state === 'correct'
            ? { scale: [1, 1.06, 1] }
            : { scale: 1, x: 0 }
      }
      transition={{ duration: 0.4 }}
      className={`relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border p-3 text-center backdrop-blur-md transition-colors sm:p-4 ${
        state === 'correct'
          ? 'border-green-400/70 bg-green-400/15 shadow-[0_0_34px_-8px_rgba(74,222,128,0.7)]'
          : state === 'wrong'
            ? 'border-red-400/70 bg-red-400/15'
            : state === 'dimmed'
              ? 'border-white/5 bg-white/5 opacity-35'
              : 'border-white/15 bg-white/10 shadow-[0_10px_30px_-14px_rgba(0,0,0,0.6)] hover:border-gold-400/50 hover:bg-white/15'
      }`}
    >
      {state === 'correct' ? (
        <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-400 text-ocean-950">
          <Check size={14} strokeWidth={3} />
        </span>
      ) : null}
      {state === 'wrong' ? (
        <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-400 text-ocean-950">
          <X size={14} strokeWidth={3} />
        </span>
      ) : null}

      {hasVisual ? <CardVisual imageSrc={imageSrc} fallbackEmoji={imageFallback} emoji={emoji} alt={imageAlt} /> : null}

      <span className="flex items-center gap-2 font-display text-sm text-parchment-100 sm:text-base">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15 text-[10px] text-parchment-100/80">
          {letter}
        </span>
        {label}
      </span>
    </motion.button>
  )
}
