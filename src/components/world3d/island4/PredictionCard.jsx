import { motion } from 'framer-motion'

// The core "AI đoán bạn" beat: a big cinematic card revealing the AI's
// guess, with two large ĐÚNG/SAI pills below. Buttons are disabled for a
// beat after mount (`answerable`) so the reveal reads before it's clickable.
export function PredictionCard({ header, icon, text, trueLabel, falseLabel, answerable, onAnswer }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.97 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="pointer-events-auto flex w-full max-w-md flex-col items-center gap-6 px-4"
    >
      <div className="w-full rounded-3xl border border-white/15 bg-white/10 px-6 py-7 text-center backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.75)]">
        <p className="mb-4 font-display text-xs tracking-[0.3em] text-cyan-200/80">{header}</p>
        {icon ? (
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 16 }}
            className="mb-3 text-6xl leading-none"
          >
            {icon}
          </motion.div>
        ) : null}
        <p className="font-display text-xl text-parchment-100 sm:text-2xl">{text}</p>
      </div>

      <div className="grid w-full grid-cols-2 gap-4">
        <motion.button
          type="button"
          disabled={!answerable}
          onClick={() => onAnswer(true)}
          whileHover={answerable ? { y: -4, scale: 1.03 } : {}}
          whileTap={answerable ? { scale: 0.95 } : {}}
          className="rounded-2xl border border-gold-400/60 bg-gradient-to-b from-gold-400 to-gold-600 py-4 font-display text-base tracking-[0.2em] text-ink-900 shadow-[0_10px_30px_-8px_rgba(211,162,74,0.7)] transition-opacity disabled:opacity-40"
        >
          {trueLabel}
        </motion.button>
        <motion.button
          type="button"
          disabled={!answerable}
          onClick={() => onAnswer(false)}
          whileHover={answerable ? { y: -4, scale: 1.03 } : {}}
          whileTap={answerable ? { scale: 0.95 } : {}}
          className="rounded-2xl border border-white/20 bg-white/10 py-4 font-display text-base tracking-[0.2em] text-parchment-100 backdrop-blur-md transition-colors disabled:opacity-40 hover:border-red-300/50 hover:bg-red-400/10"
        >
          {falseLabel}
        </motion.button>
      </div>
    </motion.div>
  )
}
