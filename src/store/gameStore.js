import { create } from 'zustand'
import { finalIsland } from '../data/finalIsland.js'
import { isFinalIslandUnlocked } from '../utils/islandLogic.js'
import { checkAchievements } from '../utils/achievementEngine.js'
import { isHienName } from '../utils/secretMode.js'
import { saveGame } from '../utils/saveSystem.js'
import { debounce } from '../utils/debounce.js'

export const initialState = {
  scene: 'title', // 'title' | 'name-entry' | 'verify' | 'greeting' | 'map' | 'island' | 'final' | 'ending'
  language: 'vi', // 'vi' | 'en'
  playerName: '',
  currentIslandId: null,
  visitedIslandIds: [],
  solvedPuzzleIds: [],
  collectedFragmentIds: [],
  unlockedAchievementIds: [],
  lastUnlockedAchievementIds: [], // transient — drives the achievement toast, cleared once shown
  finalIslandUnlocked: false,
  endingSeen: false,
  secretModeUnlocked: false, // derived from playerName on every action, see deriveComputed()
}

function addUnique(list, value) {
  return list.includes(value) ? list : [...list, value]
}

// Re-derives the systems that depend on the rest of the state (Final Island
// unlock, secret mode, achievements) after every action — mirrors the old
// gameReducer wrapper so no single action has to remember to do it.
function deriveComputed(next) {
  const newlyUnlocked = checkAchievements(next)
  return {
    ...next,
    finalIslandUnlocked: isFinalIslandUnlocked(next),
    secretModeUnlocked: isHienName(next.playerName),
    unlockedAchievementIds:
      newlyUnlocked.length > 0 ? [...next.unlockedAchievementIds, ...newlyUnlocked] : next.unlockedAchievementIds,
    lastUnlockedAchievementIds: newlyUnlocked.length > 0 ? newlyUnlocked : next.lastUnlockedAchievementIds,
  }
}

export const useGameStore = create((set) => ({
  state: { ...initialState },

  startNewGame: () =>
    // Language is a device preference, not game progress — carry it over.
    // Goes to name-entry first, not straight to the map.
    set((s) => ({ state: deriveComputed({ ...initialState, scene: 'name-entry', language: s.state.language }) })),

  loadSave: (payload) =>
    set((s) => ({
      state: deriveComputed({
        ...initialState,
        ...payload,
        language: payload.language ?? s.state.language,
        lastUnlockedAchievementIds: [],
      }),
    })),

  resetGame: () => set((s) => ({ state: deriveComputed({ ...initialState, language: s.state.language }) })),

  setScene: (scene) => set((s) => ({ state: deriveComputed({ ...s.state, scene }) })),

  setLanguage: (language) => set((s) => ({ state: deriveComputed({ ...s.state, language }) })),

  setPlayerName: (playerName) => set((s) => ({ state: deriveComputed({ ...s.state, playerName }) })),

  arriveAtIsland: (islandId) =>
    set((s) => ({
      state: deriveComputed({
        ...s.state,
        scene: 'island',
        currentIslandId: islandId,
        visitedIslandIds: addUnique(s.state.visitedIslandIds, islandId),
      }),
    })),

  arriveAtFinalIsland: () =>
    set((s) => ({ state: deriveComputed({ ...s.state, scene: 'final', currentIslandId: finalIsland.id }) })),

  solvePuzzle: (lessonId) =>
    set((s) => ({ state: deriveComputed({ ...s.state, solvedPuzzleIds: addUnique(s.state.solvedPuzzleIds, lessonId) }) })),

  collectFragment: (fragmentId) =>
    set((s) => ({
      state: deriveComputed({ ...s.state, collectedFragmentIds: addUnique(s.state.collectedFragmentIds, fragmentId) }),
    })),

  seeEnding: () => set((s) => ({ state: deriveComputed({ ...s.state, scene: 'ending', endingSeen: true }) })),

  clearAchievementToasts: () => set((s) => ({ state: deriveComputed({ ...s.state, lastUnlockedAchievementIds: [] }) })),
}))

// Auto-save, set up once at module load rather than tied to a mounted
// component — reacts to every store change, debounced 400ms, skipped while
// still on the title screen (avoids clobbering an existing save on boot).
const debouncedSave = debounce(saveGame, 400)
useGameStore.subscribe((current) => {
  if (current.state.scene === 'title') return
  debouncedSave(current.state)
})
