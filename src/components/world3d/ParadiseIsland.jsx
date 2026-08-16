import { useMemo } from 'react'
import * as THREE from 'three'
import { PalmTree } from './PalmIsland.jsx'

// Color Palette for an ultra-beautiful tropical paradise island
const BEACH_SAND = '#f4e4b7'
const WET_SAND = '#d9c693'
const LOW_HILL = '#388e3c'
const MID_HILL = '#2e7d32'
const HIGH_PEAK = '#1b5e20'
const ROCK_COLOR = '#665c4e'

// Coastal wave foam ring that pulses gently along the beach shore
function ShoreFoamRing({ radius = 3.2 }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      <ringGeometry args={[radius * 0.95, radius * 1.15, 48]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.65} side={THREE.DoubleSide} />
    </mesh>
  )
}

// Procedural organic paradise island landmass with smooth FBM noise deformation
function useParadiseTerrainGeometry(seed = 1.0) {
  return useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.5, 3.2, 1.4, 64, 32)
    const pos = geo.attributes.position

    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i)
      let y = pos.getY(i)
      let z = pos.getZ(i)

      const normY = (y + 0.7) / 1.4 // 0 (beach base) to 1 (hilltop)
      const dist = Math.sqrt(x * x + z * z)
      const angle = Math.atan2(z, x)

      // Smooth organic noise for bays, headlands, and gentle hill curves
      const wave1 = Math.sin(angle * 4 + seed) * 0.45
      const wave2 = Math.cos(angle * 7 - seed * 1.5) * 0.22
      const wave3 = Math.sin((x + z) * 1.8 + seed * 2.0) * 0.15

      const radiusOffset = (wave1 + wave2 + wave3) * (1.0 - normY * 0.5)

      x += (x / (dist || 1)) * radiusOffset
      z += (z / (dist || 1)) * radiusOffset

      // Smooth central peak elevation
      if (normY > 0.3) {
        y += Math.pow(normY, 1.8) * 0.55 + Math.sin(x * 2.0 + z * 2.0) * 0.12
      }

      pos.setXYZ(i, x, y, z)
    }

    geo.computeVertexNormals()
    return geo
  }, [seed])
}

function TropicalBush({ position, scale = 1, color = LOW_HILL }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.12, 0]} castShadow>
        <sphereGeometry args={[0.32, 14, 10]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0.14, 0.18, 0.12]} scale={0.7} castShadow>
        <sphereGeometry args={[0.25, 12, 10]} />
        <meshStandardMaterial color={MID_HILL} roughness={0.7} />
      </mesh>
    </group>
  )
}

function CoastalRock({ position, scale = 1, rotation = 0 }) {
  return (
    <mesh position={position} scale={[scale, scale * 0.75, scale * 0.9]} rotation={[0.1, rotation, 0.05]} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.22, 1]} />
      <meshStandardMaterial color={ROCK_COLOR} roughness={0.88} />
    </mesh>
  )
}

// Ancient Golden Arch Landmark embedded on the central hill
function AncientArch({ position }) {
  return (
    <group position={position}>
      <mesh position={[-0.35, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.9, 12]} />
        <meshStandardMaterial color={ROCK_COLOR} roughness={0.8} />
      </mesh>
      <mesh position={[0.35, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.9, 12]} />
        <meshStandardMaterial color={ROCK_COLOR} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.92, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.85, 12]} />
        <meshStandardMaterial color={ROCK_COLOR} roughness={0.8} />
      </mesh>

      {/* Glowing Golden Crystal Shrine inside the arch */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <octahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial color="#ffe899" emissive="#ffd700" emissiveIntensity={1.8} roughness={0.2} />
      </mesh>
      <pointLight position={[0, 0.45, 0]} color="#ffb700" intensity={0.8} distance={2.5} />
    </group>
  )
}

export function ParadiseIsland({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0], seed = 1.0 }) {
  const terrainGeo = useParadiseTerrainGeometry(seed)

  return (
    <group position={position} scale={scale} rotation={rotation}>
      {/* Wave Foam Ring along the Shore */}
      <ShoreFoamRing radius={3.2} />

      {/* Outer Shallow Water Turquoise Glow Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[3.2, 4.2, 48]} />
        <meshBasicMaterial color="#4de8d8" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>

      {/* Main Organic Paradise Island Hill */}
      <mesh geometry={terrainGeo} position={[0, 0.65, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={MID_HILL} roughness={0.72} metalness={0.05} />
      </mesh>

      {/* Lower Sandy Beach Belt */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.8, 3.3, 0.28, 48]} />
        <meshStandardMaterial color={BEACH_SAND} roughness={0.88} />
      </mesh>

      {/* Summit Rainforest Dome */}
      <mesh position={[0, 1.45, 0]} castShadow>
        <sphereGeometry args={[0.65, 24, 18]} />
        <meshStandardMaterial color={HIGH_PEAK} roughness={0.65} />
      </mesh>

      {/* Dense Tropical Palm Groves */}
      <PalmTree position={[1.2, 0.3, 1.1]} scale={0.85} lean={0.15} />
      <PalmTree position={[-1.4, 0.28, 0.8]} scale={0.75} lean={-0.12} />
      <PalmTree position={[1.5, 0.25, -1.0]} scale={0.8} lean={0.08} />
      <PalmTree position={[-1.1, 0.32, -1.3]} scale={0.7} lean={-0.15} />
      <PalmTree position={[0.2, 0.8, -0.6]} scale={0.65} lean={0.05} />

      {/* Tropical Bush Clusters */}
      <TropicalBush position={[1.6, 0.28, 0.4]} scale={0.9} color={LOW_HILL} />
      <TropicalBush position={[-1.5, 0.3, -0.5]} scale={0.85} color={LOW_HILL} />
      <TropicalBush position={[0.6, 1.1, 0.7]} scale={0.75} color={MID_HILL} />
      <TropicalBush position={[-0.7, 1.15, -0.4]} scale={0.8} color={HIGH_PEAK} />

      {/* Coastal Boulders */}
      <CoastalRock position={[2.2, 0.12, 1.5]} scale={1.1} rotation={0.4} />
      <CoastalRock position={[-2.4, 0.12, 0.9]} scale={0.95} rotation={1.2} />
      <CoastalRock position={[1.8, 0.12, -2.1]} scale={1.0} rotation={2.1} />
      <CoastalRock position={[-2.0, 0.12, -1.8]} scale={0.85} rotation={0.7} />

      {/* Ancient Golden Crystal Shrine */}
      <AncientArch position={[0, 1.4, 0.2]} />
    </group>
  )
}
