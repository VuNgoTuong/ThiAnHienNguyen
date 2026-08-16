import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bot, Crown, Flame, Send, Sparkles, User, Compass, RefreshCw, Zap } from 'lucide-react'
import { useTranslation } from '../../../hooks/useGame.js'
import { uiStrings } from '../../../data/uiStrings.js'
import { getSyllables, validateNextWord, pickAiWord, hasAnyCandidate, pickRandomStartWord } from '../../../utils/wordChainEngine.js'

const TARGET_CORRECT = 10
const AI_THINK_DELAY_MS = 650
const VICTORY_HOLD_MS = 1000
const VISIBLE_HISTORY = 5
const STREAK_FLAME_THRESHOLD = 3
const MAX_SWAPS = 3

// Vibrant arcade gem colors for progress tracking
const GEM_COLORS = [
  '#ffd700', // Gold
  '#00f2fe', // Cyan
  '#ff0844', // Rose Red
  '#00e676', // Emerald
  '#ff9100', // Amber
  '#a855f7', // Purple
  '#38bdf8', // Sky Blue
  '#f43f5e', // Coral
  '#10b981', // Mint
  '#eab308', // Sun Gold
]

const ERROR_KEYS = {
  'needs-two-syllables': 'wordChainNeedsTwoSyllables',
  'wrong-start': 'wordChainWrongStart',
  used: 'wordChainUsed',
  unknown: 'wordChainUnknown',
}

