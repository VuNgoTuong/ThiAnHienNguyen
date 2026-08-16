import { useMemo } from 'react'
import * as THREE from 'three'
import { IslandTerrain } from './IslandTerrain.jsx'

export function PalmTree({ position, scale = 1, lean = 0 }) {
  // Generate curved organic frond blades that fan outward naturally
  const frondGeometries = useMemo(() => {
    const fronds = []
    const count = 7
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const shape = new THREE.Shape()
      shape.moveTo(0, 0)
      shape.quadraticCurveTo(0.08, 0.25, 0.16, 0.65)
      shape.quadraticCurveTo(0.04, 0.45, 0, 0)
      
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: 0.015,
        bevelEnabled: true,
        bevelSize: 0.005,
        bevelThickness: 0.005,
        bevelSegments: 2,
      })
      geo.center()
      fronds.push({ geo, angle })
    }
    return fronds
  }, [])

  return (
    <group position={position} scale={scale} rotation={[0, 0, lean]}>
      {/* Segmented curving trunk */}
      <mesh position={[0.06, 0.52, 0]} rotation={[0, 0, 0.12]} castShadow>
        <cylinderGeometry args={[0.024, 0.048, 1.05, 12, 4]} />
        <meshStandardMaterial color="#5c3f24" roughness={0.88} />
      </mesh>

      {/* Coconuts at crown center */}
      {[0, 1.3, 2.6].map((rot, idx) => (
        <mesh key={idx} position={[0.08 + Math.cos(rot) * 0.04, 1.02, Math.sin(rot) * 0.04]}>
          <sphereGeometry args={[0.032, 8, 8]} />
          <meshStandardMaterial color="#3d2817" roughness={0.7} />
        </mesh>
      ))}

      {/* Organic Palm Fronds */}
      {frondGeometries.map(({ geo, angle }, i) => (
        <mesh
          key={i}
          geometry={geo}
          position={[
            0.08 + Math.cos(angle) * 0.22,
            1.05 - Math.sin(i * 0.5) * 0.02,
            Math.sin(angle) * 0.22,
          ]}
          rotation={[
            Math.PI / 3.2,
            angle,
            -Math.PI / 4,
          ]}
          castShadow
        >
          <meshStandardMaterial
            color={i % 2 === 0 ? '#2e8b42' : '#38a04d'}
            roughness={0.65}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

const ROCKS = [
  { position: [0.55, 0.02, 0.7], scale: 1, rotation: 0.4 },
  { position: [-0.7, 0.0, 0.5], scale: 0.7, rotation: 1.1 },
  { position: [0.3, 0.0, -0.85], scale: 0.85, rotation: 2.2 },
]

export function PalmIsland({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <IslandTerrain
        shoreColor="#e6d59e"
        transitionColor="#cca862"
        slopeColor="#5a8b43"
        landColor="#378243"
        rocks={ROCKS}
      />
      <PalmTree position={[0.25, 0.75, 0.12]} scale={0.8} lean={0.14} />
      <PalmTree position={[-0.32, 0.7, -0.18]} scale={0.65} lean={-0.1} />
      <PalmTree position={[0.02, 0.72, -0.35]} scale={0.55} lean={0.06} />
    </group>
  )
}

