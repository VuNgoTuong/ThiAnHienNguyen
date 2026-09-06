import { AnimatePresence, motion } from 'framer-motion'

// The 2D half of the "AI is thinking" beat — the AI Core's own pulse/rotate
// (see Island4Environment's AICore) carries the 3D side; this is just the
// line of text that appears over it before the prediction reveals.
export function AIThinking({ text }) {
  return (
    <AnimatePresence mode="wait">
      {text ? (
        <motion.p
          key={text}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="font-display text-lg tracking-wide text-cyan-100"
        >
          {text}
        </motion.p>
      ) : null}
    </AnimatePresence>
  )
}
