import * as THREE from 'three'
import { IslandTerrain } from './IslandTerrain.jsx'

// Purely decorative scenery for the Title intro — same cone/cylinder
// language as the map's Island3D, topped with a couple of simple palm
// trees. Not part of the game's island data; never interactive.
// Exported so Island3D can plant one on the gameplay islands too, for a
// consistent look between the intro and the map.
export function PalmTree({ position, scale = 1, lean = 0 }) {
  return (
    <group position={position} scale={scale} rotation={[0, 0, lean]}>
      {/* trunk, given a slight forward bend by nudging the top point sideways */}
      <mesh position={[0.05, 0.5, 0]} rotation={[0, 0, 0.09]}>
        <cylinderGeometry args={[0.018, 0.04, 1, 7]} />
        <meshStandardMaterial color="#6b4a2a" roughness={0.85} />
      </mesh>
      {/* fronds: flattened, tapered blades fanned around the crown and
          drooping past horizontal, instead of stubby full cones */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={i}
          position={[
            0.1 + Math.cos((i / 6) * Math.PI * 2) * 0.1,
            1.03,
            Math.sin((i / 6) * Math.PI * 2) * 0.1,
          ]}
          rotation={[Math.PI / 1.9, 0, (i / 6) * Math.PI * 2]}
          scale={[1, 1, 0.16]}
        >
          <coneGeometry args={[0.1, 0.6, 5]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#2f7d3a' : '#3d8f47'} roughness={0.75} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}

const ROCKS = [
  { position: [0.55, 0.02, 0.7], scale: 1, rotation: 0.4 },
  { position: [-0.7, 0.0, 0.5], scale: 0.7, rotation: 1.1 },
  { position: [0.3, 0.0, -0.85], scale: 0.85, rotation: 2.2 },
]

export function PalmIsland({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <IslandTerrain
        shoreColor="#d8c485"
        transitionColor="#c2a563"
        slopeColor="#7c8f4d"
        landColor="#4d8a52"
        rocks={ROCKS}
      />
      <PalmTree position={[0.25, 0.75, 0.12]} scale={0.75} lean={0.12} />
      <PalmTree position={[-0.32, 0.7, -0.18]} scale={0.6} lean={-0.08} />
      <PalmTree position={[0.02, 0.72, -0.35]} scale={0.5} lean={0.05} />
    </group>
  )
}
