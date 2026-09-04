import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bot, Crown, Flame, Send, Sparkles, User, Compass, RefreshCw } from 'lucide-react'
import { useTranslation } from '../../../hooks/useGame.js'
import { uiStrings } from '../../../data/uiStrings.js'
import { Button } from '../../ui/Button.jsx'
import { getSyllables, validateNextWord, pickAiWord, hasAnyCandidate, pickRandomStartWord } from '../../../utils/wordChainEngine.js'

const TARGET_CORRECT = 10
const AI_THINK_DELAY_MS = 650
const VICTORY_HOLD_MS = 1000
const VISIBLE_HISTORY = 5
const STREAK_FLAME_THRESHOLD = 3
const MAX_SWAPS = 3

const ERROR_KEYS = {
  'needs-two-syllables': 'wordChainNeedsTwoSyllables',
  'wrong-start': 'wordChainWrongStart',
  used: 'wordChainUsed',
  unknown: 'wordChainUnknown',
}

// Compass-ring timer — same visual language as ProgressRing elsewhere (a
// single gold arc), just swapping to red once time is running low.
function RadialTimerRing({ progress, seconds, timerLow }) {
  const radius = 22
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - progress * circumference

  return (
    <div className="relative flex items-center justify-center">
      <svg className="h-12 w-12 -rotate-90 transform">
        <circle cx="24" cy="24" r={radius} stroke="currentColor" strokeWidth="3" className="text-gold-400/15" fill="transparent" />
        <motion.circle
          cx="24"
          cy="24"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`transition-colors duration-200 ${timerLow ? 'text-red-400' : 'text-gold-400'}`}
          fill="transparent"
        />
      </svg>
      <div className="absolute flex items-center justify-center">
        <span className={`font-display text-xs font-bold ${timerLow ? 'text-red-400' : 'text-gold-300'}`}>{seconds}s</span>
      </div>
    </div>
  )
}

