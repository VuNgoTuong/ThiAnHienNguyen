import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { useTranslation } from '../../../hooks/useGame.js'
import { uiStrings } from '../../../data/uiStrings.js'
import { Button } from '../../ui/Button.jsx'

// puzzle.data: { emoji, effect: 'blur'|'silhouette'|'zoom'|'flash', options: [{id, text}], correctOptionId }
// No image assets/URLs involved — the "picture" is a large emoji glyph run
// through a CSS effect, which keeps this free of any external dependency.
// Each wrong guess nudges the effect a step toward fully revealed so a
// player never gets stuck staring at something illegible.
const HINT_STEPS = 3

function PictureFrame({ emoji, effect, wrongCount, solved }) {
  const hintLevel = Math.min(wrongCount, HINT_STEPS)
  const [flashPeek, setFlashPeek] = useState(true)

  useEffect(() => {
    if (effect !== 'flash') return
    const timeout = setTimeout(() => setFlashPeek(false), 1800)
    return () => clearTimeout(timeout)
  }, [effect])

  useEffect(() => {
    if (effect !== 'flash' || wrongCount === 0) return
    setFlashPeek(true)
    const timeout = setTimeout(() => setFlashPeek(false), 550)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wrongCount])

  const blurPx = solved ? 0 : [9, 6, 3, 0][hintLevel]
  const silhouetteOverlay = solved ? 0 : [1, 0.7, 0.35, 0][hintLevel]
  const zoomScale = solved ? 1 : [3.4, 2.6, 1.8, 1][hintLevel]
  const flashHidden = effect === 'flash' && !solved && !flashPeek

  return (
    <div className="relative mx-auto flex h-40 w-40 items-center justify-center overflow-hidden rounded-2xl border border-gold-500/30 bg-gradient-to-b from-ocean-900 to-ocean-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <motion.span
        animate={{
          scale: effect === 'zoom' ? zoomScale : 1,
          filter: effect === 'blur' ? `blur(${blurPx}px)` : 'none',
          opacity: flashHidden ? 0 : 1,
        }}
        transition={{ duration: 0.35 }}
        className="select-none text-8xl leading-none"
      >
        {emoji}
      </motion.span>

      {effect === 'silhouette' ? (
        <motion.div
          animate={{ opacity: silhouetteOverlay }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0 bg-ocean-950"
        />
      ) : null}

      {flashHidden ? (
        <span className="absolute font-display text-2xl text-parchment-200/30">?</span>
      ) : null}
    </div>
  )
}

export function PictureQuizPuzzle({ puzzle, onCorrect }) {
  const { t } = useTranslation()
  const { emoji, effect, options, correctOptionId } = puzzle.data
  const [selectedId, setSelectedId] = useState(null)
  const [status, setStatus] = useState('idle') // idle | wrong | correct
  const [wrongCount, setWrongCount] = useState(0)

  function handleSelect(optionId) {
    if (status === 'correct') return
    setSelectedId(optionId)
    if (optionId === correctOptionId) {
      setStatus('correct')
    } else {
      setStatus('wrong')
      setWrongCount((count) => count + 1)
      setTimeout(() => setStatus('idle'), 500)
    }
  }

  return (
    <div className="space-y-4">
      <PictureFrame emoji={emoji} effect={effect} wrongCount={wrongCount} solved={status === 'correct'} />

      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => {
          const isSelected = selectedId === option.id
          const isCorrectOption = option.id === correctOptionId
          const showCorrect = status === 'correct' && isCorrectOption
          const showWrong = status === 'wrong' && isSelected

          return (
            <motion.button
              key={option.id}
              type="button"
              onClick={() => handleSelect(option.id)}
              disabled={status === 'correct'}
              animate={showWrong ? { x: [0, -6, 6, -4, 4, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={`flex items-center justify-between rounded-lg border px-4 py-2.5 text-left font-body text-ink-900 transition-colors ${
                showCorrect
                  ? 'border-green-600 bg-green-600/10'
                  : showWrong
                    ? 'border-red-600 bg-red-600/10'
                    : 'border-ink-900/20 bg-parchment-100 hover:border-gold-600'
              }`}
            >
              <span>{t(option.text)}</span>
              {showCorrect ? <Check size={16} className="text-green-700" /> : null}
              {showWrong ? <X size={16} className="text-red-700" /> : null}
            </motion.button>
          )
        })}
      </div>

      {status === 'correct' ? <Button onClick={onCorrect}>{t(uiStrings.continueLabel)}</Button> : null}
    </div>
  )
}
