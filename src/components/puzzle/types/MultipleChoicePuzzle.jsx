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
    <div className="space-y-4">
      <div className="grid gap-2">
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

      {status === 'correct' ? (
        <div className="space-y-3 border-t border-ink-900/10 pt-3">
          {puzzle.data.funFact ? <p className="text-sm text-ink-700">{t(puzzle.data.funFact)}</p> : null}
          <Button onClick={onCorrect}>{t(uiStrings.continueLabel)}</Button>
        </div>
      ) : null}
    </div>
  )
}
