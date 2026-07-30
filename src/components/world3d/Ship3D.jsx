import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { percentToWorld3D } from '../../utils/world3dCoords.js'

const GOLD = '#e8c368'
const GOLD_DEEP = '#b3812f'
const HULL_COLOR = '#6b4526'
const HULL_TRIM = '#3a2410'
const SAIL_COLOR = '#232120'
const ROPE = '#8a7048'
const IRON = '#2b2b2b'

// A small hand-drawn Jolly Roger, generated once on a <canvas> instead of
// shipping an image asset — this game has no texture pipeline, so a
// CanvasTexture is the only way to get a flag graphic without adding one.
function useSkullFlagTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 96
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = SAIL_COLOR
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const cx = canvas.width / 2
    const cy = canvas.height * 0.44
    const bone = '#ece4cf'

    ctx.strokeStyle = bone
    ctx.lineWidth = 7
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(cx - 36, cy + 32)
    ctx.lineTo(cx + 36, cy - 6)
    ctx.moveTo(cx - 36, cy - 6)
    ctx.lineTo(cx + 36, cy + 32)
    ctx.stroke()
    ;[
      [cx - 36, cy + 32],
      [cx + 36, cy - 6],
      [cx - 36, cy - 6],
      [cx + 36, cy + 32],
    ].forEach(([x, y]) => {
      ctx.beginPath()
      ctx.arc(x, y, 5.5, 0, Math.PI * 2)
      ctx.fillStyle = bone
      ctx.fill()
    })

    ctx.fillStyle = bone
    ctx.beginPath()
    ctx.arc(cx, cy - 8, 23, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillRect(cx - 15, cy - 8, 30, 17)

    ctx.fillStyle = SAIL_COLOR
    ctx.beginPath()
    ctx.arc(cx - 9, cy - 10, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(cx + 9, cy - 10, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(cx, cy - 3)
    ctx.lineTo(cx - 4, cy + 6)
    ctx.lineTo(cx + 4, cy + 6)
    ctx.closePath()
    ctx.fill()

    ctx.strokeStyle = SAIL_COLOR
    ctx.lineWidth = 2
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath()
      ctx.moveTo(cx + i * 7, cy + 7)
      ctx.lineTo(cx + i * 7, cy + 13)
      ctx.stroke()
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  }, [])
}

// Bow points toward +X. A simple straight-line polygon (no bezier curves,
// no bevel) — predictable, unambiguous boat silhouette: flat stern, rising
// deck line, angular tapered bow, flat keel — extruded along Z for the beam.
function useHullGeometry() {
  return useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-0.6, 0.05)
    shape.lineTo(-0.62, 0.32)
    shape.lineTo(-0.4, 0.37)
    shape.lineTo(0.4, 0.32)
    shape.lineTo(0.8, 0.16)
    shape.lineTo(0.6, 0.0)
    shape.lineTo(-0.6, 0.05)
    shape.closePath()

    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.5, bevelEnabled: false, steps: 1 })
    geo.translate(0, 0, -0.25)
    geo.computeVertexNormals()
    return geo
  }, [])
}

// A flat triangular jib, built as its own tiny geometry rather than a
// stretched plane — a plane's rectangular UV would need clipping to get a
// clean triangular edge.
function useJibGeometry() {
  return useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array([0, 0, 0, 0.62, -0.5, 0, 0, -0.5, 0])
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.computeVertexNormals()
    return geo
  }, [])
}

// A wide partial open cylinder — a deep curved arc in cross-section — reads
// as a billowing sail from a much broader range of viewing angles than a
// shallow curve would (the ship's bearing varies with its sailing path, so
// the sail can't assume it's always seen face-on).
function Sail({ position, height, radius = 0.4 }) {
  return (
    <mesh position={position}>
      <cylinderGeometry args={[radius, radius * 0.92, height, 14, 1, true, -1.25, 2.5]} />
      <meshStandardMaterial color={SAIL_COLOR} side={THREE.DoubleSide} roughness={0.75} />
    </mesh>
  )
}

