import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { percentToWorld3D } from '../../utils/world3dCoords.js'

// "Cute Phô Mai Que" Sweet Palette
const CHEESE_YELLOW = '#fef08a' // soft butter cheese yellow
const STRAWBERRY_PINK = '#f472b6' // pastel strawberry pink
const CREAM_WHITE = '#fff1f2' // soft vanilla cream
const PASTEL_PURPLE = '#c084fc' // lavender accent
const GOLD_SPARKLE = '#fbbf24' // sparkling gold
const CHEEK_PINK = '#fb7185' // blush cheek

// Cute Heart & Star Sail Texture
function useCheeseCuteSailTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')

    // Pastel strawberry-cream gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 512)
    grad.addColorStop(0, '#fff1f2')
    grad.addColorStop(0.5, '#ffe4e6')
    grad.addColorStop(1, '#fbcfe8')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 512, 512)

    // Soft white polka dots
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    for (let x = 40; x < 512; x += 80) {
      for (let y = 40; y < 512; y += 80) {
        ctx.beginPath()
        ctx.arc(x, y, 10, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Big Shiny Pink Heart in Center
    const cx = 256
    const cy = 250
    ctx.fillStyle = '#f43f5e'
    ctx.shadowColor = 'rgba(244, 63, 94, 0.5)'
    ctx.shadowBlur = 30
    ctx.beginPath()
    ctx.moveTo(cx, cy + 90)
    ctx.bezierCurveTo(cx - 135, cy - 35, cx - 115, cy - 140, cx, cy - 60)
    ctx.bezierCurveTo(cx + 115, cy - 140, cx + 135, cy - 35, cx, cy + 90)
    ctx.fill()

    // Cute shine highlight
    ctx.shadowBlur = 0
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
    ctx.beginPath()
    ctx.arc(cx - 40, cy - 45, 18, 0, Math.PI * 2)
    ctx.fill()

    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  }, [])
}

// Procedural Soft Water Foam Texture
function useWaterFoamTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')

    const grad = ctx.createRadialGradient(128, 128, 15, 128, 128, 120)
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.85)')
    grad.addColorStop(0.35, 'rgba(224, 242, 254, 0.5)')
    grad.addColorStop(0.7, 'rgba(186, 230, 253, 0.2)')
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)')

    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 256, 256)

    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  }, [])
}

