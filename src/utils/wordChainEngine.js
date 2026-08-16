import { wordChainDictionary } from '../data/vietnameseWordChain.js'

function normalize(text) {
  return text.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function getSyllables(word) {
  return normalize(word).split(' ')
}

const VIETNAMESE_SYLLABLE_REGEX =
  /^[a-zàáảãạâầấẩẫậăằắẳẵặeèéẻẽẹêềếểễệiìíỉĩịoòóỏõọôồốổỗộơờớởỡợuùúủũụưừứửữựyỳýỷỹỵđ]+$/i

const wordSet = new Set(wordChainDictionary.map((word) => normalize(word)))

const wordsByStartSyllable = wordChainDictionary.reduce((index, rawWord) => {
  const word = normalize(rawWord)
  const [first] = getSyllables(word)
  if (!index[first]) index[first] = []
  index[first].push(word)
  return index
}, {})

// Smart validation: accepts prebuilt dictionary words OR any valid 2-syllable Vietnamese compound word
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

  // Check if each syllable is a valid Vietnamese word/spelling
  const isValidSyllableSpelling = syllables.every((s) => VIETNAMESE_SYLLABLE_REGEX.test(s))

  if (!wordSet.has(word) && !isValidSyllableSpelling) {
    return { valid: false, reason: 'unknown' }
  }

  // Dynamically register valid new words into dictionary so AI and player can chain further
  if (!wordSet.has(word) && isValidSyllableSpelling) {
    wordSet.add(word)
    const [first] = syllables
    if (!wordsByStartSyllable[first]) wordsByStartSyllable[first] = []
    wordsByStartSyllable[first].push(word)
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
  if (candidates.some((word) => !usedWords.has(word))) return true
  // Also return true if the syllable itself is a valid Vietnamese syllable (player can type new words!)
  return VIETNAMESE_SYLLABLE_REGEX.test(requiredStartSyllable)
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
