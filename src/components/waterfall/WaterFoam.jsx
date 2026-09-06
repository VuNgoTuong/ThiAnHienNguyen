import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function WaterFoam() {
  const foamGroupRef = useRef(null)
  const ring1Ref = useRef(null)
  const ring2Ref = useRef(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (ring1Ref.current) {
      const s1 = 1 + (t * 0.8) % 0.8
      ring1Ref.current.scale.set(s1, s1, 1)
      ring1Ref.current.material.opacity = (1 - (s1 - 1) / 0.8) * 0.75
    }
    if (ring2Ref.current) {
      const s2 = 1 + ((t * 0.8 + 0.4) % 0.8)
      ring2Ref.current.scale.set(s2, s2, 1)
      ring2Ref.current.material.opacity = (1 - (s2 - 1) / 0.8) * 0.6
    }
  })

  return (
    <group position={[0, 0.12, 0.6]}>
      {/* Concentric Impact Foam Rings */}
      <mesh ref={ring1Ref} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 1.4, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>

      <mesh ref={ring2Ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <ringGeometry args={[0.6, 2.0, 32]} />
        <meshBasicMaterial color="#b2f0fb" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Main Impact Froth Pool */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.9, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>
    </group>
  )
}
