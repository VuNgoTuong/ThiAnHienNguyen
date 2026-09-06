import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import { useGame, useTranslation } from '../../../hooks/useGame.js'
import { uiStrings } from '../../../data/uiStrings.js'
import { island4Copy } from '../../../data/island4Predictions.js'
import { buildPlayerProfile, getRoundPrediction, pickReactionLines, pickThinkingLine } from '../../../utils/predictionEngine.js'
import { SceneEffects } from '../SceneEffects.jsx'
import { Island4Environment, AICore } from './Island4Environment.jsx'
import { PredictionCard } from './PredictionCard.jsx'
import { AIThinking } from './AIThinking.jsx'

const ROUND_COUNT = 7

// Departure waypoint intentionally mirrors Island 3's resting shot/fog color
// (see Island3Scene's REST_CAM/fog) so the hand-off reads as one continuous
// flight rather than a hard cut into a new file. From there the fog cools
// from violet through open ocean into Island 4's cyan palette.
const T_START = { cam: { x: 1, y: 5, z: 9 }, look: { x: 0.4, y: 0.4, z: 0 }, fog: { near: 6, far: 24, color: '#4a3d7c' } }
const T_RISE = { cam: { x: -4, y: 13, z: 24 }, look: { x: 0, y: 2, z: -4 }, fog: { near: 12, far: 70, color: '#1c2f46' } }
const T_OCEAN = { cam: { x: 5, y: 9, z: 36 }, look: { x: 0, y: 1, z: -10 }, fog: { near: 16, far: 90, color: '#123a52' } }
const T_ARRIVE = { cam: { x: 1.5, y: 4.5, z: 15 }, look: { x: 0, y: 1.3, z: 0 }, fog: { near: 7, far: 30, color: '#123a52' } }
const REST_CAM = { x: 0, y: 3.4, z: 7.6 }
const REST_LOOK = { x: 0, y: 1.4, z: 0 }
const WIDE_CAM = { x: 0, y: 8.5, z: 15 }
const WIDE_LOOK = { x: 0, y: 1, z: 0 }
const FAR_CAM = { x: -10, y: 6.5, z: 20 }
const FAR_LOOK = { x: -22, y: 1.5, z: -52 }

function Island4Camera({ cameraRef, lookTargetRef }) {
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
      far={240}
    />
  )
}

function DeepFog({ fogRef }) {
  return <fog ref={fogRef} attach="fog" args={[T_START.fog.color, T_START.fog.near, T_START.fog.far]} />
}

function getResultsLines(aiScore, playerScore) {
  if (aiScore > playerScore) return island4Copy.aiWinsLines
  if (playerScore > aiScore) return island4Copy.playerWinsLines
  return island4Copy.tieLines
}

