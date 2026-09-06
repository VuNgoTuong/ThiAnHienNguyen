import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, RefreshCw, CloudFog, Camera, Eye, ArrowLeft } from 'lucide-react'
import { useWaterfallStore } from './useWaterfallStore.js'

export function WaterfallHUD({ onBack }) {
  const fogEnabled = useWaterfallStore((s) => s.fogEnabled)
  const cinematicMode = useWaterfallStore((s) => s.cinematicMode)
  const isHovered = useWaterfallStore((s) => s.isHovered)
  const isSelected = useWaterfallStore((s) => s.isSelected)

  const toggleFog = useWaterfallStore((s) => s.toggleFog)
  const toggleCinematicMode = useWaterfallStore((s) => s.toggleCinematicMode)
  const resetCamera = useWaterfallStore((s) => s.resetCamera)
  const setCameraMode = useWaterfallStore((s) => s.setCameraMode)

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-6 sm:p-8">
      {/* Top Header Glass Banner */}
      <div className="flex items-start justify-between">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pointer-events-auto flex items-center gap-4 rounded-3xl border border-gold-400/30 bg-ocean-950/65 px-6 py-4 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
        >
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="rounded-full border border-gold-400/30 p-2 text-parchment-100 transition-all hover:bg-gold-500/15 hover:text-gold-300"
              title="Return"
            >
              <ArrowLeft size={18} />
            </button>
          ) : null}

          <div>
            <span className="font-display text-xs font-bold tracking-[0.35em] text-gold-400 uppercase">
              WATERFALL
            </span>
            <h1 className="font-serif text-xl font-medium text-parchment-100 italic sm:text-2xl">
              Hidden in the Emerald Forest
            </h1>
          </div>
        </motion.div>

        {/* Hover / Selected Interactive Tooltip */}
        <AnimatePresence>
          {isHovered || isSelected ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="pointer-events-auto rounded-2xl border border-gold-400/50 bg-ocean-950/80 px-4 py-2.5 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.7)]"
            >
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-gold-400 animate-pulse" />
                <span className="font-display text-xs font-semibold tracking-wider text-parchment-100 uppercase">
                  {isSelected ? 'Cinematic View Active' : 'Waterfall - Click to Zoom'}
                </span>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Bottom Footer Action Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="pointer-events-auto mx-auto flex flex-wrap items-center justify-center gap-3 rounded-full border border-gold-400/30 bg-ocean-950/75 p-2 backdrop-blur-md shadow-[0_15px_50px_rgba(0,0,0,0.7)]"
      >
        <button
          type="button"
          onClick={() => setCameraMode('explore')}
          className="flex items-center gap-2 rounded-full border border-gold-400/30 bg-ocean-900/60 px-5 py-2.5 font-display text-xs font-semibold tracking-wider text-parchment-100 transition-all hover:border-gold-400 hover:bg-gold-500/20 hover:text-gold-300"
        >
          <Eye size={15} /> Explore
        </button>

        <button
          type="button"
          onClick={resetCamera}
          className="flex items-center gap-2 rounded-full border border-gold-400/30 bg-ocean-900/60 px-5 py-2.5 font-display text-xs font-semibold tracking-wider text-parchment-100 transition-all hover:border-gold-400 hover:bg-gold-500/20 hover:text-gold-300"
        >
          <RefreshCw size={15} /> Reset Camera
        </button>

        <button
          type="button"
          onClick={toggleFog}
          className={`flex items-center gap-2 rounded-full border px-5 py-2.5 font-display text-xs font-semibold tracking-wider transition-all ${
            fogEnabled
              ? 'border-gold-400 bg-gold-500/20 text-gold-300 shadow-[0_0_15px_rgba(232,195,104,0.3)]'
              : 'border-gold-400/30 bg-ocean-900/60 text-parchment-100 hover:border-gold-400'
          }`}
        >
          <CloudFog size={15} /> {fogEnabled ? 'Fog On' : 'Fog Off'}
        </button>

        <button
          type="button"
          onClick={toggleCinematicMode}
          className={`flex items-center gap-2 rounded-full border px-5 py-2.5 font-display text-xs font-semibold tracking-wider transition-all ${
            cinematicMode
              ? 'border-gold-400 bg-gradient-to-r from-gold-400 to-gold-500 text-ink-900 shadow-[0_0_20px_rgba(232,195,104,0.5)]'
              : 'border-gold-400/30 bg-ocean-900/60 text-parchment-100 hover:border-gold-400'
          }`}
        >
          <Camera size={15} /> {cinematicMode ? 'Cinematic On' : 'Toggle Cinematic Mode'}
        </button>
      </motion.div>
    </div>
  )
}