// Chubby Cute Cheese Boat Hull Geometry
function useCheeseCuteHullGeometry() {
  return useMemo(() => {
    const slices = 36
    const profileSegments = 20
    const positions = []
    const uvs = []
    const indices = []

    for (let i = 0; i <= slices; i++) {
      const u = i / slices
      const x = -0.95 + u * 2.15

      let widthFactor = 0
      if (u > 0.85) {
        widthFactor = Math.sin(((1 - u) / 0.15) * (Math.PI / 2)) * 0.45
      } else if (u < 0.15) {
        widthFactor = Math.sin((u / 0.15) * (Math.PI / 2)) * 0.48 + 0.16
      } else {
        widthFactor = 0.72 - Math.pow((u - 0.48) * 1.3, 2) * 0.28
      }
      widthFactor = Math.max(0.01, widthFactor)
      const halfWidth = widthFactor * 0.54

      let deckY = 0.34
      if (u < 0.25) {
        deckY = 0.34 + Math.pow((0.25 - u) / 0.25, 2) * 0.35
      } else if (u > 0.75) {
        deckY = 0.34 + Math.pow((u - 0.75) / 0.25, 2) * 0.28
      }

      let keelY = -0.23
      if (u < 0.1) keelY = -0.1 + u * 1.3
      if (u > 0.9) keelY = -0.23 + (u - 0.9) * 2.3

      for (let j = 0; j <= profileSegments; j++) {
        const v = j / profileSegments
        const angle = (v - 0.5) * Math.PI

        const z = Math.sin(angle) * halfWidth
        const profileHeightFactor = 1 - Math.cos(angle)
        const y = keelY + profileHeightFactor * (deckY - keelY)

        positions.push(x, y, z)
        uvs.push(u * 2, v)
      }
    }

    for (let i = 0; i < slices; i++) {
      for (let j = 0; j < profileSegments; j++) {
        const a = i * (profileSegments + 1) + j
        const b = (i + 1) * (profileSegments + 1) + j
        const c = (i + 1) * (profileSegments + 1) + (j + 1)
        const d = i * (profileSegments + 1) + (j + 1)

        indices.push(a, b, d)
        indices.push(b, c, d)
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
    geo.setIndex(indices)
    geo.computeVertexNormals()
    return geo
  }, [])
}

// 100% Flat & Soft Water Foam (Zero Z-Fighting Glitch)
function SoftWaterWake() {
  const wakeRef = useRef(null)
  const foamTexture = useWaterFoamTexture()

  useFrame(({ clock }) => {
    if (!wakeRef.current) return
    const t = clock.getElapsedTime()
    const scale = 1 + Math.sin(t * 2.2) * 0.08
    wakeRef.current.scale.set(scale * 1.35, scale * 0.9, 1)

    if (wakeRef.current.parent) {
      wakeRef.current.rotation.x = -Math.PI / 2 - wakeRef.current.parent.rotation.x
      wakeRef.current.rotation.z = -wakeRef.current.parent.rotation.z
    }
  })

  return (
    <mesh ref={wakeRef} position={[0, -0.12, 0]} renderOrder={10}>
      <planeGeometry args={[2.2, 1.4]} />
      <meshBasicMaterial
        map={foamTexture}
        transparent
        opacity={0.6}
        depthWrite={false}
        depthTest={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// Cute Blushing Bear Mascot on Bow
function CuteBearMascot({ position }) {
  return (
    <group position={position} scale={1.15}>
      {/* Bear Head */}
      <mesh castShadow>
        <sphereGeometry args={[0.095, 16, 16]} />
        <meshStandardMaterial color={CHEESE_YELLOW} roughness={0.35} />
      </mesh>
      {/* Bear Ears */}
      <mesh position={[-0.03, 0.08, 0.07]}>
        <sphereGeometry args={[0.032, 12, 12]} />
        <meshStandardMaterial color={CHEESE_YELLOW} />
      </mesh>
      <mesh position={[-0.03, 0.08, -0.07]}>
        <sphereGeometry args={[0.032, 12, 12]} />
        <meshStandardMaterial color={CHEESE_YELLOW} />
      </mesh>
      {/* Bear Snout */}
      <mesh position={[0.075, -0.01, 0]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial color={CREAM_WHITE} />
      </mesh>
      <mesh position={[0.095, 0.005, 0]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshBasicMaterial color="#451a03" />
      </mesh>
      {/* Cute Eyes */}
      <mesh position={[0.065, 0.028, 0.05]}>
        <sphereGeometry args={[0.014, 8, 8]} />
        <meshBasicMaterial color="#1e1b4b" />
      </mesh>
      <mesh position={[0.065, 0.028, -0.05]}>
        <sphereGeometry args={[0.014, 8, 8]} />
        <meshBasicMaterial color="#1e1b4b" />
      </mesh>
      {/* Rosy Cheeks */}
      <mesh position={[0.05, -0.012, 0.065]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color={CHEEK_PINK} />
      </mesh>
      <mesh position={[0.05, -0.012, -0.065]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color={CHEEK_PINK} />
      </mesh>
    </group>
  )
}

// Glowing Star Lantern
function CuteStarLantern({ position }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <sphereGeometry args={[0.065, 16, 16]} />
        <meshStandardMaterial color="#fef08a" emissive="#fbbf24" emissiveIntensity={3.0} />
      </mesh>
      <pointLight color="#fbbf24" intensity={2.4} distance={3.5} />
    </group>
  )
}

// Cute Heart Flag
function CuteHeartFlag({ position }) {
  const flagRef = useRef(null)
  useFrame(({ clock }) => {
    if (!flagRef.current) return
    const t = clock.getElapsedTime()
    flagRef.current.rotation.y = Math.sin(t * 3.2) * 0.22 + 0.25
    flagRef.current.position.z = Math.cos(t * 3.8) * 0.02
  })

  return (
    <group position={position}>
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.038, 12, 12]} />
        <meshStandardMaterial color={GOLD_SPARKLE} metalness={0.9} />
      </mesh>
      <group ref={flagRef}>
        <mesh position={[0.2, -0.1, 0]} castShadow>
          <boxGeometry args={[0.38, 0.2, 0.008]} />
          <meshStandardMaterial color={STRAWBERRY_PINK} roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  )
}

export function Ship3D({ position, bearing = 0, scale = 2.1 }) {
  const groupRef = useRef(null)
  const world = useMemo(() => (position ? percentToWorld3D(position.x, position.y) : null), [position])
  const chubbyHullGeo = useCheeseCuteHullGeometry()
  const cuteSailTexture = useCheeseCuteSailTexture()

  useFrame(({ clock }) => {
    if (!groupRef.current || !world) return
    const t = clock.getElapsedTime()
    // Playful bouncing motion
    groupRef.current.position.set(world.x, 0.15 + Math.sin(t * 2.0) * 0.08 + Math.cos(t * 1.3) * 0.04, world.z)
    groupRef.current.rotation.y = -(bearing * Math.PI) / 180
    groupRef.current.rotation.z = Math.sin(t * 1.4) * 0.04
    groupRef.current.rotation.x = Math.cos(t * 1.7) * 0.03
  })

  if (!world) return null

  return (
    <group ref={groupRef} scale={scale}>
      <SoftWaterWake />

      {/* Sweet Cheese Yellow Chubby Hull */}
      <mesh geometry={chubbyHullGeo} castShadow receiveShadow>
        <meshStandardMaterial color={CHEESE_YELLOW} roughness={0.35} metalness={0.08} />
      </mesh>

      {/* Strawberry Pink & Gold Stripe */}
      <mesh position={[0.08, 0.24, 0.32]}>
        <boxGeometry args={[1.7, 0.045, 0.015]} />
        <meshStandardMaterial color={STRAWBERRY_PINK} roughness={0.3} />
      </mesh>
      <mesh position={[0.08, 0.24, -0.32]}>
        <boxGeometry args={[1.7, 0.045, 0.015]} />
        <meshStandardMaterial color={STRAWBERRY_PINK} roughness={0.3} />
      </mesh>
      <mesh position={[0.08, 0.2, 0.32]}>
        <boxGeometry args={[1.7, 0.015, 0.016]} />
        <meshStandardMaterial color={GOLD_SPARKLE} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.08, 0.2, -0.32]}>
        <boxGeometry args={[1.7, 0.015, 0.016]} />
        <meshStandardMaterial color={GOLD_SPARKLE} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Soft Vanilla Cream Deck */}
      <mesh position={[0.04, 0.18, 0]} receiveShadow>
        <boxGeometry args={[1.52, 0.04, 0.54]} />
        <meshStandardMaterial color={CREAM_WHITE} roughness={0.5} />
      </mesh>

      {/* Cozy Lavender Candy Cabin on Stern */}
      <group position={[-0.54, 0.42, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.44, 0.26, 0.46]} />
          <meshStandardMaterial color={PASTEL_PURPLE} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.24, 0.26, 0.07, 16]} />
          <meshStandardMaterial color={STRAWBERRY_PINK} roughness={0.3} />
        </mesh>

        {/* Glowing Round Window */}
        <mesh position={[-0.225, 0.02, 0]}>
          <boxGeometry args={[0.01, 0.13, 0.28]} />
          <meshStandardMaterial color="#fef08a" emissive="#fbbf24" emissiveIntensity={2.8} />
        </mesh>

        {/* Dual Star Lanterns */}
        <CuteStarLantern position={[-0.23, 0.22, 0.18]} />
        <CuteStarLantern position={[-0.23, 0.22, -0.18]} />
      </group>

      {/* Cute Blushing Bear Mascot on Bow */}
      <group position={[1.12, 0.34, 0]}>
        <CuteBearMascot position={[0.1, 0.05, 0]} />
        {/* Bowsprit Pole */}
        <mesh rotation={[0, 0, 0.26]} castShadow>
          <cylinderGeometry args={[0.018, 0.026, 0.5, 12]} />
          <meshStandardMaterial color={CREAM_WHITE} />
        </mesh>
      </group>

      {/* Main Mast & Puffy Heart Sail */}
      <group position={[0.1, 0.38, 0]}>
        <mesh position={[0, 0.85, 0]} castShadow>
          <cylinderGeometry args={[0.022, 0.034, 1.7, 12]} />
          <meshStandardMaterial color={CREAM_WHITE} roughness={0.5} />
        </mesh>

        {/* Yardarms */}
        <mesh position={[0, 1.38, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.014, 0.014, 0.88, 8]} />
          <meshStandardMaterial color={CREAM_WHITE} />
        </mesh>
        <mesh position={[0, 0.44, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.014, 0.014, 0.98, 8]} />
          <meshStandardMaterial color={CREAM_WHITE} />
        </mesh>

        {/* Giant Puffy Pink Heart Sail */}
        <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.43, 0.47, 0.9, 24, 4, true, -1.35, 2.7]} />
          <meshStandardMaterial
            map={cuteSailTexture}
            roughness={0.38}
            side={THREE.DoubleSide}
            shadowSide={THREE.DoubleSide}
          />
        </mesh>

        {/* Fluttering Heart Flag */}
        <CuteHeartFlag position={[0, 1.75, 0]} />
      </group>
    </group>
  )
}
