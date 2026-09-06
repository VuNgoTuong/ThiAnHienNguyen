import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { AnimatePresence, motion } from 'framer-motion'
import { Compass, Sparkles } from 'lucide-react'
import gsap from 'gsap'
import { useTranslation } from '../../../hooks/useGame.js'
import { uiStrings } from '../../../data/uiStrings.js'
import { Button } from '../../ui/Button.jsx'
import { SceneEffects } from '../SceneEffects.jsx'
import { HiddenCoveEnvironment } from './HiddenCoveEnvironment.jsx'
import { CoveBurstParticles } from './CoveDustParticles.jsx'
import { LittleThingsCard } from './LittleThingsCard.jsx'

// Four gentle camera framings of the same cove — one per chapter — so
// moving into a new section of island2Content.js still reads as "the world
// shifted a little" without needing per-question clue-props to glide to
// (the old hidden-object version tied a view to each hotspot; this one just
// re-frames the same pretty scenery for variety).
const VIEW_REST = { cam: { x: 1, y: 5.4, z: 9.2 }, look: { x: 0.6, y: 0, z: 1 } }
const VIEW_CLIFFS = { cam: { x: 3.2, y: 3.8, z: 6.4 }, look: { x: 3.6, y: 0.6, z: 1.6 } }
const VIEW_HORIZON = { cam: { x: -1.4, y: 3.4, z: 5.6 }, look: { x: -3, y: 0.5, z: -3 } }
const VIEW_SKY = { cam: { x: 0, y: 6.6, z: 11 }, look: { x: 0, y: 1.6, z: 0 } }
const VIEW_FINALE = { cam: { x: 0.4, y: 4.6, z: 8.4 }, look: { x: 0.2, y: 0.9, z: 0 } }
const SECTION_VIEWS = [VIEW_REST, VIEW_CLIFFS, VIEW_HORIZON, VIEW_SKY]