function ChatBubble({ entry }) {
  const isPlayer = entry.by === 'player'
  const isStart = entry.by === 'start'

  if (isStart) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.94, y: -6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="flex items-center gap-2 self-center rounded-full border border-gold-400/40 bg-gold-400/10 px-5 py-2 text-sm font-display font-semibold text-gold-300 backdrop-blur-md"
      >
        <Compass size={15} className="text-gold-400" />
        <span>Từ mới: <strong className="text-parchment-100">{entry.word}</strong></span>
      </motion.div>
    )
  }

  const Icon = isPlayer ? User : Bot
  const syllables = getSyllables(entry.word)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      className={`flex items-end gap-2.5 ${isPlayer ? 'flex-row-reverse self-end' : 'self-start'}`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1 ${
          isPlayer ? 'bg-gold-400/20 text-gold-300 ring-gold-400/40' : 'bg-teal-500/20 text-teal-300 ring-teal-400/40'
        }`}
      >
        <Icon size={16} />
      </span>

      <div
        className={`rounded-2xl px-5 py-3 font-display text-base font-semibold sm:text-lg ${
          isPlayer
            ? 'rounded-br-sm border border-gold-400/50 bg-gold-400 text-ink-900'
            : 'rounded-bl-sm border border-teal-400/40 bg-white/10 text-parchment-100 backdrop-blur-md'
        }`}
      >
        {syllables.length === 2 ? (
          <span className="flex items-center gap-1.5">
            <span>{syllables[0]}</span>
            <span
              className={`rounded-md px-2 py-0.5 text-sm ${
                isPlayer ? 'bg-ink-900/15 text-ink-900' : 'bg-teal-400/20 text-teal-200'
              }`}
            >
              {syllables[1]}
            </span>
          </span>
        ) : (
          entry.word
        )}
      </div>
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
  const [victory, setVictory] = useState(null)
  const [swapsLeft, setSwapsLeft] = useState(MAX_SWAPS)

  const playerCorrectCount = chain.filter((entry) => entry.by === 'player').length
  const lastWord = chain[chain.length - 1].word
  const requiredStartSyllable = freeMove ? null : getSyllables(lastWord)[1]

  const timeLimitMs = puzzle?.data?.timeLimitMs ?? 20000
  const [timeLeft, setTimeLeft] = useState(timeLimitMs)
  const intervalRef = useRef(null)

  useEffect(() => {
    clearInterval(intervalRef.current)
    if (aiThinking || victory) return

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
  }, [chain.length, aiThinking, timeLimitMs, victory])

  useEffect(() => {
    if (freeMove || aiThinking || victory) return
    const usedWords = new Set(chain.map((entry) => entry.word))
    if (!hasAnyCandidate({ requiredStartSyllable, usedWords })) {
      setFreeMove(true)
    }
  }, [chain, freeMove, aiThinking, victory, requiredStartSyllable])

  useEffect(() => {
    if (!victory) return
    const timeout = setTimeout(onCorrect, VICTORY_HOLD_MS)
    return () => clearTimeout(timeout)
  }, [victory])

  function handleSwapWord() {
    if (aiThinking || victory || swapsLeft <= 0) return
    setSwapsLeft((prev) => prev - 1)
    setError(null)
    setInput('')
    setFreeMove(false)

    let newStart = pickRandomStartWord()
    while (newStart === lastWord) {
      newStart = pickRandomStartWord()
    }
    setChain((prev) => [...prev, { word: newStart, by: 'start' }])
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (aiThinking || victory || input.trim().length === 0) return

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
      setVictory('target')
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
        clearInterval(intervalRef.current)
        setVictory('ai-stuck')
      }
    }, AI_THINK_DELAY_MS)
  }

  const timerProgress = Math.max(0, timeLeft / timeLimitMs)
  const secondsLeft = Math.ceil(timeLeft / 1000)
  const timerLow = timerProgress < 0.25
  const visibleChain = chain.slice(-VISIBLE_HISTORY)
  const streak = playerCorrectCount

  return (
    <div className="w-full space-y-5">
      {/* This card floats over the plain (bright) Ocean backdrop rather than
          a custom dark 3D scene like Island 2-4, so — unlike those — it
          needs a solidly dark backing, not a light 10%-opacity glass tint,
          to stay legible. */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-ocean-950/92 p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:p-8">
        <div className="pointer-events-none absolute -top-16 right-0 h-48 w-48 rounded-full bg-gold-400/10 blur-3xl" />

        {/* Header: streak + progress on the left, timer ring on the right */}
        <div className="relative mb-5 flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-400/20 text-gold-300 ring-1 ring-gold-400/40">
              <User size={16} />
            </span>
            <p className="font-display text-sm font-semibold text-parchment-100">
              <strong className="text-gold-300">{playerCorrectCount}</strong>/{TARGET_CORRECT} {t(uiStrings.wordChainProgress)}
            </p>
            <AnimatePresence>
              {streak >= STREAK_FLAME_THRESHOLD ? (
                <motion.span
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1 rounded-full border border-gold-400/40 bg-gold-400/10 px-2.5 py-0.5 text-xs font-semibold text-gold-300"
                >
                  <Flame size={12} className="text-gold-400" />
                  <span>{streak}</span>
                </motion.span>
              ) : null}
            </AnimatePresence>
          </div>

          {!aiThinking && !victory ? (
            <RadialTimerRing progress={timerProgress} seconds={secondsLeft} timerLow={timerLow} />
          ) : null}
        </div>

        {/* Chain History Log */}
        <div className="relative flex min-h-[15rem] flex-col gap-3 sm:min-h-[17rem]">
          <AnimatePresence initial={false}>
            {visibleChain.map((entry) => (
              <ChatBubble key={`${chain.length - visibleChain.length}-${entry.word}`} entry={entry} />
            ))}
          </AnimatePresence>
          {aiThinking ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="self-start pl-12 text-xs italic text-teal-300/80"
            >
              Anh đang nghĩ từ tiếp theo...
            </motion.p>
          ) : null}
        </div>

        {/* Syllable Target Display & Swap Word Pill */}
        <div className="relative mt-5 flex flex-col items-center gap-3 border-t border-white/10 pt-5">
          {freeMove ? (
            <motion.span
              key="free"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-full border border-teal-400/40 bg-teal-500/10 px-6 py-2.5 text-center font-display text-sm font-semibold text-teal-300"
            >
              Anh hết từ nối — em chọn từ tự do nhé!
            </motion.span>
          ) : (
            <>
              <span className="font-display text-xs font-semibold tracking-[0.25em] text-parchment-200/50 uppercase">
                {t(uiStrings.wordChainNeedsSyllable)}
              </span>
              <AnimatePresence mode="wait">
                <motion.div
                  key={requiredStartSyllable}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                  className="relative flex items-center gap-2.5 rounded-2xl border border-gold-400/50 bg-gold-400/10 px-8 py-2.5"
                >
                  <Sparkles size={16} className="text-gold-400" />
                  <span className="font-display text-2xl font-bold tracking-wide text-gold-300 sm:text-3xl">
                    {requiredStartSyllable}
                  </span>
                </motion.div>
              </AnimatePresence>

              <Button
                variant="ghost"
                icon={RefreshCw}
                onClick={handleSwapWord}
                disabled={swapsLeft <= 0 || aiThinking || Boolean(victory)}
                className="mt-1 !px-4 !py-1.5 !text-xs !normal-case"
              >
                Xin đổi từ ({swapsLeft}/{MAX_SWAPS})
              </Button>
            </>
          )}
        </div>

        {/* Victory Overlay */}
        <AnimatePresence>
          {victory ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-ocean-950/90 backdrop-blur-xl"
            >
              <motion.div
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex h-16 w-16 items-center justify-center rounded-full border border-gold-400/60 bg-gold-400/15 text-gold-300"
              >
                <Crown size={30} />
              </motion.div>
              <p className="px-6 text-center font-display text-xl font-bold text-parchment-100 sm:text-2xl">
                {victory === 'ai-stuck' ? 'Anh không thể nối tiếp — em giỏi quá!' : 'Xuất sắc! Đã hoàn thành 10 từ nối liên tiếp!'}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: TARGET_CORRECT }).map((_, index) => {
          const lit = index < playerCorrectCount
          return (
            <motion.span
              key={index}
              animate={index === playerCorrectCount - 1 ? { scale: [0.6, 1.3, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`h-1.5 w-6 rounded-full transition-colors ${lit ? 'bg-gold-400' : 'bg-white/10'}`}
            />
          )
        })}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={t(uiStrings.wordChainInputPlaceholder)}
          disabled={aiThinking || Boolean(victory)}
          className="flex-1 rounded-2xl border border-white/10 bg-ocean-950/80 px-5 py-3.5 font-display text-base text-parchment-100 placeholder:text-parchment-200/40 backdrop-blur-md transition-colors focus:border-gold-400/60 focus:outline-none focus:ring-2 focus:ring-gold-400/30 disabled:opacity-60"
        />
        <Button
          type="submit"
          icon={Send}
          disabled={aiThinking || Boolean(victory) || input.trim().length === 0}
          className="shrink-0"
        >
          Gửi
        </Button>
      </form>

      {error ? (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-center font-display text-sm font-semibold text-red-400">
          {t(uiStrings[ERROR_KEYS[error]])}
        </motion.p>
      ) : null}
    </div>
  )
}
