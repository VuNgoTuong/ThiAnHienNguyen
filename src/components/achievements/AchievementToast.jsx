import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { useGame, useTranslation } from '../../hooks/useGame.js'
import { getAchievementById } from '../../data/achievements.js'
import { uiStrings } from '../../data/uiStrings.js'

export function AchievementToast() {
  const { state, clearAchievementToasts } = useGame()
  const { t } = useTranslation()
  const unlocked = state.lastUnlockedAchievementIds.map(getAchievementById).filter(Boolean)

  useEffect(() => {
    if (state.lastUnlockedAchievementIds.length === 0) return
    const timeoutId = setTimeout(() => clearAchievementToasts(), 3200)
    return () => clearTimeout(timeoutId)
  }, [state.lastUnlockedAchievementIds, clearAchievementToasts])

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[60] flex flex-col gap-2">
      <AnimatePresence>
        {unlocked.map((achievement) => {
          const Icon = Icons[achievement.icon] ?? Icons.Award
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
