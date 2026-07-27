import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '../hooks/useGame.js'
import { finalIsland } from '../data/finalIsland.js'
import { Ocean } from '../components/world/Ocean.jsx'
import { DialogBox } from '../components/dialog/DialogBox.jsx'
import { EndingSequence } from '../components/ending/EndingSequence.jsx'
import { clearGame } from '../utils/saveSystem.js'
import { fadeStep } from '../utils/motionPresets.js'

export function EndingPage() {
  const { resetGame } = useGame()
  const [showSequence, setShowSequence] = useState(false)

  function handlePlayAgain() {
    clearGame()
    resetGame()
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center p-6">
      <Ocean />
      <div className="relative z-10 w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {!showSequence ? (
            <motion.div key="ending-dialog" {...fadeStep}>
              <DialogBox
                speaker={finalIsland.ending.speaker}
                lines={finalIsland.ending.lines}
                onComplete={() => setShowSequence(true)}
              />
            </motion.div>
          ) : (
            <motion.div key="ending-sequence" {...fadeStep}>
              <EndingSequence onPlayAgain={handlePlayAgain} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
