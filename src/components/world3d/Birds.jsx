import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const FLOCK = [
  { radius: 9.5, height: 8.8, speed: 0.22, phase: 0 },
  { radius: 12.5, height: 10.2, speed: 0.18, phase: 2.2 },
  { radius: 8.0, height: 8.0, speed: 0.25, phase: 4.4 },
  { radius: 14.5, height: 11.8, speed: 0.15, phase: 1.2 },
  { radius: 11.0, height: 9.5, speed: 0.2, phase: 5.5 },
]

function useSeagullWingGeometry() {
  return useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0.05)
    shape.bezierCurveTo(0.12, 0.08, 0.28, 0.04, 0.45, -0.02)
    shape.bezierCurveTo(0.28, -0.01, 0.12, 0.01, 0, -0.03)
    shape.closePath()

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.008,
      bevelEnabled: true,
      bevelSize: 0.003,
      bevelThickness: 0.003,
      bevelSegments: 2,
    })
    return geo
  }, [])
}

function Seagull({ radius, height, speed, phase }) {
  const groupRef = useRef(null)
  const leftWingRef = useRef(null)
  const rightWingRef = useRef(null)
  const wingGeo = useSeagullWingGeometry()

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime()
    const t = elapsed * speed + phase
    if (groupRef.current) {
      groupRef.current.position.set(
        Math.cos(t) * radius - 2,
        height + Math.sin(t * 1.8) * 0.6,
        Math.sin(t * 0.7) * (radius * 0.55) - 6,
      )
      // Yaw rotation along flight circle
      groupRef.current.rotation.y = -t + Math.PI / 2
      // Aerodynamic banking roll into the turn
      groupRef.current.rotation.z = Math.sin(t) * 0.18
      groupRef.current.rotation.x = Math.cos(t * 1.8) * 0.06
    }

    // Realistic flap & glide cycle (flaps 4 times, then glides gracefully)
    const cycle = (elapsed * 6 + phase) % (Math.PI * 2)
    const isGliding = cycle > Math.PI * 1.2
    const flap = isGliding ? 0.06 : Math.sin(cycle * 2.5) * 0.45

    if (leftWingRef.current) leftWingRef.current.rotation.z = flap
    if (rightWingRef.current) rightWingRef.current.rotation.z = -flap
  })

  return (
    <group ref={groupRef} scale={1.8}>
      {/* Aerodynamic White Body */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.065, 0.44, 8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.35} />
      </mesh>

      {/* Head & Yellow Beak */}
      <group position={[0, 0.02, 0.2]}>
        <mesh castShadow>
          <sphereGeometry args={[0.055, 10, 10]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        {/* Beak */}
        <mesh position={[0, -0.01, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.018, 0.08, 6]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.4} />
        </mesh>
      </group>

      {/* Tail Feathers */}
      <mesh position={[0, 0.02, -0.22]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.08, 0.01, 0.12]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
      </mesh>

      {/* Curved Left Wing with Dark Wingtip */}
      <group ref={leftWingRef} position={[-0.05, 0.02, 0.02]}>
        <mesh geometry={wingGeo} scale={[-1, 1, 1]} castShadow>
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
        <mesh position={[-0.38, -0.01, -0.01]} scale={[0.12, 0.006, 0.04]} rotation={[0, -0.2, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </mesh>
      </group>

      {/* Curved Right Wing with Dark Wingtip */}
      <group ref={rightWingRef} position={[0.05, 0.02, 0.02]}>
        <mesh geometry={wingGeo} castShadow>
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
        <mesh position={[0.38, -0.01, -0.01]} scale={[0.12, 0.006, 0.04]} rotation={[0, 0.2, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </mesh>
      </group>
    </group>
  )
}

export function Birds() {
  return (
    <>
      {FLOCK.map((bird, index) => (
        <Seagull key={index} {...bird} />
      ))}
    </>
  )
}
