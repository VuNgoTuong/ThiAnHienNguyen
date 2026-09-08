import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Bot, Crown, Flame, Send, Sparkles, User, Compass, RefreshCw } from 'lucide-react'
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
// single rose arc), just swapping to red once time is running low. A soft
// glow disc sits behind it so it reads as a little jeweled instrument
// rather than a flat progress bar.
function RadialTimerRing({ progress, seconds, timerLow }) {
  const radius = 24
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - progress * circumference

  return (
    <div className="relative flex items-center justify-center">
      <div
        className={`absolute inset-0 rounded-full blur-md transition-colors duration-300 ${timerLow ? 'bg-red-400/25' : 'bg-rose-300/35'}`}
      />
      <svg className="relative h-14 w-14 -rotate-90 transform">
        <circle cx="28" cy="28" r={radius} stroke="currentColor" strokeWidth="3" className="text-rose-900/10" fill="transparent" />
        <motion.circle
          cx="28"
          cy="28"
          r={radius}
          stroke="currentColor"
          strokeWidth="3.5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`transition-colors duration-200 ${timerLow ? 'text-red-500' : 'text-rose-500'}`}
          fill="transparent"
        />
      </svg>
      <div className="absolute flex items-center justify-center">
        <span className={`font-display text-xs font-bold ${timerLow ? 'text-red-600' : 'text-rose-700'}`}>{seconds}s</span>
      </div>
    </div>
  )
}

