import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Lightbulb, SkipForward } from 'lucide-react'
import { Button } from '../../ui/Button.jsx'
import { useTranslation } from '../../../hooks/useGame.js'
import { uiStrings } from '../../../data/uiStrings.js'

// Punctuation-only strip (not a-z0-9-only) so Vietnamese diacritics survive
// normalization — the old ASCII-only filter silently mangled Vietnamese
// answers (e.g. stripped every accented character).
function normalize(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[?"'.,!;:()]/g, '')
    .replace(/\s+/g, ' ')
}

export function RiddlePuzzle({ puzzle, onCorrect }) {
  const { t } = useTranslation()
  const [answer, setAnswer] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [shake, setShake] = useState(0)
  const hintsRevealed = Math.min(attempts, puzzle.data.hints.length)

  // 10s per attempt by default. Running out of time does NOT pass the
  // riddle through — it counts as a failed attempt (same as a wrong
  // guess: reveals a hint, shakes the input) and the clock just restarts.
  // Only an actually-correct answer, or the explicit skip link, finishes
  // this lesson.
  const timeLimitMs = puzzle.data.timeLimitMs ?? 10000
  const [timeLeft, setTimeLeft] = useState(timeLimitMs)
  const intervalRef = useRef(null)

  useEffect(() => {
    let startedAt = Date.now()
    intervalRef.current = setInterval(() => {
      const remaining = timeLimitMs - (Date.now() - startedAt)
      if (remaining <= 0) {
        setAttempts((count) => count + 1)
        setShake((n) => n + 1)
        startedAt = Date.now()
        setTimeLeft(timeLimitMs)
      } else {
        setTimeLeft(remaining)
      }
    }, 100)
    return () => clearInterval(intervalRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLimitMs])

  function finish() {
    clearInterval(intervalRef.current)
    onCorrect()
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (answer.trim().length === 0) return

    const normalized = normalize(answer)
    const isCorrect = puzzle.data.acceptedAnswers.some((accepted) => normalize(accepted) === normalized)

    if (isCorrect) {
      finish()
      return
    }
    setAttempts((count) => count + 1)
    setShake((n) => n + 1)
  }

  const progress = Math.max(0, timeLeft / timeLimitMs)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-900/10">
        <div
          className={`h-full transition-[width] ${progress < 0.25 ? 'bg-red-600' : 'bg-gold-600'}`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <motion.input
        key={shake}
        animate={shake > 0 ? { x: [0, -8, 8, -6, 6, 0] } : {}}
        transition={{ duration: 0.4 }}
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
        placeholder={t(uiStrings.answerPlaceholder)}
        className="w-full rounded-xl border-2 border-gold-600/30 bg-[#fbf5e6] px-5 py-3.5 font-body text-base sm:text-lg text-ink-900 placeholder:text-ink-700/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] transition-all focus:border-gold-600 focus:bg-white focus:outline-none"
      />

      <div className="flex items-center justify-between gap-4">
        <Button type="submit" variant="primary">
          {t(uiStrings.answerButton)}
        </Button>
        {hintsRevealed === 0 ? (
          <span className="text-xs text-ink-700/70">{t(uiStrings.hintPrompt)}</span>
        ) : null}
      </div>

      {hintsRevealed > 0 ? (
        <ul className="space-y-1.5 border-t border-ink-900/10 pt-3">
          {puzzle.data.hints.slice(0, hintsRevealed).map((hint, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-ink-700">
              <Lightbulb size={14} className="mt-0.5 shrink-0 text-gold-600" />
              {t(hint)}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex justify-end border-t border-ink-900/10 pt-3">
        <button
          type="button"
          onClick={finish}
          className="flex items-center gap-1.5 text-xs text-ink-700/60 transition-colors hover:text-ink-900 hover:underline"
        >
          <SkipForward size={12} />
          {t(uiStrings.skipQuestion)}
        </button>
      </div>
    </form>
  )
}
