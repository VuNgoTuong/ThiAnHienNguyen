import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { WORLD_WIDTH, WORLD_DEPTH } from '../../utils/world3dCoords.js'

const SEGMENTS = 128
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
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    const position = geometry.attributes.position
    const count = position.count

    for (let i = 0; i < count; i++) {
      const x = basePositions[i * 3]
      const z = basePositions[i * 3 + 2]

      // Organic multi-directional Gerstner/trochoidal wave simulation
      const wave1 = Math.sin(x * 0.22 + t * 1.3) * 0.28
      const wave2 = Math.cos(z * 0.26 + t * 1.1) * 0.24
      const wave3 = Math.sin((x * 0.55 + z * 0.45) + t * 1.8) * 0.12
      const chop = Math.sin(x * 1.4 - z * 1.2 + t * 2.5) * 0.05

      // Distance falloff to keep horizon smooth
      const distSq = x * x + z * z
      const falloff = 1 / (1 + distSq * 0.00012)
      
      position.setY(i, (wave1 + wave2 + wave3 + chop) * falloff)
    }

    position.needsUpdate = true
    geometry.computeVertexNormals()
  })

  return (
    <mesh ref={meshRef} geometry={geometry} receiveShadow position={[0, -0.15, 0]}>
      <meshStandardMaterial
        color="#0b556a"
        roughness={0.12}
        metalness={0.4}
        envMapIntensity={2.5}
        emissive="#042235"
        emissiveIntensity={0.35}
        flatShading={false}
      />
    </mesh>
  )
}


