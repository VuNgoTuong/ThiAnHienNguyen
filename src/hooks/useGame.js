import { useGameStore } from '../store/gameStore.js'
import { islands, getIslandById } from '../data/islands.js'
import { finalIsland } from '../data/finalIsland.js'
import { achievements, getAchievementById } from '../data/achievements.js'
import { isIslandUnlocked, isIslandSolved } from '../utils/islandLogic.js'
import { t } from '../utils/i18n.js'

export function useGame() {
  return useGameStore()
}

// Targeted selectors (below) subscribe to one specific field instead of the
// whole store like `useGame()` does. `useGame()` returns the store's top-
// level object, which zustand replaces wholesale on every single action
// (see gameStore.js's `deriveComputed`) — so any component using it re-
// renders on every action anywhere in the app, not just the ones relevant
// to it. That's fine for one-off screens, but components that are always
// mounted (GameShell, AchievementToast) or that render a 3D scene should
// prefer a selector scoped to just the field(s) they actually read.
export function useCurrentScene() {
  return useGameStore((s) => s.state.scene)
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

export function useDiscoveredClues() {
  return useGameStore((s) => s.state.discoveredClueIds)
}

export function useAchievements() {
  const unlockedAchievementIds = useGameStore((s) => s.state.unlockedAchievementIds)
  return achievements.map((achievement) => ({ ...achievement, unlocked: unlockedAchievementIds.includes(achievement.id) }))
}

export function useAchievementToastQueue() {
  const lastUnlockedAchievementIds = useGameStore((s) => s.state.lastUnlockedAchievementIds)
  const clearAchievementToasts = useGameStore((s) => s.clearAchievementToasts)
  const unlocked = lastUnlockedAchievementIds.map(getAchievementById).filter(Boolean)
  return { unlocked, clearAchievementToasts }
}
