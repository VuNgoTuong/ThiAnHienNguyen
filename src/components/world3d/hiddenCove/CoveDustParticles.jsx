import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const COUNT = 90
const BOUNDS = { x: 6, yMin: 0.2, yMax: 3.6, z: 5 }

export function CoveDustParticles() {
  const pointsRef = useRef(null)

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    const spd = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * BOUNDS.x * 2
      pos[i * 3 + 1] = BOUNDS.yMin + Math.random() * (BOUNDS.yMax - BOUNDS.yMin)
      pos[i * 3 + 2] = (Math.random() - 0.5) * BOUNDS.z * 2
      spd[i] = 0.05 + Math.random() * 0.09
    }
    return [pos, spd]
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const geometry = pointsRef.current?.geometry
    if (!geometry) return
    const position = geometry.attributes.position
    for (let i = 0; i < COUNT; i++) {
      let y = position.getY(i) + speeds[i] * 0.01
      if (y > BOUNDS.yMax) y = BOUNDS.yMin
      position.setY(i, y)
      position.setX(i, position.getX(i) + Math.sin(t * 0.4 + i) * 0.0015)
      position.setZ(i, position.getZ(i) + Math.cos(t * 0.3 + i) * 0.0012)
    }
    position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={COUNT} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#f4d9a0" size={0.045} transparent opacity={0.55} depthWrite={false} sizeAttenuation />
    </points>
  )
}

const BURST_COUNT = 46
const BURST_LIFE = 1.1

export function CoveBurstParticles({ active }) {
  const pointsRef = useRef(null)
  const materialRef = useRef(null)
  const stateRef = useRef({ elapsed: BURST_LIFE, velocities: null })

  const positions = useMemo(() => new Float32Array(BURST_COUNT * 3), [])

  useFrame((_, delta) => {
    const geometry = pointsRef.current?.geometry
    if (!geometry) return
    const s = stateRef.current

    if (active && s.elapsed >= BURST_LIFE) {
      // (re)arm: reset every particle to origin with a fresh random velocity
      s.elapsed = 0
      s.velocities = new Float32Array(BURST_COUNT * 3)
      const position = geometry.attributes.position
      for (let i = 0; i < BURST_COUNT; i++) {
        position.setXYZ(i, 0, 0.15, 0)
        const angle = Math.random() * Math.PI * 2
        const upward = 0.9 + Math.random() * 1.6
        const outward = 0.6 + Math.random() * 1.4
        s.velocities[i * 3] = Math.cos(angle) * outward
        s.velocities[i * 3 + 1] = upward
        s.velocities[i * 3 + 2] = Math.sin(angle) * outward
      }
      position.needsUpdate = true
    }

    if (s.elapsed >= BURST_LIFE) {
      if (materialRef.current) materialRef.current.opacity = 0
      return
    }

    s.elapsed += delta
    const position = geometry.attributes.position
    for (let i = 0; i < BURST_COUNT; i++) {
      const vx = s.velocities[i * 3]
      const vy = s.velocities[i * 3 + 1] - s.elapsed * 2.2 // gravity
      const vz = s.velocities[i * 3 + 2]
      position.setXYZ(
        i,
        position.getX(i) + vx * delta,
        Math.max(0, position.getY(i) + vy * delta),
        position.getZ(i) + vz * delta,
      )
    }
    position.needsUpdate = true
    if (materialRef.current) materialRef.current.opacity = Math.max(0, 1 - s.elapsed / BURST_LIFE)
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={BURST_COUNT} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color="#ffd27a"
        size={0.09}
        transparent
        opacity={0}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}
