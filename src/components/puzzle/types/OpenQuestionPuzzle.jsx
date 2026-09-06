import { useState } from 'react'
import { Button } from '../../ui/Button.jsx'
import { useTranslation } from '../../../hooks/useGame.js'
import { uiStrings } from '../../../data/uiStrings.js'

const MIN_ANSWER_LENGTH = 10

// An open reflection prompt — no right/wrong answer to check, but a real
// answer is required: no skip button, and Submit stays disabled under
// MIN_ANSWER_LENGTH characters so a one-word non-answer can't sneak
// through. Used by Level 1's "getting acquainted" lessons.
export function OpenQuestionPuzzle({ onCorrect }) {
  const { t } = useTranslation()
  const [answer, setAnswer] = useState('')
  const trimmedLength = answer.trim().length
  const tooShort = trimmedLength > 0 && trimmedLength < MIN_ANSWER_LENGTH

  function handleSubmit(event) {
    event.preventDefault()
    if (trimmedLength < MIN_ANSWER_LENGTH) return
    onCorrect()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
        placeholder={t(uiStrings.openAnswerPlaceholder)}
        rows={4}
        className="w-full resize-none rounded-xl border-2 border-gold-600/30 bg-[#fbf5e6] p-4 font-body text-base sm:text-lg text-ink-900 placeholder:text-ink-700/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] transition-all focus:border-gold-600 focus:bg-white focus:outline-none"
      />

      <div className="flex items-center justify-between gap-4">
        <Button type="submit" variant="primary" disabled={trimmedLength < MIN_ANSWER_LENGTH}>
          {t(uiStrings.openAnswerButton)}
        </Button>
        {tooShort ? (
          <span className="text-xs text-red-700">{t(uiStrings.openAnswerTooShort)}</span>
        ) : (
          <span className="text-xs text-ink-700/70">{t(uiStrings.openAnswerRequired)}</span>
        )}
      </div>
    </form>
  )
}
