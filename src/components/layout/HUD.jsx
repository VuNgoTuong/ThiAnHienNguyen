import { useState } from 'react'
import { Package, Award, Compass } from 'lucide-react'
import { useFragments, useTranslation } from '../../hooks/useGame.js'
import { ProgressRing } from '../ui/ProgressRing.jsx'
import { LanguageToggle } from '../ui/LanguageToggle.jsx'
import { FullscreenToggle } from '../ui/FullscreenToggle.jsx'
import { InventoryPanel } from '../inventory/InventoryPanel.jsx'
import { AchievementsPanel } from '../achievements/AchievementsPanel.jsx'
import { uiStrings } from '../../data/uiStrings.js'

export function HUD() {
  const { t } = useTranslation()
  const [panel, setPanel] = useState(null) // 'inventory' | 'achievements' | null
  const { collected, total } = useFragments()

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-center justify-between p-4">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-parchment-200/15 bg-ocean-950/60 px-3 py-1.5 backdrop-blur">
          <ProgressRing value={collected.length} max={total} size={30} strokeWidth={3}>
            <Compass size={14} className="text-gold-400" />
          </ProgressRing>
          <span className="font-display text-xs text-parchment-100">
            {collected.length}/{total}
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <FullscreenToggle />
          <LanguageToggle />
          <button
            type="button"
            onClick={() => setPanel('inventory')}
            aria-label={t(uiStrings.compassFragments)}
            className="rounded-full border border-parchment-200/15 bg-ocean-950/60 p-2.5 text-parchment-100 backdrop-blur transition-colors hover:border-gold-500/50 hover:text-gold-400"
          >
            <Package size={18} />
          </button>
          <button
            type="button"
            onClick={() => setPanel('achievements')}
            aria-label={t(uiStrings.achievementsTitle)}
            className="rounded-full border border-parchment-200/15 bg-ocean-950/60 p-2.5 text-parchment-100 backdrop-blur transition-colors hover:border-gold-500/50 hover:text-gold-400"
          >
            <Award size={18} />
          </button>
        </div>
      </div>

      <InventoryPanel isOpen={panel === 'inventory'} onClose={() => setPanel(null)} />
      <AchievementsPanel isOpen={panel === 'achievements'} onClose={() => setPanel(null)} />
    </>
  )
}
