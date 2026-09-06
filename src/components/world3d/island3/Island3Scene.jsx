import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { AnimatePresence, motion } from 'framer-motion'
import { Bot } from 'lucide-react'
import gsap from 'gsap'
import { useGame, useTranslation } from '../../../hooks/useGame.js'
import { uiStrings } from '../../../data/uiStrings.js'
import { AI_REACTIONS, COMBO_LABELS, island3Copy } from '../../../data/quizAssets.js'
import { SceneEffects } from '../SceneEffects.jsx'
import { Island3Environment, CrystalCore } from './Island3Environment.jsx'
import { QuizCard } from './QuizCard.jsx'

// Transition waypoints: leaving Island 2's warm glow (tight, orange fog) ->
// climbing and clearing the fog -> crossing open ocean -> diving into the
// arena with a light flash -> settling on the resting shot. camera.position
// + fog.near/far are tweened together so the "leaving one place, arriving
// somewhere else" read comes from color as much as motion.
const T_START = { cam: { x: -6, y: 3, z: 40 }, look: { x: 0, y: 1, z: 0 }, fog: { near: 3, far: 18, color: '#e8956b' } }
const T_CLIMB = { cam: { x: -2, y: 10, z: 26 }, look: { x: 0, y: 0, z: 0 }, fog: { near: 10, far: 60, color: '#6a5a9c' } }
const T_CROSS = { cam: { x: 2, y: 5, z: 15 }, look: { x: 0, y: 0.5, z: 0 }, fog: { near: 8, far: 40, color: '#4a3d7c' } }
const T_DIVE = { cam: { x: 1, y: 2.2, z: 6 }, look: { x: 0, y: 0.6, z: 0 }, fog: { near: 5, far: 26, color: '#4a3d7c' } }
const REST_CAM = { x: 1, y: 5, z: 9 }
const REST_LOOK = { x: 0.4, y: 0.4, z: 0 }
const WIDE_CAM = { x: 0, y: 8, z: 13 }
const WIDE_LOOK = { x: 0, y: 0.5, z: 0 }

function CoveCamera3({ cameraRef, lookTargetRef }) {
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
      fov={50}
      position={[T_START.cam.x, T_START.cam.y, T_START.cam.z]}
      near={0.1}
      far={220}
    />
  )
}

function TwilightFog({ fogRef }) {
  return <fog ref={fogRef} attach="fog" args={[T_START.fog.color, T_START.fog.near, T_START.fog.far]} />
}

// 8 small glowing orbs that scale in around the crystal core once `active`,
// staggered, then keep drifting slowly — the "energy fragments" from the
// spec's ending sequence, simplified to an orbit-forming-a-ring effect
// rather than literally flying in from the 2D pip bar's screen position.
function OrbitingFragments({ active }) {
  const groupRef = useRef(null)
  const startRef = useRef(null)

  useFrame(({ clock }) => {
    const group = groupRef.current
    if (!group) return
    if (active && startRef.current === null) startRef.current = clock.getElapsedTime()
    if (!active) {
      startRef.current = null
      group.children.forEach((child) => child.scale.setScalar(0))
      return
    }
    const elapsed = clock.getElapsedTime() - startRef.current
    group.rotation.y = elapsed * 0.4
    group.children.forEach((child, index) => {
      const delay = index * 0.12
      const local = Math.max(0, Math.min(1, (elapsed - delay) / 0.5))
      child.scale.setScalar(local)
    })
  })

  const fragments = useMemo(() => Array.from({ length: 8 }), [])

  return (
    <group ref={groupRef} position={[0, 1.6, 0]}>
      {fragments.map((_, index) => {
        const angle = (index / 8) * Math.PI * 2
        return (
          <mesh key={index} position={[Math.cos(angle) * 2.1, 0, Math.sin(angle) * 2.1]}>
            <octahedronGeometry args={[0.16, 0]} />
            <meshStandardMaterial color="#f0c675" emissive="#f0c675" emissiveIntensity={1.4} roughness={0.3} />
          </mesh>
        )
      })}
    </group>
  )
}

