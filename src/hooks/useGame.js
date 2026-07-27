import { useGameStore } from '../store/gameStore.js'
import { islands, getIslandById } from '../data/islands.js'
import { finalIsland } from '../data/finalIsland.js'
import { achievements } from '../data/achievements.js'
import { isIslandUnlocked, isIslandSolved } from '../utils/islandLogic.js'
import { t } from '../utils/i18n.js'

// Whole-store subscription (state + every action method) — used by pages
// that both read broadly and dispatch actions, same re-render behavior the
// old Context-based version had for these consumers.
export function useGame() {
  return useGameStore()
}

export function useTranslation() {
  const language = useGameStore((s) => s.state.language)
  const setLanguage = useGameStore((s) => s.setLanguage)
  return { language, t: (field) => t(field, language), setLanguage }
}

export function useCurrentIsland() {
  const currentIslandId = useGameStore((s) => s.state.currentIslandId)
  if (currentIslandId === finalIsland.id) return finalIsland
  return getIslandById(currentIslandId)
}

export function useIsIslandUnlocked(island) {
  return useGameStore((s) => isIslandUnlocked(island, s.state))
}

export function useIsIslandSolved(island) {
  return useGameStore((s) => isIslandSolved(island, s.state))
}

export function useFragments() {
  const collectedFragmentIds = useGameStore((s) => s.state.collectedFragmentIds)
  const collected = islands.map((island) => island.fragment).filter((fragment) => collectedFragmentIds.includes(fragment.id))
  return { collected, total: islands.length }
}

export function useAchievements() {
  const unlockedAchievementIds = useGameStore((s) => s.state.unlockedAchievementIds)
  return achievements.map((achievement) => ({ ...achievement, unlocked: unlockedAchievementIds.includes(achievement.id) }))
}
