import { motion } from 'framer-motion'
import { Compass } from 'lucide-react'
import { useGame, useTranslation } from '../hooks/useGame.js'
import { Button } from '../components/ui/Button.jsx'
import { Ocean } from '../components/world/Ocean.jsx'
import { uiStrings } from '../data/uiStrings.js'

export function GreetingPage() {
  const { state, setScene } = useGame()
  const { t } = useTranslation()

  function handleStart() {
    setScene('map')
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center p-6 bg-ocean-950/40 backdrop-blur-sm">
      <Ocean />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-4 flex w-full max-w-lg flex-col items-center gap-7 rounded-3xl border border-gold-400/35 bg-ocean-950/60 p-8 text-center backdrop-blur-md shadow-[0_30px_90px_rgba(0,0,0,0.85)] outline outline-1 outline-gold-400/15 -outline-offset-8 sm:p-12"
      >
        {/* Subtle glowing corner flares */}
        <span className="pointer-events-none absolute top-3 left-3 h-2 w-2 rounded-full border border-gold-400/40" />
        <span className="pointer-events-none absolute top-3 right-3 h-2 w-2 rounded-full border border-gold-400/40" />
        <span className="pointer-events-none absolute bottom-3 left-3 h-2 w-2 rounded-full border border-gold-400/40" />
        <span className="pointer-events-none absolute bottom-3 right-3 h-2 w-2 rounded-full border border-gold-400/40" />

        <motion.div
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative flex items-center justify-center rounded-full border border-gold-400/50 bg-gradient-to-br from-gold-500/20 via-gold-400/10 to-transparent p-4 shadow-[0_0_25px_rgba(232,195,104,0.35)]"
        >
          <Compass size={40} className="text-gold-400 drop-shadow-[0_0_10px_rgba(232,195,104,0.8)]" />
        </motion.div>

        <div className="flex flex-col items-center gap-3">
          <h1 className="bg-gradient-to-r from-parchment-100 via-gold-300 to-parchment-100 bg-clip-text font-display text-3xl font-bold tracking-wide text-transparent drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] sm:text-4xl">
            {t(uiStrings.greetingTitle)} {state.playerName}!
          </h1>
          <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />
          <p className="max-w-md font-serif text-lg text-parchment-200/90 italic leading-relaxed sm:text-xl">
            {t(uiStrings.greetingBody)}
          </p>
        </div>

        <Button onClick={handleStart} className="min-w-[200px] shadow-lg">
          {t(uiStrings.startJourney)}
        </Button>
      </motion.div>
    </div>
  )
}