// Animated Radial Compass Ring Timer
function RadialTimerRing({ progress, seconds, timerLow }) {
  const radius = 22
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - progress * circumference

  return (
    <div className="relative flex items-center justify-center">
      <svg className="h-14 w-14 -rotate-90 transform drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]">
        {/* Track Ring */}
        <circle
          cx="28"
          cy="28"
          r={radius}
          stroke="currentColor"
          strokeWidth="3.5"
          className="text-amber-400/20"
          fill="transparent"
        />
        {/* Dynamic Sweeping SVG Arc */}
        <motion.circle
          cx="28"
          cy="28"
          r={radius}
          stroke="currentColor"
          strokeWidth="3.5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`transition-all duration-100 ${timerLow ? 'text-red-500' : 'text-amber-400'}`}
          fill="transparent"
        />
      </svg>
      {/* Center Seconds */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`font-display text-xs font-black tracking-tighter ${timerLow ? 'text-red-400 animate-pulse' : 'text-amber-300'}`}>
          {seconds}s
        </span>
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
        initial={{ opacity: 0, scale: 0.9, y: -6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="flex items-center gap-2.5 self-center rounded-full border border-amber-400/60 bg-gradient-to-r from-purple-500/20 via-amber-400/25 to-purple-500/20 px-6 py-2.5 text-sm font-display font-bold text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.35)] backdrop-blur-md"
      >
        <Compass size={18} className="text-amber-400 animate-spin-slow" />
        <span>Từ Mới: <strong className="text-white underline decoration-amber-400 underline-offset-4 font-black">{entry.word}</strong></span>
      </motion.div>
    )
  }

  const Icon = isPlayer ? User : Bot
  const syllables = getSyllables(entry.word)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14, scale: 0.9, rotate: isPlayer ? 1 : -1 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 450, damping: 24 }}
      className={`flex items-end gap-3.5 ${isPlayer ? 'flex-row-reverse self-end' : 'self-start'}`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-lg ${
          isPlayer
            ? 'bg-gradient-to-tr from-amber-400 via-yellow-400 to-orange-500 text-ink-950 ring-2 ring-yellow-300 shadow-[0_0_20px_rgba(251,191,36,0.6)]'
            : 'bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-500 text-ink-950 ring-2 ring-cyan-300 shadow-[0_0_20px_rgba(45,212,191,0.6)]'
        }`}
      >
        <Icon size={20} />
      </span>

      <div
        className={`rounded-2xl px-6 py-3.5 font-display text-lg font-bold sm:text-xl shadow-2xl backdrop-blur-xl ${
          isPlayer
            ? 'rounded-br-none border border-amber-300/50 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-ink-950 shadow-[0_6px_25px_rgba(245,158,11,0.4)]'
            : 'rounded-bl-none border border-cyan-400/40 bg-gradient-to-r from-teal-900/90 via-ocean-800/90 to-cyan-900/90 text-parchment-100 shadow-[0_6px_25px_rgba(45,212,191,0.25)]'
        }`}
      >
        {syllables.length === 2 ? (
          <span className="flex items-center gap-1.5">
            <span>{syllables[0]}</span>
            <span
              className={`rounded-md px-2.5 py-0.5 text-base ${
                isPlayer
                  ? 'bg-ink-950/20 text-ink-950 font-black ring-1 ring-ink-950/30'
                  : 'bg-cyan-400/25 text-cyan-200 font-bold ring-1 ring-cyan-400/50 shadow-[0_0_10px_rgba(45,212,191,0.4)]'
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
    <div className="w-full space-y-6">
      {/* Vibrant Colorful Glassmorphic Arena Card */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-400/40 bg-gradient-to-b from-ocean-900/95 via-ocean-950/90 to-ocean-900/95 p-6 shadow-[0_25px_65px_rgba(0,0,0,0.85)] backdrop-blur-2xl sm:p-8">
        {/* Ambient Color Glow Spots */}
        <div className="pointer-events-none absolute -top-20 left-10 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -top-16 right-10 h-56 w-56 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-purple-500/15 blur-3xl" />

        {/* Header: Player VS Companion Status Bar + Radial Compass Timer Ring */}
        <div className="relative mb-6 flex items-center justify-between border-b border-amber-400/20 pb-4">
          {/* Player Avatar */}
          <div className="flex items-center gap-3.5">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 via-yellow-400 to-orange-500 text-ink-950 shadow-[0_0_20px_rgba(251,191,36,0.6)] ring-2 ring-yellow-300">
              <User size={22} />
            </span>
            <div>
              <span className="font-display text-base font-bold tracking-wider text-parchment-100 uppercase">
                Em
              </span>
              <p className="flex items-center gap-1 text-xs font-bold text-amber-400">
                <Zap size={12} className="text-amber-400 fill-amber-400 animate-pulse" />
                <span>{playerCorrectCount}/{TARGET_CORRECT} Từ Đúng</span>
              </p>
            </div>
          </div>

          {/* Center VS & Radial Compass Energy Timer Ring */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-0.5">
              <span className="font-display text-sm font-black tracking-[0.4em] text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]">
                VS
              </span>
              <AnimatePresence>
                {streak >= STREAK_FLAME_THRESHOLD ? (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1 rounded-full border border-orange-400/60 bg-gradient-to-r from-red-500/30 via-orange-500/30 to-amber-500/30 px-3 py-0.5 text-xs font-bold text-amber-300 shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                  >
                    <Flame size={13} className="text-orange-400 fill-orange-400 animate-bounce" />
                    <span>{streak} Streak</span>
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </div>

            {/* Radial Compass Energy Ring Timer */}
            {!aiThinking && !victory ? (
              <RadialTimerRing progress={timerProgress} seconds={secondsLeft} timerLow={timerLow} />
            ) : null}
          </div>

          {/* Companion Avatar */}
          <div className="flex items-center gap-3.5">
            <div className="text-right">
              <span className="font-display text-base font-bold tracking-wider text-parchment-100 uppercase">
                Anh
              </span>
              <p className="text-xs font-bold text-cyan-300">Đồng Hành</p>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-500 text-ink-950 shadow-[0_0_20px_rgba(45,212,191,0.6)] ring-2 ring-cyan-300">
              <Bot size={22} />
            </span>
          </div>
        </div>

        {/* Chain History Log */}
        <div className="relative flex min-h-[15rem] flex-col gap-3.5 sm:min-h-[17rem]">
          <AnimatePresence initial={false}>
            {visibleChain.map((entry) => (
              <ChatBubble key={`${chain.length - visibleChain.length}-${entry.word}`} entry={entry} />
            ))}
          </AnimatePresence>
          {aiThinking ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="self-start pl-16 text-xs font-semibold italic text-cyan-300/80 animate-pulse"
            >
              Anh đang nghĩ từ tiếp theo...
            </motion.p>
          ) : null}
        </div>

        {/* Syllable Target Display & Swap Word Pill */}
        <div className="relative mt-6 flex flex-col items-center gap-3 border-t border-amber-400/20 pt-5">
          {freeMove ? (
            <motion.span
              key="free"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-full border border-cyan-400/60 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 px-6 py-2.5 text-center font-display text-base font-bold text-cyan-300 shadow-[0_0_25px_rgba(45,212,191,0.4)]"
            >
              Anh Hết Từ Nối — Em Chọn Từ Tự Do Nhé!
            </motion.span>
          ) : (
            <>
              <span className="font-display text-xs font-bold tracking-[0.3em] text-parchment-200/60 uppercase">
                {t(uiStrings.wordChainNeedsSyllable)}
              </span>
              <AnimatePresence mode="wait">
                <motion.div
                  key={requiredStartSyllable}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                  className="relative flex items-center gap-3 rounded-2xl border-2 border-amber-400/80 bg-gradient-to-r from-amber-500/25 via-yellow-400/35 to-amber-500/25 px-10 py-3 shadow-[0_0_35px_rgba(245,158,11,0.6)] backdrop-blur-md"
                >
                  <Sparkles size={18} className="text-amber-400 animate-pulse" />
                  <span className="font-display text-3xl font-black tracking-widest text-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.9)] sm:text-4xl">
                    {requiredStartSyllable}
                  </span>
                  <Sparkles size={18} className="text-amber-400 animate-pulse" />
                </motion.div>
              </AnimatePresence>

              {/* Xin Đổi Từ Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleSwapWord}
                disabled={swapsLeft <= 0 || aiThinking || Boolean(victory)}
                className="mt-1 inline-flex items-center gap-2 rounded-full border border-cyan-400/50 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 px-5 py-2 font-display text-xs font-bold text-cyan-300 shadow-[0_0_15px_rgba(45,212,191,0.3)] transition-all hover:border-cyan-300 hover:bg-cyan-400/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                <RefreshCw size={14} className={swapsLeft > 0 ? 'text-cyan-300 animate-spin-slow' : ''} />
                <span>Xin Đổi Từ ({swapsLeft}/{MAX_SWAPS})</span>
              </motion.button>
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
              className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-ocean-950/95 backdrop-blur-xl"
            >
              <motion.div
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-amber-400 bg-amber-400/25 text-amber-300 shadow-[0_0_50px_rgba(251,191,36,0.9)]"
              >
                <Crown size={40} className="animate-bounce" />
              </motion.div>
              <p className="px-6 text-center font-display text-2xl font-black text-parchment-100 sm:text-3xl">
                {victory === 'ai-stuck' ? 'Anh Không Thể Nối Tiếp — Em Giỏi Quá!' : 'Xuất Sắc! Đã Hoàn Thành 10 Từ Nối Liên Tiếp!'}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Target Progress Vivid Multi-Color Gem Pips */}
      <div className="flex items-center justify-between gap-4 px-2">
        <span className="font-display text-sm font-bold tracking-wider text-parchment-100/90">
          Tiến Độ Nối Chữ: <strong className="text-amber-400">{playerCorrectCount}</strong>/{TARGET_CORRECT}
        </span>
        <div className="flex gap-2">
          {Array.from({ length: TARGET_CORRECT }).map((_, index) => {
            const color = GEM_COLORS[index % GEM_COLORS.length]
            const lit = index < playerCorrectCount
            return (
              <motion.span
                key={index}
                animate={index === playerCorrectCount - 1 ? { scale: [0.5, 1.4, 1] } : { scale: 1 }}
                transition={{ duration: 0.35 }}
                className="h-3.5 w-3.5 rounded-full border border-white/20"
                style={{
                  backgroundColor: lit ? color : 'rgba(255,255,255,0.12)',
                  boxShadow: lit ? `0 0 14px ${color}` : 'none',
                }}
              />
            )
          })}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={t(uiStrings.wordChainInputPlaceholder)}
          disabled={aiThinking || Boolean(victory)}
          className="flex-1 rounded-2xl border border-amber-400/40 bg-ocean-950/90 px-6 py-4 font-display text-lg text-parchment-100 placeholder:text-parchment-200/40 shadow-2xl focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 disabled:opacity-60"
        />
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          type="submit"
          disabled={aiThinking || Boolean(victory) || input.trim().length === 0}
          className="inline-flex items-center justify-center gap-2.5 rounded-2xl border border-amber-300/60 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 px-9 py-4 font-display text-base font-black text-ink-950 shadow-[0_8px_25px_rgba(245,158,11,0.5)] transition-all disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          <span>Gửi Từ</span>
          <Send size={18} />
        </motion.button>
      </form>

      {error ? (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-center font-display text-sm font-bold text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
          {t(uiStrings[ERROR_KEYS[error]])}
        </motion.p>
      ) : null}
    </div>
  )
}
