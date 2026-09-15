import { Anchor, ScrollText, Map, Compass, Star, Award } from 'lucide-react'

// Named imports (not `import * as Icons`) so bundlers can tree-shake the
// other ~4000 lucide-react icons out of the build — every icon string used
// in data/achievements.js must have an entry here.
export const achievementIcons = { Anchor, ScrollText, Map, Compass, Star }

export const fallbackAchievementIcon = Award
