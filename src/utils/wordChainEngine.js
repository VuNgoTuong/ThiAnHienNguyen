import { wordChainDictionary } from '../data/vietnameseWordChain.js'

function normalize(text) {
  return text.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function getSyllables(word) {
  return normalize(word).split(' ')
}

const wordSet = new Set(wordChainDictionary.map((word) => normalize(word)))

const wordsByStartSyllable = wordChainDictionary.reduce((index, rawWord) => {
  const word = normalize(rawWord)
  const [first] = getSyllables(word)
  if (!index[first]) index[first] = []
  index[first].push(word)
  return index
}, {})

// `requiredStartSyllable` of null/undefined means any dictionary word is
// accepted (used for the "AI is stuck, start fresh" recovery move).
export function validateNextWord({ input, requiredStartSyllable, usedWords }) {
  const word = normalize(input)
  const syllables = word.split(' ')

  if (syllables.length !== 2 || syllables.some((syllable) => syllable.length === 0)) {
    return { valid: false, reason: 'needs-two-syllables' }
  }
  if (requiredStartSyllable && syllables[0] !== requiredStartSyllable) {
    return { valid: false, reason: 'wrong-start' }
  }
  if (usedWords.has(word)) {
    return { valid: false, reason: 'used' }
  }
  if (!wordSet.has(word)) {
    return { valid: false, reason: 'unknown' }
  }
  return { valid: true, word }
}

function countContinuations(word, usedWords) {
  const lastSyllable = getSyllables(word)[1]
  const candidates = wordsByStartSyllable[lastSyllable] ?? []
  return candidates.filter((candidate) => !usedWords.has(candidate)).length
}

// Used to proactively detect a dead syllable (no unused word starts with
// it) so the UI can switch to a free move *before* the player wastes
// guesses on something that was never going to work.
export function hasAnyCandidate({ requiredStartSyllable, usedWords }) {
  if (!requiredStartSyllable) return true
  return (wordsByStartSyllable[requiredStartSyllable] ?? []).some((word) => !usedWords.has(word))
}

// "Smart" heuristic: among valid unused words, prefer the one that leaves
// the player the FEWEST (but still nonzero, when possible) further options —
// applies real pressure without ever intentionally choosing a dead end.
export function pickAiWord({ requiredStartSyllable, usedWords }) {
  const candidates = (wordsByStartSyllable[requiredStartSyllable] ?? []).filter((word) => !usedWords.has(word))
  if (candidates.length === 0) return null

  const ranked = candidates
    .map((word) => ({ word, followups: countContinuations(word, usedWords) }))
    .sort((a, b) => a.followups - b.followups)

  const withFollowups = ranked.filter((entry) => entry.followups > 0)
  return (withFollowups[0] ?? ranked[0]).word
}
