import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Anchor, Sparkles } from 'lucide-react'
import { useGame, useCurrentIsland, useIsIslandSolved, useTranslation } from '../hooks/useGame.js'
import { Ocean } from '../components/world/Ocean.jsx'
import { DialogBox } from '../components/dialog/DialogBox.jsx'
import { PuzzleEngine } from '../components/puzzle/PuzzleEngine.jsx'
import { HiddenCoveScene } from '../components/world3d/hiddenCove/HiddenCoveScene.jsx'
import { Island3Scene } from '../components/world3d/island3/Island3Scene.jsx'
import { Island4Scene } from '../components/world3d/island4/Island4Scene.jsx'
import { FragmentRevealModal } from '../components/inventory/FragmentRevealModal.jsx'
import { ParchmentPanel } from '../components/ui/ParchmentPanel.jsx'
import { Button } from '../components/ui/Button.jsx'
import { fadeStep } from '../utils/motionPresets.js'
import { uiStrings } from '../data/uiStrings.js'
import { pickRandomRiddles } from '../data/riddleBank.js'

export function IslandPage() {
  const { state, solvePuzzle, collectFragment, setScene, arriveAtIsland } = useGame()
  const { t } = useTranslation()
  const island = useCurrentIsland()
  const alreadySolved = useIsIslandSolved(island ?? { lessons: [] })
  const [step, setStep] = useState(() => (alreadySolved ? 'revisit' : 'arrival'))
  const [lessonIndex, setLessonIndex] = useState(0)
  const [revealedFragment, setRevealedFragment] = useState(null)
  const [randomRiddles] = useState(() =>
    pickRandomRiddles((island?.lessons ?? []).filter((lesson) => lesson.type === 'riddle-random').length),
  )

  useEffect(() => {
    setStep(alreadySolved ? 'revisit' : 'arrival')
    setLessonIndex(0)
    setRevealedFragment(null)
  }, [island?.id])

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
      ? island.arrival.secretLines
      : island.arrival.lines

  if (step === 'lesson' && currentLesson.type === 'little-things') {
    return (
      <div className="relative h-full w-full">
        <HiddenCoveScene lesson={currentLesson} onSolved={handleLessonSolved} />
        <FragmentRevealModal fragment={revealedFragment} onContinue={handleFragmentContinue} />
      </div>
    )
  }

  if (island.id === 'level-3-challenge' && step === 'arrival') {
    return (
      <div className="relative h-full w-full">
        <Island3Scene
          lesson={island.lessons[0]}
          onSolved={handleLessonSolved}
          secretModeUnlocked={state.secretModeUnlocked}
        />
        <FragmentRevealModal fragment={revealedFragment} onContinue={handleFragmentContinue} />
      </div>
    )
  }

  if (island.id === 'level-4-wit' && step === 'arrival') {
    return (
      <div className="relative h-full w-full">
        <Island4Scene onSolved={handleLessonSolved} secretModeUnlocked={state.secretModeUnlocked} />
        <FragmentRevealModal fragment={revealedFragment} onContinue={handleFragmentContinue} />
      </div>
    )
  }

  const isWideLesson = step === 'lesson' && currentLesson.type === 'word-chain'

  return (
    <div className="relative flex h-full w-full items-center justify-center p-6">
      <Ocean />
      <div className={`relative z-10 flex w-full flex-col items-center mx-auto ${isWideLesson ? 'max-w-4xl sm:max-w-5xl' : 'max-w-3xl sm:max-w-4xl'}`}>
        <AnimatePresence mode="wait">
          {step === 'arrival' ? (
            <motion.div key="arrival" {...fadeStep} className="flex w-full justify-center">
              <DialogBox
                speaker={island.arrival.speaker}
                lines={arrivalLines}
                onComplete={() => setStep('discovery')}
              />
            </motion.div>
          ) : null}

          {step === 'discovery' ? (
            <motion.div key="discovery" {...fadeStep} className="flex w-full justify-center">
              <ParchmentPanel className="w-full max-w-xl p-8 text-center sm:p-10">
                <h2 className="mb-4 font-display text-2xl font-bold text-ink-900">{t(island.discovery.title)}</h2>
                {island.discovery.story.map((paragraph, index) => (
                  <p key={index} className="mb-3 font-serif text-lg leading-relaxed text-ink-900/90">
                    {t(paragraph)}
                  </p>
                ))}
                <div className="mt-6 flex justify-center">
                  <Button onClick={() => setStep('lesson')}>
                    {t(uiStrings.continueLabel)}
                  </Button>
                </div>
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
            <motion.div key="complete" {...fadeStep} className="flex w-full justify-center">
              <ParchmentPanel className="w-full max-w-xl p-8 text-center sm:p-10">
                {island.outro?.lines ? (
                  island.outro.lines.map((line, index) => (
                    <p key={index} className="mb-3 font-serif text-lg leading-relaxed text-ink-900/90 sm:text-xl">
                      {t(line)}
                    </p>
                  ))
                ) : (
                  <p className="mb-4 font-serif text-lg leading-relaxed text-ink-900">
                    {t(island.name)} {t(uiStrings.islandCompleteMessage)}
                  </p>
                )}
                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  {island.id === 'level-2-mystery' ? (
                    <Button icon={Sparkles} onClick={() => arriveAtIsland('level-3-challenge')}>
                      {t(uiStrings.goToIsland3)}
                    </Button>
                  ) : null}
                  {island.id === 'level-3-challenge' ? (
                    <Button icon={Sparkles} onClick={() => arriveAtIsland('level-4-wit')}>
                      {t(uiStrings.goToIsland4)}
                    </Button>
                  ) : null}
                  <Button
                    icon={Anchor}
                    variant={island.id === 'level-2-mystery' || island.id === 'level-3-challenge' ? 'ghost' : 'primary'}
                    onClick={handleReturnToMap}
                  >
                    {t(uiStrings.returnToShip)}
                  </Button>
                </div>
              </ParchmentPanel>
            </motion.div>
          ) : null}

          {step === 'revisit' ? (
            <motion.div key="revisit" {...fadeStep} className="flex w-full justify-center">
              <ParchmentPanel className="w-full max-w-xl p-8 text-center sm:p-10">
                <h2 className="mb-3 font-display text-xl font-bold text-ink-900">{t(island.discovery.title)}</h2>
                <p className="mb-6 font-serif text-base text-ink-700">{t(uiStrings.islandRevisitMessage)}</p>
                <div className="flex justify-center">
                  <Button icon={Anchor} onClick={handleReturnToMap}>
                    {t(uiStrings.returnToShip)}
                  </Button>
                </div>
              </ParchmentPanel>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <FragmentRevealModal fragment={revealedFragment} onContinue={handleFragmentContinue} />
    </div>
  )
}
