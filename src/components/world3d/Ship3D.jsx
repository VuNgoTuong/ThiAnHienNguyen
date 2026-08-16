import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { percentToWorld3D } from '../../utils/world3dCoords.js'

const GOLD = '#f3cf73'
const GOLD_DEEP = '#c4953a'
const HULL_COLOR = '#4a2b16'
const HULL_DECK = '#381f0d'
const HULL_TRIM = '#241407'
const SAIL_COLOR = '#f4ebd0'
const SAIL_SHADOW = '#dfd3b2'
const ROPE = '#b89c74'
const IRON = '#262626'

// Hand-drawn skull flag texture with high contrast and smooth lines
function useSkullFlagTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 192
    const ctx = canvas.getContext('2d')
    
    // Crimson black background
    ctx.fillStyle = '#181412'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Gold trim border on pennant
    ctx.strokeStyle = GOLD
    ctx.lineWidth = 6
    ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8)

    const cx = canvas.width / 2
    const cy = canvas.height * 0.44
    const bone = '#fdf8eb'

    // Crossbones
    ctx.strokeStyle = bone
    ctx.lineWidth = 12
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(cx - 56, cy + 48)
    ctx.lineTo(cx + 56, cy - 10)
    ctx.moveTo(cx - 56, cy - 10)
    ctx.lineTo(cx + 56, cy + 48)
    ctx.stroke()
    
    ;[
      [cx - 56, cy + 48],
      [cx + 56, cy - 10],
      [cx - 56, cy - 10],
      [cx + 56, cy + 48],
    ].forEach(([x, y]) => {
      ctx.beginPath()
      ctx.arc(x, y, 9, 0, Math.PI * 2)
      ctx.fillStyle = bone
      ctx.fill()
    })

    // Skull head
    ctx.fillStyle = bone
    ctx.beginPath()
    ctx.arc(cx, cy - 12, 34, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillRect(cx - 22, cy - 12, 44, 26)

    // Eye sockets
    ctx.fillStyle = '#181412'
    ctx.beginPath()
    ctx.arc(cx - 13, cy - 14, 9, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(cx + 13, cy - 14, 9, 0, Math.PI * 2)
    ctx.fill()

    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  }, [])
}

// Curved, elegant hull geometry with bevels and smooth normals
function useHullGeometry() {
  return useMemo(() => {
    const shape = new THREE.Shape()
    // Smooth bow-to-stern hull profile curve
    shape.moveTo(-0.7, 0.08)
    shape.bezierCurveTo(-0.72, 0.25, -0.68, 0.4, -0.45, 0.42)
    shape.lineTo(0.45, 0.38)
    shape.bezierCurveTo(0.7, 0.34, 0.9, 0.22, 0.95, 0.16)
    shape.bezierCurveTo(0.85, 0.04, 0.65, -0.02, 0.5, -0.02)
    shape.lineTo(-0.55, 0.02)
    shape.closePath()

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.54,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 2,
      bevelSize: 0.04,
      bevelThickness: 0.04,
    })
    geo.translate(0, 0, -0.27)
    geo.computeVertexNormals()
    return geo
  }, [])
}

function Sail({ position, height, radius = 0.44 }) {
  return (
    <mesh position={position} castShadow>
      <cylinderGeometry args={[radius, radius * 0.9, height, 20, 2, true, -1.35, 2.7]} />
      <meshStandardMaterial
        color={SAIL_COLOR}
        side={THREE.DoubleSide}
        roughness={0.55}
        metalness={0.05}
        shadowSide={THREE.DoubleSide}
      />
    </mesh>
  )
}

function Pennant({ position, texture }) {
  const meshRef = useRef(null)
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 3) * 0.12
    }
  })
  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[0.26, 0.18]} />
      <meshStandardMaterial map={texture} side={THREE.DoubleSide} roughness={0.4} />
    </mesh>
  )
}

