import { puzzleRegistry } from '../../data/puzzleRegistry.js'
import { ParchmentPanel } from '../ui/ParchmentPanel.jsx'
import { useTranslation } from '../../hooks/useGame.js'

export function PuzzleEngine({ puzzle, onSolved, secretModeUnlocked = false }) {
  const { t } = useTranslation()
  const PuzzleTypeComponent = puzzleRegistry[puzzle.type]

  if (!PuzzleTypeComponent) {
    return null
  }

  const displayedPrompt = secretModeUnlocked && puzzle.secretPrompt ? puzzle.secretPrompt : puzzle.prompt

  // word-chain owns its full presentation — a dark cinematic card (its own
  // prompt line included), not the light parchment sheet every other puzzle
  // type sits on — so it renders standalone rather than nested inside the
  // panel built for prompt-then-widget puzzles.
  if (puzzle.type === 'word-chain') {
    return <PuzzleTypeComponent puzzle={puzzle} onCorrect={onSolved} />
  }

  return (
    <ParchmentPanel className="w-full p-8 sm:p-10">
      <p className="mb-6 font-serif text-xl sm:text-2xl leading-relaxed font-medium text-ink-900 italic">{t(displayedPrompt)}</p>
      <PuzzleTypeComponent puzzle={puzzle} onCorrect={onSolved} />
    </ParchmentPanel>
  )
}
