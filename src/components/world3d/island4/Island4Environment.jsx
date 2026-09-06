import { forwardRef, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GradientSky } from '../GradientSky.jsx'
import { Ocean3D } from '../Ocean3D.jsx'
import { Birds } from '../Birds.jsx'

// Deep cyan/midnight palette — distinct from Island 1 (daytime blue) and
// Island 3 (violet/twilight). Cool and a little mysterious, with a
// beacon-like glow reserved for the AI Core itself, per spec: "mysterious,
// warm, playful, cinematic, premium, slightly magical."
export function Island4Sky() {
  return <GradientSky topColor="#0a2440" horizonColor="#3fb6c9" bottomColor="#04121f" exponent={0.75} />
}

const PARTICLE_COLORS = ['#7fe8ff', '#f0c675', '#e8f6ff']
const COUNT = 90
const BOUNDS = { radius: 6, yMin: 0.3, yMax: 4.2 }

export function AIRoomParticles() {
  const pointsRef = useRef(null)

  const [positions, colors, speeds] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    const col = new Float32Array(COUNT * 3)
    const spd = new Float32Array(COUNT)
    const color = new THREE.Color()
    for (let i = 0; i < COUNT; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = Math.sqrt(Math.random()) * BOUNDS.radius
      pos[i * 3] = Math.cos(angle) * r
      pos[i * 3 + 1] = BOUNDS.yMin + Math.random() * (BOUNDS.yMax - BOUNDS.yMin)
      pos[i * 3 + 2] = Math.sin(angle) * r
      color.set(PARTICLE_COLORS[i % PARTICLE_COLORS.length])
      col[i * 3] = color.r
      col[i * 3 + 1] = color.g
      col[i * 3 + 2] = color.b
      spd[i] = 0.03 + Math.random() * 0.06
    }
    return [pos, col, spd]
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
      position.setX(i, position.getX(i) + Math.sin(t * 0.25 + i) * 0.0015)
      position.setZ(i, position.getZ(i) + Math.cos(t * 0.2 + i) * 0.0015)
    }
    position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={COUNT} itemSize={3} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} count={COUNT} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.7} depthWrite={false} sizeAttenuation />
    </points>
  )
}

// The AI Core — a softly spinning glass sphere with an inner glow.
// `intensityRef` lets the orchestrator drive extra brightness during the
// "thinking" pulse and each round's reaction beat, without re-rendering the
// 3D tree every frame. `.current` can go negative to dim it below its idle
// baseline (used for the final-reveal "AI Core dims" beat).
export const AICore = forwardRef(function AICore(_, intensityRef) {
  const coreRef = useRef(null)
  const lightRef = useRef(null)
  const ringRef = useRef(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const boost = intensityRef?.current ?? 0
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.18
      coreRef.current.position.y = 1.3 + Math.sin(t * 0.8) * 0.06
    }
    if (ringRef.current) ringRef.current.rotation.z = t * 0.12
    if (lightRef.current) {
      lightRef.current.intensity = Math.max(0.15, 1.3 + Math.sin(t * 1.3) * 0.25 + boost)
    }
  })

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={coreRef} position={[0, 1.3, 0]}>
        <icosahedronGeometry args={[0.5, 2]} />
        <meshStandardMaterial
          color="#bfeeff"
          emissive="#3fd8ff"
          emissiveIntensity={1.2}
          roughness={0.15}
          metalness={0.2}
          transparent
          opacity={0.92}
        />
      </mesh>
      <pointLight ref={lightRef} position={[0, 1.3, 0]} color="#7fe8ff" distance={10} intensity={1.3} />
      <mesh ref={ringRef} position={[0, 1.3, 0]} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[0.85, 0.015, 8, 64]} />
        <meshBasicMaterial color="#7fe8ff" transparent opacity={0.5} />
      </mesh>
      {/* glowing ring set into the floor beneath the core */}
      <mesh position={[0, 0.021, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.05, 1.28, 48]} />
        <meshBasicMaterial color="#3fd8ff" transparent opacity={0.5} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.022, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.65, 1.76, 48]} />
        <meshBasicMaterial color="#f0c675" transparent opacity={0.3} depthWrite={false} />
      </mesh>
    </group>
  )
})

function GlassPillar({ angle, radius = 3.6 }) {
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius
  return (
    <mesh position={[x, 1.6, z]}>
      <cylinderGeometry args={[0.05, 0.05, 3.2, 8]} />
      <meshStandardMaterial color="#bfeeff" emissive="#2a8fb0" emissiveIntensity={0.4} roughness={0.2} transparent opacity={0.4} />
    </mesh>
  )
}

// A hazy, far-off silhouette on the horizon — Island 5, glimpsed but never
// approached. Kept cheap (a handful of low-poly cones) and let the scene
// fog do the "cực xa" (very distant) read rather than detail.
export function DistantIsland5({ position = [-30, 0, -70] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.4, 0]}>
        <coneGeometry args={[3.2, 3.4, 7]} />
        <meshStandardMaterial color="#123049" roughness={1} />
      </mesh>
      <mesh position={[3.2, 0.7, 1.6]}>
        <coneGeometry args={[1.6, 1.8, 6]} />
        <meshStandardMaterial color="#123049" roughness={1} />
      </mesh>
      <mesh position={[0, 3.6, 0]}>
        <octahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial color="#f0c675" emissive="#f0c675" emissiveIntensity={1.6} roughness={0.3} />
      </mesh>
    </group>
  )
}

export function Island4Environment() {
  const pillarAngles = useMemo(() => Array.from({ length: 6 }, (_, index) => (index / 6) * Math.PI * 2), [])

  return (
    <>
      <Island4Sky />
      <fog attach="fog" args={['#123a52', 10, 32]} />

      <hemisphereLight args={['#3fb6c9', '#04121f', 0.5]} />
      <ambientLight intensity={0.38} color="#bfeeff" />
      <directionalLight position={[8, 16, -6]} intensity={0.5} color="#eaf7ff" />

      {/* circular observatory floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[4.2, 4.5, 0.3, 40]} />
        <meshStandardMaterial color="#0e2436" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.11, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.4, 0.12, 40]} />
        <meshStandardMaterial color="#163650" roughness={0.6} />
      </mesh>

      {pillarAngles.map((angle, index) => (
        <GlassPillar key={index} angle={angle} />
      ))}

      <AIRoomParticles />
      <DistantIsland5 />
      <Birds />
      <Ocean3D />
    </>
  )
}
