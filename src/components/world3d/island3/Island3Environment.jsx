import { forwardRef, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GradientSky } from '../GradientSky.jsx'
import { Ocean3D } from '../Ocean3D.jsx'
import { Birds } from '../Birds.jsx'

// Twilight/violet palette — distinct from Island 1 (daytime blue) and
// Island 2 (sunset orange) on purpose, so the arena immediately reads as
// "somewhere new". Kept mid-brightness per spec: mystical, not horror-dark.
export function Island3Sky() {
  return <GradientSky topColor="#3a2d6b" horizonColor="#8a6fc9" bottomColor="#1a3a5c" exponent={0.85} />
}

// Ambient magic-dust — slow upward drift, purple/teal/gold mixed so it
// reads as "enchanted" rather than any one flat color.
const PARTICLE_COLORS = ['#c9a6ff', '#6fe3d0', '#f0c675']
const COUNT = 140
const BOUNDS = { radius: 6.5, yMin: 0.2, yMax: 5 }

export function ArenaParticles() {
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
      spd[i] = 0.04 + Math.random() * 0.08
    }
    return [pos, col, spd]
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const geometry = pointsRef.current?.geometry
    if (!geometry) return
    const position = geometry.attributes.position
    for (let i = 0; i < COUNT; i++) {
      let y = position.getY(i) + speeds[i] * 0.012
      if (y > BOUNDS.yMax) y = BOUNDS.yMin
      position.setY(i, y)
      position.setX(i, position.getX(i) + Math.sin(t * 0.3 + i) * 0.002)
      position.setZ(i, position.getZ(i) + Math.cos(t * 0.25 + i) * 0.002)
    }
    position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={COUNT} itemSize={3} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} count={COUNT} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.055} vertexColors transparent opacity={0.75} depthWrite={false} sizeAttenuation />
    </points>
  )
}

// The arena's centerpiece — a slowly spinning crystal core with a pulsing
// glow. `intensityRef` lets the orchestrator drive extra brightness during
// correct-answer beats and the ending sequence without prop-drilling state
// through every frame (avoids re-rendering the whole 3D tree per tick).
export const CrystalCore = forwardRef(function CrystalCore(_, intensityRef) {
  const crystalRef = useRef(null)
  const lightRef = useRef(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (crystalRef.current) {
      crystalRef.current.rotation.y = t * 0.25
      const bob = Math.sin(t * 0.9) * 0.08
      crystalRef.current.position.y = 1.1 + bob
    }
    const boost = intensityRef?.current ?? 0
    if (lightRef.current) {
      lightRef.current.intensity = 1.4 + Math.sin(t * 1.6) * 0.3 + boost
    }
  })

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={crystalRef} position={[0, 1.1, 0]} castShadow>
        <icosahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          color="#b48cf0"
          emissive="#8a5cf5"
          emissiveIntensity={1.1}
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>
      <pointLight ref={lightRef} position={[0, 1.1, 0]} color="#b48cf0" distance={9} intensity={1.4} />
      {/* glowing ring set into the floor beneath the crystal */}
      <mesh position={[0, 0.021, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.1, 1.35, 48]} />
        <meshBasicMaterial color="#9a6cf0" transparent opacity={0.55} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.022, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.7, 1.82, 48]} />
        <meshBasicMaterial color="#6fe3d0" transparent opacity={0.35} depthWrite={false} />
      </mesh>
    </group>
  )
})

function EdgeRock({ position, scale = 1, rotation = 0 }) {
  return (
    <mesh position={position} scale={scale} rotation={[0.15, rotation, 0.05]} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.6, 0]} />
      <meshStandardMaterial color="#4a3f5c" roughness={0.9} />
    </mesh>
  )
}

function EdgeSpire({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <coneGeometry args={[0.22, 1.3, 6]} />
        <meshStandardMaterial color="#3a3050" roughness={0.75} />
      </mesh>
      <mesh position={[0, 1.32, 0]}>
        <octahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial color="#c9a6ff" emissive="#8a5cf5" emissiveIntensity={0.8} roughness={0.3} />
      </mesh>
    </group>
  )
}

export function Island3Environment() {
  return (
    <>
      <Island3Sky />
      <fog attach="fog" args={['#4a3d7c', 10, 30]} />

      <hemisphereLight args={['#8a6fc9', '#1c1430', 0.55]} />
      <ambientLight intensity={0.4} color="#c9b8ff" />
      <directionalLight position={[10, 14, 6]} intensity={0.55} color="#c9b8ff" castShadow />

      {/* arena floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[7, 7.4, 0.3, 32]} />
        <meshStandardMaterial color="#2b2440" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.11, 0]} receiveShadow>
        <cylinderGeometry args={[4.6, 5, 0.12, 32]} />
        <meshStandardMaterial color="#382d54" roughness={0.7} />
      </mesh>

      {[
        [-4.4, 0.3, -2.6, 0.9],
        [4.6, 0.4, -1.8, 1.1],
        [-3.6, 0.3, 3.2, 0.85],
        [4.2, 0.35, 3.4, 1],
      ].map(([x, y, z, scale], index) => (
        <EdgeRock key={index} position={[x, y, z]} scale={scale} rotation={index} />
      ))}

      {[
        [-5.2, 0.05, 0.4],
        [5.3, 0.05, -0.6],
        [0.4, 0.05, -5.1],
        [-0.6, 0.05, 5],
      ].map((position, index) => (
        <EdgeSpire key={index} position={position} scale={0.9 + (index % 2) * 0.2} />
      ))}

      <ArenaParticles />
      <Birds />
      <Ocean3D />
    </>
  )
}
