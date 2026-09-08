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
    <div className="relative flex h-full w-full items-center justify-center p-4 sm:p-8 bg-ocean-950/40 backdrop-blur-sm">
      <Ocean />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-xl sm:max-w-2xl"
      >
        <ParchmentPanel className="p-6 sm:p-12 text-center">
          <h1 className="mb-3 font-display text-2xl font-bold tracking-wide text-ink-900 sm:text-4xl">
            {t(uiStrings.nameEntryTitle)}
          </h1>
          {t(uiStrings.nameEntrySubtitle) ? (
            <>
              <div className="mx-auto mb-5 h-0.5 w-16 bg-gradient-to-r from-transparent via-rose-400/60 to-transparent" />
              <p className="mb-8 font-serif text-base sm:text-xl text-ink-700 italic whitespace-pre-line">{t(uiStrings.nameEntrySubtitle)}</p>
            </>
          ) : (
            <div className="mb-8" />
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                autoFocus
                value={name}
                onChange={handleChange}
                placeholder={t(uiStrings.nameEntryPlaceholder)}
                className="w-full rounded-2xl border-2 border-rose-300/60 bg-[#fdf6f8] px-4 py-3 text-center font-body text-sm font-medium text-ink-900 placeholder:text-rose-400/50 shadow-[inset_0_2px_6px_rgba(0,0,0,0.1)] transition-all focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-300/30 focus:outline-none sm:px-6 sm:py-4 sm:text-xl"
              />
            </div>
            <Button type="submit" icon={ArrowRight} disabled={!name.trim()} className="w-full py-3 text-base rounded-2xl shadow-lg sm:py-4 sm:text-lg">
              {t(uiStrings.nameEntryButton)}
            </Button>
          </form>
          <AnimatePresence>
            {rejected ? (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-5 font-body text-base font-semibold text-red-700"
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
