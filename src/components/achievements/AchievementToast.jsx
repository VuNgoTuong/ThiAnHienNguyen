import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAchievementToastQueue, useTranslation } from '../../hooks/useGame.js'
import { uiStrings } from '../../data/uiStrings.js'
import { achievementIcons, fallbackAchievementIcon } from '../../data/achievementIcons.js'

export function AchievementToast() {
  const { unlocked, clearAchievementToasts } = useAchievementToastQueue()
  const { t } = useTranslation()

  useEffect(() => {
    if (unlocked.length === 0) return
    const timeoutId = setTimeout(() => clearAchievementToasts(), 3200)
    return () => clearTimeout(timeoutId)
  }, [unlocked, clearAchievementToasts])

  return (
    <div className="pointer-events-none fixed top-16 right-3 z-[60] flex flex-col gap-2 sm:top-20 sm:right-5">
      <AnimatePresence>
        {unlocked.map((achievement) => {
          const Icon = achievementIcons[achievement.icon] ?? fallbackAchievementIcon
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="shadow-parchment flex items-center gap-3 rounded-xl border border-gold-500/40 bg-ocean-900/95 px-4 py-3"
            >
              <Icon size={20} className="text-gold-400" />
              <div>
                <p className="text-xs tracking-wide text-gold-400">{t(uiStrings.achievementUnlocked)}</p>
                <p className="font-display text-sm text-parchment-100">{t(achievement.name)}</p>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
