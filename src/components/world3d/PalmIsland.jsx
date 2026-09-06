import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { IslandTerrain } from './IslandTerrain.jsx'

export function PalmTree({ position = [0, 0, 0], scale = 1, lean = 0 }) {
  const crownRef = useRef(null)
  const trunkRef = useRef(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const wind = Math.sin(t * 1.5 + position[0] * 2) * 0.04
    if (crownRef.current) {
      crownRef.current.rotation.z = wind
      crownRef.current.rotation.x = Math.cos(t * 1.2 + position[2]) * 0.025
    }
    if (trunkRef.current) {
      trunkRef.current.rotation.z = lean + wind * 0.35
    }
  })

  // 10 Curved, drooping palm fronds that arch downward naturally
  const frondGeometries = useMemo(() => {
    const fronds = []
    const count = 10
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const shape = new THREE.Shape()
      shape.moveTo(0, 0)
      shape.quadraticCurveTo(0.06, 0.3, 0.14, 0.75)
      shape.quadraticCurveTo(0.03, 0.5, 0, 0)

      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: 0.012,
        bevelEnabled: true,
        bevelSize: 0.004,
        bevelThickness: 0.004,
        bevelSegments: 2,
      })
      geo.center()
      fronds.push({ geo, angle })
    }
    return fronds
  }, [])

  return (
    <group position={position} scale={scale}>
      {/* Segmented curving mahogany trunk */}
      <mesh ref={trunkRef} position={[0.04, 0.52, 0]} rotation={[0, 0, lean + 0.1]} castShadow>
        <cylinderGeometry args={[0.022, 0.046, 1.08, 12, 4]} />
        <meshStandardMaterial color="#543b22" roughness={0.88} />
      </mesh>

      {/* Wind-Swaying Drooping Leaf Crown */}
      <group ref={crownRef} position={[0.06, 1.08, 0]}>
        {/* Coconuts at crown center */}
        {[0, 1.3, 2.6].map((rot, idx) => (
          <mesh key={idx} position={[Math.cos(rot) * 0.04, -0.02, Math.sin(rot) * 0.04]}>
            <sphereGeometry args={[0.032, 8, 8]} />
            <meshStandardMaterial color="#3d2817" roughness={0.7} />
          </mesh>
        ))}

        {/* Drooping Palm Fronds (pointing outward & curving down) */}
        {frondGeometries.map(({ geo, angle }, i) => (
          <mesh
            key={i}
            geometry={geo}
            position={[Math.cos(angle) * 0.28, -Math.sin(i * 0.4) * 0.04, Math.sin(angle) * 0.28]}
            rotation={[Math.PI / 2.6, angle, -Math.PI / 4]}
            castShadow
          >
            <meshStandardMaterial
              color={i % 2 === 0 ? '#27853c' : '#32a048'}
              roughness={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
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
        shoreColor="#ebd59b"
        transitionColor="#cca862"
        slopeColor="#5a8b43"
        landColor="#2d8a4e"
        rocks={ROCKS}
      />
      <PalmTree position={[0.25, 0.75, 0.12]} scale={0.8} lean={0.14} />
      <PalmTree position={[-0.32, 0.7, -0.18]} scale={0.65} lean={-0.1} />
      <PalmTree position={[0.02, 0.72, -0.35]} scale={0.55} lean={0.06} />
    </group>
  )
}
