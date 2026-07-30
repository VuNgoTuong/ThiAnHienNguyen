import { Html } from '@react-three/drei'
import { Lock, CheckCircle2 } from 'lucide-react'
import { useTranslation } from '../../hooks/useGame.js'
import { uiStrings } from '../../data/uiStrings.js'
import { percentToWorld3D } from '../../utils/world3dCoords.js'
import { PalmTree } from './PalmIsland.jsx'
import { IslandTerrain } from './IslandTerrain.jsx'

// 3D counterpart of the old IslandNode.jsx — same badge/lock/label markup
// (kept as a drei <Html> overlay so click handling stays plain DOM instead
// of mesh raycasting), the island glyph itself is now a low-poly mesh.
export function Island3D({ island, unlocked, solved, onClick, isFinal = false }) {
  const { t } = useTranslation()
  const { x, z } = percentToWorld3D(island.position.x, island.position.y)
  const shoreColor = isFinal ? '#7a5a2a' : '#3a6b3f'
  const landColor = isFinal ? '#a3792f' : '#4d8a52'
  const scale = isFinal ? 1.15 : 1

  return (
    <group position={[x, 0, z]}>
      <group scale={scale}>
        <IslandTerrain shoreColor={shoreColor} landColor={landColor} />
      </group>
      <PalmTree position={[0.2 * scale, 0.72 * scale, 0.15 * scale]} scale={0.55 * scale} lean={0.1} />

      <Html center distanceFactor={14} position={[0, 1.6 * scale, 0]}>
        <button
          type="button"
          disabled={!unlocked}
          onClick={onClick}
          className="flex flex-col items-center gap-1 disabled:cursor-not-allowed"
        >
          {island.level ? (
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-display tracking-wide ${
                unlocked ? 'bg-gold-400 text-ink-900' : 'bg-parchment-100/20 text-parchment-100/50'
              }`}
            >
              {t(uiStrings.levelLabel)} {island.level}
            </span>
          ) : null}

          <div className="relative flex h-6 w-6 items-center justify-center">
            {unlocked && !solved ? <span className="absolute -inset-2 animate-ping rounded-full bg-gold-400/25" /> : null}
            {!unlocked ? <Lock size={16} className="text-parchment-200/70" /> : null}
            {solved ? <CheckCircle2 size={16} className="text-gold-400" /> : null}
          </div>

          <span
            className={`font-display text-xs tracking-wide whitespace-nowrap ${
              unlocked ? 'text-parchment-100' : 'text-parchment-100/40'
            }`}
          >
            {t(island.name)}
          </span>
        </button>
      </Html>
    </group>
  )
}
