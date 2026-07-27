const STORAGE_KEY = 'voyage-of-discovery:save:v1'

// Structural check only (not a full schema) — enough to reject a corrupt or
// pre-v1 save without crashing the app, while staying tolerant of new
// optional fields added in later versions.
function isValidSaveShape(value) {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.scene === 'string' &&
    Array.isArray(value.visitedIslandIds) &&
    Array.isArray(value.solvedPuzzleIds) &&
    Array.isArray(value.collectedFragmentIds) &&
    Array.isArray(value.unlockedAchievementIds)
  )
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return isValidSaveShape(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function saveGame(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // localStorage unavailable (private mode, quota exceeded, etc.) — the
    // voyage just won't persist across reloads this session.
  }
}

export function clearGame() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // nothing to do if storage is unavailable
  }
}

export function hasSave() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null
  } catch {
    return false
  }
}
