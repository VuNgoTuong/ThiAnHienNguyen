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

// Validation: must be a valid 2-syllable Vietnamese compound word present in dictionary
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

export function hasAnyCandidate({ requiredStartSyllable, usedWords }) {
  if (!requiredStartSyllable) return true
  const candidates = wordsByStartSyllable[requiredStartSyllable] ?? []
  return candidates.some((word) => !usedWords.has(word))
}

export function pickAiWord({ requiredStartSyllable, usedWords }) {
  const candidates = (wordsByStartSyllable[requiredStartSyllable] ?? []).filter((word) => !usedWords.has(word))
  if (candidates.length === 0) return null

  const ranked = candidates
    .map((word) => ({ word, followups: countContinuations(word, usedWords) }))
    .sort((a, b) => a.followups - b.followups)

  const withFollowups = ranked.filter((entry) => entry.followups > 0)
  return (withFollowups[Math.floor(Math.random() * Math.min(3, withFollowups.length))] ?? ranked[0]).word
}

const startableWords = wordChainDictionary
  .map((word) => normalize(word))
  .filter((word) => hasAnyCandidate({ requiredStartSyllable: getSyllables(word)[1], usedWords: new Set([word]) }))

export function pickRandomStartWord() {
  const pool = startableWords.length > 0 ? startableWords : wordChainDictionary.map((word) => normalize(word))
  return pool[Math.floor(Math.random() * pool.length)]
}

