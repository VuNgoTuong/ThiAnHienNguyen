import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { percentToWorld3D } from '../../utils/world3dCoords.js'

const GOLD = '#e8c368'
const GOLD_DEEP = '#b3812f'
const HULL_COLOR = '#6b4526'
const HULL_TRIM = '#3a2410'
const SAIL_COLOR = '#f7ecd2'

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

function Mast({ x, height, sailHeight, sailY, sailRadius, crowsNest }) {
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
    </group>
  )
}

// 3D counterpart of the old ship/Ship.jsx (SVG) — rebuilt as an ornate
// "royal" galleon (shaped hull, curved sails, gilded trim/figurehead)
// rather than a box raft. Shared by the world map and the Title intro.
// Position comes straight from useShipVoyage's GSAP-driven state (already
// re-rendering every tick), so useFrame only owns the idle bob/heading.
export function Ship3D({ position, bearing = 0 }) {
  const groupRef = useRef(null)
  const world = useMemo(() => (position ? percentToWorld3D(position.x, position.y) : null), [position])
  const hullGeometry = useHullGeometry()

  useFrame(({ clock }) => {
    if (!groupRef.current || !world) return
    const t = clock.getElapsedTime()
    groupRef.current.position.set(world.x, 0.1 + Math.sin(t * 2) * 0.08, world.z)
    groupRef.current.rotation.y = -(bearing * Math.PI) / 180
    groupRef.current.rotation.z = Math.sin(t * 1.3) * 0.02
  })

  if (!world) return null

  return (
    <group ref={groupRef} scale={1.4}>
      {/* hull */}
      <mesh geometry={hullGeometry} castShadow receiveShadow>
        <meshStandardMaterial color={HULL_COLOR} roughness={0.5} metalness={0.1} />
      </mesh>

      {/* gunwale trim, port + starboard */}
      <mesh position={[0.05, 0.365, 0.245]}>
        <boxGeometry args={[1.35, 0.03, 0.02]} />
        <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[0.05, 0.365, -0.245]}>
        <boxGeometry args={[1.35, 0.03, 0.02]} />
        <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.35} />
      </mesh>
      {/* waterline stripe */}
      <mesh position={[0.05, 0.06, 0.251]}>
        <boxGeometry args={[1.3, 0.03, 0.005]} />
        <meshStandardMaterial color={GOLD_DEEP} metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0.05, 0.06, -0.251]}>
        <boxGeometry args={[1.3, 0.03, 0.005]} />
        <meshStandardMaterial color={GOLD_DEEP} metalness={0.4} roughness={0.4} />
      </mesh>

      {/* stylized gilded figurehead at the bow */}
      <mesh position={[0.82, 0.14, 0]} rotation={[0, 0, -0.3]}>
        <coneGeometry args={[0.055, 0.24, 8]} />
        <meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0.72, 0.02, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color={GOLD_DEEP} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* bowsprit */}
      <mesh position={[0.96, 0.24, 0]} rotation={[0, 0, 0.35]}>
        <cylinderGeometry args={[0.016, 0.022, 0.42, 6]} />
        <meshStandardMaterial color={HULL_TRIM} />
      </mesh>

      {/* fore + main masts */}
      <Mast x={-0.26} height={1.0} sailHeight={0.62} sailY={0.66} sailRadius={0.3} />
      <Mast x={0.16} height={1.35} sailHeight={0.85} sailY={0.86} sailRadius={0.38} crowsNest />

      {/* flag */}
      <mesh position={[0.16, 1.42, 0]}>
        <planeGeometry args={[0.26, 0.15]} />
        <meshStandardMaterial color={GOLD} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}
