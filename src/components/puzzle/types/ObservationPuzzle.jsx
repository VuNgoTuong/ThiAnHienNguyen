import { useEffect, useState } from 'react'
import * as Icons from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from '../../../hooks/useGame.js'
import { uiStrings } from '../../../data/uiStrings.js'

// puzzle.data: { icon: 'Compass', gridSize: 16, timeLimitMs: 10000 }
// A grid of identical icons with one rotated/dimmed cell — click it before
// the timer runs out. Timeout or a wrong click just re-randomizes and
// resets the timer, no dead-end/fail state.
export function ObservationPuzzle({ puzzle, onCorrect }) {
  const { t } = useTranslation()
  const { icon = 'Compass', gridSize = 16, timeLimitMs = 10000 } = puzzle.data
  const Icon = Icons[icon] ?? Icons.Compass

  const [oddIndex, setOddIndex] = useState(() => Math.floor(Math.random() * gridSize))
  const [timeLeft, setTimeLeft] = useState(timeLimitMs)
  const [wrongIndex, setWrongIndex] = useState(null)

  useEffect(() => {
    const startedAt = Date.now()
    const intervalId = setInterval(() => {
      const remaining = timeLimitMs - (Date.now() - startedAt)
      if (remaining <= 0) {
        setOddIndex(Math.floor(Math.random() * gridSize))
        setTimeLeft(timeLimitMs)
      } else {
        setTimeLeft(remaining)
      }
    }, 100)
    return () => clearInterval(intervalId)
  }, [oddIndex, gridSize, timeLimitMs])

  function handleClick(index) {
    if (index === oddIndex) {
      onCorrect()
      return
    }
    setWrongIndex(index)
    setTimeout(() => setWrongIndex(null), 300)
  }

  const progress = Math.max(0, timeLeft / timeLimitMs)
  const columns = Math.ceil(Math.sqrt(gridSize))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-ink-700/70">{t(uiStrings.observationPrompt)}</p>
        <div className="h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-ink-900/10">
          <div className="h-full bg-gold-600 transition-[width]" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {Array.from({ length: gridSize }).map((_, index) => {
          const isOdd = index === oddIndex
          return (
            <motion.button
              key={index}
              type="button"
              onClick={() => handleClick(index)}
              animate={wrongIndex === index ? { x: [0, -4, 4, -3, 3, 0] } : {}}
              transition={{ duration: 0.3 }}
              className="flex aspect-square items-center justify-center rounded-lg border border-ink-900/15 bg-parchment-100 text-ink-900/70 transition-colors hover:border-gold-600"
            >
              <Icon size={18} style={isOdd ? { transform: 'rotate(30deg)', opacity: 0.45 } : undefined} />
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
