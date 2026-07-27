// Every translatable field in data files is either a plain string (tolerated
// as-is) or a `{ vi, en }` object. One helper resolves either shape so
// components never branch on it themselves.
export function t(field, language) {
  if (!field) return ''
  if (typeof field === 'string') return field
  return field[language] ?? field.vi ?? field.en ?? ''
}