function ChatBubble({ entry }) {
  const isPlayer = entry.by === 'player'
  const isStart = entry.by === 'start'

  if (isStart) {
    return (
      <motion.div layout initial={{ opacity: 0, scale: 0.94, y: -6 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative self-center">
        {/* Glow lives on its own layer behind the text, not as a box-shadow
            on the text's own element — a large blurred box-shadow sharing a
            paint layer with text tends to soften the text itself too
            (visible as slightly smeared glyphs, worse on scaled/transformed
            elements like this one). */}
        <div className="pointer-events-none absolute inset-0 rounded-full bg-gold-400/25 blur-lg" />
        <div className="relative flex items-center gap-2 rounded-full border border-gold-500/50 bg-gradient-to-r from-gold-200/60 via-gold-100/50 to-gold-200/60 px-5 py-2 text-sm font-display font-semibold text-gold-700 backdrop-blur-md">
          <Compass size={15} className="text-gold-600" />
          <span>Từ mới: <strong className="text-rose-900">{entry.word}</strong></span>
        </div>
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
          isPlayer
            ? 'bg-gradient-to-br from-rose-300 to-pink-400 text-rose-950 ring-rose-300/70 shadow-[0_2px_10px_-2px_rgba(244,114,182,0.6)]'
            : 'bg-violet-100 text-violet-500 ring-violet-300/70'
        }`}
      >
        <Icon size={16} />
      </span>

      <div
        className={`rounded-2xl px-5 py-3 font-display text-base font-semibold sm:text-lg ${
          isPlayer
            ? 'rounded-br-sm border border-rose-300/70 bg-gradient-to-br from-rose-300 to-pink-400 text-rose-950 shadow-[0_4px_16px_-4px_rgba(244,114,182,0.45)]'
            : 'rounded-bl-sm border border-violet-200 bg-violet-50/90 text-violet-950 backdrop-blur-md'
        }`}
      >
        {syllables.length === 2 ? (
          <span className="flex items-center gap-1.5">
            <span>{syllables[0]}</span>
            <span
              className={`rounded-md px-2 py-0.5 text-sm font-bold ${
                isPlayer ? 'bg-white/70 text-rose-950' : 'bg-violet-200/80 text-violet-950'
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

  const timeLimitMs = puzzle?.data?.timeLimitMs ?? 30000
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

  useEffect(() => {
    if (!error) return
    const timeout = setTimeout(() => setError(null), 2600)
    return () => clearTimeout(timeout)
  }, [error])

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
      setAiThinking(false)
      const aiWord = pickAiWord({ requiredStartSyllable: nextRequired, usedWords: nextUsed })
      if (aiWord) {
        setChain((current) => [...current, { word: aiWord, by: 'ai' }])
        return
      }

      // Genuinely cornered the AI on this word — that's a real win, not
      // something it should get to dodge by throwing in an unrelated fresh
      // word. (It used to do exactly that; players correctly called it out
      // as an unfair way to avoid ever losing.)
      clearInterval(intervalRef.current)
      setVictory('ai-stuck')
    }, AI_THINK_DELAY_MS)
  }

  const timerProgress = Math.max(0, timeLeft / timeLimitMs)
  const secondsLeft = Math.ceil(timeLeft / 1000)
  const timerLow = timerProgress < 0.25
  const visibleChain = chain.slice(-VISIBLE_HISTORY)
  const streak = playerCorrectCount

  return (
    <div className="relative w-full space-y-5">
      {/* This card floats over the plain (bright) Ocean backdrop rather than
          a custom dark 3D scene like Island 2-4 — that backdrop is shared
          with several other screens (name entry, verify, greeting, ending)
          so it can't be recolored just for this lesson. A soft breathing
          glow behind the card (instead) gives it the same "the card is the
          stage" weight Island 2's full-bleed scene gets for free. */}
      <div className="pointer-events-none absolute inset-x-0 -top-8 -bottom-8 -z-10 flex items-center justify-center">
        <div className="animate-pulse-glow h-full w-[94%] rounded-[3rem] bg-gradient-to-b from-rose-300/30 via-pink-200/15 to-transparent blur-3xl" />
        <div className="absolute inset-x-8 top-1/3 h-2/3 rounded-[3rem] bg-violet-300/20 blur-3xl" />
      </div>

      {/* Eyebrow + prompt — same "small tracked-out label above a serif
          italic line" convention Island 2's chapter captions use, now
          rendered here instead of on PuzzleEngine's light parchment sheet
          (see PuzzleEngine.jsx's word-chain bypass). Drop-shadowed since it
          sits directly over the bright ocean, not a cream panel. */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-1 flex flex-col items-center gap-1.5 text-center"
      >
        <span className="font-display text-[11px] font-semibold tracking-[0.3em] text-white uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
          Nối Từ
        </span>
        <p className="font-serif text-lg text-white italic drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] sm:text-xl">
          {t(puzzle.prompt)}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-[2rem] border-2 border-rose-300/70 bg-gradient-to-b from-white via-rose-50 to-pink-100 p-6 shadow-parchment outline outline-1 outline-rose-300/30 -outline-offset-8 backdrop-blur-xl sm:p-8"
      >
        {/* A thin, continuously sweeping highlight along the top edge — the
            same shimmer keyframe Button's primary variant uses on hover,
            just always-on and confined to a hairline so it reads as light
            glinting off a gold trim rather than a loading indicator. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] overflow-hidden">
          <div className="animate-shimmer h-full w-full bg-[length:200%_100%] bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
        </div>

        {/* Decorative corner accent markers — same motif as ParchmentPanel,
            gold trim on the blush card like a keepsake jewel box. */}
        <span className="pointer-events-none absolute top-3 left-3 h-2 w-2 rounded-full border border-gold-500/60" />
        <span className="pointer-events-none absolute top-3 right-3 h-2 w-2 rounded-full border border-gold-500/60" />
        <span className="pointer-events-none absolute bottom-3 left-3 h-2 w-2 rounded-full border border-gold-500/60" />
        <span className="pointer-events-none absolute bottom-3 right-3 h-2 w-2 rounded-full border border-gold-500/60" />

        <div className="pointer-events-none absolute -top-16 right-0 h-56 w-56 rounded-full bg-rose-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-violet-300/15 blur-3xl" />

        {/* Header: streak + progress on the left, timer ring on the right */}
        <div className="relative mb-5 flex items-center justify-between gap-3 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-500 ring-1 ring-rose-300/60 shadow-[0_0_14px_-4px_rgba(244,114,182,0.5)]">
              <User size={16} />
            </span>
            <p className="font-display text-sm font-semibold text-ink-900">
              <strong className="text-rose-600">{playerCorrectCount}</strong>/{TARGET_CORRECT} {t(uiStrings.wordChainProgress)}
            </p>
            <AnimatePresence>
              {streak >= STREAK_FLAME_THRESHOLD ? (
                <motion.span
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1 rounded-full border border-orange-300/60 bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-600"
                >
                  <Flame size={12} className="text-orange-500" />
                  <span>{streak}</span>
                </motion.span>
              ) : null}
            </AnimatePresence>
          </div>

          {!aiThinking && !victory ? (
            <RadialTimerRing progress={timerProgress} seconds={secondsLeft} timerLow={timerLow} />
          ) : null}
        </div>
        <div className="relative -mt-5 mb-5 h-px w-full bg-gradient-to-r from-transparent via-rose-300/50 to-transparent" />

        {/* Chain History Log */}
        <div className="relative flex min-h-[15rem] flex-col gap-3 sm:min-h-[17rem]">
          <AnimatePresence initial={false}>
            {visibleChain.map((entry) => (
              <ChatBubble key={`${chain.length - visibleChain.length}-${entry.word}`} entry={entry} />
            ))}
          </AnimatePresence>
          {aiThinking ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5 self-start"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-500 ring-1 ring-violet-300/70">
                <Bot size={16} />
              </span>
              <span className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-violet-200 bg-violet-50/90 px-4 py-3 backdrop-blur-md">
                {[0, 1, 2].map((dot) => (
                  <motion.span
                    key={dot}
                    className="h-1.5 w-1.5 rounded-full bg-violet-400/90"
                    animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.15 }}
                  />
                ))}
              </span>
            </motion.div>
          ) : null}
        </div>

        {/* Syllable Target Display & Swap Word Pill */}
        <div className="relative mt-5 flex flex-col items-center gap-3 pt-5">
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-rose-300/50 to-transparent" />
          {freeMove ? (
            <motion.div key="free" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative">
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-violet-300/25 blur-lg" />
              <div className="relative rounded-2xl border border-violet-300/60 bg-violet-100/80 px-6 py-2.5 text-center font-display text-sm font-semibold text-violet-700">
                Anh hết từ nối — em chọn từ tự do nhé!
              </div>
            </motion.div>
          ) : (
            <>
              <span className="font-display text-xs font-semibold tracking-[0.25em] text-rose-900/50 uppercase">
                {t(uiStrings.wordChainNeedsSyllable)}
              </span>
              <AnimatePresence mode="wait">
                <motion.div
                  key={requiredStartSyllable}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                  className="relative"
                >
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-rose-300/40 blur-lg" />
                  <div className="relative flex items-center gap-2.5 rounded-2xl border border-rose-400/70 bg-gradient-to-b from-rose-100 to-pink-50 px-9 py-3">
                    <span className="pointer-events-none absolute inset-0 rounded-2xl border border-gold-400/40" />
                    <Sparkles size={16} className="text-gold-500" />
                    <span className="font-display text-2xl font-bold tracking-wide text-rose-700 sm:text-3xl">
                      {requiredStartSyllable}
                    </span>
                  </div>
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
              className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-white/95 via-rose-50/95 to-pink-100/95 backdrop-blur-xl"
            >
              <span className="pointer-events-none absolute top-4 left-4 h-2 w-2 rounded-full border border-gold-500/60" />
              <span className="pointer-events-none absolute top-4 right-4 h-2 w-2 rounded-full border border-gold-500/60" />
              <span className="pointer-events-none absolute bottom-4 left-4 h-2 w-2 rounded-full border border-gold-500/60" />
              <span className="pointer-events-none absolute bottom-4 right-4 h-2 w-2 rounded-full border border-gold-500/60" />
              <div className="pointer-events-none absolute h-40 w-40 rounded-full bg-rose-300/30 blur-3xl" />

              <motion.div
                initial={{ scale: 0.4, opacity: 0, rotate: -20 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                className="relative flex h-20 w-20 items-center justify-center"
              >
                <div className="pointer-events-none absolute inset-0 rounded-full bg-gold-400/30 blur-xl" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold-500/70 bg-gradient-to-b from-gold-300/40 to-gold-200/10 text-gold-600">
                  <Crown size={34} />
                </div>
              </motion.div>
              <p className="relative px-6 text-center font-display text-xl font-bold text-rose-950 sm:text-2xl">
                {victory === 'ai-stuck' ? 'Oops! Anh bó tay, em win rồi... =))' : 'Xuất sắc! Đã hoàn thành 10 từ nối liên tiếp!'}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: TARGET_CORRECT }).map((_, index) => {
          const lit = index < playerCorrectCount
          return (
            <motion.span
              key={index}
              animate={index === playerCorrectCount - 1 ? { scale: [0.6, 1.3, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`h-1.5 w-6 rounded-full transition-colors ${
                lit ? 'bg-gradient-to-r from-gold-400 to-gold-500 shadow-[0_0_8px_-1px_rgba(232,195,104,0.7)]' : 'bg-white/40'
              }`}
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
          className="flex-1 rounded-2xl border border-rose-300/50 bg-white/80 px-5 py-3.5 font-display text-base text-ink-900 placeholder:text-rose-400/60 backdrop-blur-md transition-colors focus:border-rose-400/70 focus:outline-none focus:ring-2 focus:ring-rose-300/40 disabled:opacity-60"
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

      {/* Error toast — same dark-glass card as AchievementToast, auto-
          dismissing rather than sitting parked in the layout below the
          input. Kept dark regardless of the card's light theme — a high-
          contrast alert reads as "pay attention" in any color scheme.
          Rendered through a portal straight into <body>: this component
          sits inside IslandPage's animated `motion.div` (fadeStep), and
          framer-motion always sets an explicit `transform` on that wrapper
          (even for a no-op like y: 0) — which makes it a `position: fixed`
          containing block *and* a new stacking context. Without the portal
          the toast would be trapped inside that wrapper's box instead of
          the real viewport, landing underneath the HUD instead of above it
          regardless of z-index. Positioned below `top-20` to clear the
          HUD's own top-0 row entirely. */}
      {createPortal(
        <div className="pointer-events-none fixed inset-x-0 top-20 z-[60] flex justify-center px-4">
          <AnimatePresence>
            {error ? (
              <motion.div
                key={error}
                initial={{ opacity: 0, y: -16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.95 }}
                className="shadow-parchment flex items-center gap-3 rounded-xl border border-red-400/40 bg-ocean-900/95 px-4 py-3"
              >
                <AlertCircle size={20} className="shrink-0 text-red-400" />
                <p className="font-display text-sm text-parchment-100">{t(uiStrings[ERROR_KEYS[error]])}</p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>,
        document.body,
      )}
    </div>
  )
}
