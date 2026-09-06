import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, X, Eye, Sparkles } from 'lucide-react'
import { useTranslation } from '../../../hooks/useGame.js'
import { Button } from '../../ui/Button.jsx'

const HINT_STEPS = 3

function PictureFrame({ emoji, effect, wrongCount, solved }) {
  const hintLevel = Math.min(wrongCount, HINT_STEPS)
  const [flashPeek, setFlashPeek] = useState(true)

  useEffect(() => {
    if (effect !== 'flash') return
    const timeout = setTimeout(() => setFlashPeek(false), 1800)
    return () => clearTimeout(timeout)
  }, [effect])

  useEffect(() => {
    if (effect !== 'flash' || wrongCount === 0) return
    setFlashPeek(true)
    const timeout = setTimeout(() => setFlashPeek(false), 600)
    return () => clearTimeout(timeout)
  }, [wrongCount, effect])

  const blurPx = solved ? 0 : [8, 5, 2, 0][hintLevel]
  const silhouetteOpacity = solved ? 0 : [0.92, 0.6, 0.3, 0][hintLevel]
  const zoomScale = solved ? 1 : [2.8, 2.0, 1.4, 1][hintLevel]
  const flashHidden = effect === 'flash' && !solved && !flashPeek

  return (
    <div className="relative mx-auto flex h-44 w-44 items-center justify-center overflow-hidden rounded-3xl border border-gold-400/40 bg-ocean-950 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)]">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,195,104,0.12),transparent_70%)]" />

      {/* Corner accents — same motif as ParchmentPanel */}
      <span className="pointer-events-none absolute top-3 left-3 h-2 w-2 rounded-full border border-gold-400/50" />
      <span className="pointer-events-none absolute top-3 right-3 h-2 w-2 rounded-full border border-gold-400/50" />
      <span className="pointer-events-none absolute bottom-3 left-3 h-2 w-2 rounded-full border border-gold-400/50" />
      <span className="pointer-events-none absolute bottom-3 right-3 h-2 w-2 rounded-full border border-gold-400/50" />

      {/* Main Emoji Graphic with Smooth Filters */}
      <motion.span
        animate={{
          scale: effect === 'zoom' ? zoomScale : 1,
          filter: effect === 'blur' ? `blur(${blurPx}px)` : 'none',
          opacity: flashHidden ? 0.05 : 1,
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="select-none text-8xl leading-none"
      >
        {emoji}
      </motion.span>

      {/* Silhouette Mode Overlay */}
      {effect === 'silhouette' ? (
        <motion.div
          animate={{ opacity: silhouetteOpacity }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-ocean-950/95"
        />
      ) : null}

      {/* Flash Mode Hidden Icon Indicator */}
      {flashHidden ? (
        <div className="absolute flex flex-col items-center gap-1">
          <Eye size={28} className="text-amber-400/40 animate-pulse" />
          <span className="font-display text-xs font-bold text-amber-300/60 uppercase tracking-widest">
            Ẩn Giấu
          </span>
        </div>
      ) : null}

      {/* Solved Sparkle Badge */}
      {solved ? (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute bottom-2 rounded-full border border-emerald-400/60 bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)] backdrop-blur-md"
        >
          Chính Xác!
        </motion.span>
      ) : null}
    </div>
  )
}

const DEFAULT_WRONG_REACTIONS = [{ vi: 'Chưa đúng đâu, thử lại nha.', en: "Not quite — try again." }]
const DEFAULT_CORRECT_REACTIONS = [{ vi: 'Chính xác!', en: 'Right!' }]

export function PictureQuizPuzzle({ puzzle, onCorrect }) {
  const { t } = useTranslation()
  const { emoji, effect, options, correctOptionId, wrongReactions, correctReactions } = puzzle.data
  const [selectedId, setSelectedId] = useState(null)
  const [status, setStatus] = useState('idle') // idle | wrong | correct
  const [wrongCount, setWrongCount] = useState(0)
  const [reaction, setReaction] = useState(null)

  function pickReaction(pool) {
    return pool[Math.floor(Math.random() * pool.length)]
  }

  function handleSelect(optionId) {
    if (status === 'correct') return
    setSelectedId(optionId)
    if (optionId === correctOptionId) {
      setStatus('correct')
      setReaction(pickReaction(correctReactions ?? DEFAULT_CORRECT_REACTIONS))
    } else {
      setStatus('wrong')
      setWrongCount((count) => count + 1)
      setReaction(pickReaction(wrongReactions ?? DEFAULT_WRONG_REACTIONS))
      setTimeout(() => {
        setStatus('idle')
        setReaction(null)
      }, 900)
    }
  }

  return (
    <div className="w-full space-y-5">
      {/* 3D Frame Display */}
      <PictureFrame emoji={emoji} effect={effect} wrongCount={wrongCount} solved={status === 'correct'} />

      {/* Reaction line */}
      <AnimatePresence mode="wait">
        {reaction ? (
          <motion.p
            key={t(reaction)}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`text-center font-display text-sm font-bold ${
              status === 'correct' ? 'text-emerald-300' : 'text-amber-300'
            }`}
          >
            {t(reaction)}
          </motion.p>
        ) : null}
      </AnimatePresence>

      {/* 2x2 Choice Grid */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => {
          const isSelected = selectedId === option.id
          const isCorrectOption = option.id === correctOptionId
          const showCorrect = status === 'correct' && isCorrectOption
          const showWrong = status === 'wrong' && isSelected

          return (
            <motion.button
              key={option.id}
              whileHover={{ scale: status === 'correct' ? 1 : 1.03 }}
              whileTap={{ scale: status === 'correct' ? 1 : 0.97 }}
              type="button"
              onClick={() => handleSelect(option.id)}
              disabled={status === 'correct'}
              animate={showWrong ? { x: [0, -8, 8, -5, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={`flex items-center justify-between rounded-2xl border px-5 py-3.5 text-left font-display text-sm font-semibold backdrop-blur-md transition-all ${
                showCorrect
                  ? 'border-emerald-400/70 bg-emerald-500/15 text-emerald-200'
                  : showWrong
                    ? 'border-red-400/70 bg-red-500/15 text-red-200'
                    : 'border-white/15 bg-white/5 text-parchment-100 hover:border-gold-400/50 hover:bg-white/10'
              }`}
            >
              <span>{t(option.text)}</span>
              {showCorrect ? <Check size={18} className="text-emerald-300 font-black" /> : null}
              {showWrong ? <X size={18} className="text-red-300 font-black" /> : null}
            </motion.button>
          )
        })}
      </div>

      {/* Continue Button after correct answer */}
      <AnimatePresence>
        {status === 'correct' ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Button icon={Sparkles} onClick={onCorrect} className="w-full">
              Câu Tiếp Theo
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
