import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame, useTranslation } from '../hooks/useGame.js'
import { finalIsland } from '../data/finalIsland.js'
import { ROUND_DEFS } from '../data/island4Predictions.js'
import { Ocean } from '../components/world/Ocean.jsx'
import { DialogBox } from '../components/dialog/DialogBox.jsx'
import { ParchmentPanel } from '../components/ui/ParchmentPanel.jsx'
import { Button } from '../components/ui/Button.jsx'
import { fadeStep } from '../utils/motionPresets.js'
import { uiStrings } from '../data/uiStrings.js'

// Turns Island 4's stored round-by-round ĐÚNG/SAI answers into the sentences
// this island plays back — falls back gracefully if Island 4 was skipped or
// somehow left no data behind.
function buildRecapLines(island4Result) {
  const rounds = island4Result?.rounds ?? []
  const lines = rounds
    .map((entry) => {
      const def = ROUND_DEFS[entry.round - 1]
      return def?.recap ? def.recap(entry.isTrue) : null
    })
    .filter(Boolean)
  return lines.length > 0 ? lines : [finalIsland.recap.fallbackLine]
}

export function FinalIslandPage() {
  const { state, seeEnding } = useGame()
  const { t } = useTranslation()
  const [step, setStep] = useState(() => (state.endingSeen ? 'recap' : 'arrival'))

  const recapLines = useMemo(() => buildRecapLines(state.island4Result), [state.island4Result])

  const arrivalLines =
    state.secretModeUnlocked && finalIsland.arrival.secretLines
      ? [...finalIsland.arrival.lines, ...finalIsland.arrival.secretLines]
      : finalIsland.arrival.lines

  return (
    <div className="relative flex h-full w-full items-center justify-center p-6">
      <Ocean />
      <div className="relative z-10 w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {step === 'arrival' ? (
            <motion.div key="arrival" {...fadeStep}>
              <DialogBox
                speaker={finalIsland.arrival.speaker}
                lines={arrivalLines}
                onComplete={() => setStep('discovery')}
              />
            </motion.div>
          ) : null}

          {step === 'discovery' ? (
            <motion.div key="discovery" {...fadeStep}>
              <ParchmentPanel className="p-6">
                <h2 className="mb-3 font-display text-xl text-ink-900">{t(finalIsland.discovery.title)}</h2>
                {finalIsland.discovery.story.map((paragraph, index) => (
                  <p key={index} className="mb-2 leading-relaxed text-ink-900/90">
                    {t(paragraph)}
                  </p>
                ))}
                <Button className="mt-4" onClick={() => setStep('recap')}>
                  {t(uiStrings.continueLabel)}
                </Button>
              </ParchmentPanel>
            </motion.div>
          ) : null}

          {step === 'recap' ? (
            <motion.div key="recap" {...fadeStep}>
              <RecapPanel lines={recapLines} onDone={() => seeEnding()} t={t} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}

// A slow, one-line-at-a-time reveal of what the player chose earlier in the
// voyage, no scoring or puzzle attached — purely a moment to look back.
function RecapPanel({ lines, onDone, t }) {
  const allLines = [finalIsland.recap.intro, ...lines, finalIsland.recap.closingLine]
  return (
    <ParchmentPanel className="p-6 text-center">
      <div className="mb-6 flex flex-col gap-2.5">
        {allLines.map((line, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.9 }}
            className="font-serif text-lg leading-relaxed text-ink-900/90"
          >
            {t(line)}
          </motion.p>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 + allLines.length * 0.9 }}
      >
        <Button onClick={onDone}>{t(uiStrings.continueLabel)}</Button>
      </motion.div>
    </ParchmentPanel>
  )
}
