import { islands } from '../data/islands.js'
import { finalIsland } from '../data/finalIsland.js'

// An island unlocks once the island immediately before it (by `order`) has
// had every one of its lessons solved. The first island is always unlocked.
export function isIslandUnlocked(island, state) {
  if (island.order === 1) return true
  const previous = islands.find((candidate) => candidate.order === island.order - 1)
  if (!previous) return true
  return isIslandSolved(previous, state)
}

export function isIslandSolved(island, state) {
  return island.lessons.every((lesson) => state.solvedPuzzleIds.includes(lesson.id))
}

// The Final Island opens once every regular island has surrendered its
// Compass Fragment — independent of visit order, so future non-linear
// islands can still gate it correctly.
export function isFinalIslandUnlocked(state) {
  return islands.every((island) => state.collectedFragmentIds.includes(island.fragment.id))
}

export const START_POSITION = { x: 6, y: 85 }

// Where the ship sits on the map when not mid-voyage: the last island
// visited (or the Final Island once reached), falling back to a starting
// anchorage for a brand-new voyage.
export function getShipRestingPosition(state) {
  if (state.currentIslandId === finalIsland.id) return finalIsland.position
  const visited = islands.filter((island) => state.visitedIslandIds.includes(island.id))
  if (visited.length === 0) return START_POSITION
  return visited.reduce((latest, island) => (island.order > latest.order ? island : latest)).position
}
