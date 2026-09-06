import { AI_GUESS_REACTIONS, ROUND_DEFS } from '../data/island4Predictions.js'

// Turns the raw `state.island3Result` (see Island3Scene's
// summarizeAnswerRecords) into the small set of signals the round
// predictions read from. No machine learning, no backend — just plain
// thresholds over whatever Island 3 happened to record.
export function buildPlayerProfile(state) {
  const r3 = state?.island3Result
  if (!r3 || r3.total === 0) return { hasIsland3Data: false }
  return {
    hasIsland3Data: true,
    quizAccuracy: r3.score / r3.total,
    avgAnswerTimeMs: r3.avgAnswerTimeMs,
    firstOptionRate: r3.firstOptionPicks / r3.total,
    imageAccuracy: r3.imageTotal ? r3.imageCorrect / r3.imageTotal : null,
    worldCorrect: r3.worldCorrect,
    worldTotal: r3.worldTotal,
    animalCorrect: r3.animalCorrect,
    animalTotal: r3.animalTotal,
  }
}

// round is 1-indexed (1..7).
export function getRoundPrediction(profile, round) {
  const def = ROUND_DEFS[round - 1]
  return {
    round,
    icon: def.icon,
    text: def.getText(profile),
    thinkingLine: def.thinkingLine ?? null,
    special: def.special ?? null,
  }
}

function pickOne(pool) {
  return pool[Math.floor(Math.random() * pool.length)]
}

// Random "Hmm..." flavor for rounds without a scripted thinkingLine.
export function pickThinkingLine() {
  return pickOne(AI_GUESS_REACTIONS.thinking)
}

// outcome: 'ai-correct' (player pressed ĐÚNG) | 'ai-wrong' (player pressed SAI).
// Returns an array of 1-2 lines to show in sequence.
export function pickReactionLines(outcome, consecutiveAiWrong, consecutiveAiCorrect) {
  if (outcome === 'ai-wrong' && consecutiveAiWrong >= 2) return AI_GUESS_REACTIONS.wrongStreak
  if (outcome === 'ai-correct' && consecutiveAiCorrect >= 3) return AI_GUESS_REACTIONS.correctStreak
  const pool = outcome === 'ai-correct' ? AI_GUESS_REACTIONS.correct : AI_GUESS_REACTIONS.wrong
  return [pickOne(pool)]
}
