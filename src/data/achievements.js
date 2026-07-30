import { islands } from './islands.js'

// Achievement definitions. Only `unlockedAchievementIds` (a list of ids) is
// ever persisted to localStorage, so it's safe for `condition` to be a plain
// function here rather than a serializable descriptor.
//
// `icon` is a lucide-react component name, resolved by AchievementsPanel.
// `name`/`description` are `{ vi, en }` — see utils/i18n.js.

export const achievements = [
  {
    id: 'first-landfall',
    name: { vi: 'Bước Chân Đầu Tiên', en: 'First Landfall' },
    description: { vi: 'Mày đã đặt chân lên hòn đảo đầu tiên.', en: "You've set foot on your first island." },
    icon: 'Anchor',
    condition: (state) => state.visitedIslandIds.length >= 1,
  },
  {
    id: 'riddle-solver',
    name: { vi: 'Người Giải Đố', en: 'Riddle Solver' },
    description: { vi: 'Mày đã cân được thử thách đầu tiên.', en: 'You crushed your first challenge.' },
    icon: 'ScrollText',
    condition: (state) => state.solvedPuzzleIds.length >= 1,
  },
  {
    id: 'fully-charted',
    name: { vi: 'Khám Phá Trọn Vẹn', en: 'Fully Charted' },
    description: { vi: 'Mày đã lết hết qua mọi hòn đảo.', en: 'You dragged yourself through every island.' },
    icon: 'Map',
    // Dynamic against the current island count, so this stays correct if
    // more/fewer islands are added later.
    condition: (state) => state.visitedIslandIds.length >= islands.length,
  },
  {
    id: 'threefold-compass',
    name: { vi: 'La Bàn Trọn Vẹn', en: 'Compass Complete' },
    description: { vi: 'Mày đã gom đủ tất cả Mảnh La Bàn.', en: "You've hoarded every Compass Fragment." },
    icon: 'Compass',
    condition: (state) => state.collectedFragmentIds.length >= islands.length,
  },
  {
    id: 'horizon-keeper',
    name: { vi: 'Người Giữ Chân Trời', en: 'Horizon Keeper' },
    description: {
      vi: 'Mày đã ráp lại chiếc La Bàn và xong cả hành trình.',
      en: 'You reassembled the Compass and finished the damn voyage.',
    },
    icon: 'Star',
    condition: (state) => state.endingSeen,
  },
]

export function getAchievementById(id) {
  return achievements.find((achievement) => achievement.id === id) ?? null
}
