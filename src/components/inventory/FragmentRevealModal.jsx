import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Compass } from 'lucide-react'
import gsap from 'gsap'
import { ParchmentPanel } from '../ui/ParchmentPanel.jsx'
import { Button } from '../ui/Button.jsx'
import { useTranslation, useFragments } from '../../hooks/useGame.js'
import { uiStrings } from '../../data/uiStrings.js'

// Fires once the player confirms the reveal: the compass glyph detaches
// from the panel and flies toward the HUD's compass badge (fixed top-left,
// see HUD.jsx) before the modal actually closes — same beat for every
// island, not just Island 2's Hidden Cove.
function useFlyToCompass(onContinue) {
  const iconRef = useRef(null)
  const [flying, setFlying] = useState(false)

  function start() {
    if (!iconRef.current) {
      onContinue?.()
      return
    }
    setFlying(true)
    const rect = iconRef.current.getBoundingClientRect()
    const targetX = 32 - (rect.left + rect.width / 2)
    const targetY = 32 - (rect.top + rect.height / 2)
    gsap.to(iconRef.current, {
      x: targetX,
      y: targetY,
      scale: 0.25,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.in',
      onComplete: () => {
        setFlying(false)
        onContinue?.()
      },
    })
  }

  return { iconRef, flying, start }
}

export function FragmentRevealModal({ fragment, onContinue }) {
  const { t } = useTranslation()
  const { collected, total } = useFragments()
  const { iconRef, flying, start } = useFlyToCompass(onContinue)

  const remaining = Math.max(0, total - collected.length)
  const progressLine = t(uiStrings.fragmentProgressLine)
    .replace('{count}', collected.length)
    .replace('{total}', total)
    .replace('{remaining}', remaining)

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
                ref={iconRef}
                animate={flying ? undefined : { rotate: [0, 8, -8, 0] }}
                transition={{ duration: 1.6, repeat: flying ? 0 : Infinity, ease: 'easeInOut' }}
                className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold-500 bg-gold-400/20 text-gold-600"
              >
                <Compass size={36} />
              </motion.div>
              <p className="mb-1 text-xs tracking-wide text-gold-600">{t(uiStrings.fragmentFoundTitle)}</p>
              <h3 className="mb-3 font-display text-lg text-ink-900">{t(fragment.name)}</h3>
              <p className="mb-4 text-sm text-ink-700">{t(fragment.loreText)}</p>
              <p className="mb-6 text-xs tracking-wide text-gold-600">{progressLine}</p>
              <Button onClick={start} disabled={flying}>
                {t(uiStrings.continueLabel)}
              </Button>
            </ParchmentPanel>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