function Mast({ x, height, sailHeight, sailY, sailRadius, crowsNest, flagTexture }) {
  return (
    <group position={[x, 0.35, 0]}>
      {/* Wooden Mast Pole */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.022, 0.034, height, 12]} />
        <meshStandardMaterial color={HULL_TRIM} roughness={0.7} />
      </mesh>
      {/* Yardarms */}
      <mesh position={[0, sailY + sailHeight / 2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, sailRadius * 2.2, 8]} />
        <meshStandardMaterial color={HULL_TRIM} />
      </mesh>
      <mesh position={[0, sailY - sailHeight / 2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, sailRadius * 2.1, 8]} />
        <meshStandardMaterial color={HULL_TRIM} />
      </mesh>
      {crowsNest ? (
        <group position={[0, height * 0.65, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.11, 0.02, 8, 16]} />
            <meshStandardMaterial color={HULL_TRIM} />
          </mesh>
          <mesh position={[0, -0.04, 0]}>
            <cylinderGeometry args={[0.1, 0.07, 0.08, 12]} />
            <meshStandardMaterial color={HULL_COLOR} roughness={0.7} />
          </mesh>
        </group>
      ) : null}
      <Sail position={[0, sailY, 0]} height={sailHeight} radius={sailRadius} />
      <Pennant position={[0, height + 0.1, 0]} texture={flagTexture} />
    </group>
  )
}

function Railing({ z }) {
  const postXs = [-0.55, -0.35, -0.15, 0.05, 0.25, 0.45, 0.65, 0.8]
  return (
    <>
      {postXs.map((x) => (
        <mesh key={x} position={[x, 0.38, z]} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.11, 8]} />
          <meshStandardMaterial color={GOLD_DEEP} metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0.12, 0.43, z]} castShadow>
        <boxGeometry args={[1.45, 0.035, 0.025]} />
        <meshStandardMaterial color={GOLD} metalness={0.75} roughness={0.22} />
      </mesh>
    </>
  )
}

function Cannons({ z }) {
  const xs = [-0.45, -0.22, 0.0, 0.22, 0.45]
  const outward = z > 0 ? 1 : -1
  return xs.map((x) => (
    <mesh key={x} position={[x, 0.2, z + 0.06 * outward]} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[0.02, 0.026, 0.16, 12]} />
      <meshStandardMaterial color={IRON} metalness={0.8} roughness={0.35} />
    </mesh>
  ))
}

function ShipWaterWake() {
  const wakeRef = useRef(null)
  useFrame(({ clock }) => {
    if (!wakeRef.current) return
    const t = clock.getElapsedTime()
    const s = 1 + Math.sin(t * 2) * 0.06
    wakeRef.current.scale.set(s * 1.2, s * 0.7, 1)
    wakeRef.current.material.opacity = 0.45 + Math.sin(t * 2) * 0.15
  })
  return (
    <mesh ref={wakeRef} rotation={[-Math.PI / 2, 0, 0]} position={[0.05, -0.06, 0]}>
      <ringGeometry args={[0.42, 0.98, 32]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.45} side={THREE.DoubleSide} />
    </mesh>
  )
}

