import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

// A handful of tiny, very low-poly silhouettes looping across the sky —
// meant to be glanced at, not scrutinized up close, so a simple flattened
// wing shape with a bobbing flap reads fine at this distance/scale.
const FLOCK = [
  { radius: 16, height: 22, speed: 0.16, phase: 0, tilt: 0.15 },
  { radius: 21, height: 26, speed: 0.13, phase: 2.4, tilt: -0.1 },
  { radius: 12, height: 19, speed: 0.21, phase: 4.6, tilt: 0.2 },
  { radius: 24, height: 29, speed: 0.11, phase: 1.2, tilt: -0.15 },
  { radius: 18, height: 24, speed: 0.15, phase: 5.6, tilt: 0.1 },
]

function Bird({ radius, height, speed, phase, tilt }) {
  const groupRef = useRef(null)
  const wingRef = useRef(null)

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime()
    const t = elapsed * speed + phase
    if (groupRef.current) {
      groupRef.current.position.set(Math.cos(t) * radius, height + Math.sin(t * 1.7) * 1.2, Math.sin(t) * radius * 0.55 - 20)
      groupRef.current.rotation.y = -t + Math.PI / 2
      groupRef.current.rotation.z = tilt
    }
    if (wingRef.current) {
      wingRef.current.scale.y = 0.5 + Math.abs(Math.sin(elapsed * 9 + phase)) * 0.9
    }
  })

  return (
    <group ref={groupRef}>
      <mesh ref={wingRef}>
        <coneGeometry args={[0.16, 0.5, 3]} />
        <meshStandardMaterial color="#241a0e" />
      </mesh>
    </group>
  )
}

export function Birds() {
  return (
    <>
      {FLOCK.map((bird, index) => (
        <Bird key={index} {...bird} />
      ))}
    </>
  )
}
