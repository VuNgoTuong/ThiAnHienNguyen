import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { AnimatePresence, motion } from 'framer-motion'
import { Compass } from 'lucide-react'
import gsap from 'gsap'
import { useTranslation } from '../../../hooks/useGame.js'
import { uiStrings } from '../../../data/uiStrings.js'
import { ParchmentPanel } from '../../ui/ParchmentPanel.jsx'
import { SceneEffects } from '../SceneEffects.jsx'
import { HiddenCoveEnvironment, OldTreeMesh, WellMesh, FootprintsMesh, CaveMouthMesh } from './HiddenCoveEnvironment.jsx'
import { TreasureChest } from './TreasureChest.jsx'
import { CoveBurstParticles } from './CoveDustParticles.jsx'
import { PictureQuizPuzzle } from '../../puzzle/types/PictureQuizPuzzle.jsx'

// Purely decorative set-dressing now — nothing in the scene is clickable.
// The camera just glides between these points as the player answers each
// question, so the pretty cove still gets shown off one piece at a time.
const TREE_POSITION = [-2.6, 0, 1.8]
const WELL_POSITION = [1.6, 0, -1.4]
const FOOTPRINTS_POSITION = [0.9, 0, 0.3]
const CAVE_POSITION = [3.0, 0, 2.4]
const CHEST_POSITION = [3.6, 0.02, 4.0]

const VIEW_REST = { cam: { x: 1, y: 5.4, z: 9.2 }, look: { x: 0.6, y: 0, z: 1 } }
const VIEW_TREE = { cam: { x: -1.2, y: 3.6, z: 6.5 }, look: { x: -2.2, y: 0.6, z: 1.6 } }
const VIEW_WELL = { cam: { x: 2.4, y: 3.8, z: 3.5 }, look: { x: 1.6, y: 0.5, z: -1 } }
const VIEW_CAVE = { cam: { x: 3.6, y: 3.4, z: 7.5 }, look: { x: 3, y: 0.5, z: 2.6 } }
const VIEW_CHEST = {
  cam: { x: CHEST_POSITION[0], y: 1.5, z: CHEST_POSITION[2] + 2.2 },
  look: { x: CHEST_POSITION[0], y: 0.25, z: CHEST_POSITION[2] },
}
// One framing per question (cycled by index) so answering feels like a
// little tour of the cove instead of four rounds staring at the same shot.
const QUESTION_VIEWS = [VIEW_REST, VIEW_TREE, VIEW_WELL, VIEW_CAVE]

function CoveCamera({ cameraRef, lookTargetRef }) {
  const localRef = useRef(null)

  useFrame(() => {
    const camera = localRef.current
    if (!camera) return
    camera.lookAt(lookTargetRef.current.x, lookTargetRef.current.y, lookTargetRef.current.z)
  })

  return (
    <PerspectiveCamera
      ref={(node) => {
        localRef.current = node
        cameraRef.current = node
      }}
      makeDefault
      fov={48}
      position={[VIEW_REST.cam.x, VIEW_REST.cam.y, VIEW_REST.cam.z]}
      near={0.1}
      far={120}
    />
  )
}

