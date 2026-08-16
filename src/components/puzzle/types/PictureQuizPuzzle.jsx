import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, X, Sparkles, Eye, ShieldAlert } from 'lucide-react'
import { useTranslation } from '../../../hooks/useGame.js'
import { uiStrings } from '../../../data/uiStrings.js'

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
    <div className="relative mx-auto flex h-44 w-44 items-center justify-center overflow-hidden rounded-3xl border-2 border-amber-400/70 bg-gradient-to-b from-ocean-900 via-ocean-950 to-ocean-900 shadow-[0_0_35px_rgba(245,158,11,0.4)] backdrop-blur-xl">
      {/* Background glowing energy aura */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15),transparent_70%)]" />

      {/* Decorative Golden Corner Accents */}
      <span className="pointer-events-none absolute top-2 left-2 h-2.5 w-2.5 rounded-tl-sm border-t-2 border-l-2 border-amber-400" />
      <span className="pointer-events-none absolute top-2 right-2 h-2.5 w-2.5 rounded-tr-sm border-t-2 border-r-2 border-amber-400" />
      <span className="pointer-events-none absolute bottom-2 left-2 h-2.5 w-2.5 rounded-bl-sm border-b-2 border-l-2 border-amber-400" />
      <span className="pointer-events-none absolute bottom-2 right-2 h-2.5 w-2.5 rounded-br-sm border-b-2 border-r-2 border-amber-400" />

      {/* Main Emoji Graphic with Smooth Filters */}
      <motion.span
        animate={{
          scale: effect === 'zoom' ? zoomScale : 1,
          filter: effect === 'blur' ? `blur(${blurPx}px)` : 'none',
          opacity: flashHidden ? 0.05 : 1,
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="select-none text-8xl leading-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
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

export function PictureQuizPuzzle({ puzzle, onCorrect }) {
  const { t } = useTranslation()
  const { emoji, effect, options, correctOptionId } = puzzle.data
  const [selectedId, setSelectedId] = useState(null)
  const [status, setStatus] = useState('idle') // idle | wrong | correct
  const [wrongCount, setWrongCount] = useState(0)

  function handleSelect(optionId) {
    if (status === 'correct') return
    setSelectedId(optionId)
    if (optionId === correctOptionId) {
      setStatus('correct')
    } else {
      setStatus('wrong')
      setWrongCount((count) => count + 1)
      setTimeout(() => setStatus('idle'), 600)
    }
  }

  return (
    <div className="w-full space-y-5">
      {/* 3D Frame Display */}
      <PictureFrame emoji={emoji} effect={effect} wrongCount={wrongCount} solved={status === 'correct'} />

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
              className={`flex items-center justify-between rounded-2xl border-2 px-5 py-3.5 text-left font-display text-base font-bold shadow-xl backdrop-blur-md transition-all ${
                showCorrect
                  ? 'border-emerald-400 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                  : showWrong
                    ? 'border-red-400 bg-gradient-to-r from-red-500/30 to-rose-500/30 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                    : 'border-amber-400/30 bg-ocean-900/80 text-parchment-100 hover:border-amber-400 hover:bg-ocean-800/90 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]'
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
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={onCorrect}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-300/60 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 px-8 py-3.5 font-display text-base font-black text-ink-950 shadow-[0_8px_25px_rgba(245,158,11,0.5)]"
            >
              <span>Tiếp Tục Chặng Đuôi</span>
              <Sparkles size={18} />
            </motion.button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
