import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Multi-octave Fractional Brownian Motion noise for natural island coastline & mountain terrain
function fbmNoise(x, z, seed = 1.0) {
  const n1 = Math.sin(x * 1.6 + seed) * Math.cos(z * 1.5 + seed * 1.4) * 0.42
  const n2 = Math.sin(x * 3.8 - z * 3.2 + seed * 2.3) * 0.22
  const n3 = Math.cos(x * 8.1 + z * 7.6 + seed * 3.7) * 0.09
  const n4 = Math.sin(x * 16.5 - z * 15.2 + seed * 4.9) * 0.04
  return n1 + n2 + n3 + n4
}

// Procedurally deforms cylinder into a natural, organic island landmass with realistic shoreline coves & ridges
function useOrganicIslandGeometry(radiusBase = 1.35, heightMax = 0.75, seed = 1.0) {
  return useMemo(() => {
    const RADIAL_SEGMENTS = 64
    const HEIGHT_SEGMENTS = 24
    const geo = new THREE.CylinderGeometry(radiusBase * 0.2, radiusBase * 1.2, heightMax, RADIAL_SEGMENTS, HEIGHT_SEGMENTS)
    const pos = geo.attributes.position

    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i)
      let y = pos.getY(i)
      let z = pos.getZ(i)

      const dist = Math.sqrt(x * x + z * z)
      const angle = Math.atan2(z, x)

      // Organic coastline perturbation (bays, coves, headlands)
      const coastNoise = fbmNoise(Math.cos(angle) * 2.2, Math.sin(angle) * 2.2, seed)
      const radialFactor = 1 + coastNoise * 0.35

      // Height profile: smooth dome curve + terrain ridge noise
      const normY = (y + heightMax / 2) / heightMax // 0 to 1
      const elevationNoise = fbmNoise(x * 1.8, z * 1.8, seed * 2.5) * 0.28
      
      // Expand radius according to coast noise
      x *= radialFactor
      z *= radialFactor

      // Flatten seabed edges, elevate island interior
      if (normY < 0.15) {
        y = -0.1 + (dist / radiusBase) * 0.05
      } else {
        const heightProfile = Math.pow(Math.max(0, 1 - (dist / (radiusBase * radialFactor))), 1.3)
        y = -0.05 + heightProfile * heightMax * 1.1 + elevationNoise * Math.max(0.1, heightProfile)
      }

      pos.setXYZ(i, x, y, z)
    }

    geo.computeVertexNormals()
    return geo
  }, [radiusBase, heightMax, seed])
}

// Animated wave foam ring breaking gently against the island shore
function ShoreFoamRing({ radius = 1.5 }) {
  const foamRef = useRef(null)
  
  useFrame(({ clock }) => {
    if (!foamRef.current) return
    const t = clock.getElapsedTime()
    const scale = 1 + Math.sin(t * 1.5) * 0.035
    foamRef.current.scale.set(scale, scale, 1)
    foamRef.current.material.opacity = 0.35 + Math.sin(t * 1.5) * 0.15
  })

  return (
    <mesh ref={foamRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
      <ringGeometry args={[radius * 0.92, radius * 1.18, 48]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.4} side={THREE.DoubleSide} />
    </mesh>
  )
}

function OrganicBush({ position, scale = 1, color = '#2e7a3e' }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.24, 12, 10]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0.1, 0.06, 0.08]} scale={0.75} castShadow>
        <sphereGeometry args={[0.2, 10, 8]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[-0.08, 0.04, -0.06]} scale={0.7} castShadow>
        <sphereGeometry args={[0.2, 10, 8]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
    </group>
  )
}

function Rock({ position, scale = 1, rotation = 0 }) {
  return (
    <mesh position={position} scale={[scale, scale * 0.75, scale * 0.85]} rotation={[0.2, rotation, 0.1]} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.15, 1]} />
      <meshStandardMaterial color="#595248" roughness={0.88} />
    </mesh>
  )
}

export function IslandTerrain({
  shoreColor = '#e6d59e',
  landColor = '#378243',
  transitionColor,
  slopeColor,
  rocks = [],
  seed = 1.0,
  scale = 1,
}) {
  const islandGeo = useOrganicIslandGeometry(1.35, 0.65, seed)

  const [transition, slope] = useMemo(() => {
    const shore = new THREE.Color(shoreColor)
    const land = new THREE.Color(landColor)
    return [
      transitionColor ? new THREE.Color(transitionColor) : shore.clone().lerp(land, 0.35),
      slopeColor ? new THREE.Color(slopeColor) : shore.clone().lerp(land, 0.65),
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shoreColor, landColor, transitionColor, slopeColor])

  return (
    <group scale={scale}>
      {/* Wave Foam Ring */}
      <ShoreFoamRing radius={1.45} />

      {/* Main Procedural Deformed Island Mesh */}
      <mesh geometry={islandGeo} castShadow receiveShadow position={[0, 0, 0]}>
        <meshStandardMaterial
          color={landColor}
          roughness={0.72}
          metalness={0.08}
        />
      </mesh>

      {/* Sandy Beach Outer Skirt */}
      <mesh position={[0, -0.06, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.3, 1.6, 0.22, 36]} />
        <meshStandardMaterial color={shoreColor} roughness={0.88} />
      </mesh>

      {/* Lush Foliage Bush Clusters */}
      <OrganicBush position={[0.22, 0.48, 0.18]} scale={0.9} color={landColor} />
      <OrganicBush position={[-0.3, 0.42, -0.15]} scale={0.8} color={slope} />
      <OrganicBush position={[0.05, 0.52, -0.32]} scale={0.75} color={transition} />
      <OrganicBush position={[-0.15, 0.45, 0.35]} scale={0.85} color={landColor} />

      {rocks.map((rock, index) => (
        <Rock key={index} {...rock} />
      ))}
    </group>
  )
}


