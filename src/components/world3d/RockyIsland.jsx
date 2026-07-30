import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PalmTree } from './PalmIsland.jsx'

const ROCK = '#7d7568'
const ROCK_DARK = '#4a423a'
const ROCK_LIGHT = '#a89a82'
const MOSS = '#5c7a42'
const SAND = '#d8c485'

// A vertical streak pattern instead of a plain blue plane — cheap to fake
// falling water without a video texture or a real particle system.
function useWaterfallTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width
      const w = 1 + Math.random() * 2
      const h = 10 + Math.random() * 30
      const y = Math.random() * canvas.height
      ctx.fillStyle = `rgba(255,255,255,${0.25 + Math.random() * 0.4})`
      ctx.fillRect(x, y, w, h)
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(1, 2)
    return texture
  }, [])
}

// One faceted chunk of the cliff — a low-segment cone with flat shading
// reads as broken rock instead of a smooth dome. Each tier also gets its
// own x/z offset (not stacked on a shared center axis), so the stack piles
// up lopsided like real karst rather than tapering into a neat, symmetric
// "Christmas tree" silhouette.
function RockTier({ x = 0, y, z = 0, radius, height, rotationY, squash = [1, 1], color = ROCK }) {
  return (
    <mesh
      position={[x, y, z]}
      rotation={[0, rotationY, 0]}
      scale={[squash[0], 1, squash[1]]}
      castShadow
      receiveShadow
    >
      <coneGeometry args={[radius, height, 5, 1]} />
      <meshStandardMaterial color={color} roughness={0.95} flatShading />
    </mesh>
  )
}

// The summit — a short, flat-topped cylinder instead of another tapering
// cone, so the cliff ends in a plateau (something for the top-of-cliff
// vegetation to actually sit on) rather than a bare point.
function Plateau({ x = 0, y, z = 0, radius, color = ROCK_LIGHT }) {
  return (
    <mesh position={[x, y, z]} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius * 1.3, 0.16, 5]} />
      <meshStandardMaterial color={color} roughness={0.95} flatShading />
    </mesh>
  )
}

function MossPatch({ position, scale = 1 }) {
  return (
    <mesh position={position} scale={[scale, scale * 0.5, scale]}>
      <sphereGeometry args={[0.25, 8, 6]} />
      <meshStandardMaterial color={MOSS} roughness={0.9} />
    </mesh>
  )
}

function Waterfall({ position, height }) {
  const texture = useWaterfallTexture()
  useFrame(({ clock }) => {
    texture.offset.y = -clock.getElapsedTime() * 0.4
  })
  return (
    <group position={position}>
      <mesh>
        <planeGeometry args={[0.28, height]} />
        <meshStandardMaterial
          map={texture}
          transparent
          color="#eaf6fb"
          emissive="#bfe0ee"
          emissiveIntensity={0.3}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* splash pool where it meets the shore */}
      <mesh position={[0, -height / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.22, 12]} />
        <meshStandardMaterial color="#eaf6fb" transparent opacity={0.6} roughness={0.4} />
      </mesh>
    </group>
  )
}

// A dramatic karst-cliff island with a waterfall, for the Title intro's
// background scenery — a taller, rockier counterpart to PalmIsland's low
// tropical atoll, so the establishing shot has one striking landmark
// instead of two identical mounds.
export function RockyIsland({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, -0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.3, 1.6, 0.3, 16]} />
        <meshStandardMaterial color={SAND} roughness={0.9} />
      </mesh>

      <RockTier x={0} y={0.45} z={0} radius={1.1} height={1.0} rotationY={0.3} squash={[1, 0.85]} color={ROCK} />
      <RockTier x={0.28} y={1.05} z={-0.18} radius={0.72} height={0.95} rotationY={-0.5} squash={[0.9, 1]} color={ROCK_DARK} />
      <RockTier x={-0.22} y={1.62} z={0.2} radius={0.52} height={0.85} rotationY={0.9} squash={[1, 0.85]} color={ROCK} />
      <RockTier x={0.12} y={2.1} z={-0.12} radius={0.38} height={0.65} rotationY={-1.2} squash={[0.85, 1]} color={ROCK_DARK} />
      <Plateau x={0.05} y={2.44} z={-0.05} radius={0.34} color={ROCK_LIGHT} />

      <MossPatch position={[0.55, 0.32, 0.55]} scale={0.5} />
      <MossPatch position={[0.05, 0.9, -0.35]} scale={0.4} />
      <MossPatch position={[-0.35, 1.45, 0.3]} scale={0.32} />

      <Waterfall position={[0.1, 1.25, 0.7]} height={1.7} />

      {/* small canopy on the summit plateau, echoing the base foliage */}
      <mesh position={[0.05, 2.6, -0.05]} castShadow>
        <coneGeometry args={[0.24, 0.34, 8]} />
        <meshStandardMaterial color={MOSS} roughness={0.85} />
      </mesh>

      <PalmTree position={[0.85, 0.05, 0.85]} scale={0.7} lean={0.15} />
      <PalmTree position={[-1.0, 0.05, 0.5]} scale={0.55} lean={-0.1} />
      <PalmTree position={[0.9, 0.05, -0.75]} scale={0.5} lean={0.05} />
    </group>
  )
}