// Island 4: cinematic hand-off from Island 3's Quiz Arena into the AI Room,
// a 7-round "AI guesses you" mini-game driven by predictionEngine.js, and a
// closing beat that teases (never implements) Island 5. `onSolved` — same
// contract as every other island's — only fires after the player clicks
// through the final teaser, so fragment-reveal/return-to-ship still works
// exactly like Island 1-3.
export function Island4Scene({ onSolved, secretModeUnlocked = false }) {
  const { t } = useTranslation()
  const { state, recordIsland4Result } = useGame()
  // Island 3's result is already final by the time a player reaches here —
  // computing the profile once at mount keeps every round's prediction
  // stable instead of re-rolling mid-game.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const profile = useMemo(() => buildPlayerProfile(state), [])

  const [phase, setPhase] = useState('transition')
  // transition|greeting|title|ai-intro|ai-ready|round|results|teaser|outro
  const [roundNumber, setRoundNumber] = useState(1)
  const [roundStage, setRoundStage] = useState('thinking') // pre-final|thinking|reveal|answered
  const [predictionDef, setPredictionDef] = useState(null)
  const [thinkingLineObj, setThinkingLineObj] = useState(null)
  const [reactionLineObjs, setReactionLineObjs] = useState([])
  const [answerable, setAnswerable] = useState(false)
  const [aiScore, setAiScore] = useState(0)
  const [playerScore, setPlayerScore] = useState(0)
  const [roundResults, setRoundResults] = useState([]) // { round, outcome, icon }
  const [consecutiveAiWrong, setConsecutiveAiWrong] = useState(0)
  const [consecutiveAiCorrect, setConsecutiveAiCorrect] = useState(0)
  const [flash, setFlash] = useState(false)

  const cameraRef = useRef(null)
  const lookTargetRef = useRef({ ...T_START.look })
  const fogRef = useRef(null)
  const glowBoostRef = useRef(0)
  const skipRef = useRef(null)
  const roundTimeoutRef = useRef(null)
  const resultRecordedRef = useRef(false)

  const greetingLines = secretModeUnlocked ? [...island4Copy.approachLines, island4Copy.approachLinesSecret] : island4Copy.approachLines

  // --- cinematic hand-off from Island 3, skippable by click or Space ---
  useEffect(() => {
    let raf = null
    let timeline = null

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
        onComplete: () => setPhase((p) => (p === 'transition' ? 'greeting' : p)),
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
      leg(T_RISE, 1.4, 'power1.inOut')
      leg(T_OCEAN, 1.3, 'power1.inOut')
      leg(T_ARRIVE, 1.1, 'power2.in')
      timeline.call(() => {
        setFlash(true)
        setTimeout(() => setFlash(false), 240)
      })
      timeline
        .to(camera.position, { ...REST_CAM, duration: 0.9, ease: 'power3.out' })
        .to(lookTargetRef.current, { ...REST_LOOK, duration: 0.9, ease: 'power3.out' }, '<')
        .to(fog, { near: 7, far: 30, duration: 0.9, ease: 'power3.out' }, '<')
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
        fog.near = 7
        fog.far = 30
        fog.color.set('#123a52')
      }
      setPhase('greeting')
    }
    function handleKey(event) {
      if (event.code === 'Space') skip()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [phase])

  // title -> ai-intro (auto-advance, same beat as every other island's title card)
  useEffect(() => {
    if (phase !== 'title') return
    const timeout = setTimeout(() => setPhase('ai-intro'), 2200)
    return () => clearTimeout(timeout)
  }, [phase])

  useEffect(() => () => clearTimeout(roundTimeoutRef.current), [])

  function beginThinkingStage(number) {
    const pred = getRoundPrediction(profile, number)
    setPredictionDef(pred)
    setThinkingLineObj(pred.thinkingLine ?? pickThinkingLine())
    setReactionLineObjs([])
    setAnswerable(false)
    setRoundStage('thinking')
    roundTimeoutRef.current = setTimeout(() => {
      setRoundStage('reveal')
      roundTimeoutRef.current = setTimeout(() => setAnswerable(true), 400)
    }, 1000)
  }

  function beginRound(number) {
    setRoundNumber(number)
    if (number === ROUND_COUNT) {
      setRoundStage('pre-final')
      return
    }
    beginThinkingStage(number)
  }

  function handleAnswer(isTrue) {
    if (!answerable || !predictionDef) return
    setAnswerable(false)
    const outcome = isTrue ? 'ai-correct' : 'ai-wrong'
    const nextWrongStreak = outcome === 'ai-wrong' ? consecutiveAiWrong + 1 : 0
    const nextCorrectStreak = outcome === 'ai-correct' ? consecutiveAiCorrect + 1 : 0
    setConsecutiveAiWrong(nextWrongStreak)
    setConsecutiveAiCorrect(nextCorrectStreak)
    setRoundResults((list) => [...list, { round: roundNumber, outcome, icon: predictionDef.icon, isTrue }])
    if (outcome === 'ai-correct') setAiScore((s) => s + 1)
    else setPlayerScore((s) => s + 1)
    setReactionLineObjs(pickReactionLines(outcome, nextWrongStreak, nextCorrectStreak))
    glowBoostRef.current = outcome === 'ai-correct' ? 1.3 : -0.7
    setRoundStage('answered')
    roundTimeoutRef.current = setTimeout(() => {
      glowBoostRef.current = 0
      if (roundNumber >= ROUND_COUNT) {
        setPhase('results')
      } else {
        beginRound(roundNumber + 1)
      }
    }, 1600)
  }

  // results: pull back to a wide shot, dim the AI Core, record the outcome once.
  useEffect(() => {
    if (phase !== 'results') return
    const camera = cameraRef.current
    if (camera) {
      gsap.to(camera.position, { ...WIDE_CAM, duration: 1.4, ease: 'power2.inOut' })
      gsap.to(lookTargetRef.current, { ...WIDE_LOOK, duration: 1.4, ease: 'power2.inOut' })
    }
    glowBoostRef.current = -1
    if (!resultRecordedRef.current) {
      resultRecordedRef.current = true
      recordIsland4Result({ aiScore, playerScore, rounds: roundResults })
    }
    return () => {
      glowBoostRef.current = 0
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  // teaser: brighten the Core again, drift slowly toward the distant Island 5.
  useEffect(() => {
    if (phase !== 'teaser') return
    const camera = cameraRef.current
    if (camera) {
      gsap.to(camera.position, { ...FAR_CAM, duration: 5, ease: 'power1.inOut' })
      gsap.to(lookTargetRef.current, { ...FAR_LOOK, duration: 5, ease: 'power1.inOut' })
    }
    glowBoostRef.current = 1
    return () => {
      glowBoostRef.current = 0
    }
  }, [phase])

  // outro: fade to black, then hand off to IslandPage's fragment/complete flow.
  useEffect(() => {
    if (phase !== 'outro') return
    const timeout = setTimeout(() => onSolved(), 950)
    return () => clearTimeout(timeout)
  }, [phase, onSolved])

  const resultsLines = getResultsLines(aiScore, playerScore)

  return (
    <div className="relative h-full w-full">
      <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true }}>
        <Island4Camera cameraRef={cameraRef} lookTargetRef={lookTargetRef} />
        <DeepFog fogRef={fogRef} />
        <Island4Environment />
        <AICore ref={glowBoostRef} />
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
            {t(island4Copy.skipHint)}
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

      {/* greeting: "Lần này... Bạn không trả lời. Để tôi thử đoán." */}
      <AnimatePresence>
        {phase === 'greeting' ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-4 px-4"
          >
            <div className="w-full max-w-md rounded-3xl border border-white/15 bg-white/10 p-5 text-center backdrop-blur-xl">
              <DialogBoxLite lines={greetingLines} onDone={() => setPhase('title')} t={t} />
            </div>
          </motion.div>
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
            <p className="mb-2 font-display text-sm tracking-[0.35em] text-cyan-300">{t(island4Copy.eyebrow)}</p>
            <h1 className="font-display text-3xl text-parchment-100 sm:text-4xl">{t(island4Copy.title)}</h1>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* AI intro (rules) */}
      <AnimatePresence>
        {phase === 'ai-intro' ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-4 px-4"
          >
            <div className="w-full max-w-md rounded-3xl border border-white/15 bg-white/10 p-5 text-center backdrop-blur-xl">
              <DialogBoxLite lines={island4Copy.aiIntro} onDone={() => setPhase('ai-ready')} t={t} />
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
              onClick={() => {
                setPhase('round')
                beginRound(1)
              }}
              className="rounded-full border border-gold-400/60 bg-gradient-to-b from-gold-400 to-gold-600 px-8 py-3 font-display text-sm tracking-[0.2em] text-ink-900 shadow-[0_10px_30px_-8px_rgba(211,162,74,0.7)] transition-transform hover:scale-105 active:scale-95"
            >
              {t(island4Copy.startButton)}
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* round progress pips */}
      {phase === 'round' ? (
        <div className="pointer-events-none absolute inset-x-0 top-4 z-10 flex flex-col items-center gap-2">
          <p className="font-display text-xs tracking-[0.3em] text-cyan-200/80">
            {t(island4Copy.eyebrow)} · {String(roundNumber).padStart(2, '0')} / {String(ROUND_COUNT).padStart(2, '0')}
          </p>
          <div className="flex gap-1.5">
            {Array.from({ length: ROUND_COUNT }).map((_, index) => {
              const result = roundResults[index]
              return (
                <span
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    result?.outcome === 'ai-correct'
                      ? 'bg-gold-400 shadow-[0_0_6px_rgba(232,195,104,0.8)]'
                      : result?.outcome === 'ai-wrong'
                        ? 'bg-red-400/70'
                        : index === roundNumber - 1
                          ? 'bg-parchment-100/60'
                          : 'bg-parchment-200/20'
                  }`}
                />
              )
            })}
          </div>
        </div>
      ) : null}

      {/* round 7 pre-intro dialogue */}
      <AnimatePresence>
        {phase === 'round' && roundStage === 'pre-final' ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-4 px-4"
          >
            <div className="w-full max-w-md rounded-3xl border border-white/15 bg-white/10 p-5 text-center backdrop-blur-xl">
              <DialogBoxLite lines={island4Copy.finalRoundIntro} onDone={() => beginThinkingStage(ROUND_COUNT)} t={t} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* AI thinking */}
      <AnimatePresence>
        {phase === 'round' && roundStage === 'thinking' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-x-0 bottom-16 z-20 flex justify-center"
          >
            <AIThinking text={thinkingLineObj ? t(thinkingLineObj) : ''} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* prediction card + reaction */}
      <AnimatePresence mode="wait">
        {phase === 'round' && (roundStage === 'reveal' || roundStage === 'answered') && predictionDef ? (
          <motion.div
            key={roundNumber}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-0 bottom-6 z-20 flex flex-col items-center gap-4"
          >
            <PredictionCard
              header={t(island4Copy.predictionHeader)}
              icon={predictionDef.icon}
              text={t(predictionDef.text)}
              trueLabel={t(island4Copy.trueLabel)}
              falseLabel={t(island4Copy.falseLabel)}
              answerable={answerable}
              onAnswer={handleAnswer}
            />
            <AnimatePresence>
              {roundStage === 'answered' && reactionLineObjs.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-0.5"
                >
                  {reactionLineObjs.map((line, index) => (
                    <p key={index} className="font-display text-sm text-cyan-100/90">
                      {t(line)}
                    </p>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* results: fragments row, then score */}
      <AnimatePresence>
        {phase === 'results' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 px-4 text-center"
          >
            <div className="flex gap-2.5">
              {roundResults.map((result, index) => (
                <motion.span
                  key={result.round}
                  initial={{ opacity: 0, scale: 0.4, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.15 * index, type: 'spring', stiffness: 260, damping: 18 }}
                  className={`flex h-11 w-11 items-center justify-center rounded-full border text-xl backdrop-blur-md ${
                    result.outcome === 'ai-correct'
                      ? 'border-gold-400/70 bg-gold-400/15 shadow-[0_0_18px_-4px_rgba(232,195,104,0.7)]'
                      : 'border-white/10 bg-white/5 opacity-50'
                  }`}
                >
                  {result.icon}
                </motion.span>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="w-full max-w-sm rounded-3xl border border-white/15 bg-white/10 p-7 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.75)]"
            >
              <p className="mb-1 font-display text-xs tracking-[0.3em] text-cyan-300">{t(island4Copy.resultsTitle)}</p>
              <div className="my-4 flex items-center justify-center gap-8">
                <div>
                  <p className="font-display text-3xl text-parchment-100">{aiScore}</p>
                  <p className="text-xs tracking-widest text-parchment-200/70">{t(island4Copy.aiScoreLabel)}</p>
                </div>
                <div className="h-8 w-px bg-white/15" />
                <div>
                  <p className="font-display text-3xl text-parchment-100">{playerScore}</p>
                  <p className="text-xs tracking-widest text-parchment-200/70">{t(island4Copy.playerScoreLabel)}</p>
                </div>
              </div>
              <p className="mb-1 text-xs tracking-wide text-parchment-200/70">
                {t(island4Copy.aiGuessedLabel)} {aiScore}/{ROUND_COUNT} · {t(island4Copy.playerFooledLabel)} {playerScore} {t(island4Copy.timesSuffix)}
              </p>
              {resultsLines.map((line, index) => (
                <p key={index} className="text-sm text-parchment-200/70 italic">
                  {t(line)}
                </p>
              ))}
              <button
                type="button"
                onClick={() => setPhase('teaser')}
                className="mt-6 rounded-full border border-gold-400/60 bg-gradient-to-b from-gold-400 to-gold-600 px-8 py-3 font-display text-sm tracking-[0.2em] text-ink-900 shadow-[0_10px_30px_-8px_rgba(211,162,74,0.7)] transition-transform hover:scale-105 active:scale-95"
              >
                {t(island4Copy.continueButton)}
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* teaser: Island 5, no reveal, just curiosity */}
      <AnimatePresence>
        {phase === 'teaser' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-8 bg-ocean-950/40 px-4 text-center"
          >
            <div>
              {island4Copy.teaserLines.map((line, index) => (
                <motion.p
                  key={`a-${index}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.9 }}
                  className="font-display text-lg text-parchment-100"
                >
                  {t(line)}
                </motion.p>
              ))}
              {island4Copy.teaserLines2.map((line, index) => (
                <motion.p
                  key={`b-${index}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.4 + index * 0.9 }}
                  className="font-display text-lg text-parchment-100"
                >
                  {t(line)}
                </motion.p>
              ))}
            </div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 4.6 }}>
              <p className="mb-6 font-display text-2xl tracking-[0.3em] text-cyan-200 sm:text-3xl">{t(island4Copy.island5Label)}</p>
              <button
                type="button"
                onClick={() => setPhase('outro')}
                className="rounded-full border border-gold-400/60 bg-gradient-to-b from-gold-400 to-gold-600 px-8 py-3 font-display text-sm tracking-[0.2em] text-ink-900 shadow-[0_10px_30px_-8px_rgba(211,162,74,0.7)] transition-transform hover:scale-105 active:scale-95"
              >
                {t(uiStrings.continueLabel)}
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* outro fade */}
      <AnimatePresence>
        {phase === 'outro' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9 }}
            className="pointer-events-none absolute inset-0 z-40 bg-ocean-950"
          />
        ) : null}
      </AnimatePresence>
    </div>
  )
}

// Minimal click-to-advance line reader — same shape as Island3Scene's
// inline DialogBoxLite, duplicated locally rather than shared since it's
// not exported from there either.
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

function hexToRgb(hex) {
  const value = hex.replace('#', '')
  return {
    r: parseInt(value.slice(0, 2), 16) / 255,
    g: parseInt(value.slice(2, 4), 16) / 255,
    b: parseInt(value.slice(4, 6), 16) / 255,
  }
}
