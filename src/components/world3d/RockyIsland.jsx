import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PalmTree } from './PalmIsland.jsx'

const ROCK_BASE = '#4d463b'
const ROCK_SLOPE = '#61584a'
const ROCK_LIGHT = '#786e5c'
const MOSS = '#3b7a42'
const SAND = '#e6d59e'

function useWaterfallTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 512
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#3fa0c7'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Flowing water white & turquoise foam streaks
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * canvas.width
      const w = 1.5 + Math.random() * 4.5
      const h = 25 + Math.random() * 100
      const y = Math.random() * canvas.height
      const alpha = 0.35 + Math.random() * 0.6
      ctx.fillStyle = i % 3 === 0 ? `rgba(255, 255, 255, ${alpha})` : `rgba(205, 245, 255, ${alpha})`
      ctx.fillRect(x, y, w, h)
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(1, 2)
    return texture
  }, [])
}

// Procedural seamless mountain cliff geometry with a carved ravine notch for the waterfall
function useMountainGeometry() {
  return useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.38, 1.45, 2.6, 48, 32)
    const pos = geo.attributes.position

    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i)
      let y = pos.getY(i)
      let z = pos.getZ(i)

      const normY = (y + 1.3) / 2.6 // 0 (bottom) to 1 (top)
      const angle = Math.atan2(z, x)

      // Organic mountain cliff noise
      const n1 = Math.sin(x * 2.2 + y * 1.8) * Math.cos(z * 2.4) * 0.16
      const n2 = Math.sin(angle * 5) * 0.1

      // Carve out a waterfall ravine channel on the front face (+Z side)
      if (z > 0.05 && Math.abs(x) < 0.5 && normY > 0.15 && normY < 0.88) {
        const ravineDepth = (0.28 - Math.abs(x) * 0.45) * Math.sin((normY - 0.15) * (Math.PI / 0.73))
        z -= Math.max(0, ravineDepth)
      } else {
        x += n1 + n2 * 0.4
        z += n1 + n2 * 0.4
      }

      pos.setXYZ(i, x, y, z)
    }

    geo.computeVertexNormals()
    return geo
  }, [])
}

function WaterfallMistParticles({ position }) {
  const particlesRef = useRef(null)

  const particles = useMemo(() => {
    return Array.from({ length: 16 }).map((_, i) => ({
      x: (Math.random() - 0.5) * 0.4,
      y: (Math.random() - 0.5) * 0.2,
      z: (Math.random() - 0.5) * 0.3,
      scale: 0.18 + Math.random() * 0.22,
      speed: 0.8 + Math.random() * 1.2,
      phase: i * 0.4,
    }))
  }, [])

  useFrame(({ clock }) => {
    if (!particlesRef.current) return
    const t = clock.getElapsedTime()
    particlesRef.current.children.forEach((child, i) => {
      const p = particles[i]
      const cycle = (t * p.speed + p.phase) % Math.PI
      child.scale.setScalar(p.scale * (0.8 + Math.sin(cycle) * 0.4))
      child.material.opacity = Math.sin(cycle) * 0.35
    })
  })

  return (
    <group ref={particlesRef} position={position}>
      {particles.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[0.25, 8, 8]} />
          <meshBasicMaterial color="#e5f7ff" transparent opacity={0.25} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

function Waterfall({ position, height }) {
  const texture = useWaterfallTexture()
  const streamRef = useRef(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    texture.offset.y = -t * 0.7
    if (streamRef.current) {
      streamRef.current.scale.x = 1 + Math.sin(t * 3.5) * 0.03
    }
  })

  return (
    <group position={position}>
      {/* Primary Cascading Water Stream in Ravine */}
      <mesh ref={streamRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.22, height, 20, 1, true]} />
        <meshStandardMaterial
          map={texture}
          transparent
          color="#d2f2ff"
          emissive="#52c8ed"
          emissiveIntensity={0.85}
          side={THREE.DoubleSide}
          roughness={0.12}
          depthWrite={false}
        />
      </mesh>

      {/* Outer Water Spray Veil */}
      <mesh position={[0, 0, 0.05]} rotation={[0.08, 0, 0]}>
        <planeGeometry args={[0.38, height]} />
        <meshStandardMaterial
          map={texture}
          transparent
          opacity={0.85}
          color="#ffffff"
          emissive="#76d8f5"
          emissiveIntensity={0.6}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Waterfall Crest Notch Curve at Mountain Top */}
      <mesh position={[0, height / 2, -0.06]} rotation={[Math.PI / 3.5, 0, 0]}>
        <cylinderGeometry args={[0.14, 0.12, 0.24, 16, 1, true]} />
        <meshStandardMaterial color="#80e0fc" transparent opacity={0.8} emissive="#3ec5ec" emissiveIntensity={0.8} />
      </mesh>

      {/* Waterfall Base Splash Pool Foaming Ripples */}
      <mesh position={[0, -height / 2 + 0.02, 0.12]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.08, 0.42, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.75} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -height / 2 + 0.01, 0.15]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.22, 0.62, 32]} />
        <meshBasicMaterial color="#8de5fc" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Volumetric Water Mist Spray */}
      <WaterfallMistParticles position={[0, -height / 2 + 0.12, 0.14]} />

      {/* Water Glow Point Light illuminating the Ravine */}
      <pointLight position={[0, 0, 0.1]} intensity={0.7} distance={2.5} color="#55e2f7" />
    </group>
  )
}

