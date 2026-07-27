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

  return (
    <ParchmentPanel className="w-full max-w-2xl p-6">
      <p className="mb-5 font-body text-lg leading-relaxed text-ink-900 italic">{t(displayedPrompt)}</p>
      <PuzzleTypeComponent puzzle={puzzle} onCorrect={onSolved} />
    </ParchmentPanel>
  )
}
