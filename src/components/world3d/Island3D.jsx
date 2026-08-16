import { Html } from '@react-three/drei'
import { Lock, CheckCircle2 } from 'lucide-react'
import { useTranslation } from '../../hooks/useGame.js'
import { uiStrings } from '../../data/uiStrings.js'
import { percentToWorld3D } from '../../utils/world3dCoords.js'
import { PalmTree } from './PalmIsland.jsx'
import { IslandTerrain } from './IslandTerrain.jsx'
import { ParadiseIsland } from './ParadiseIsland.jsx'

export function Island3D({ island, unlocked, solved, onClick, isFinal = false }) {
  const { t } = useTranslation()
  const { x, z } = percentToWorld3D(island.position.x, island.position.y)
  const shoreColor = isFinal ? '#8a652e' : '#e6d59e'
  const landColor = isFinal ? '#b38332' : '#378243'
  const scale = isFinal ? 1.25 : 1
  const seed = (island.level || 1) * 3.7 + 1.2
  const isParadise = island.level === 1 || island.level === 3

  return (
    <group position={[x, 0, z]}>
      <group scale={scale}>
        {isParadise ? (
          <ParadiseIsland position={[0, -0.05, 0]} scale={0.4} rotation={[0, 0.4, 0]} seed={seed} />
        ) : (
          <IslandTerrain shoreColor={shoreColor} landColor={landColor} seed={seed} />
        )}
      </group>

      {!isParadise ? (
        <>
          <PalmTree position={[0.22 * scale, 0.65 * scale, 0.18 * scale]} scale={0.6 * scale} lean={0.12} />
          <PalmTree position={[-0.3 * scale, 0.58 * scale, -0.2 * scale]} scale={0.5 * scale} lean={-0.1} />
        </>
      ) : null}

      <Html center distanceFactor={14} position={[0, 1.7 * scale, 0]}>
        <button
          type="button"
          disabled={!unlocked}
          onClick={onClick}
          className={`group flex flex-col items-center gap-1.5 rounded-2xl border p-2.5 backdrop-blur-md transition-all duration-300 ${
            unlocked
              ? 'border-gold-400/40 bg-ocean-950/75 shadow-[0_10px_25px_rgba(0,0,0,0.7)] hover:scale-110 hover:border-gold-400 hover:shadow-[0_0_20px_rgba(232,195,104,0.5)] cursor-pointer'
              : 'border-parchment-200/15 bg-ocean-950/50 opacity-60 cursor-not-allowed'
          }`}
        >
          {island.level ? (
            <span
              className={`rounded-full px-2.5 py-0.5 font-display text-[10px] font-bold tracking-wider uppercase ${
                unlocked
                  ? 'bg-gradient-to-r from-gold-400 to-gold-500 text-ink-900 shadow-[0_0_8px_rgba(232,195,104,0.4)]'
                  : 'bg-parchment-100/20 text-parchment-100/50'
              }`}
            >
              {t(uiStrings.levelLabel)} {island.level}
            </span>
          ) : null}

          <div className="relative flex h-6 w-6 items-center justify-center">
            {unlocked && !solved ? <span className="absolute -inset-2 animate-ping rounded-full bg-gold-400/30" /> : null}
            {!unlocked ? <Lock size={17} className="text-parchment-200/60" /> : null}
            {solved ? <CheckCircle2 size={18} className="text-gold-400 drop-shadow-[0_0_6px_rgba(232,195,104,0.8)]" /> : null}
          </div>

          <span
            className={`font-display text-xs font-semibold tracking-wide whitespace-nowrap ${
              unlocked ? 'text-parchment-100 group-hover:text-gold-300' : 'text-parchment-100/40'
            }`}
          >
            {t(island.name)}
          </span>
        </button>
      </Html>
    </group>
  )
}
