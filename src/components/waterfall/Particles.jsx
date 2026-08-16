import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Particles() {
  const particlesRef = useRef(null)

  const dustData = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      x: (Math.random() - 0.5) * 14,
      y: 1.0 + Math.random() * 8.0,
      z: (Math.random() - 0.5) * 8.0,
      speed: 0.2 + Math.random() * 0.5,
      phase: i * 0.3,
    }))
  }, [])

  useFrame(({ clock }) => {
    if (!particlesRef.current) return
    const t = clock.getElapsedTime()
    particlesRef.current.children.forEach((child, i) => {
      const d = dustData[i]
      child.position.y = d.y + Math.sin(t * d.speed + d.phase) * 0.4
      child.position.x = d.x + Math.cos(t * d.speed * 0.5 + d.phase) * 0.2
    })
  })

  return (
    <group ref={particlesRef}>
      {dustData.map((d, i) => (
        <mesh key={i} position={[d.x, d.y, d.z]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshBasicMaterial color="#ffecb3" transparent opacity={0.65} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}
