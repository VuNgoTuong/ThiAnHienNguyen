import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { useTranslation } from '../../../hooks/useGame.js'
import { uiStrings } from '../../../data/uiStrings.js'
import { Button } from '../../ui/Button.jsx'

// puzzle.data: { options: [{id, text}], correctOptionId, funFact? }
export function MultipleChoicePuzzle({ puzzle, onCorrect }) {
  const { t } = useTranslation()
  const [selectedId, setSelectedId] = useState(null)
  const [status, setStatus] = useState('idle') // idle | wrong | correct

  function handleSelect(optionId) {
    if (status === 'correct') return
    setSelectedId(optionId)
    if (optionId === puzzle.data.correctOptionId) {
      setStatus('correct')
    } else {
      setStatus('wrong')
      setTimeout(() => setStatus('idle'), 500)
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3.5">
        {puzzle.data.options.map((option) => {
          const isSelected = selectedId === option.id
          const isCorrectOption = option.id === puzzle.data.correctOptionId
          const showCorrect = status === 'correct' && isCorrectOption
          const showWrong = status === 'wrong' && isSelected

          return (
            <motion.button
              key={option.id}
              type="button"
              onClick={() => handleSelect(option.id)}
              disabled={status === 'correct'}
              whileHover={status !== 'correct' ? { scale: 1.01, x: 3 } : undefined}
              whileTap={status !== 'correct' ? { scale: 0.99 } : undefined}
              animate={showWrong ? { x: [0, -6, 6, -4, 4, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={`flex items-center justify-between rounded-xl border-2 px-5 py-4 text-left font-body text-base sm:text-lg font-medium transition-all shadow-sm ${
                showCorrect
                  ? 'border-emerald-600 bg-emerald-600/15 text-emerald-950 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                  : showWrong
                    ? 'border-red-600 bg-red-600/15 text-red-950 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                    : 'border-gold-600/30 bg-[#fbf5e6] text-ink-900 hover:border-gold-600 hover:bg-[#ffffff] hover:shadow-md'
              }`}
            >
              <span>{t(option.text)}</span>
              {showCorrect ? <Check size={20} className="text-emerald-700 font-bold shrink-0 ml-2" /> : null}
              {showWrong ? <X size={20} className="text-red-700 font-bold shrink-0 ml-2" /> : null}
            </motion.button>
          )
        })}
      </div>

      {status === 'correct' ? (
        <div className="space-y-3 border-t border-ink-900/10 pt-3">
          {puzzle.data.funFact ? <p className="text-sm text-ink-700">{t(puzzle.data.funFact)}</p> : null}
          <Button onClick={onCorrect}>{t(uiStrings.continueLabel)}</Button>
        </div>
      ) : null}
    </div>
  )
}