function OrganicBush({ position, scale = 1, color = MOSS }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.28, 14, 10]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0.12, 0.08, 0.1]} scale={0.75} castShadow>
        <sphereGeometry args={[0.22, 12, 10]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
    </group>
  )
}

function RockBoulder({ position, scale = 1, rotation = 0 }) {
  return (
    <mesh position={position} scale={[scale, scale * 0.8, scale * 0.9]} rotation={[0.2, rotation, 0.1]} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.18, 1]} />
      <meshStandardMaterial color={ROCK_SLOPE} roughness={0.88} />
    </mesh>
  )
}

export function RockyIsland({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }) {
  const mountainGeo = useMountainGeometry()

  return (
    <group position={position} scale={scale} rotation={rotation}>
      {/* Sandy Shore Base Skirt */}
      <mesh position={[0, -0.06, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.35, 1.72, 0.28, 36]} />
        <meshStandardMaterial color={SAND} roughness={0.88} />
      </mesh>

      {/* Seamless Single Mountain Peak with Carved Ravine */}
      <mesh geometry={mountainGeo} position={[0, 1.25, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={ROCK_BASE} roughness={0.82} metalness={0.08} />
      </mesh>

      {/* Waterfall flowing INSIDE the mountain ravine notch */}
      <Waterfall position={[0, 1.22, 0.42]} height={2.1} />

      {/* Summit Rainforest Canopy */}
      <mesh position={[0, 2.52, -0.05]} castShadow>
        <sphereGeometry args={[0.45, 20, 16]} />
        <meshStandardMaterial color={MOSS} roughness={0.7} />
      </mesh>
      <mesh position={[0.15, 2.65, 0.05]} scale={0.7} castShadow>
        <sphereGeometry args={[0.35, 16, 12]} />
        <meshStandardMaterial color="#2d6b33" roughness={0.7} />
      </mesh>

      {/* Terraced Bush Clusters & Moss Patches */}
      <OrganicBush position={[0.45, 0.65, 0.52]} scale={0.9} color={MOSS} />
      <OrganicBush position={[-0.42, 0.72, -0.38]} scale={0.85} color="#2d6b33" />
      <OrganicBush position={[0.28, 1.45, -0.28]} scale={0.75} color={MOSS} />
      <OrganicBush position={[-0.35, 1.62, 0.32]} scale={0.8} color="#2d6b33" />

      {/* Coastal & Cliffside Boulders */}
      <RockBoulder position={[0.85, 0.08, 0.75]} scale={0.9} rotation={0.4} />
      <RockBoulder position={[-1.0, 0.08, 0.45]} scale={0.8} rotation={1.1} />
      <RockBoulder position={[0.82, 0.08, -0.7]} scale={0.75} rotation={2.2} />

      {/* Coastal Palm Trees */}
      <PalmTree position={[0.88, 0.05, 0.82]} scale={0.8} lean={0.14} />
      <PalmTree position={[-1.05, 0.05, 0.48]} scale={0.65} lean={-0.1} />
      <PalmTree position={[0.92, 0.05, -0.72]} scale={0.6} lean={0.06} />
    </group>
  )
}

