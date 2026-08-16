import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { WORLD_WIDTH, WORLD_DEPTH } from '../../utils/world3dCoords.js'

const SEGMENTS = 96
const PLANE_SCALE = 8

export function Ocean3D() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(WORLD_WIDTH * PLANE_SCALE, WORLD_DEPTH * PLANE_SCALE, SEGMENTS, SEGMENTS)
    geo.rotateX(-Math.PI / 2)
    return geo
  }, [])

  const basePositions = useMemo(() => geometry.attributes.position.array.slice(), [geometry])
  const meshRef = useRef(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const position = geometry.attributes.position
    for (let i = 0; i < position.count; i++) {
      const x = basePositions[i * 3]
      const z = basePositions[i * 3 + 2]
      
      // Multi-directional trochoidal sine waves for realistic, organic ocean swells
      const wave1 = Math.sin(x * 0.28 + t * 1.1) * 0.26
      const wave2 = Math.cos(z * 0.32 + t * 0.95) * 0.22
      const wave3 = Math.sin((x * 0.7 + z * 0.6) + t * 1.6) * 0.1
      const chop = Math.sin(x * 1.8 - z * 1.5 + t * 2.2) * 0.04
      
      const falloff = 1 / (1 + (x * x + z * z) * 0.00018)
      position.setY(i, (wave1 + wave2 + wave3 + chop) * falloff)
    }
    position.needsUpdate = true
    geometry.computeVertexNormals()
  })

  return (
    <mesh ref={meshRef} geometry={geometry} receiveShadow position={[0, -0.15, 0]}>
      <meshStandardMaterial
        color="#0a4666"
        roughness={0.16}
        metalness={0.28}
        envMapIntensity={2.0}
        emissive="#041d2e"
        emissiveIntensity={0.2}
      />
    </mesh>
  )
}

