import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { percentToWorld3D } from '../../utils/world3dCoords.js'

// High-end pirate ship color palette
const GOLD = '#facc15'
const GOLD_GLOW = '#fbbf24'
const MAHOGANY = '#3b1c0e'
const MAHOGANY_DARK = '#241007'
const DECK_WOOD = '#543118'
const SAIL_CLOTH = '#fef6e4'
const SAIL_SHADOW = '#e2d4ba'
const ROPE_COLOR = '#8c704f'
const IRON_COLOR = '#1f2937'

// Procedural rich wood plank texture for hull and decks
function useWoodPlankTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')

    // Rich dark wood base
    ctx.fillStyle = MAHOGANY
    ctx.fillRect(0, 0, 512, 512)

    // Wood grain planks
    for (let y = 0; y < 512; y += 32) {
      ctx.fillStyle = y % 64 === 0 ? MAHOGANY_DARK : '#4a2513'
      ctx.fillRect(0, y, 512, 30)

      // Grain noise lines
      ctx.strokeStyle = 'rgba(20, 8, 3, 0.4)'
      ctx.lineWidth = 1
      for (let i = 0; i < 6; i++) {
        const lineY = y + Math.random() * 30
        ctx.beginPath()
        ctx.moveTo(0, lineY)
        ctx.lineTo(512, lineY + (Math.random() - 0.5) * 4)
        ctx.stroke()
      }
    }

    // Gold trim stripe
    ctx.fillStyle = GOLD
    ctx.fillRect(0, 240, 512, 16)
    ctx.fillRect(0, 270, 512, 8)

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(2, 1)
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  }, [])
}

// Hand-painted skull emblem sail texture with golden compass motif
function useSailEmblemTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')

    // Canvas cloth base color
    ctx.fillStyle = SAIL_CLOTH
    ctx.fillRect(0, 0, 512, 512)

    // Subtle cloth seams
    ctx.strokeStyle = '#d6c7a9'
    ctx.lineWidth = 4
    for (let x = 64; x < 512; x += 64) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, 512)
      ctx.stroke()
    }

    const cx = 256
    const cy = 256

    // Golden compass star behind emblem
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.35)'
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.arc(cx, cy, 140, 0, Math.PI * 2)
    ctx.stroke()

    // Crimson Royal Skull & Crossbones Emblem
    ctx.fillStyle = '#881337'
    ctx.beginPath()
    ctx.arc(cx, cy - 20, 70, 0, Math.PI * 2)
    ctx.fill()

    // Crossbones
    ctx.strokeStyle = '#881337'
    ctx.lineWidth = 26
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(cx - 120, cy + 90)
    ctx.lineTo(cx + 120, cy - 70)
    ctx.moveTo(cx - 120, cy - 70)
    ctx.lineTo(cx + 120, cy + 90)
    ctx.stroke()

    // Skull details (eyes & teeth in canvas gold)
    ctx.fillStyle = GOLD
    ctx.beginPath()
    ctx.arc(cx - 28, cy - 25, 18, 0, Math.PI * 2)
    ctx.arc(cx + 28, cy - 25, 18, 0, Math.PI * 2)
    ctx.fill()

    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  }, [])
}

// Curving, elegant multi-deck ship hull geometry with bowsprit and elevated quarterdeck
function useGalleonHullGeometry() {
  return useMemo(() => {
    const shape = new THREE.Shape()
    // Bow to stern hull outline
    shape.moveTo(-0.85, 0.05)
    shape.bezierCurveTo(-0.9, 0.3, -0.75, 0.52, -0.5, 0.54)
    shape.lineTo(0.55, 0.48)
    shape.bezierCurveTo(0.85, 0.44, 1.15, 0.3, 1.25, 0.18)
    shape.bezierCurveTo(1.1, 0.02, 0.8, -0.05, 0.6, -0.05)
    shape.lineTo(-0.65, 0.0)
    shape.closePath()

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.68,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 3,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    })
    geo.translate(0, 0, -0.34)
    geo.computeVertexNormals()
    return geo
  }, [])
}

// Glowing stern and mast lantern
function SternLantern({ position }) {
  return (
    <group position={position}>
      {/* Brass cage */}
      <mesh castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.1, 8]} />
        <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Lit interior glass */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial color="#fffbeb" emissive="#f59e0b" emissiveIntensity={2.5} />
      </mesh>
      <pointLight color="#f59e0b" intensity={1.8} distance={2.8} />
    </group>
  )
}

// Billowing cloth sail with natural wind curvature
function BillowSail({ position, width, height, curve = 0.15, emblemTexture }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <cylinderGeometry args={[width / 2, width / 2.1, height, 24, 4, true, -1.4, 2.8]} />
      <meshStandardMaterial
        color={SAIL_CLOTH}
        map={emblemTexture}
        roughness={0.5}
        metalness={0.05}
        side={THREE.DoubleSide}
        shadowSide={THREE.DoubleSide}
      />
    </mesh>
  )
}

// Rigging rope connecting yardarm to hull
function RiggingLine({ start, end }) {
  const points = useMemo(() => [new THREE.Vector3(...start), new THREE.Vector3(...end)], [start, end])
  const lineGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points])
  return (
    <line geometry={lineGeo}>
      <lineBasicMaterial color={ROPE_COLOR} linewidth={1.5} />
    </line>
  )
}

