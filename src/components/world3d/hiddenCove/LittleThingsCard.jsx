import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useTranslation } from '../../../hooks/useGame.js'
import { uiStrings } from '../../../data/uiStrings.js'
import { Button } from '../../ui/Button.jsx'

// The small on-select flourish for the chosen card — picked per section via
// `micro` (island2Content.js) so every chapter reads a little differently,
// without needing a bespoke animation per individual option. Purely a DOM/
// framer-motion effect layered on the card itself — no coupling to the R3F
// canvas, so it stays cheap and can't desync from it.
function MicroFlourish({ variant }) {
  if (variant === 'ripple') {
    return (
      <motion.span
        initial={{ scale: 0.4, opacity: 0.55 }}
        animate={{ scale: 2.2, opacity: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-gold-300/70"
      />
    )
  }
  if (variant === 'glow') {
    return (
      <motion.span
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
        className="pointer-events-none absolute -inset-2 rounded-3xl bg-gold-300/25 blur-xl"
      />
    )
  }
  if (variant === 'wave') {
    return (
      <motion.span
        initial={{ y: 0 }}
        animate={{ y: [0, -5, 0, -2, 0] }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        className="pointer-events-none absolute inset-0"
      />
    )
  }
  // 'sparkle'
  return (
    <>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0.9, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: 0,
            scale: 1,
            x: [0, (i - 1) * 22],
            y: [-4, -22 - i * 4],
          }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.05 }}
          className="pointer-events-none absolute top-1/2 left-1/2 h-1.5 w-1.5 rounded-full bg-gold-300"
        />
      ))}
    </>
  )
}

// One island2Content interaction: a prompt and two options, no correct side.
// Selecting locks the pair in (chosen highlighted, the other quietly dims),
// plays `microVariant`, and reveals a short reaction line. The player then
// taps to continue at their own pace — nothing here auto-advances or times
// out, by design (see the brief: no push, no countdown).
export function LittleThingsCard({ interaction, microVariant = 'glow', onContinue }) {
  const { t } = useTranslation()
  const [chosenId, setChosenId] = useState(null)

  const chosenOption = interaction.options.find((option) => option.id === chosenId) ?? null

  function handleSelect(option) {
    if (chosenId) return
    setChosenId(option.id)
  }

  return (
    <div className="w-full space-y-4">
      <p className="text-center font-serif text-lg leading-relaxed text-parchment-100 italic">
        {t(interaction.prompt)}
      </p>

      <div className="grid grid-cols-2 gap-3">
        {interaction.options.map((option) => {
          const isChosen = chosenId === option.id
          const isDimmed = chosenId !== null && !isChosen

          return (
            <motion.button
              key={option.id}
              type="button"
              onClick={() => handleSelect(option)}
              disabled={chosenId !== null}
              whileHover={chosenId === null ? { scale: 1.03, y: -1 } : undefined}
              whileTap={chosenId === null ? { scale: 0.97 } : undefined}
              animate={{ opacity: isDimmed ? 0.45 : 1 }}
              transition={{ duration: 0.35 }}
              className={`relative overflow-visible rounded-2xl border px-4 py-4 text-center font-display text-sm font-semibold backdrop-blur-md transition-colors ${
                isChosen
                  ? 'border-gold-400/80 bg-gold-500/15 text-gold-100'
                  : 'border-white/15 bg-white/5 text-parchment-100 hover:border-gold-400/50 hover:bg-white/10'
              }`}
            >
              {isChosen ? <MicroFlourish variant={microVariant} /> : null}
              <span className="relative">{t(option.label)}</span>
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {chosenOption ? (
          <motion.div
            key={chosenOption.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="space-y-4 text-center"
          >
            <p className="font-serif text-sm text-parchment-100/85 italic">{t(chosenOption.reaction)}</p>
            <Button icon={Sparkles} variant="ghost" onClick={() => onContinue(chosenOption)} className="mx-auto">
              {t(uiStrings.next)}
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
