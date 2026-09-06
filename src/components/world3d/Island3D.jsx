import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { Lock, CheckCircle2, Sparkles, Compass } from 'lucide-react'
import * as THREE from 'three'
import { useTranslation } from '../../hooks/useGame.js'
import { uiStrings } from '../../data/uiStrings.js'
import { percentToWorld3D } from '../../utils/world3dCoords.js'
import { PalmTree } from './PalmIsland.jsx'
import { IslandTerrain } from './IslandTerrain.jsx'
import { ParadiseIsland } from './ParadiseIsland.jsx'

// Glowing beacon sky beam for unlocked / active islands
function IslandBeacon({ color = '#fbbf24' }) {
  const beamRef = useRef(null)
  useFrame(({ clock }) => {
    if (beamRef.current) {
      beamRef.current.rotation.y = clock.getElapsedTime() * 0.4
    }
  })

  return (
    <group position={[0, 0.5, 0]}>
      {/* Light Pillar */}
      <mesh ref={beamRef} position={[0, 3, 0]}>
        <cylinderGeometry args={[0.08, 0.45, 6, 16, 1, true]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Dynamic Point Light */}
      <pointLight color={color} intensity={2.2} distance={5} />
    </group>
  )
}

// Floating mystical ambient light particles over islands
function FloatingPollenParticles({ count = 12, color = '#fef08a' }) {
  const pointsRef = useRef(null)

  const positions = useRef(
    Array.from({ length: count }, () => [
      (Math.random() - 0.5) * 2.2,
      0.8 + Math.random() * 1.5,
      (Math.random() - 0.5) * 2.2,
    ]).flat(),
  ).current

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    const t = clock.getElapsedTime()
    const posAttr = pointsRef.current.geometry.attributes.position
    for (let i = 0; i < count; i++) {
      const y = positions[i * 3 + 1]
      posAttr.setY(i, y + Math.sin(t * 1.5 + i) * 0.08)
    }
    posAttr.needsUpdate = true
  })

  const geo = useRef(new THREE.BufferGeometry()).current
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial size={0.08} color={color} transparent opacity={0.7} blending={THREE.AdditiveBlending} />
    </points>
  )
}

export function Island3D({ island, unlocked, solved, onClick, isFinal = false }) {
  const { t } = useTranslation()
  const { x, z } = percentToWorld3D(island.position.x, island.position.y)

  const scale = isFinal ? 1.35 : 1.05
  const seed = (island.level || 5) * 4.1 + 1.6
  const isParadise = island.level === 1 || island.level === 3

  return (
    <group position={[x, 0, z]}>
      {/* 3D Terrain Model */}
      <group scale={scale}>
        {isParadise ? (
          <ParadiseIsland position={[0, -0.05, 0]} scale={0.42} rotation={[0, 0.4, 0]} seed={seed} />
        ) : (
          <IslandTerrain
            shoreColor={isFinal ? '#8a652e' : '#e6d59e'}
            landColor={isFinal ? '#b38332' : '#378243'}
            seed={seed}
          />
        )}
      </group>

      {!isParadise ? (
        <>
          <PalmTree position={[0.26 * scale, 0.68 * scale, 0.2 * scale]} scale={0.65 * scale} lean={0.12} />
          <PalmTree position={[-0.32 * scale, 0.6 * scale, -0.22 * scale]} scale={0.55 * scale} lean={-0.1} />
        </>
      ) : null}

      {/* Radiant Light Pillar for active / final island */}
      {unlocked ? <IslandBeacon color={isFinal ? '#f59e0b' : '#38bdf8'} /> : null}

      {/* Floating Magic Particles */}
      {unlocked ? <FloatingPollenParticles count={15} color={isFinal ? '#fbbf24' : '#67e8f9'} /> : null}

      {/* Premium Glassmorphic HTML Label Card */}
      <Html center distanceFactor={14} position={[0, 2.2 * scale, 0]}>
        <button
          type="button"
          disabled={!unlocked}
          onClick={onClick}
          className={`group flex flex-col items-center gap-1.5 rounded-2xl border px-3.5 py-2.5 backdrop-blur-xl transition-all duration-300 ${
            unlocked
              ? 'border-amber-400/50 bg-gradient-to-b from-ocean-900/90 via-ocean-950/95 to-ocean-900/90 shadow-[0_12px_35px_rgba(0,0,0,0.85)] hover:scale-110 hover:border-amber-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] cursor-pointer'
              : 'border-parchment-200/15 bg-ocean-950/60 opacity-60 cursor-not-allowed'
          }`}
        >
          {island.level ? (
            <span
              className={`rounded-full px-2.5 py-0.5 font-display text-[10px] font-black tracking-widest uppercase ${
                unlocked
                  ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-ink-950 shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                  : 'bg-parchment-100/20 text-parchment-100/50'
              }`}
            >
              {t(uiStrings.levelLabel)} {island.level}
            </span>
          ) : isFinal ? (
            <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-0.5 font-display text-[10px] font-black text-ink-950 shadow-[0_0_15px_rgba(245,158,11,0.8)]">
              <Compass size={12} className="animate-spin-slow" />
              <span>ĐẢO CUỐI</span>
            </span>
          ) : null}

          <div className="relative flex h-7 w-7 items-center justify-center">
            {unlocked && !solved ? (
              <span className="absolute -inset-2 animate-ping rounded-full bg-amber-400/35" />
            ) : null}
            {!unlocked ? <Lock size={18} className="text-parchment-200/60" /> : null}
            {solved ? (
              <CheckCircle2 size={20} className="text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.9)]" />
            ) : null}
            {unlocked && !solved ? (
              <Sparkles size={20} className="text-amber-300 animate-pulse drop-shadow-[0_0_10px_rgba(251,191,36,0.9)]" />
            ) : null}
          </div>

          <span
            className={`font-display text-xs font-bold tracking-wide whitespace-nowrap ${
              unlocked ? 'text-parchment-100 group-hover:text-amber-300' : 'text-parchment-100/40'
            }`}
          >
            {t(island.name)}
          </span>
        </button>
      </Html>
    </group>
  )
}