function Pennant({ position, texture }) {
  return (
    <mesh position={position}>
      <planeGeometry args={[0.2, 0.15]} />
      <meshStandardMaterial map={texture} side={THREE.DoubleSide} roughness={0.6} />
    </mesh>
  )
}

function Mast({ x, height, sailHeight, sailY, sailRadius, crowsNest, flagTexture }) {
  return (
    <group position={[x, 0.32, 0]}>
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.02, 0.028, height, 8]} />
        <meshStandardMaterial color={HULL_TRIM} />
      </mesh>
      {crowsNest ? (
        <mesh position={[0, height * 0.62, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.1, 0.016, 6, 12]} />
          <meshStandardMaterial color={HULL_TRIM} />
        </mesh>
      ) : null}
      <Sail position={[0, sailY, 0]} height={sailHeight} radius={sailRadius} />
      <Pennant position={[0, height + 0.08, 0]} texture={flagTexture} />
    </group>
  )
}

// Thin gold posts along the gunwale, capped by the existing rail bar —
// reads as a proper balustrade instead of a single floating gold stick.
function Railing({ z }) {
  const postXs = [-0.5, -0.3, -0.1, 0.1, 0.3, 0.5, 0.68]
  return (
    <>
      {postXs.map((x) => (
        <mesh key={x} position={[x, 0.32, z]}>
          <cylinderGeometry args={[0.006, 0.006, 0.09, 5]} />
          <meshStandardMaterial color={GOLD_DEEP} metalness={0.5} roughness={0.35} />
        </mesh>
      ))}
      <mesh position={[0.05, 0.365, z]}>
        <boxGeometry args={[1.35, 0.03, 0.02]} />
        <meshStandardMaterial color={GOLD} metalness={0.55} roughness={0.25} />
      </mesh>
    </>
  )
}

// A row of cannon barrels poking through the hull, port + starboard — the
// single detail that reads as "pirate ship" from silhouette alone.
function Cannons({ z }) {
  const xs = [-0.42, -0.2, 0.02, 0.24]
  const outward = z > 0 ? 1 : -1
  return xs.map((x) => (
    <mesh key={x} position={[x, 0.16, z + 0.05 * outward]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.018, 0.022, 0.14, 8]} />
      <meshStandardMaterial color={IRON} metalness={0.6} roughness={0.4} />
    </mesh>
  ))
}