export function Ship3D({ position, bearing = 0 }) {
  const groupRef = useRef(null)
  const world = useMemo(() => (position ? percentToWorld3D(position.x, position.y) : null), [position])
  const hullGeometry = useHullGeometry()
  const flagTexture = useSkullFlagTexture()

  useFrame(({ clock }) => {
    if (!groupRef.current || !world) return
    const t = clock.getElapsedTime()
    // Organic floating sway on ocean waves
    groupRef.current.position.set(world.x, 0.12 + Math.sin(t * 1.8) * 0.07 + Math.cos(t * 1.1) * 0.04, world.z)
    groupRef.current.rotation.y = -(bearing * Math.PI) / 180
    groupRef.current.rotation.z = Math.sin(t * 1.2) * 0.035
    groupRef.current.rotation.x = Math.cos(t * 1.5) * 0.02
  })

  if (!world) return null

  const mainTop = [0.18, 1.75, 0]
  const foreTop = [-0.28, 1.4, 0]
  const bowTip = [1.12, 0.32, 0]
  const sternTop = [-0.56, 0.48, 0]
  const deckPort = (x) => [x, 0.4, 0.27]
  const deckStar = (x) => [x, 0.4, -0.27]

  return (
    <group ref={groupRef} scale={1.45}>
      {/* Ocean Water Wake Foam Ring */}
      <ShipWaterWake />

      {/* Main Wooden Hull */}
      <mesh geometry={hullGeometry} castShadow receiveShadow>
        <meshStandardMaterial color={HULL_COLOR} roughness={0.45} metalness={0.15} />
      </mesh>

      {/* Decorative Gold Trim Stripes */}
      <mesh position={[0.08, 0.12, 0.285]}>
        <boxGeometry args={[1.5, 0.035, 0.008]} />
        <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[0.08, 0.12, -0.285]}>
        <boxGeometry args={[1.5, 0.035, 0.008]} />
        <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.25} />
      </mesh>

      {/* Gunwales & Cannons */}
      <Railing z={0.28} />
      <Railing z={-0.28} />
      <Cannons z={0.28} />
      <Cannons z={-0.28} />

      {/* Raised Captain's Aftcastle Cabin */}
      <group position={[-0.52, 0.48, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.28, 0.22, 0.48]} />
          <meshStandardMaterial color={HULL_DECK} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.12, 0]} castShadow>
          <boxGeometry args={[0.29, 0.03, 0.49]} />
          <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.25} />
        </mesh>

        {/* Stern Gallery Windows */}
        <mesh position={[-0.145, 0.02, 0]}>
          <boxGeometry args={[0.01, 0.1, 0.32]} />
          <meshStandardMaterial color="#fff3b0" emissive="#ffc44d" emissiveIntensity={1.8} roughness={0.2} />
        </mesh>

        {/* Steering Wheel / Helm */}
        <mesh position={[0.08, 0.16, 0]} rotation={[0, 0, Math.PI / 4]}>
          <torusGeometry args={[0.06, 0.012, 6, 8]} />
          <meshStandardMaterial color={GOLD_DEEP} metalness={0.6} />
        </mesh>

        {/* Glowing Lantern */}
        <mesh position={[-0.16, 0.22, 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#fff1aa" emissive="#ffaa33" emissiveIntensity={2.5} roughness={0.2} />
        </mesh>
        <pointLight position={[-0.16, 0.22, 0]} color="#ffa022" intensity={0.6} distance={2.5} />
      </group>

      {/* Golden Eagle / Dragon Bowsprit Figurehead */}
      <group position={[0.95, 0.18, 0]} rotation={[0, 0, -0.25]}>
        <mesh castShadow>
          <coneGeometry args={[0.065, 0.28, 12]} />
          <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Bowsprit */}
      <mesh position={[1.08, 0.3, 0]} rotation={[0, 0, 0.32]} castShadow>
        <cylinderGeometry args={[0.018, 0.026, 0.5, 8]} />
        <meshStandardMaterial color={HULL_TRIM} />
      </mesh>

      {/* Fore & Main Masts */}
      <Mast x={-0.28} height={1.12} sailHeight={0.72} sailY={0.72} sailRadius={0.34} flagTexture={flagTexture} />
      <Mast
        x={0.18}
        height={1.5}
        sailHeight={0.98}
        sailY={0.94}
        sailRadius={0.42}
        crowsNest
        flagTexture={flagTexture}
      />

      {/* Standing Rigging Lines */}
      <Line points={[foreTop, bowTip]} color={ROPE} lineWidth={1.2} />
      <Line points={[mainTop, foreTop]} color={ROPE} lineWidth={1.2} />
      <Line points={[mainTop, sternTop]} color={ROPE} lineWidth={1.2} />
      <Line points={[mainTop, deckPort(0.18)]} color={ROPE} lineWidth={1.2} />
      <Line points={[mainTop, deckStar(0.18)]} color={ROPE} lineWidth={1.2} />
      <Line points={[foreTop, deckPort(-0.28)]} color={ROPE} lineWidth={1.2} />
      <Line points={[foreTop, deckStar(-0.28)]} color={ROPE} lineWidth={1.2} />
    </group>
  )
}


