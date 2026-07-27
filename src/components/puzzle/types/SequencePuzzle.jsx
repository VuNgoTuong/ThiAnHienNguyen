import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '../../../hooks/useGame.js'
import { uiStrings } from '../../../data/uiStrings.js'
import { Button } from '../../ui/Button.jsx'
import { shuffle } from '../../../utils/shuffle.js'

// puzzle.data: { items: [{id, label}], correctOrder: [id, ...] }
// Click-to-append into a tray, then Check — no drag library needed.
export function SequencePuzzle({ puzzle, onCorrect }) {
  const { t } = useTranslation()
  const itemsById = Object.fromEntries(puzzle.data.items.map((item) => [item.id, item]))
  const [poolIds, setPoolIds] = useState(() => shuffle(puzzle.data.items.map((item) => item.id)))
  const [trayIds, setTrayIds] = useState([])
  const [shake, setShake] = useState(0)

  function addToTray(id) {
    setPoolIds((ids) => ids.filter((poolId) => poolId !== id))
    setTrayIds((ids) => [...ids, id])
  }

  function removeFromTray(id) {
    setTrayIds((ids) => ids.filter((trayId) => trayId !== id))
    setPoolIds((ids) => [...ids, id])
  }

  function handleCheck() {
    const isCorrect =
      trayIds.length === puzzle.data.correctOrder.length &&
      trayIds.every((id, index) => id === puzzle.data.correctOrder[index])

    if (isCorrect) {
      onCorrect()
      return
    }
    setShake((n) => n + 1)
    setPoolIds((ids) => [...ids, ...trayIds])
    setTrayIds([])
  }

  return (
    <div className="space-y-4">
      <motion.div
        key={shake}
        animate={shake > 0 ? { x: [0, -6, 6, -4, 4, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="flex min-h-14 flex-wrap gap-2 rounded-lg border border-dashed border-ink-900/25 bg-ink-900/5 p-3"
      >
        {trayIds.length === 0 ? (
          <span className="text-xs text-ink-700/60">{t(uiStrings.resetSelectionHint)}</span>
        ) : null}
        {trayIds.map((id, index) => (
          <button
            key={id}
            type="button"
            onClick={() => removeFromTray(id)}
            className="rounded-full border border-gold-600 bg-gold-400/15 px-3 py-1.5 text-sm text-ink-900"
          >
            {index + 1}. {t(itemsById[id].label)}
          </button>
        ))}
      </motion.div>

      <div className="flex flex-wrap gap-2">
        {poolIds.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => addToTray(id)}
            className="rounded-full border border-ink-900/20 bg-parchment-100 px-3 py-1.5 text-sm text-ink-900 transition-colors hover:border-gold-600"
          >
            {t(itemsById[id].label)}
          </button>
        ))}
      </div>

      <Button onClick={handleCheck} disabled={trayIds.length !== puzzle.data.items.length}>
        {t(uiStrings.checkButton)}
      </Button>
    </div>
  )
}
