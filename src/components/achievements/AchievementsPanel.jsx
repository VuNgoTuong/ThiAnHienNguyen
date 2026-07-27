import * as Icons from 'lucide-react'
import { Modal } from '../ui/Modal.jsx'
import { useAchievements, useTranslation } from '../../hooks/useGame.js'
import { uiStrings } from '../../data/uiStrings.js'

export function AchievementsPanel({ isOpen, onClose }) {
  const { t } = useTranslation()
  const achievements = useAchievements()

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t(uiStrings.achievementsTitle)}>
      <ul className="space-y-3">
        {achievements.map((achievement) => {
          const Icon = Icons[achievement.icon] ?? Icons.Award
          return (
            <li
              key={achievement.id}
              className={`flex items-center gap-3 rounded-lg border p-3 ${
                achievement.unlocked ? 'border-gold-500/40 bg-gold-400/10' : 'border-ink-900/10 opacity-50'
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  achievement.unlocked ? 'bg-gold-400/20 text-gold-600' : 'bg-ink-900/10 text-ink-900/40'
                }`}
              >
                <Icon size={18} />
              </div>
              <div>
                <p className="font-display text-sm text-ink-900">{t(achievement.name)}</p>
                <p className="text-sm text-ink-700">{t(achievement.description)}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </Modal>
  )
}
