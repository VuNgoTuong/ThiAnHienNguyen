import { useState } from 'react'
import { Package, Award, Compass, Droplets } from 'lucide-react'
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
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-center justify-between p-2.5 sm:p-5">
        <div className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-gold-400/30 bg-ocean-950/75 px-2.5 py-1.5 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.6)] sm:gap-2.5 sm:px-4 sm:py-2">
          <ProgressRing value={collected.length} max={total} size={26} strokeWidth={3}>
            <Compass size={12} className="text-gold-400 drop-shadow-[0_0_6px_rgba(232,195,104,0.6)]" />
          </ProgressRing>
          <span className="font-display text-xs font-bold tracking-wider text-parchment-100 sm:text-sm">
            {collected.length}/{total}
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-0.5 rounded-full border border-gold-400/30 bg-ocean-950/75 p-1 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.6)] sm:gap-2.5 sm:p-1.5">
          <FullscreenToggle className="border-0 bg-transparent p-1.5 shadow-none hover:bg-gold-500/15 sm:p-2.5" />
          <div className="h-4 w-px bg-gold-400/20" />
          <LanguageToggle className="border-0 bg-transparent shadow-none" />
          <div className="h-4 w-px bg-gold-400/20" />
          <button
            type="button"
            onClick={() => setPanel('inventory')}
            aria-label={t(uiStrings.compassFragments)}
            className="rounded-full p-1.5 text-parchment-100 transition-all duration-200 hover:bg-gold-500/15 hover:text-gold-300 hover:shadow-[0_0_12px_rgba(232,195,104,0.3)] sm:p-2"
          >
            <Package size={16} />
          </button>
          <button
            type="button"
            onClick={() => setPanel('achievements')}
            aria-label={t(uiStrings.achievementsTitle)}
            className="rounded-full p-1.5 text-parchment-100 transition-all duration-200 hover:bg-gold-500/15 hover:text-gold-300 hover:shadow-[0_0_12px_rgba(232,195,104,0.3)] sm:p-2"
          >
            <Award size={16} />
          </button>
        </div>
      </div>

      <InventoryPanel isOpen={panel === 'inventory'} onClose={() => setPanel(null)} />
      <AchievementsPanel isOpen={panel === 'achievements'} onClose={() => setPanel(null)} />
    </>
  )
}
