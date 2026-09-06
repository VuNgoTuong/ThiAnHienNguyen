import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { useTypewriter } from '../../hooks/useTypewriter.js'
import { useTranslation } from '../../hooks/useGame.js'
import { ParchmentPanel } from '../ui/ParchmentPanel.jsx'
import { uiStrings } from '../../data/uiStrings.js'

// Generic line-by-line dialog renderer, used for island arrivals,
// discoveries, and the ending alike — only the `speaker`/`lines` data
// changes between call sites. `lines` is an array of `{ vi, en }` fields.
export function DialogBox({ speaker, lines, onComplete }) {
  const { t } = useTranslation()
  const [lineIndex, setLineIndex] = useState(0)
  const currentLine = t(lines[lineIndex])
  const { displayedText, isDone, skip } = useTypewriter(currentLine)
  const isLastLine = lineIndex === lines.length - 1

  function handleAdvance() {
    if (!isDone) {
      skip()
      return
    }
    if (!isLastLine) {
      setLineIndex((index) => index + 1)
    } else {
      onComplete?.()
    }
  }

  return (
    <ParchmentPanel
      as="button"
      type="button"
      onClick={handleAdvance}
      className="mx-auto block w-full max-w-2xl cursor-pointer p-6 text-left"
    >
      {speaker ? (
        <p className="mb-3 font-display text-xs font-bold tracking-widest text-gold-700 uppercase">{t(speaker)}</p>
      ) : null}

      <AnimatePresence mode="wait">
        <motion.p
          key={lineIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="min-h-20 font-serif text-xl font-medium leading-relaxed text-ink-900"
        >
          {displayedText}
        </motion.p>
      </AnimatePresence>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-1.5">
          {lines.map((_, index) => (
            <span
              key={index}
              className={`h-1.5 w-1.5 rounded-full ${index === lineIndex ? 'bg-gold-600' : 'bg-ink-900/20'}`}
            />
          ))}
        </div>
        <motion.span
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex items-center gap-1 text-xs tracking-wide text-ink-700"
        >
          {isDone ? (isLastLine ? t(uiStrings.continueLabel) : t(uiStrings.next)) : t(uiStrings.skip)}
          <ChevronRight size={14} />
        </motion.span>
      </div>
    </ParchmentPanel>
  )
}
