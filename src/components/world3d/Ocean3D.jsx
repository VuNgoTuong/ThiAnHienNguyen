import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { WORLD_WIDTH, WORLD_DEPTH } from '../../utils/world3dCoords.js'

// Segments scaled up alongside the plane size (see PLANE_SCALE) so the
// wave's spatial frequency stays properly sampled even at the Title
// intro's high establishing shot — too few segments on a very large plane
// under-samples the sine waves, producing incoherent (aliased) normals
// that show up as a blurry lighting "blob" instead of a smooth surface.
const SEGMENTS = 72
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
      // Two long swells plus a short chop layer so the surface catches
      // light in visibly varied facets instead of reading as a flat plane.
      const swell = Math.sin(x * 0.35 + t * 0.8) * 0.22 + Math.cos(z * 0.4 + t * 0.6) * 0.18
      const chop = Math.sin(x * 1.6 + z * 1.3 + t * 1.7) * 0.05
      // Fades the displacement out toward the far edges — distant water
      // reads as flatter/hazier anyway from perspective, and this keeps
      // the wave frequency well-sampled without needing an enormous grid.
      const falloff = 1 / (1 + (x * x + z * z) * 0.00025)
      position.setY(i, (swell + chop) * falloff)
    }
    position.needsUpdate = true
    geometry.computeVertexNormals()
  })

  return (
    <mesh ref={meshRef} geometry={geometry} receiveShadow position={[0, -0.15, 0]}>
      <meshStandardMaterial color="#136e88" roughness={0.22} metalness={0.12} envMapIntensity={1.2} />
    </mesh>
  )
}
