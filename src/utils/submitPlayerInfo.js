// Sends the player-info form to Formspree so it lands in an inbox — this app
// has no backend, so this is the only way the info leaves the browser. Set
// VITE_PLAYER_INFO_ENDPOINT (see .env.example) to a Formspree form endpoint,
// e.g. https://formspree.io/f/xxxxxxx. Silently no-ops without it, and never
// throws — a failed/missing submit must not block the player from continuing.
const ENDPOINT = import.meta.env.VITE_PLAYER_INFO_ENDPOINT

export function submitPlayerInfo(info) {
  if (!ENDPOINT) return

  fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ ...info, submittedAt: new Date().toISOString() }),
  }).catch(() => {})
}
