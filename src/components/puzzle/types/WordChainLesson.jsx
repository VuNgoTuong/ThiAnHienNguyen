import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bot, User, Sparkles } from 'lucide-react'
import { useTranslation } from '../../../hooks/useGame.js'
import { uiStrings } from '../../../data/uiStrings.js'
import { Button } from '../../ui/Button.jsx'
import { getSyllables, validateNextWord, pickAiWord, hasAnyCandidate, pickRandomStartWord } from '../../../utils/wordChainEngine.js'

const TARGET_CORRECT = 10
const AI_THINK_DELAY_MS = 650
// Only the tail of the chain is ever shown — a chat log that scrolled back
// to the first word would just get taller and taller over 10 rounds. The
// full chain still lives in state (needed for the used-words check), it
// just isn't all rendered.
const VISIBLE_HISTORY = 5

const ERROR_KEYS = {
  'needs-two-syllables': 'wordChainNeedsTwoSyllables',
  'wrong-start': 'wordChainWrongStart',
  used: 'wordChainUsed',
  unknown: 'wordChainUnknown',
}

function ChatBubble({ entry }) {
  const isPlayer = entry.by === 'player'
  const isStart = entry.by === 'start'
  const Icon = isStart ? Sparkles : isPlayer ? User : Bot

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex items-end gap-2 ${isPlayer ? 'flex-row-reverse self-end' : 'self-start'}`}
    >
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
          isPlayer ? 'bg-gold-500 text-ink-900' : 'bg-ink-900/15 text-ink-700'
        }`}
      >
        <Icon size={12} />
      </span>
      <span
        className={`rounded-2xl px-3 py-1.5 text-sm ${
          isPlayer ? 'rounded-br-sm bg-gold-500/90 text-ink-900' : 'rounded-bl-sm bg-parchment-100 text-ink-900'
        }`}
      >
        {entry.word}
      </span>
    </motion.div>
  )
}

export function WordChainLesson({ puzzle, onCorrect }) {
  const { t } = useTranslation()
  const [chain, setChain] = useState(() => [{ word: pickRandomStartWord(), by: 'start' }])
  const [input, setInput] = useState('')
  const [error, setError] = useState(null)
  const [aiThinking, setAiThinking] = useState(false)
  const [freeMove, setFreeMove] = useState(false)

  const playerCorrectCount = chain.filter((entry) => entry.by === 'player').length
  const lastWord = chain[chain.length - 1].word
  const requiredStartSyllable = freeMove ? null : getSyllables(lastWord)[1]

  // Per player turn — timing out does NOT pass the lesson through. It
  // restarts the whole round from the starter word, so all 10 correct
  // chains still have to happen inside the time limit, turn by turn.
  const timeLimitMs = puzzle?.data?.timeLimitMs ?? 15000
  const [timeLeft, setTimeLeft] = useState(timeLimitMs)
  const intervalRef = useRef(null)

  useEffect(() => {
    clearInterval(intervalRef.current)
    if (aiThinking) return

    const startedAt = Date.now()
    setTimeLeft(timeLimitMs)
    intervalRef.current = setInterval(() => {
      const remaining = timeLimitMs - (Date.now() - startedAt)
      if (remaining <= 0) {
        clearInterval(intervalRef.current)
        setChain([{ word: pickRandomStartWord(), by: 'start' }])
        setInput('')
        setError(null)
        setFreeMove(false)
      } else {
        setTimeLeft(remaining)
      }
    }, 100)
    return () => clearInterval(intervalRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain.length, aiThinking, timeLimitMs])

  // Proactively detect a dead syllable (no unused dictionary word starts
  // with it) so the player is never left guessing at the impossible —
  // catches it whenever the chain changes, not just after a failed guess.
  useEffect(() => {
    if (freeMove || aiThinking) return
    const usedWords = new Set(chain.map((entry) => entry.word))
    if (!hasAnyCandidate({ requiredStartSyllable, usedWords })) {
      setFreeMove(true)
    }
  }, [chain, freeMove, aiThinking, requiredStartSyllable])

  function handleSubmit(event) {
    event.preventDefault()
    if (aiThinking || input.trim().length === 0) return

    const usedWords = new Set(chain.map((entry) => entry.word))
    const result = validateNextWord({ input, requiredStartSyllable, usedWords })

    if (!result.valid) {
      setError(result.reason)
      return
    }

    setError(null)
    setInput('')
    setFreeMove(false)

    const nextChain = [...chain, { word: result.word, by: 'player' }]
    setChain(nextChain)

    if (nextChain.filter((entry) => entry.by === 'player').length >= TARGET_CORRECT) {
      clearInterval(intervalRef.current)
      onCorrect()
      return
    }

    setAiThinking(true)
    const nextUsed = new Set(nextChain.map((entry) => entry.word))
    const nextRequired = getSyllables(result.word)[1]

    setTimeout(() => {
      const aiWord = pickAiWord({ requiredStartSyllable: nextRequired, usedWords: nextUsed })
      setAiThinking(false)
      if (aiWord) {
        setChain((current) => [...current, { word: aiWord, by: 'ai' }])
      } else {
        setFreeMove(true)
      }
    }, AI_THINK_DELAY_MS)
  }

  const timerProgress = Math.max(0, timeLeft / timeLimitMs)
  const visibleChain = chain.slice(-VISIBLE_HISTORY)

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 rounded-xl border border-ink-900/10 bg-ink-900/5 p-3">
        <AnimatePresence initial={false}>
          {visibleChain.map((entry) => (
            <ChatBubble key={`${chain.length - visibleChain.length}-${entry.word}`} entry={entry} />
          ))}
        </AnimatePresence>
        {aiThinking ? (
          <p className="pl-8 text-xs text-ink-700/60 italic">{t(uiStrings.wordChainAiThinking)}</p>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3 text-xs text-ink-700">
        <span className="font-medium">
          {t(uiStrings.wordChainProgress)}: {playerCorrectCount}/{TARGET_CORRECT}
        </span>
        {freeMove ? (
          <span className="text-gold-600">{t(uiStrings.wordChainAiStuck)}</span>
        ) : (
          <span>
            {t(uiStrings.wordChainNeedsSyllable)}{' '}
            <span className="rounded-full bg-gold-400/20 px-2 py-0.5 font-display text-gold-700">
              {requiredStartSyllable}
            </span>
          </span>
        )}
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-900/10">
        <div
          className="h-full bg-gold-600 transition-[width] duration-300"
          style={{ width: `${(playerCorrectCount / TARGET_CORRECT) * 100}%` }}
        />
      </div>

      {!aiThinking ? (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-900/10">
          <div
            className={`h-full transition-[width] ${timerProgress < 0.25 ? 'bg-red-600' : 'bg-gold-600'}`}
            style={{ width: `${timerProgress * 100}%` }}
          />
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={t(uiStrings.wordChainInputPlaceholder)}
          disabled={aiThinking}
          className="flex-1 rounded-lg border border-ink-900/20 bg-parchment-100 px-4 py-2.5 font-body text-ink-900 placeholder:text-ink-700/50 focus:border-gold-600 focus:outline-none disabled:opacity-60"
        />
        <Button type="submit" disabled={aiThinking || input.trim().length === 0}>
          {t(uiStrings.wordChainSubmit)}
        </Button>
      </form>

      {error ? <p className="text-sm text-red-700">{t(uiStrings[ERROR_KEYS[error]])}</p> : null}
    </div>
  )
}
