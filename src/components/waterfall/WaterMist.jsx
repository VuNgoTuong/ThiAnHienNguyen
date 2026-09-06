import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function WaterMist() {
  const groupRef = useRef(null)

  const mistClouds = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => ({
      x: (Math.random() - 0.5) * 4.2,
      y: 0.3 + Math.random() * 2.2,
      z: 0.2 + (Math.random() - 0.5) * 2.5,
      scale: 0.8 + Math.random() * 1.4,
      speed: 0.4 + Math.random() * 0.8,
      phase: i * 0.4,
    }))
  }, [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.children.forEach((child, i) => {
      const m = mistClouds[i]
      const cycle = (t * m.speed + m.phase) % (Math.PI * 2)
      child.position.y = m.y + Math.sin(cycle) * 0.35
      child.scale.setScalar(m.scale * (0.85 + Math.sin(cycle * 0.8) * 0.25))
      child.material.opacity = (Math.sin(cycle) * 0.5 + 0.5) * 0.32
    })
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {mistClouds.map((m, i) => (
        <mesh key={i} position={[m.x, m.y, m.z]}>
          <sphereGeometry args={[0.75, 12, 10]} />
          <meshBasicMaterial color="#e0f7fc" transparent opacity={0.25} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}
