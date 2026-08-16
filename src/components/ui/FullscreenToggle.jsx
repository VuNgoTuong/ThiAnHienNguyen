import { Maximize, Minimize } from 'lucide-react'
import { useFullscreen } from '../../hooks/useFullscreen.js'
import { useTranslation } from '../../hooks/useGame.js'
import { uiStrings } from '../../data/uiStrings.js'

export function FullscreenToggle({ className = '' }) {
  const { isFullscreen, toggleFullscreen } = useFullscreen()
  const { t } = useTranslation()

  return (
    <button
      type="button"
      onClick={toggleFullscreen}
      aria-label={t(isFullscreen ? uiStrings.exitFullscreen : uiStrings.enterFullscreen)}
      title={t(isFullscreen ? uiStrings.exitFullscreen : uiStrings.enterFullscreen)}
      className={`rounded-full border border-parchment-200/15 bg-ocean-950/60 p-2.5 text-parchment-100 backdrop-blur transition-colors hover:border-gold-500/50 hover:text-gold-400 ${className}`}
    >
      {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
    </button>
  )
}