// Ship stern wake trail effect
function WaterWakeTrail() {
  const wakeRef = useRef(null)
  useFrame(({ clock }) => {
    if (!wakeRef.current) return
    const t = clock.getElapsedTime()
    const scale = 1 + Math.sin(t * 2) * 0.08
    wakeRef.current.scale.set(scale * 1.2, scale * 0.7, 1)
    wakeRef.current.material.opacity = 0.45 + Math.sin(t * 2) * 0.15
  })
  return (
    <mesh ref={wakeRef} rotation={[-Math.PI / 2, 0, 0]} position={[0.05, -0.06, 0]}>
      <ringGeometry args={[0.42, 0.98, 32]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.45} side={THREE.DoubleSide} />
    </mesh>
  )
}

// Gunwale railing with brass posts
function Railing({ z }) {
  const postXs = [-0.55, -0.35, -0.15, 0.05, 0.25, 0.45, 0.65, 0.8]
  return (
    <>
      {postXs.map((x) => (
        <mesh key={x} position={[x, 0.38, z]} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.11, 8]} />
          <meshStandardMaterial color={GOLD_GLOW} metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0.12, 0.43, z]} castShadow>
        <boxGeometry args={[1.45, 0.035, 0.025]} />
        <meshStandardMaterial color={GOLD} metalness={0.75} roughness={0.22} />
      </mesh>
    </>
  )
}

// Deck-mounted cannon row
function Cannons({ z }) {
  const xs = [-0.45, -0.22, 0.0, 0.22, 0.45]
  const outward = z > 0 ? 1 : -1
  return xs.map((x) => (
    <mesh key={x} position={[x, 0.2, z + 0.06 * outward]} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[0.02, 0.026, 0.16, 12]} />
      <meshStandardMaterial color={IRON_COLOR} metalness={0.8} roughness={0.35} />
    </mesh>
  ))
}

// Mast with yardarms, optional crow's nest, and an emblem-painted billowing sail
function Mast({ x, height, sailHeight, sailY, sailRadius, crowsNest, emblemTexture }) {
  return (
    <group position={[x, 0.35, 0]}>
      {/* Wooden Mast Pole */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.022, 0.034, height, 12]} />
        <meshStandardMaterial color={MAHOGANY_DARK} roughness={0.7} />
      </mesh>
      {/* Yardarms */}
      <mesh position={[0, sailY + sailHeight / 2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, sailRadius * 2.2, 8]} />
        <meshStandardMaterial color={MAHOGANY_DARK} />
      </mesh>
      <mesh position={[0, sailY - sailHeight / 2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, sailRadius * 2.1, 8]} />
        <meshStandardMaterial color={MAHOGANY_DARK} />
      </mesh>
      {crowsNest ? (
        <group position={[0, height * 0.65, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.11, 0.02, 8, 16]} />
            <meshStandardMaterial color={MAHOGANY_DARK} />
          </mesh>
          <mesh position={[0, -0.04, 0]}>
            <cylinderGeometry args={[0.1, 0.07, 0.08, 12]} />
            <meshStandardMaterial color={MAHOGANY} roughness={0.7} />
          </mesh>
        </group>
      ) : null}
      <BillowSail position={[0, sailY, 0]} width={sailRadius * 2} height={sailHeight} emblemTexture={emblemTexture} />
    </group>
  )
}

export function Ship3D({ position, bearing = 0 }) {
  const groupRef = useRef(null)
  const world = useMemo(() => (position ? percentToWorld3D(position.x, position.y) : null), [position])
  const hullGeometry = useGalleonHullGeometry()
  const plankTexture = useWoodPlankTexture()
  const emblemTexture = useSailEmblemTexture()

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
      <WaterWakeTrail />

      {/* Main Wooden Hull */}
      <mesh geometry={hullGeometry} castShadow receiveShadow>
        <meshStandardMaterial map={plankTexture} color={MAHOGANY} roughness={0.45} metalness={0.15} />
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
          <meshStandardMaterial color={DECK_WOOD} roughness={0.5} />
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
          <meshStandardMaterial color={GOLD_GLOW} metalness={0.6} />
        </mesh>

        {/* Glowing Lantern */}
        <SternLantern position={[-0.16, 0.22, 0]} />
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
        <meshStandardMaterial color={MAHOGANY_DARK} />
      </mesh>

      {/* Fore & Main Masts */}
      <Mast x={-0.28} height={1.12} sailHeight={0.72} sailY={0.72} sailRadius={0.34} emblemTexture={emblemTexture} />
      <Mast
        x={0.18}
        height={1.5}
        sailHeight={0.98}
        sailY={0.94}
        sailRadius={0.42}
        crowsNest
        emblemTexture={emblemTexture}
      />

      {/* Standing Rigging Lines */}
      <RiggingLine start={foreTop} end={bowTip} />
      <RiggingLine start={mainTop} end={foreTop} />
      <RiggingLine start={mainTop} end={sternTop} />
      <RiggingLine start={mainTop} end={deckPort(0.18)} />
      <RiggingLine start={mainTop} end={deckStar(0.18)} />
      <RiggingLine start={foreTop} end={deckPort(-0.28)} />
      <RiggingLine start={foreTop} end={deckStar(-0.28)} />
    </group>
  )
}


