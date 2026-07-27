import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useTranslation } from '../../../hooks/useGame.js'
import { uiStrings } from '../../../data/uiStrings.js'
import { shuffle } from '../../../utils/shuffle.js'

// puzzle.data: { pairs: [{id, left, right}] }
// Click-to-select rather than drag-and-drop — works the same on touch and
// desktop, no extra dependency.
export function MatchingPuzzle({ puzzle, onCorrect }) {
  const { t } = useTranslation()
  const pairs = puzzle.data.pairs
  const [rightOrder] = useState(() => shuffle(pairs))
  const [matchedIds, setMatchedIds] = useState([])
  const [selectedLeft, setSelectedLeft] = useState(null)
  const [selectedRight, setSelectedRight] = useState(null)
  const [wrongFlash, setWrongFlash] = useState(false)

  useEffect(() => {
    if (selectedLeft === null || selectedRight === null) return

    if (selectedLeft === selectedRight) {
      const next = [...matchedIds, selectedLeft]
      setMatchedIds(next)
      setSelectedLeft(null)
      setSelectedRight(null)
      if (next.length === pairs.length) onCorrect()
      return
    }

    setWrongFlash(true)
    const timeoutId = setTimeout(() => {
      setWrongFlash(false)
      setSelectedLeft(null)
      setSelectedRight(null)
    }, 500)
    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLeft, selectedRight])

  function cellClass(pairId, isSelected) {
    if (matchedIds.includes(pairId)) return 'border-green-600 bg-green-600/10 cursor-default'
    if (isSelected && wrongFlash) return 'border-red-600 bg-red-600/10'
    if (isSelected) return 'border-gold-600 bg-gold-400/10'
    return 'border-ink-900/20 bg-parchment-100 hover:border-gold-600'
  }

  return (
    <div className="space-y-3">
      {!matchedIds.length ? <p className="text-xs text-ink-700/70">{t(uiStrings.resetSelectionHint)}</p> : null}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          {pairs.map((pair) => (
            <motion.button
              key={pair.id}
              type="button"
              disabled={matchedIds.includes(pair.id)}
              onClick={() => setSelectedLeft(pair.id)}
              animate={selectedLeft === pair.id && wrongFlash ? { x: [0, -6, 6, -4, 4, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm font-body text-ink-900 transition-colors ${cellClass(pair.id, selectedLeft === pair.id)}`}
            >
              {t(pair.left)}
              {matchedIds.includes(pair.id) ? <Check size={14} className="text-green-700" /> : null}
            </motion.button>
          ))}
        </div>
        <div className="space-y-2">
          {rightOrder.map((pair) => (
            <motion.button
              key={pair.id}
              type="button"
              disabled={matchedIds.includes(pair.id)}
              onClick={() => setSelectedRight(pair.id)}
              animate={selectedRight === pair.id && wrongFlash ? { x: [0, -6, 6, -4, 4, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm font-body text-ink-900 transition-colors ${cellClass(pair.id, selectedRight === pair.id)}`}
            >
              {t(pair.right)}
              {matchedIds.includes(pair.id) ? <Check size={14} className="text-green-700" /> : null}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
