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
    <div className="relative flex h-full w-full items-center justify-center p-6">
      <Ocean />
      <div
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{ background: 'radial-gradient(ellipse 60% 65% at 50% 50%, rgba(5,13,24,0.4) 0%, rgba(5,13,24,0.1) 55%, rgba(5,13,24,0) 75%)' }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center gap-6 px-6 text-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)]"
      >
        <motion.div
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Compass size={40} className="text-gold-400" />
        </motion.div>
        <div>
          <h1 className="font-display text-3xl text-parchment-100 sm:text-4xl">
            {t(uiStrings.greetingTitle)} {state.playerName}!
          </h1>
          <p className="mt-3 max-w-md font-body text-lg text-parchment-200/90">{t(uiStrings.greetingBody)}</p>
        </div>
        <Button onClick={handleStart}>{t(uiStrings.startJourney)}</Button>
      </motion.div>
    </div>
  )
}