function CoveCamera({ cameraRef, lookTargetRef }) {
  const localRef = useRef(null)

  useFrame(({ clock }) => {
    const camera = localRef.current
    if (!camera) return
    const t = clock.getElapsedTime()
    const swayX = Math.sin(t * 0.8) * 0.08
    const swayY = Math.cos(t * 0.6) * 0.06
    camera.lookAt(lookTargetRef.current.x + swayX, lookTargetRef.current.y + swayY, lookTargetRef.current.z)
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

// Full-bleed 3D scene for Island 2 — "Những Điều Nhỏ". The cove is now
// purely a cinematic backdrop: the camera drifts to a new framing once per
// chapter while the player works through island2Content.js's either/or
// interactions, one at a time, at their own pace. `onSolved` is IslandPage's
// `handleLessonSolved`, called once after the finale, so the rest of the
// fragment pipeline (already generic for every island) picks up unchanged.
export function HiddenCoveScene({ lesson, onSolved }) {
  const { t } = useTranslation()
  const { sections, outro } = lesson.data

  const flat = useMemo(
    () =>
      sections.flatMap((section, sectionIndex) =>
        section.interactions.map((interaction, indexInSection) => ({
          ...interaction,
          sectionId: section.id,
          sectionTitle: section.title,
          sectionMicro: section.micro,
          sectionIndex,
          sectionLength: section.interactions.length,
          indexInSection,
        })),
      ),
    [sections],
  )

  // 'section-intro' | 'question' | 'finale'
  const [phase, setPhase] = useState('section-intro')
  const [stepIndex, setStepIndex] = useState(0)
  const [finaleStep, setFinaleStep] = useState(0)
  const [keywords, setKeywords] = useState([])

  const cameraRef = useRef(null)
  const lookTargetRef = useRef({ ...VIEW_REST.look })
  const lightBurstRef = useRef(null)
  const finaleTriggeredRef = useRef(false)
  const [burstActive, setBurstActive] = useState(false)

  const current = flat[stepIndex]

  function moveCamera(view) {
    const camera = cameraRef.current
    if (!camera) return
    gsap.to(camera.position, { ...view.cam, duration: 1.3, ease: 'power2.inOut' })
    gsap.to(lookTargetRef.current, { ...view.look, duration: 1.3, ease: 'power2.inOut' })
  }

  function enterSection(index) {
    moveCamera(SECTION_VIEWS[flat[index].sectionIndex % SECTION_VIEWS.length])
    setPhase('section-intro')
  }

  function handleSectionIntroContinue() {
    setPhase('question')
  }

  function handleAnswer(option) {
    setKeywords((list) => [...list, option.keyword])

    const nextIndex = stepIndex + 1
    if (nextIndex >= flat.length) {
      triggerFinale()
      return
    }

    setStepIndex(nextIndex)
    if (flat[nextIndex].indexInSection === 0) {
      enterSection(nextIndex)
    } else {
      setPhase('question')
    }
  }

  function triggerFinale() {
    if (finaleTriggeredRef.current) return
    finaleTriggeredRef.current = true
    setPhase('finale')
    setFinaleStep(0)
    moveCamera(VIEW_FINALE)

    gsap
      .timeline()
      .call(() => setBurstActive(true))
      .to(lightBurstRef.current, { intensity: 1.6, duration: 0.5 }, '+=0.3')
      .to(lightBurstRef.current, { intensity: 0.3, duration: 1.2 })
  }

  function handleFinaleContinue() {
    if (finaleStep >= 2) {
      setPhase('done')
      onSolved()
      return
    }
    setFinaleStep((step) => step + 1)
  }

  return (
    <div className="relative h-full w-full">
      <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true }}>
        <CoveCamera cameraRef={cameraRef} lookTargetRef={lookTargetRef} />
        <HiddenCoveEnvironment />

        <group position={[0.3, 1, 0]}>
          <pointLight ref={lightBurstRef} intensity={0} color="#ffd27a" distance={7} />
          <CoveBurstParticles active={burstActive} />
        </group>

        <SceneEffects />
      </Canvas>

      {/* chapter progress */}
      {phase === 'section-intro' || phase === 'question' ? (
        <div className="pointer-events-none absolute inset-x-0 top-4 z-10 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2 rounded-full border border-parchment-200/15 bg-ocean-950/55 px-3 py-1.5 backdrop-blur">
            <Compass size={13} className="text-gold-400" />
            <span className="font-display text-[11px] font-semibold tracking-widest text-gold-300 uppercase">
              {t(current.sectionTitle)} · {current.indexInSection + 1}/{current.sectionLength}
            </span>
          </div>
          <div className="flex gap-1.5">
            {sections.map((section, index) => (
              <span
                key={section.id}
                className={`h-1.5 w-6 rounded-full transition-colors duration-300 ${
                  index < current.sectionIndex
                    ? 'bg-gold-400'
                    : index === current.sectionIndex
                      ? 'bg-gold-400/60'
                      : 'bg-parchment-200/20'
                }`}
              />
            ))}
          </div>
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {phase === 'section-intro' ? (
          <motion.div
            key={`section-${current.sectionId}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={handleSectionIntroContinue}
            className="absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-center gap-2 px-6 text-center"
          >
            <span className="font-display text-xs font-semibold tracking-[0.3em] text-gold-300/80 uppercase">
              {t(uiStrings.littleThingsPart)} {current.sectionIndex + 1}/{sections.length}
            </span>
            <h2 className="font-display text-2xl font-bold text-parchment-100 sm:text-3xl">
              {t(current.sectionTitle)}
            </h2>
          </motion.div>
        ) : null}

        {phase === 'question' ? (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="pointer-events-auto absolute inset-x-0 bottom-6 z-10 flex justify-center px-4"
          >
            <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:max-w-lg sm:p-7">
              <div className="pointer-events-none absolute -top-12 right-10 h-32 w-32 rounded-full bg-gold-400/15 blur-2xl" />
              <LittleThingsCard interaction={current} microVariant={current.sectionMicro} onContinue={handleAnswer} />
            </div>
          </motion.div>
        ) : null}

        {phase === 'finale' ? (
          <motion.div
            key={`finale-${finaleStep}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5 }}
            className="pointer-events-auto absolute inset-x-0 top-6 bottom-6 z-10 flex items-center justify-center px-4"
          >
            <div className="max-h-full w-full max-w-lg space-y-5 overflow-y-auto rounded-3xl border border-white/15 bg-white/10 p-7 text-center shadow-[0_20px_60px_-20px_rgba(0,0,0,0.75)] backdrop-blur-xl">
              {finaleStep === 0 ? (
                <p className="font-serif text-lg text-parchment-100 italic">{t(outro.intro)}</p>
              ) : null}

              {finaleStep === 1 ? (
                <div className="flex flex-wrap justify-center gap-2">
                  {keywords.map((keyword, index) => (
                    <motion.span
                      key={`${index}-${t(keyword)}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.04 }}
                      className="rounded-full border border-gold-400/40 bg-white/5 px-3 py-1 font-display text-xs tracking-wide text-parchment-100"
                    >
                      {t(keyword)}
                    </motion.span>
                  ))}
                </div>
              ) : null}

              {finaleStep === 2 ? (
                <div className="space-y-2">
                  {outro.reflect.map((line, index) => (
                    <p key={index} className="font-serif text-lg text-parchment-100 italic">
                      {t(line)}
                    </p>
                  ))}
                </div>
              ) : null}

              <Button icon={Sparkles} onClick={handleFinaleContinue}>
                {finaleStep >= 2 ? t(uiStrings.continueLabel) : t(uiStrings.next)}
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
