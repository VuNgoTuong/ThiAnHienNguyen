import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame, useTranslation } from '../hooks/useGame.js'
import { finalIsland } from '../data/finalIsland.js'
import { Ocean } from '../components/world/Ocean.jsx'
import { DialogBox } from '../components/dialog/DialogBox.jsx'
import { EndingSequence } from '../components/ending/EndingSequence.jsx'
import { ParchmentPanel } from '../components/ui/ParchmentPanel.jsx'
import { clearGame } from '../utils/saveSystem.js'
import { fadeStep } from '../utils/motionPresets.js'

export function EndingPage() {
  const { resetGame } = useGame()
  const { t } = useTranslation()
  const [step, setStep] = useState('dialog') // dialog | heart | sequence

  function handlePlayAgain() {
    clearGame()
    resetGame()
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center p-6">
      <Ocean />
      <div className="relative z-10 w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {step === 'dialog' ? (
            <motion.div key="ending-dialog" {...fadeStep}>
              <DialogBox
                speaker={finalIsland.ending.speaker}
                lines={finalIsland.ending.lines}
                onComplete={() => setStep('heart')}
              />
            </motion.div>
          ) : null}

          {step === 'heart' ? (
            <motion.div key="ending-heart" {...fadeStep}>
              <ParchmentPanel className="p-8 text-center">
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6 font-serif text-xl leading-relaxed text-ink-900"
                >
                  {t(finalIsland.ending.heartLine)}
                </motion.p>
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  type="button"
                  onClick={() => setStep('sequence')}
                  className="rounded-full border border-gold-400/60 bg-gradient-to-b from-gold-400 to-gold-600 px-8 py-3 font-display text-sm tracking-[0.2em] text-ink-900 shadow-[0_10px_30px_-8px_rgba(211,162,74,0.7)] transition-transform hover:scale-105 active:scale-95"
                >
                  {t(finalIsland.ending.continueButton)}
                </motion.button>
              </ParchmentPanel>
            </motion.div>
          ) : null}

          {step === 'sequence' ? (
            <motion.div key="ending-sequence" {...fadeStep}>
              <EndingSequence onPlayAgain={handlePlayAgain} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}
