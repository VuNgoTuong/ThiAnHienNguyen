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
    description: { vi: 'Bạn đã đặt chân lên hòn đảo đầu tiên.', en: "You've set foot on your first island." },
    icon: 'Anchor',
    condition: (state) => state.visitedIslandIds.length >= 1,
  },
  {
    id: 'riddle-solver',
    name: { vi: 'Người Giải Đố', en: 'Riddle Solver' },
    description: { vi: 'Bạn đã vượt qua thử thách đầu tiên.', en: 'You cleared your first challenge.' },
    icon: 'ScrollText',
    condition: (state) => state.solvedPuzzleIds.length >= 1,
  },
  {
    id: 'fully-charted',
    name: { vi: 'Khám Phá Trọn Vẹn', en: 'Fully Charted' },
    description: { vi: 'Bạn đã khám phá tất cả các đảo.', en: 'You explored every island.' },
    icon: 'Map',
    // Dynamic against the current island count, so this stays correct if
    // more/fewer islands are added later.
    condition: (state) => state.visitedIslandIds.length >= islands.length,
  },
  {
    id: 'threefold-compass',
    name: { vi: 'La Bàn Trọn Vẹn', en: 'Compass Complete' },
    description: { vi: 'Bạn đã thu thập đủ tất cả Mảnh La Bàn.', en: "You've collected every Compass Fragment." },
    icon: 'Compass',
    condition: (state) => state.collectedFragmentIds.length >= islands.length,
  },
  {
    id: 'horizon-keeper',
    name: { vi: 'Người Giữ Chân Trời', en: 'Horizon Keeper' },
    description: {
      vi: 'Bạn đã ghép lại chiếc La Bàn và hoàn thành hành trình.',
      en: 'You reassembled the Compass and completed the voyage.',
    },
    icon: 'Star',
    condition: (state) => state.endingSeen,
  },
]

export function getAchievementById(id) {
  return achievements.find((achievement) => achievement.id === id) ?? null
}
