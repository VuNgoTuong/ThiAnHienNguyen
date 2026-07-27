import { AnimatePresence, motion } from 'framer-motion'
import { Compass } from 'lucide-react'
import { ParchmentPanel } from '../ui/ParchmentPanel.jsx'
import { Button } from '../ui/Button.jsx'
import { useTranslation } from '../../hooks/useGame.js'
import { uiStrings } from '../../data/uiStrings.js'

export function FragmentRevealModal({ fragment, onContinue }) {
  const { t } = useTranslation()

  return (
    <AnimatePresence>
      {fragment ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ocean-950/85 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          >
            <ParchmentPanel className="max-w-sm p-8 text-center">
              <motion.div
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold-500 bg-gold-400/20 text-gold-600"
              >
                <Compass size={36} />
              </motion.div>
              <p className="mb-1 text-xs tracking-wide text-gold-600">{t(uiStrings.fragmentFoundTitle)}</p>
              <h3 className="mb-3 font-display text-lg text-ink-900">{t(fragment.name)}</h3>
              <p className="mb-6 text-sm text-ink-700">{t(fragment.loreText)}</p>
              <Button onClick={onContinue}>{t(uiStrings.continueLabel)}</Button>
            </ParchmentPanel>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
