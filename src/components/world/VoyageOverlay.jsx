import { AnimatePresence, motion } from 'framer-motion'
import { Compass } from 'lucide-react'
import { useTranslation } from '../../hooks/useGame.js'
import { uiStrings } from '../../data/uiStrings.js'

export function VoyageOverlay({ isSailing, destinationName }) {
  const { t } = useTranslation()

  return (
    <AnimatePresence>
      {isSailing ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-40 flex flex-col items-center justify-end gap-3 bg-gradient-to-t from-ocean-950/70 via-transparent to-transparent pb-16"
        >
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}>
            <Compass size={22} className="text-gold-400" />
          </motion.div>
          <p className="font-display text-sm tracking-wide text-parchment-100">
            {t(uiStrings.sailingTo)} {t(destinationName)}…
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