// Full-bleed 3D scene for Island 2 — a picture-guessing quiz staged inside
// the Hidden Cove environment. `onSolved` is IslandPage's existing
// `handleLessonSolved`, called once after the last question and the chest
// finale, so the rest of the fragment pipeline (already generic for every
// island) picks up unchanged from there.
export function HiddenCoveScene({ lesson, onSolved, secretModeUnlocked = false }) {
  const { t } = useTranslation()

  const [phase, setPhase] = useState('title') // 'title' | 'exploring' | 'finale' | 'done'
  const [questionIndex, setQuestionIndex] = useState(0)
  const [burstActive, setBurstActive] = useState(false)

  const cameraRef = useRef(null)
  const lookTargetRef = useRef({ ...VIEW_REST.look })
  const lidRef = useRef(null)
  const lockRef = useRef(null)
  const lightBurstRef = useRef(null)
  const finaleTriggeredRef = useRef(false)

  const questions = lesson.data.questions
  const currentQuestion = questions[questionIndex]

  useEffect(() => {
    const timeout = setTimeout(() => setPhase((p) => (p === 'title' ? 'exploring' : p)), 3200)
    return () => clearTimeout(timeout)
  }, [])

  function moveCamera(view) {
    const camera = cameraRef.current
    if (!camera) return
    gsap.to(camera.position, { ...view.cam, duration: 1.1, ease: 'power2.inOut' })
    gsap.to(lookTargetRef.current, { ...view.look, duration: 1.1, ease: 'power2.inOut' })
  }

  function handleQuestionCorrect() {
    const nextIndex = questionIndex + 1
    if (nextIndex >= questions.length) {
      triggerFinale()
      return
    }
    setQuestionIndex(nextIndex)
    moveCamera(QUESTION_VIEWS[nextIndex % QUESTION_VIEWS.length])
  }

  function triggerFinale() {
    if (finaleTriggeredRef.current) return
    finaleTriggeredRef.current = true
    setPhase('finale')

    const camera = cameraRef.current
    const timeline = gsap.timeline({
      onComplete: () => {
        setPhase('done')
        onSolved()
      },
    })

    timeline
      .to(camera.position, { ...VIEW_CHEST.cam, duration: 1, ease: 'power2.inOut' })
      .to(lookTargetRef.current, { ...VIEW_CHEST.look, duration: 1, ease: 'power2.inOut' }, '<')
      .to(lockRef.current.material, { emissiveIntensity: 2.2, duration: 0.22, yoyo: true, repeat: 3 })
      .call(() => setBurstActive(true))
      .to(camera.position, { x: '+=0.05', y: '+=0.035', duration: 0.045, repeat: 7, yoyo: true, ease: 'none' })
      .to(lidRef.current.rotation, { x: -1.9, duration: 0.9, ease: 'power3.out' }, '-=0.1')
      .to(lightBurstRef.current, { intensity: 3.5, duration: 0.15 }, '<')
      .to(lightBurstRef.current, { intensity: 0, duration: 1.3 })
      .to({}, { duration: 0.6 }) // brief hold on the open chest before handing off
  }

  const promptField = secretModeUnlocked && currentQuestion.secretPrompt ? currentQuestion.secretPrompt : currentQuestion.prompt

  return (
    <div className="relative h-full w-full">
      <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true }}>
        <CoveCamera cameraRef={cameraRef} lookTargetRef={lookTargetRef} />
        <HiddenCoveEnvironment />

        <group position={TREE_POSITION}>
          <OldTreeMesh />
        </group>
        <group position={WELL_POSITION}>
          <WellMesh />
        </group>
        <group position={FOOTPRINTS_POSITION}>
          <FootprintsMesh />
        </group>
        <group position={CAVE_POSITION}>
          <CaveMouthMesh />
        </group>
        <group position={CHEST_POSITION}>
          <TreasureChest lidRef={lidRef} lockRef={lockRef} />
          <pointLight ref={lightBurstRef} position={[0, 0.6, 0]} intensity={0} color="#ffd27a" distance={5} />
          <CoveBurstParticles active={burstActive} />
        </group>

        <SceneEffects />
      </Canvas>

      {/* title card */}
      <AnimatePresence>
        {phase === 'title' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center bg-ocean-950/35 text-center"
          >
            <p className="mb-2 font-display text-sm tracking-[0.3em] text-gold-400">{t(uiStrings.hiddenCoveEyebrow)}</p>
            <h1 className="mb-4 font-display text-3xl text-parchment-100 sm:text-4xl">
              {t({ vi: 'Vịnh Ẩn Giấu', en: 'The Hidden Cove' })}
            </h1>
            <p className="max-w-md px-6 text-sm text-parchment-200/85">{t(uiStrings.hiddenCoveSubtitle)}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* question progress */}
      {phase !== 'title' ? (
        <div className="pointer-events-none absolute inset-x-0 top-4 z-10 flex justify-center">
          <div className="flex items-center gap-2 rounded-full border border-parchment-200/15 bg-ocean-950/55 px-3 py-1.5 backdrop-blur">
            <Compass size={13} className="text-gold-400" />
            <div className="flex gap-1">
              {questions.map((question, index) => (
                <span
                  key={question.id}
                  className={`h-1.5 w-1.5 rounded-full ${index < questionIndex || phase === 'finale' || phase === 'done' ? 'bg-gold-400' : index === questionIndex ? 'bg-gold-400/50' : 'bg-parchment-200/25'}`}
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* quiz card */}
      <AnimatePresence mode="wait">
        {phase === 'exploring' ? (
          <motion.div
            key={questionIndex}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="pointer-events-auto absolute inset-x-0 bottom-4 z-10 flex justify-center px-4"
          >
            <ParchmentPanel className="w-full max-w-sm p-5 text-center">
              <p className="mb-1 font-display text-[10px] tracking-wide text-gold-600">
                {questionIndex + 1}/{questions.length}
              </p>
              <p className="mb-3 text-sm leading-relaxed text-ink-900/90 italic">{t(promptField)}</p>
              <PictureQuizPuzzle puzzle={{ data: currentQuestion }} onCorrect={handleQuestionCorrect} />
            </ParchmentPanel>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
