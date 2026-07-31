import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Anchor } from 'lucide-react'
import { useGame, useCurrentIsland, useIsIslandSolved, useTranslation } from '../hooks/useGame.js'
import { Ocean } from '../components/world/Ocean.jsx'
import { DialogBox } from '../components/dialog/DialogBox.jsx'
import { PuzzleEngine } from '../components/puzzle/PuzzleEngine.jsx'
import { FragmentRevealModal } from '../components/inventory/FragmentRevealModal.jsx'
import { ParchmentPanel } from '../components/ui/ParchmentPanel.jsx'
import { Button } from '../components/ui/Button.jsx'
import { fadeStep } from '../utils/motionPresets.js'
import { uiStrings } from '../data/uiStrings.js'
import { pickRandomRiddles } from '../data/riddleBank.js'

// Step machine: arrival -> discovery -> lesson[0..n-1] -> complete. A
// previously solved island skips straight to a revisit summary. An island
// can have several lessons (Level 1) or just one (everyone else) — the
// machine doesn't need to know which.
export function IslandPage() {
  const { state, solvePuzzle, collectFragment, setScene } = useGame()
  const { t } = useTranslation()
  const island = useCurrentIsland()
  const alreadySolved = useIsIslandSolved(island ?? { lessons: [] })
  const [step, setStep] = useState(() => (alreadySolved ? 'revisit' : 'arrival'))
  const [lessonIndex, setLessonIndex] = useState(0)
  const [revealedFragment, setRevealedFragment] = useState(null)
  // Picked once per island visit — every 'riddle-random' lesson slot gets
  // a distinct riddle from the bank, so the 3 slots never repeat the same
  // one in a single playthrough. See data/islands.js for why the lessons
  // themselves carry no prompt/data.
  const [randomRiddles] = useState(() =>
    pickRandomRiddles((island?.lessons ?? []).filter((lesson) => lesson.type === 'riddle-random').length),
  )

  if (!island) return null

  function resolveLesson(lesson, index) {
    if (lesson.type !== 'riddle-random') return lesson
    const slot = island.lessons.slice(0, index).filter((entry) => entry.type === 'riddle-random').length
    const riddle = randomRiddles[slot]
    return { ...lesson, type: 'riddle', prompt: riddle.prompt, data: riddle.data }
  }

  function handleLessonSolved() {
    const lesson = island.lessons[lessonIndex]
    solvePuzzle(lesson.id)

    if (lessonIndex < island.lessons.length - 1) {
      setLessonIndex((index) => index + 1)
      return
    }

    collectFragment(island.fragment.id)
    setRevealedFragment(island.fragment)
  }

  function handleFragmentContinue() {
    setRevealedFragment(null)
    setStep('complete')
  }

  function handleReturnToMap() {
    setScene('map')
  }

  const currentLesson = resolveLesson(island.lessons[lessonIndex], lessonIndex)
  const arrivalLines =
    state.secretModeUnlocked && island.arrival.secretLines
      ? [...island.arrival.lines, ...island.arrival.secretLines]
      : island.arrival.lines

  return (
    <div className="relative flex h-full w-full items-center justify-center p-6">
      <Ocean />
      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center">
        <AnimatePresence mode="wait">
          {step === 'arrival' ? (
            <motion.div key="arrival" {...fadeStep} className="w-full">
              <DialogBox
                speaker={island.arrival.speaker}
                lines={arrivalLines}
                onComplete={() => setStep('discovery')}
              />
            </motion.div>
          ) : null}

          {step === 'discovery' ? (
            <motion.div key="discovery" {...fadeStep} className="w-full">
              <ParchmentPanel className="p-6">
                <h2 className="mb-3 font-display text-xl text-ink-900">{t(island.discovery.title)}</h2>
                {island.discovery.story.map((paragraph, index) => (
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
            <motion.div key={`lesson-${lessonIndex}`} {...fadeStep} className="w-full">
              {island.lessons.length > 1 ? (
                <div className="mb-2 flex justify-center gap-1.5">
                  {island.lessons.map((lesson, index) => (
                    <span
                      key={lesson.id}
                      className={`h-1.5 w-6 rounded-full ${index <= lessonIndex ? 'bg-gold-400' : 'bg-parchment-200/20'}`}
                    />
                  ))}
                </div>
              ) : null}
              <PuzzleEngine
                puzzle={currentLesson}
                onSolved={handleLessonSolved}
                secretModeUnlocked={state.secretModeUnlocked}
              />
            </motion.div>
          ) : null}

          {step === 'complete' ? (
            <motion.div key="complete" {...fadeStep} className="w-full">
              <ParchmentPanel className="p-6 text-center">
                <p className="mb-4 text-ink-900">
                  {t(island.name)} {t(uiStrings.islandCompleteMessage)}
                </p>
                <Button icon={Anchor} onClick={handleReturnToMap}>
                  {t(uiStrings.returnToShip)}
                </Button>
              </ParchmentPanel>
            </motion.div>
          ) : null}

          {step === 'revisit' ? (
            <motion.div key="revisit" {...fadeStep} className="w-full">
              <ParchmentPanel className="p-6 text-center">
                <h2 className="mb-2 font-display text-lg text-ink-900">{t(island.discovery.title)}</h2>
                <p className="mb-4 text-sm text-ink-700">{t(uiStrings.islandRevisitMessage)}</p>
                <Button icon={Anchor} onClick={handleReturnToMap}>
                  {t(uiStrings.returnToShip)}
                </Button>
              </ParchmentPanel>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <FragmentRevealModal fragment={revealedFragment} onContinue={handleFragmentContinue} />
    </div>
  )
}
