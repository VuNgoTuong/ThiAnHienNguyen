import { RiddlePuzzle } from '../components/puzzle/types/RiddlePuzzle.jsx'
import { MultipleChoicePuzzle } from '../components/puzzle/types/MultipleChoicePuzzle.jsx'
import { MatchingPuzzle } from '../components/puzzle/types/MatchingPuzzle.jsx'
import { SequencePuzzle } from '../components/puzzle/types/SequencePuzzle.jsx'
import { ObservationPuzzle } from '../components/puzzle/types/ObservationPuzzle.jsx'
import { WordChainLesson } from '../components/puzzle/types/WordChainLesson.jsx'

// Maps a lesson/puzzle's `type` string to the component that renders it, so
// PuzzleEngine never needs a switch statement — adding a new type later is
// a one-line addition here plus the component itself.
export const puzzleRegistry = {
  riddle: RiddlePuzzle,
  'multiple-choice': MultipleChoicePuzzle,
  matching: MatchingPuzzle,
  sequence: SequencePuzzle,
  observation: ObservationPuzzle,
  'word-chain': WordChainLesson,
}
