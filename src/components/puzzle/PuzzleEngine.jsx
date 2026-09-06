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
    <ParchmentPanel className="w-full p-8 sm:p-10">
      <p className="mb-6 font-serif text-xl sm:text-2xl leading-relaxed font-medium text-ink-900 italic">{t(displayedPrompt)}</p>
      <PuzzleTypeComponent puzzle={puzzle} onCorrect={onSolved} />
    </ParchmentPanel>
  )
}