// 3D counterpart of the old ship/Ship.jsx (SVG) — rebuilt as an ornate
// "royal" galleon (shaped hull, curved sails, gilded trim/figurehead,
// rigging, a raised aftcastle) rather than a box raft. Shared by the world
// map and the Title intro. Position comes straight from useShipVoyage's
// GSAP-driven state (already re-rendering every tick), so useFrame only
// owns the idle bob/heading.
export function Ship3D({ position, bearing = 0 }) {
  const groupRef = useRef(null)
  const world = useMemo(() => (position ? percentToWorld3D(position.x, position.y) : null), [position])
  const hullGeometry = useHullGeometry()
  const jibGeometry = useJibGeometry()
  const flagTexture = useSkullFlagTexture()

  useFrame(({ clock }) => {
    if (!groupRef.current || !world) return
    const t = clock.getElapsedTime()
    groupRef.current.position.set(world.x, 0.1 + Math.sin(t * 2) * 0.08, world.z)
    groupRef.current.rotation.y = -(bearing * Math.PI) / 180
    groupRef.current.rotation.z = Math.sin(t * 1.3) * 0.02
  })

  if (!world) return null

  // Rigging anchor points, in the ship's local space — kept as plain
  // constants (not state/props) since the hull silhouette is fixed.
  const mainTop = [0.16, 1.67, 0]
  const foreTop = [-0.26, 1.32, 0]
  const bowTip = [0.98, 0.26, 0]
  const sternTop = [-0.51, 0.42, 0]
  const deckPort = (x) => [x, 0.36, 0.245]
  const deckStar = (x) => [x, 0.36, -0.245]

  return (
    <group ref={groupRef} scale={1.4}>
      {/* hull */}
      <mesh geometry={hullGeometry} castShadow receiveShadow>
        <meshStandardMaterial color={HULL_COLOR} roughness={0.5} metalness={0.1} />
      </mesh>

      {/* gunwale balustrade, port + starboard */}
      <Railing z={0.245} />
      <Railing z={-0.245} />
      {/* waterline stripe */}
      <mesh position={[0.05, 0.06, 0.251]}>
        <boxGeometry args={[1.3, 0.03, 0.005]} />
        <meshStandardMaterial color={GOLD_DEEP} metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0.05, 0.06, -0.251]}>
        <boxGeometry args={[1.3, 0.03, 0.005]} />
        <meshStandardMaterial color={GOLD_DEEP} metalness={0.4} roughness={0.4} />
      </mesh>

      {/* gun deck, port + starboard */}
      <Cannons z={0.25} />
      <Cannons z={-0.25} />

      {/* raised aftcastle deck + stern lantern */}
      <mesh position={[-0.5, 0.44, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.22, 0.16, 0.42]} />
        <meshStandardMaterial color={HULL_COLOR} roughness={0.55} />
      </mesh>
      <mesh position={[-0.5, 0.53, 0]}>
        <boxGeometry args={[0.23, 0.02, 0.43]} />
        <meshStandardMaterial color={GOLD} metalness={0.55} roughness={0.3} />
      </mesh>
      <mesh position={[-0.58, 0.62, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.14, 5]} />
        <meshStandardMaterial color={HULL_TRIM} />
      </mesh>
      <mesh position={[-0.58, 0.7, 0]}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshStandardMaterial color="#ffdf8f" emissive="#ffb347" emissiveIntensity={1.1} roughness={0.3} />
      </mesh>

      {/* stylized gilded figurehead at the bow */}
      <mesh position={[0.82, 0.14, 0]} rotation={[0, 0, -0.3]}>
        <coneGeometry args={[0.055, 0.24, 8]} />
        <meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.25} />
      </mesh>
      <mesh position={[0.72, 0.02, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color={GOLD_DEEP} metalness={0.6} roughness={0.25} />
      </mesh>
      <mesh position={[0.86, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.045, 0.012, 6, 12]} />
        <meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.25} />
      </mesh>

      {/* bowsprit + jib */}
      <mesh position={[0.96, 0.24, 0]} rotation={[0, 0, 0.35]}>
        <cylinderGeometry args={[0.016, 0.022, 0.42, 6]} />
        <meshStandardMaterial color={HULL_TRIM} />
      </mesh>
      <mesh geometry={jibGeometry} position={[0.26, 1.32, 0]}>
        <meshStandardMaterial color={SAIL_COLOR} side={THREE.DoubleSide} roughness={0.75} />
      </mesh>

      {/* fore + main masts */}
      <Mast x={-0.26} height={1.0} sailHeight={0.62} sailY={0.66} sailRadius={0.3} flagTexture={flagTexture} />
      <Mast
        x={0.16}
        height={1.35}
        sailHeight={0.85}
        sailY={0.86}
        sailRadius={0.38}
        crowsNest
        flagTexture={flagTexture}
      />

      {/* standing rigging — a simple stay/shroud fan instead of bare masts */}
      <Line points={[foreTop, bowTip]} color={ROPE} lineWidth={1} />
      <Line points={[mainTop, foreTop]} color={ROPE} lineWidth={1} />
      <Line points={[mainTop, sternTop]} color={ROPE} lineWidth={1} />
      <Line points={[mainTop, deckPort(0.16)]} color={ROPE} lineWidth={1} />
      <Line points={[mainTop, deckStar(0.16)]} color={ROPE} lineWidth={1} />
      <Line points={[foreTop, deckPort(-0.26)]} color={ROPE} lineWidth={1} />
      <Line points={[foreTop, deckStar(-0.26)]} color={ROPE} lineWidth={1} />
    </group>
  )
}