function getScoreLines(score) {
  if (score >= 7) return island3Copy.scoreHigh
  if (score >= 4) return island3Copy.scoreMid
  return island3Copy.scoreLow
}

// The whole of Island 3: cinematic hand-off from Island 2, an arena
// environment, an 8-question picture quiz with combo/AI-reaction feedback,
// and a cinematic ending that teases (but does not implement) Island 4.
// `onSolved` — IslandPage's `handleLessonSolved` — is only called at the
// very end, after the Island 4 teaser, so the standard fragment-reveal /
// "return to ship" flow picks up exactly like every other island.
export function Island3Scene({ lesson, onSolved, secretModeUnlocked = false }) {
  const { t } = useTranslation()
  const { recordIsland3Result } = useGame()
  const questions = lesson.data.questions

  const [phase, setPhase] = useState('transition') // transition|title|ai-intro|quiz|ending|results|teaser
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedId, setSelectedId] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [answerLog, setAnswerLog] = useState([]) // 'correct' | 'wrong', one per question
  const [streak, setStreak] = useState(0)
  const [aiText, setAiText] = useState(null)
  const [comboLabel, setComboLabel] = useState(null)
  const [flash, setFlash] = useState(false)

  const cameraRef = useRef(null)
  const lookTargetRef = useRef({ ...T_START.look })
  const fogRef = useRef(null)
  const glowBoostRef = useRef(0)
  const skipRef = useRef(null)
  const advanceTimeoutRef = useRef(null)
  // Per-question answer records (time/choice/category) — never re-rendered
  // on, only read once the quiz ends to feed Island 4's prediction engine.
  const answerRecordsRef = useRef([])
  const questionStartRef = useRef(Date.now())
  const resultRecordedRef = useRef(false)

  const question = questions[questionIndex]
  const score = answerLog.filter((entry) => entry === 'correct').length
  const introLines = secretModeUnlocked ? [...island3Copy.aiIntro, island3Copy.aiIntroSecret] : island3Copy.aiIntro

  // --- cinematic hand-off, skippable by click or Space ---
  useEffect(() => {
    let raf = null
    let timeline = null

    // Refs attached to elements inside <Canvas> aren't guaranteed to be
    // populated in the same commit as this outer component's mount effect
    // (R3F's reconciler ticks separately) — retry each frame until they are,
    // rather than silently giving up and leaving the scene frozen.
    function trySetup() {
      const camera = cameraRef.current
      const fog = fogRef.current
      if (!camera || !fog) {
        raf = requestAnimationFrame(trySetup)
        return
      }

      camera.position.set(T_START.cam.x, T_START.cam.y, T_START.cam.z)
      fog.near = T_START.fog.near
      fog.far = T_START.fog.far
      fog.color.set(T_START.fog.color)

      timeline = gsap.timeline({
        delay: 0.5,
        onComplete: () => setPhase((p) => (p === 'transition' ? 'title' : p)),
      })
      skipRef.current = timeline

      function leg(target, duration, ease) {
        timeline
          .to(camera.position, { ...target.cam, duration, ease }, '<')
          .to(lookTargetRef.current, { ...target.look, duration, ease }, '<')
          .to(fog, { near: target.fog.near, far: target.fog.far, duration, ease }, '<')
          .to(
            fog.color,
            { r: hexToRgb(target.fog.color).r, g: hexToRgb(target.fog.color).g, b: hexToRgb(target.fog.color).b, duration, ease },
            '<',
          )
      }
      leg(T_CLIMB, 1.3, 'power1.inOut')
      leg(T_CROSS, 1.2, 'power1.inOut')
      leg(T_DIVE, 1, 'power2.in')
      timeline.call(() => {
        setFlash(true)
        setTimeout(() => setFlash(false), 260)
      })
      timeline
        .to(camera.position, { ...REST_CAM, duration: 0.9, ease: 'power3.out' })
        .to(lookTargetRef.current, { ...REST_LOOK, duration: 0.9, ease: 'power3.out' }, '<')
        .to(fog, { near: 6, far: 24, duration: 0.9, ease: 'power3.out' }, '<')
    }

    trySetup()
    return () => {
      if (raf) cancelAnimationFrame(raf)
      timeline?.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (phase !== 'transition') return
    function skip() {
      skipRef.current?.kill()
      const camera = cameraRef.current
      const fog = fogRef.current
      if (camera) camera.position.set(REST_CAM.x, REST_CAM.y, REST_CAM.z)
      lookTargetRef.current = { ...REST_LOOK }
      if (fog) {
        fog.near = 6
        fog.far = 24
        fog.color.set('#4a3d7c')
      }
      setPhase('title')
    }
    function handleKey(event) {
      if (event.code === 'Space') skip()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [phase])

  // title -> ai-intro
  useEffect(() => {
    if (phase !== 'title') return
    const timeout = setTimeout(() => setPhase('ai-intro'), 2600)
    return () => clearTimeout(timeout)
  }, [phase])

  useEffect(() => () => clearTimeout(advanceTimeoutRef.current), [])

  // Restart the per-question stopwatch every time a fresh question is shown.
  useEffect(() => {
    if (phase === 'quiz') questionStartRef.current = Date.now()
  }, [phase, questionIndex])

  function handleSelect(optionId) {
    if (answered) return
    setSelectedId(optionId)
    setAnswered(true)

    const correct = optionId === question.correctOptionId
    answerRecordsRef.current[questionIndex] = {
      correct,
      elapsedMs: Date.now() - questionStartRef.current,
      optionIndex: question.options.findIndex((option) => option.id === optionId),
      category: question.category,
      layout: question.layout,
    }
    setAnswerLog((log) => {
      const next = [...log]
      next[questionIndex] = correct ? 'correct' : 'wrong'
      return next
    })

    if (correct) {
      const nextStreak = streak + 1
      setStreak(nextStreak)
      glowBoostRef.current = 1.5
      if (nextStreak >= 2) {
        setComboLabel(COMBO_LABELS[Math.min(nextStreak, 5)])
        setTimeout(() => setComboLabel(null), 1300)
      }
      const pool = nextStreak >= 3 ? AI_REACTIONS.streak : AI_REACTIONS.correct
      setAiText(t(pool[Math.floor(Math.random() * pool.length)]))
    } else {
      setStreak(0)
      setAiText(t(AI_REACTIONS.wrong[Math.floor(Math.random() * AI_REACTIONS.wrong.length)]))
    }

    advanceTimeoutRef.current = setTimeout(() => {
      glowBoostRef.current = 0
      const nextIndex = questionIndex + 1
      if (nextIndex >= questions.length) {
        setPhase('ending')
        return
      }
      setQuestionIndex(nextIndex)
      setSelectedId(null)
      setAnswered(false)
      // The last question gets its own small cinematic beat — a brief
      // dolly-in-and-settle — instead of just cutting to another card.
      if (questions[nextIndex]?.cinematic) {
        const camera = cameraRef.current
        if (camera) {
          gsap.to(camera.position, {
            x: REST_CAM.x * 0.7,
            y: REST_CAM.y * 0.85,
            z: REST_CAM.z * 0.8,
            duration: 0.8,
            ease: 'power2.out',
            yoyo: true,
            repeat: 1,
          })
        }
      }
      setAiText(null)
    }, 1000)
  }

  // ending cinematic -> results
  useEffect(() => {
    if (phase !== 'ending') return
    const camera = cameraRef.current
    if (camera) {
      gsap.to(camera.position, { ...WIDE_CAM, duration: 1.4, ease: 'power2.inOut' })
      gsap.to(lookTargetRef.current, { ...WIDE_LOOK, duration: 1.4, ease: 'power2.inOut' })
    }
    // Hand the run's stats off to the store once, so Island 4's "AI guesses
    // you" predictions have real behavior to draw from.
    if (!resultRecordedRef.current) {
      resultRecordedRef.current = true
      recordIsland3Result(summarizeAnswerRecords(answerRecordsRef.current))
    }
    const timeout = setTimeout(() => setPhase('results'), 3400)
    return () => clearTimeout(timeout)
  }, [phase])

  const scoreLines = getScoreLines(score)

  return (
    <div className="relative h-full w-full">
      <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true }}>
        <CoveCamera3 cameraRef={cameraRef} lookTargetRef={lookTargetRef} />
        <TwilightFog fogRef={fogRef} />
        <Island3Environment />
        <CrystalCore ref={glowBoostRef} />
        <OrbitingFragments active={phase === 'ending' || phase === 'results' || phase === 'teaser'} />
        <SceneEffects />
      </Canvas>

      {/* transition skip hint + flash */}
      {phase === 'transition' ? (
        <button
          type="button"
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }))}
          className="absolute inset-0 z-30 flex items-end justify-center pb-8"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="rounded-full border border-parchment-200/20 bg-ocean-950/50 px-4 py-1.5 text-xs text-parchment-200/70 backdrop-blur"
          >
            {t(island3Copy.skipHint)}
          </motion.span>
        </button>
      ) : null}
      <AnimatePresence>
        {flash ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute inset-0 z-40 bg-white"
          />
        ) : null}
      </AnimatePresence>

      {/* title card */}
      <AnimatePresence>
        {phase === 'title' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center bg-ocean-950/30 text-center"
          >
            <p className="mb-2 font-display text-sm tracking-[0.35em] text-violet-300">{t(island3Copy.eyebrow)}</p>
            <h1 className="font-display text-3xl text-parchment-100 sm:text-4xl">{t(island3Copy.title)}</h1>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* AI intro */}
      <AnimatePresence>
        {phase === 'ai-intro' ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-4 px-4"
          >
            <div className="w-full max-w-md rounded-3xl border border-white/15 bg-white/10 p-5 text-center backdrop-blur-xl">
              <DialogBoxLite lines={introLines} onDone={() => setPhase('ai-ready')} t={t} />
            </div>
          </motion.div>
        ) : null}
        {phase === 'ai-ready' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-x-0 bottom-10 z-20 flex justify-center"
          >
            <button
              type="button"
              onClick={() => setPhase('quiz')}
              className="rounded-full border border-gold-400/60 bg-gradient-to-b from-gold-400 to-gold-600 px-8 py-3 font-display text-sm tracking-[0.2em] text-ink-900 shadow-[0_10px_30px_-8px_rgba(211,162,74,0.7)] transition-transform hover:scale-105 active:scale-95"
            >
              {t(island3Copy.startButton)}
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* quiz progress pips */}
      {phase === 'quiz' ? (
        <div className="pointer-events-none absolute inset-x-0 top-4 z-10 flex flex-col items-center gap-2">
          <p className="font-display text-xs tracking-[0.3em] text-violet-200/80">
            {t(island3Copy.eyebrow)} · {String(questionIndex + 1).padStart(2, '0')} / {String(questions.length).padStart(2, '0')}
          </p>
          <div className="flex gap-1.5">
            {questions.map((q, index) => (
              <span
                key={q.id}
                className={`h-2 w-2 rounded-full transition-colors ${
                  answerLog[index] === 'correct'
                    ? 'bg-gold-400 shadow-[0_0_6px_rgba(232,195,104,0.8)]'
                    : answerLog[index] === 'wrong'
                      ? 'bg-red-400/70'
                      : index === questionIndex
                        ? 'bg-parchment-100/60'
                        : 'bg-parchment-200/20'
                }`}
              />
            ))}
          </div>
        </div>
      ) : null}

      {/* combo badge */}
      <AnimatePresence>
        {comboLabel ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            className="pointer-events-none absolute left-1/2 top-16 z-20 -translate-x-1/2 rounded-full border border-gold-400/60 bg-ocean-950/70 px-4 py-1.5 font-display text-sm text-gold-300 backdrop-blur"
          >
            {comboLabel}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* AI corner reaction */}
      {phase === 'quiz' ? (
        <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex items-end gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-500/25 text-violet-200 ring-1 ring-violet-300/40">
            <Bot size={16} />
          </span>
          <AnimatePresence mode="wait">
            {aiText ? (
              <motion.span
                key={aiText}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl rounded-bl-sm border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-parchment-100 backdrop-blur-md"
              >
                {aiText}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </div>
      ) : null}

      {/* question card */}
      <AnimatePresence mode="wait">
        {phase === 'quiz' ? (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.98 }}
            transition={{ duration: 0.35 }}
            className="pointer-events-auto absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-4 px-4 pb-6 sm:px-8"
          >
            <p
              className={`max-w-lg text-center font-display sm:text-2xl ${
                question.cinematic
                  ? 'text-xl text-gold-200 drop-shadow-[0_0_18px_rgba(240,198,117,0.6)] sm:text-3xl'
                  : 'text-lg text-parchment-100'
              }`}
            >
              {question.category} {t(question.prompt)}
            </p>

            {question.layout === 'image-question' ? (
              <div className="h-28 w-full max-w-xs overflow-hidden rounded-2xl border border-white/15 shadow-[0_10px_40px_-14px_rgba(0,0,0,0.7)] sm:h-36 sm:max-w-sm">
                <QuestionImage image={question.image} />
              </div>
            ) : null}

            <div className="grid w-full max-w-xl grid-cols-2 gap-3">
              {question.options.map((option, index) => {
                const letter = String.fromCharCode(65 + index)
                const isSelected = selectedId === option.id
                const isCorrectOption = option.id === question.correctOptionId
                let state = 'idle'
                if (answered) {
                  if (isSelected && isCorrectOption) state = 'correct'
                  else if (isSelected) state = 'wrong'
                  else if (isCorrectOption) state = 'correct'
                  else state = 'dimmed'
                }
                return (
                  <QuizCard
                    key={option.id}
                    letter={letter}
                    emoji={option.emoji}
                    label={t(option.text)}
                    state={state}
                    disabled={answered}
                    onSelect={() => handleSelect(option.id)}
                  />
                )
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* ending cinematic AI lines */}
      <AnimatePresence>
        {phase === 'ending' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-x-0 bottom-10 z-20 flex flex-col items-center gap-1 text-center"
          >
            {island3Copy.endingLines.map((line, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 1.1 }}
                className="font-display text-lg text-parchment-100"
              >
                {t(line)}
              </motion.p>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* results */}
      <AnimatePresence>
        {phase === 'results' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 z-20 flex items-center justify-center px-4"
          >
            <div className="w-full max-w-sm rounded-3xl border border-white/15 bg-white/10 p-7 text-center backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.75)]">
              <p className="mb-1 font-display text-xs tracking-[0.3em] text-violet-300">{t(island3Copy.resultsTitle)}</p>
              <p className="mb-4 font-display text-4xl text-parchment-100">
                {score} / {questions.length}
              </p>
              <p className="mb-1 text-sm text-parchment-200/90">{t(island3Copy.scoreGeneric)}</p>
              {scoreLines.map((line, index) => (
                <p key={index} className="text-sm text-parchment-200/70 italic">
                  {t(line)}
                </p>
              ))}
              <button
                type="button"
                onClick={() => setPhase('teaser')}
                className="mt-6 rounded-full border border-gold-400/60 bg-gradient-to-b from-gold-400 to-gold-600 px-8 py-3 font-display text-sm tracking-[0.2em] text-ink-900 shadow-[0_10px_30px_-8px_rgba(211,162,74,0.7)] transition-transform hover:scale-105 active:scale-95"
              >
                {t(island3Copy.continueButton)}
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Island 4 teaser */}
      <AnimatePresence>
        {phase === 'teaser' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 bg-ocean-950/50 px-4 text-center"
          >
            <div>
              {island3Copy.island4Lines.map((line, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.9 }}
                  className="font-display text-base text-parchment-100"
                >
                  {t(line)}
                </motion.p>
              ))}
            </div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2 }}>
              <p className="mb-1 font-display text-xs tracking-[0.35em] text-violet-300">{t(island3Copy.island4Eyebrow)}</p>
              <h2 className="mb-6 font-display text-2xl text-parchment-100 sm:text-3xl">{t(island3Copy.island4Title)}</h2>
              <button
                type="button"
                onClick={onSolved}
                className="rounded-full border border-gold-400/60 bg-gradient-to-b from-gold-400 to-gold-600 px-8 py-3 font-display text-sm tracking-[0.2em] text-ink-900 shadow-[0_10px_30px_-8px_rgba(211,162,74,0.7)] transition-transform hover:scale-105 active:scale-95"
              >
                {t(uiStrings.continueLabel)}
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

// Minimal click-to-advance line reader, same shape as DialogBox's
// interaction but undecorated (no ParchmentPanel) so it sits naturally
// inside the frosted glass panel used throughout Island 3.
function DialogBoxLite({ lines, onDone, t }) {
  const [index, setIndex] = useState(0)
  const isLast = index === lines.length - 1
  return (
    <button
      type="button"
      onClick={() => (isLast ? onDone() : setIndex((i) => i + 1))}
      className="block w-full cursor-pointer text-center"
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="min-h-10 font-body text-base text-parchment-100"
        >
          {t(lines[index])}
        </motion.p>
      </AnimatePresence>
      <div className="mt-3 flex justify-center gap-1.5">
        {lines.map((_, dot) => (
          <span key={dot} className={`h-1.5 w-1.5 rounded-full ${dot === index ? 'bg-gold-400' : 'bg-parchment-100/25'}`} />
        ))}
      </div>
    </button>
  )
}

function QuestionImage({ image }) {
  const [failed, setFailed] = useState(false)
  if (!image || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-ocean-900 text-5xl">
        {image?.fallbackEmoji ?? '🖼️'}
      </div>
    )
  }
  return (
    <img
      src={image.src}
      alt={image.alt ?? ''}
      onError={() => setFailed(true)}
      loading="lazy"
      className="h-full w-full object-cover"
    />
  )
}

// Rolls the raw per-question records into the aggregate shape stored in
// `state.island3Result` — this is the only "profile data" Island 4 has to
// work with, so keep it cheap, deterministic, and free of any question ids
// (the prediction engine only ever needs the shape, not the source quiz).
function summarizeAnswerRecords(records) {
  const clean = records.filter(Boolean)
  const total = clean.length
  const score = clean.filter((entry) => entry.correct).length
  const avgAnswerTimeMs = total ? Math.round(clean.reduce((sum, entry) => sum + entry.elapsedMs, 0) / total) : 0
  const firstOptionPicks = clean.filter((entry) => entry.optionIndex === 0).length
  const imageEntries = clean.filter((entry) => entry.layout === 'image-question')
  const worldEntries = clean.filter((entry) => entry.category === '🌍')
  const animalEntries = clean.filter((entry) => entry.category === '🐘')
  return {
    score,
    total,
    avgAnswerTimeMs,
    firstOptionPicks,
    imageCorrect: imageEntries.filter((entry) => entry.correct).length,
    imageTotal: imageEntries.length,
    worldCorrect: worldEntries.filter((entry) => entry.correct).length,
    worldTotal: worldEntries.length,
    animalCorrect: animalEntries.filter((entry) => entry.correct).length,
    animalTotal: animalEntries.length,
  }
}

function hexToRgb(hex) {
  const value = hex.replace('#', '')
  return {
    r: parseInt(value.slice(0, 2), 16) / 255,
    g: parseInt(value.slice(2, 4), 16) / 255,
    b: parseInt(value.slice(4, 6), 16) / 255,
  }
}
