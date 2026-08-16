import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bot, Crown, Flame, Send, Sparkles, User } from 'lucide-react'
import { useTranslation } from '../../../hooks/useGame.js'
import { uiStrings } from '../../../data/uiStrings.js'
import { getSyllables, validateNextWord, pickAiWord, hasAnyCandidate, pickRandomStartWord } from '../../../utils/wordChainEngine.js'

const TARGET_CORRECT = 10
const AI_THINK_DELAY_MS = 650
const VICTORY_HOLD_MS = 1000
// Only the tail of the chain is ever shown — a duel log that scrolled back
// to the first word would just get taller and taller over 10 rounds. The
// full chain still lives in state (needed for the used-words check), it
// just isn't all rendered.
const VISIBLE_HISTORY = 5
const STREAK_FLAME_THRESHOLD = 3
// A small, deliberately playful palette layered on top of the app's usual
// gold — only used here, for the confetti burst and the pip trail, to give
// this one duel screen a livelier, more "arcade" feel than the rest of the
// game's parchment-and-gold look.
const CONFETTI_COLORS = ['#e8c368', '#2fb0ab', '#e8956b', '#c88fd8']

const ERROR_KEYS = {
  'needs-two-syllables': 'wordChainNeedsTwoSyllables',
  'wrong-start': 'wordChainWrongStart',
  used: 'wordChainUsed',
  unknown: 'wordChainUnknown',
}

