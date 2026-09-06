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
      className={`rounded-full border border-gold-400/30 bg-ocean-950/75 p-2.5 text-parchment-100 backdrop-blur-md shadow-md transition-all duration-200 hover:border-gold-400 hover:text-gold-300 hover:bg-gold-500/15 hover:shadow-[0_0_15px_rgba(232,195,104,0.3)] ${className}`}
    >
      {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
    </button>
  )
}
