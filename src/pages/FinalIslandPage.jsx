import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame, useTranslation } from '../hooks/useGame.js'
import { finalIsland } from '../data/finalIsland.js'
import { Ocean } from '../components/world/Ocean.jsx'
import { DialogBox } from '../components/dialog/DialogBox.jsx'
import { PuzzleEngine } from '../components/puzzle/PuzzleEngine.jsx'
import { ParchmentPanel } from '../components/ui/ParchmentPanel.jsx'
import { Button } from '../components/ui/Button.jsx'
import { fadeStep } from '../utils/motionPresets.js'
import { uiStrings } from '../data/uiStrings.js'

export function FinalIslandPage() {
  const { state, solvePuzzle, seeEnding } = useGame()
  const { t } = useTranslation()
  const alreadySolved = finalIsland.lessons.every((lesson) => state.solvedPuzzleIds.includes(lesson.id))
  const [step, setStep] = useState(() => (alreadySolved ? 'lesson' : 'arrival'))
  const [lessonIndex, setLessonIndex] = useState(0)

  function handleLessonSolved() {
    const lesson = finalIsland.lessons[lessonIndex]
    solvePuzzle(lesson.id)

    if (lessonIndex < finalIsland.lessons.length - 1) {
      setLessonIndex((index) => index + 1)
      return
    }
    seeEnding()
  }

  const currentLesson = finalIsland.lessons[lessonIndex]
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
                <Button className="mt-4" onClick={() => setStep('lesson')}>
                  {t(uiStrings.continueLabel)}
                </Button>
              </ParchmentPanel>
            </motion.div>
          ) : null}

          {step === 'lesson' ? (
            <motion.div key={`lesson-${lessonIndex}`} {...fadeStep}>
              <PuzzleEngine
                puzzle={currentLesson}
                onSolved={handleLessonSolved}
                secretModeUnlocked={state.secretModeUnlocked}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}
