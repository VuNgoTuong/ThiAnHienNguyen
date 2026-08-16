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
    <div className="relative flex h-full w-full items-center justify-center p-6">
      <Ocean />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <ParchmentPanel className="p-8 text-center">
          <h1 className="mb-2 font-display text-2xl text-ink-900">{t(uiStrings.nameEntryTitle)}</h1>
          <p className="mb-6 text-sm text-ink-700">{t(uiStrings.nameEntrySubtitle)}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              autoFocus
              value={name}
              onChange={handleChange}
              placeholder={t(uiStrings.nameEntryPlaceholder)}
              className="w-full rounded-lg border border-ink-900/20 bg-parchment-100 px-4 py-2.5 text-center font-body text-ink-900 placeholder:text-ink-700/50 focus:border-gold-600 focus:outline-none"
            />
            <Button type="submit" icon={ArrowRight} disabled={!name.trim()} className="w-full">
              {t(uiStrings.nameEntryButton)}
            </Button>
          </form>
          <AnimatePresence>
            {rejected ? (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 font-body text-sm font-medium text-red-700"
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
