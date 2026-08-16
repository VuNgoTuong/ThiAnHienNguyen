import { useMemo } from 'react'
import * as THREE from 'three'

// Multi-tiered natural rock cliff face (12m high) with dark damp wet rocks near water, moss patches, and cracks
export function Cliff() {
  const cliffGeometry = useMemo(() => {
    const width = 18
    const height = 14
    const geo = new THREE.PlaneGeometry(width, height, 48, 36)
    const pos = geo.attributes.position

    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i)
      let y = pos.getY(i)
      let z = pos.getZ(i)

      const normY = (y + height / 2) / height

      // Natural cliff face rock noise & overhangs
      const n1 = Math.sin(x * 0.8 + y * 0.9) * 0.45
      const n2 = Math.cos(x * 1.8 - y * 1.6) * 0.25
      const n3 = Math.sin(x * 4.2 + y * 3.8) * 0.1

      z += n1 + n2 + n3

      // Center waterfall recess gorge
      if (Math.abs(x) < 3.2) {
        z -= (3.2 - Math.abs(x)) * 0.5 * Math.sin(normY * Math.PI)
      }

      pos.setXYZ(i, x, y, z)
    }

    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <group position={[0, 6, -0.6]}>
      {/* Main Natural Rock Cliff Mesh */}
      <mesh geometry={cliffGeometry} castShadow receiveShadow>
        <meshStandardMaterial
          color="#423b32"
          roughness={0.88}
          metalness={0.08}
        />
      </mesh>

      {/* Dark Damp Wet Rock Ledges near Water */}
      <mesh position={[0, -2.5, 0.4]} scale={[1.1, 0.6, 1.0]} receiveShadow>
        <planeGeometry args={[8, 4, 16, 16]} />
        <meshStandardMaterial
          color="#241e18"
          roughness={0.25}
          metalness={0.3}
        />
      </mesh>

      {/* Moss Patches on Ledges */}
      {[-3.5, -1.2, 1.5, 3.8].map((x, idx) => (
        <mesh key={idx} position={[x, 3.2 + (idx % 2) * 1.5, 0.2]} scale={[1.2, 0.5, 0.8]}>
          <sphereGeometry args={[0.6, 12, 8]} />
          <meshStandardMaterial color="#2d6934" roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}
