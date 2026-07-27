const ACCEPTED_NAMES = ['hiền', 'an hiền']

export function isHienName(name) {
  if (typeof name !== 'string') return false
  const normalized = name.trim().normalize('NFC').toLowerCase()
  return ACCEPTED_NAMES.includes(normalized)
}
