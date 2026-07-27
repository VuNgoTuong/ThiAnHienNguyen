import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Compass, Play, RotateCcw } from 'lucide-react'
import { useGame, useTranslation } from '../hooks/useGame.js'
import { Button } from '../components/ui/Button.jsx'
import { LanguageToggle } from '../components/ui/LanguageToggle.jsx'
import { hasSave, loadGame, clearGame } from '../utils/saveSystem.js'
import { uiStrings } from '../data/uiStrings.js'

const MIN_LOADING_MS = 2000
const FLAVOR_KEYS = [uiStrings.loadingFlavor1, uiStrings.loadingFlavor2, uiStrings.loadingFlavor3, uiStrings.loadingFlavor4]

const STAGGER_CONTAINER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16, delayChildren: 0.1 } },
}
const STAGGER_ITEM = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

// Loads the heavy 3D intro scene while showing a stylized loading screen
// (never instant, never a lie — the bar eases toward 90% over a minimum
// dramatic duration, then completes once the chunk has actually arrived),
// then plays a cinematic camera-reveal before the title UI appears — the
// "wow" first impression, contained entirely to this one screen.
function LoadingOverlay({ progress }) {
  const { t } = useTranslation()
  const [flavorIndex, setFlavorIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setFlavorIndex((i) => (i + 1) % FLAVOR_KEYS.length), 900)
    return () => clearInterval(id)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 overflow-hidden bg-ocean-950"
    >
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 50 }).map((_, index) => (
          <span
            key={index}
            className="animate-twinkle absolute block h-[2px] w-[2px] rounded-full bg-parchment-100"
            style={{
              left: `${(index * 31) % 100}%`,
              top: `${(index * 47) % 100}%`,
              animationDelay: `${(index % 10) * 0.35}s`,
            }}
          />
        ))}
      </div>

      <div className="relative">
        <div className="absolute inset-0 -m-6 animate-pulse rounded-full bg-gold-400/20 blur-xl" />
        <motion.div
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
        >
          <Compass size={44} className="text-gold-400" />
        </motion.div>
      </div>

      <div className="relative w-64">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-parchment-100/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-300 shadow-[0_0_10px_rgba(232,195,104,0.6)] transition-[width] duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-1.5 text-right font-display text-[10px] text-parchment-200/40">{progress}%</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={flavorIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative font-body text-sm text-parchment-200/60 italic"
        >
          {t(FLAVOR_KEYS[flavorIndex])}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  )
}

export function TitleScreen() {
  const { startNewGame, loadSave, resetGame } = useGame()
  const { t } = useTranslation()
  const [saveExists] = useState(() => hasSave())
  const [stage, setStage] = useState('loading') // 'loading' | 'intro' | 'ready'
  const [progress, setProgress] = useState(0)
  const [IntroScene, setIntroScene] = useState(null)

  useEffect(() => {
    let cancelled = false
    const start = performance.now()

    const progressTimer = setInterval(() => {
      const ratio = Math.min((performance.now() - start) / MIN_LOADING_MS, 1)
      setProgress(Math.round(ratio * 90))
    }, 60)

    Promise.all([
      import('../components/world3d/TitleIntroScene.jsx'),
      new Promise((resolve) => setTimeout(resolve, MIN_LOADING_MS)),
    ]).then(([module]) => {
      if (cancelled) return
      clearInterval(progressTimer)
      setProgress(100)
      setIntroScene(() => module.TitleIntroScene)
      setTimeout(() => !cancelled && setStage('intro'), 350)
    })

    return () => {
      cancelled = true
      clearInterval(progressTimer)
    }
  }, [])

  function handleNewVoyage() {
    clearGame()
    startNewGame()
  }

  function handleContinue() {
    const saved = loadGame()
    if (saved) loadSave(saved)
  }

  function handleReset() {
    clearGame()
    resetGame()
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b from-ocean-950 via-ocean-900 to-ocean-800">
      {IntroScene ? (
        <div className="absolute inset-0">
          <IntroScene onSettled={() => setStage('ready')} />
        </div>
      ) : null}

      {stage === 'ready' ? (
        // Soft scrim behind the title block only — keeps the text readable
        // against whatever the moving 3D backdrop happens to be doing,
        // without flattening the rest of the scene into a dark box.
        <div
          className="pointer-events-none absolute inset-0 z-[5]"
          style={{ background: 'radial-gradient(ellipse 60% 65% at 50% 42%, rgba(5,13,24,0.72) 0%, rgba(5,13,24,0.15) 55%, rgba(5,13,24,0) 75%)' }}
        />
      ) : null}

      <AnimatePresence>{stage === 'loading' ? <LoadingOverlay progress={progress} /> : null}</AnimatePresence>

      {stage === 'ready' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="absolute top-4 right-4 z-10"
        >
          <LanguageToggle />
        </motion.div>
      ) : null}

      {stage === 'ready' ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="relative z-10 flex flex-col items-center gap-6 px-6 text-center"
        >
          <motion.div
            variants={STAGGER_ITEM}
            initial={{ opacity: 0, rotate: -540 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
          >
            <Compass size={40} className="text-gold-400" />
          </motion.div>
          <motion.div variants={STAGGER_ITEM} className="drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)]">
            <h1 className="font-display text-4xl text-parchment-100 sm:text-5xl">{t(uiStrings.gameTitle)}</h1>
            <p className="mt-3 max-w-md font-body text-lg text-parchment-200/90">{t(uiStrings.gameSubtitle)}</p>
          </motion.div>
          <motion.div variants={STAGGER_ITEM} className="mt-4 flex flex-col items-center gap-3">
            <Button icon={Play} onClick={handleNewVoyage}>
              {t(uiStrings.newVoyage)}
            </Button>
            {saveExists ? (
              <>
                <Button icon={Compass} variant="ghost" onClick={handleContinue}>
                  {t(uiStrings.continueVoyage)}
                </Button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-1 flex items-center gap-1 text-xs text-parchment-200/50 transition-colors hover:text-parchment-200"
                >
                  <RotateCcw size={12} /> {t(uiStrings.resetProgress)}
                </button>
              </>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </div>
  )
}
