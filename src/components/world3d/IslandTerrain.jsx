import { useMemo } from 'react'
import * as THREE from 'three'

// Shared island landmass — layered outer/transition/slope/foliage bands
// instead of a single ring + a bare cone, plus a couple of scattered rocks
// for texture. Used by both PalmIsland (decorative, Title intro — passes
// explicit tan/green beach tones) and Island3D (interactive, world map —
// passes just its two state-colored tones and lets the bands in between
// get derived automatically), which only differ in palette and whatever
// they stack on top (palm trees, the click overlay).
function Rock({ position, scale = 1, rotation = 0 }) {
  return (
    <mesh position={position} scale={[scale, scale * 0.7, scale * 0.85]} rotation={[0.25, rotation, 0.1]} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.12, 0]} />
      <meshStandardMaterial color="#5c584f" roughness={0.95} />
    </mesh>
  )
}

export function IslandTerrain({ shoreColor = '#d8c485', landColor = '#4d8a52', transitionColor, slopeColor, rocks = [] }) {
  const [transition, slope] = useMemo(() => {
    const shore = new THREE.Color(shoreColor)
    const land = new THREE.Color(landColor)
    return [
      transitionColor ? new THREE.Color(transitionColor) : shore.clone().lerp(land, 0.3),
      slopeColor ? new THREE.Color(slopeColor) : shore.clone().lerp(land, 0.6),
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shoreColor, landColor, transitionColor, slopeColor])

  return (
    <group>
      {/* outer ring */}
      <mesh position={[0, -0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.1, 1.4, 0.3, 16]} />
        <meshStandardMaterial color={shoreColor} roughness={0.9} />
      </mesh>
      {/* transition band, closer to the waterline and a touch glossier */}
      <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.86, 1.04, 0.16, 16]} />
        <meshStandardMaterial color={transition} roughness={0.5} />
      </mesh>
      {/* slope */}
      <mesh position={[0, 0.16, 0]} castShadow>
        <coneGeometry args={[0.8, 0.42, 14]} />
        <meshStandardMaterial color={slope} roughness={0.85} />
      </mesh>
      {/* foliage cap, tapered cone + a rounded top so it doesn't end in a
          bare point */}
      <mesh position={[0, 0.42, 0]} scale={[1.05, 0.9, 0.95]} castShadow>
        <coneGeometry args={[0.6, 0.48, 14]} />
        <meshStandardMaterial color={landColor} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.65, 0]} castShadow>
        <sphereGeometry args={[0.2, 10, 8]} />
        <meshStandardMaterial color={landColor} roughness={0.8} />
      </mesh>

      {rocks.map((rock, index) => (
        <Rock key={index} {...rock} />
      ))}
    </group>
  )
}