function ChatBubble({ entry }) {
  const isPlayer = entry.by === 'player'
  const isStart = entry.by === 'start'

  if (isStart) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-1.5 self-center rounded-full border border-parchment-100/15 bg-parchment-100/5 px-3.5 py-1.5 text-sm text-parchment-200/70"
      >
        <Sparkles size={13} className="text-gold-300" />
        {entry.word}
      </motion.div>
    )
  }

  const Icon = isPlayer ? User : Bot

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 26 }}
      className={`flex items-end gap-2.5 ${isPlayer ? 'flex-row-reverse self-end' : 'self-start'}`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          isPlayer ? 'bg-gold-400 text-ink-900' : 'bg-ocean-600/70 text-parchment-100 ring-1 ring-parchment-100/15'
        }`}
      >
        <Icon size={16} />
      </span>
      <span
        className={`rounded-2xl px-4 py-2.5 font-body text-base ${
          isPlayer
            ? 'rounded-br-sm bg-gradient-to-br from-gold-400 to-gold-600 text-ink-900 shadow-[0_0_16px_-3px_rgba(232,195,104,0.7)]'
            : 'rounded-bl-sm bg-ocean-700/70 text-parchment-100 ring-1 ring-parchment-100/10'
        }`}
      >
        {entry.word}
      </span>
    </motion.div>
  )
}

function ConfettiBurst() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, index) => ({
        angle: (index / 12) * Math.PI * 2 + Math.random() * 0.35,
        distance: 46 + Math.random() * 34,
        color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
      })),
    [],
  )

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {pieces.map((piece, index) => (
        <motion.span
          key={index}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: Math.cos(piece.angle) * piece.distance, y: Math.sin(piece.angle) * piece.distance, opacity: 0, scale: 0.4 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="absolute h-2 w-2 rounded-full"
          style={{ backgroundColor: piece.color }}
        />
      ))}
    </div>
  )
}

export function WordChainLesson({ puzzle, onCorrect }) {
  const { t } = useTranslation()
  const [chain, setChain] = useState(() => [{ word: pickRandomStartWord(), by: 'start' }])
  const [input, setInput] = useState('')
  const [error, setError] = useState(null)
  const [aiThinking, setAiThinking] = useState(false)
  const [freeMove, setFreeMove] = useState(false)
  const [victory, setVictory] = useState(null) // null | 'target' | 'ai-stuck'
  const [burstKey, setBurstKey] = useState(0)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain.length, aiThinking, timeLimitMs, victory])

  // Proactively detect a dead syllable (no unused dictionary word starts
  // with it) so the player is never left guessing at the impossible —
  // catches it whenever the chain changes, not just after a failed guess.
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [victory])

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
    setBurstKey((key) => key + 1)

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
        // The AI genuinely can't continue the chain — that's a loss for it,
        // so the lesson is won on the spot rather than handing the player a
        // free move and making them grind out the rest of TARGET_CORRECT.
        clearInterval(intervalRef.current)
        setVictory('ai-stuck')
      }
    }, AI_THINK_DELAY_MS)
  }

  const timerProgress = Math.max(0, timeLeft / timeLimitMs)
  const timerLow = timerProgress < 0.25
  const visibleChain = chain.slice(-VISIBLE_HISTORY)
  const streak = playerCorrectCount

  return (
    <div className="space-y-4">
      {/* animated rainbow frame around the duel arena — the one place in
          the game that gets to be loud/colorful on purpose */}
      <div className="relative overflow-hidden rounded-[28px] p-[2px]">
        <div
          className="absolute inset-0 animate-spin-slow opacity-80"
          style={{
            background: 'conic-gradient(from 0deg, #e8c368, #2fb0ab, #e8956b, #c88fd8, #e8c368)',
          }}
        />
        <div className="relative overflow-hidden rounded-[26px] border border-white/5 bg-gradient-to-b from-ocean-900 to-ocean-950 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_50px_-24px_rgba(0,0,0,0.7)] sm:p-6">
          <div className="pointer-events-none absolute -top-16 left-1/4 h-40 w-40 -translate-x-1/2 rounded-full bg-gold-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -top-10 right-0 h-36 w-36 rounded-full bg-teal-400/15 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/2 h-32 w-64 -translate-x-1/2 rounded-full bg-[#e8956b]/10 blur-3xl" />

          {/* VS header */}
          <div className="relative mb-4 flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-400/15 text-gold-300 ring-1 ring-gold-400/40">
              <User size={17} />
            </span>
            <div className="flex flex-col items-center gap-1">
              <span className="font-display text-xs tracking-[0.35em] text-gold-400/70">VS</span>
              <AnimatePresence>
                {streak >= STREAK_FLAME_THRESHOLD ? (
                  <motion.span
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-0.5 text-xs font-medium text-gold-300"
                  >
                    <Flame size={11} />
                    {streak}
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ocean-600/50 text-parchment-100 ring-1 ring-parchment-100/15">
              <Bot size={17} />
            </span>
          </div>

          {/* chain log */}
          <div className="relative flex min-h-[9rem] flex-col gap-2.5 sm:min-h-[10rem]">
            <AnimatePresence initial={false}>
              {visibleChain.map((entry) => (
                <ChatBubble key={`${chain.length - visibleChain.length}-${entry.word}`} entry={entry} />
              ))}
            </AnimatePresence>
            {aiThinking ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="self-start pl-11 text-xs italic text-parchment-200/50"
              >
                {t(uiStrings.wordChainAiThinking)}
              </motion.p>
            ) : null}
          </div>

          {/* required syllable / dead-end readout */}
          <div className="relative mt-4 flex flex-col items-center gap-2">
            <AnimatePresence>{burstKey > 0 ? <ConfettiBurst key={burstKey} /> : null}</AnimatePresence>
            {freeMove ? (
              <motion.span
                key="free"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-full border border-teal-400/40 bg-teal-400/10 px-5 py-2 text-center text-sm text-teal-300"
              >
                {t(uiStrings.wordChainAiStuck)}
              </motion.span>
            ) : (
              <>
                <span className="text-[10px] tracking-[0.2em] text-parchment-200/45 uppercase">
                  {t(uiStrings.wordChainNeedsSyllable)}
                </span>
                <motion.span
                  key={requiredStartSyllable}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                  className="rounded-full border border-gold-400/50 bg-gold-400/10 px-6 py-2 font-display text-xl tracking-wide text-gold-300 shadow-[0_0_26px_-6px_rgba(232,195,104,0.65)]"
                >
                  {requiredStartSyllable}
                </motion.span>
              </>
            )}
          </div>

          {/* victory flash */}
          <AnimatePresence>
            {victory ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-ocean-950/90 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 16 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold-400 bg-gold-400/15 text-gold-300 shadow-[0_0_34px_-4px_rgba(232,195,104,0.85)]"
                >
                  <Crown size={30} />
                </motion.div>
                <p className="font-display text-base tracking-wide text-parchment-100">
                  {victory === 'ai-stuck' ? t(uiStrings.wordChainAiDefeated) : t(uiStrings.wordChainTargetReached)}
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* progress pips */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-ink-700">
          {t(uiStrings.wordChainProgress)}: {playerCorrectCount}/{TARGET_CORRECT}
        </span>
        <div className="flex gap-1.5">
          {Array.from({ length: TARGET_CORRECT }).map((_, index) => {
            const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length]
            const lit = index < playerCorrectCount
            return (
              <motion.span
                key={index}
                animate={index === playerCorrectCount - 1 ? { scale: [0.5, 1.3, 1] } : { scale: 1 }}
                transition={{ duration: 0.32 }}
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: lit ? color : 'rgba(42,30,16,0.12)',
                  boxShadow: lit ? `0 0 8px 0 ${color}99` : 'none',
                }}
              />
            )
          })}
        </div>
      </div>

      {!aiThinking && !victory ? (
        <div className="h-2 w-full overflow-hidden rounded-full bg-ink-900/10">
          <motion.div
            className={`h-full rounded-full ${timerLow ? 'bg-red-600' : 'bg-gradient-to-r from-gold-600 via-gold-400 to-teal-400'}`}
            style={{ width: `${timerProgress * 100}%` }}
            animate={timerLow ? { opacity: [1, 0.45, 1] } : { opacity: 1 }}
            transition={{ duration: 0.55, repeat: timerLow ? Infinity : 0 }}
          />
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="flex gap-2.5">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={t(uiStrings.wordChainInputPlaceholder)}
          disabled={aiThinking || Boolean(victory)}
          className="flex-1 rounded-xl border border-ink-900/20 bg-parchment-100 px-5 py-3 font-body text-base text-ink-900 placeholder:text-ink-700/50 focus:border-gold-600 focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={aiThinking || Boolean(victory) || input.trim().length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-gold-600/60 bg-gradient-to-b from-gold-400 to-gold-600 px-6 py-3 font-display text-sm tracking-wide text-ink-900 shadow-[0_4px_16px_-4px_rgba(211,162,74,0.65)] transition-transform disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none hover:enabled:scale-[1.03] active:enabled:scale-[0.97]"
        >
          {t(uiStrings.wordChainSubmit)}
          <Send size={15} />
        </button>
      </form>

      {error ? (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-700">
          {t(uiStrings[ERROR_KEYS[error]])}
        </motion.p>
      ) : null}
    </div>
  )
}
