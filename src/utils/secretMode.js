const ACCEPTED_NAMES = ['hien', 'an hien']

// Strips Vietnamese diacritics (including đ, which doesn't decompose via
// NFD like the accented vowels do) so "Hiền", "hien", and "HIỀN" all match
// the same way — typing without a Vietnamese keyboard shouldn't lock
// anyone out.
function stripDiacritics(value) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/đ/g, 'd')
}

export function isHienName(name) {
  if (typeof name !== 'string') return false
  const normalized = stripDiacritics(name.trim().toLowerCase())
  return ACCEPTED_NAMES.includes(normalized)
}
