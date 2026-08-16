import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useGame, useTranslation } from '../hooks/useGame.js'
import { Button } from '../components/ui/Button.jsx'
import { ParchmentPanel } from '../components/ui/ParchmentPanel.jsx'
import { Ocean } from '../components/world/Ocean.jsx'
import { uiStrings } from '../data/uiStrings.js'
import { isHienName } from '../utils/secretMode.js'

export function NameEntryPage() {
  const { setPlayerName, setScene } = useGame()
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [rejected, setRejected] = useState(false)

  function handleChange(event) {
    setName(event.target.value)
    setRejected(false)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) return
    if (!isHienName(trimmedName)) {
      setRejected(true)
      setName('')
      return
    }
    setPlayerName(trimmedName)
    setScene('verify')
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center p-6 bg-ocean-950/40 backdrop-blur-sm">
      <Ocean />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <ParchmentPanel className="p-8 sm:p-10 text-center">
          <h1 className="mb-2 font-display text-2xl font-bold tracking-wide text-ink-900 sm:text-3xl">
            {t(uiStrings.nameEntryTitle)}
          </h1>
          <div className="mx-auto mb-4 h-0.5 w-12 bg-gold-600/40" />
          <p className="mb-7 font-serif text-base text-ink-700 italic">{t(uiStrings.nameEntrySubtitle)}</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <input
                autoFocus
                value={name}
                onChange={handleChange}
                placeholder={t(uiStrings.nameEntryPlaceholder)}
                className="w-full rounded-2xl border-2 border-gold-600/40 bg-[#fbf5e6] px-5 py-3.5 text-center font-body text-lg font-medium text-ink-900 placeholder:text-ink-700/40 shadow-[inset_0_2px_6px_rgba(0,0,0,0.1)] transition-all focus:border-gold-600 focus:bg-[#ffffff] focus:ring-4 focus:ring-gold-500/25 focus:outline-none"
              />
            </div>
            <Button type="submit" icon={ArrowRight} disabled={!name.trim()} className="w-full shadow-lg">
              {t(uiStrings.nameEntryButton)}
            </Button>
          </form>
          <AnimatePresence>
            {rejected ? (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 font-body text-sm font-semibold text-red-700"
              >
                {t(uiStrings.nameEntryRejected)}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </ParchmentPanel>
      </motion.div>
    </div>
  )
}
