import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Efficient InstancedMesh vegetation renderer for 60 FPS performance
const BUSH_COUNT = 36
const FERN_COUNT = 24

export function Vegetation() {
  const bushMeshRef = useRef(null)
  const fernMeshRef = useRef(null)

  // Generate random transform matrices for instanced bushes and ferns
  const bushTransforms = useMemo(() => {
    const matrices = []
    const dummy = new THREE.Object3D()
    for (let i = 0; i < BUSH_COUNT; i++) {
      const x = (Math.random() - 0.5) * 14
      const y = 0.5 + Math.random() * 8.5
      const z = (Math.random() - 0.5) * 4 - 0.5
      const scale = 0.4 + Math.random() * 0.7
      dummy.position.set(x, y, z)
      dummy.scale.set(scale, scale * (0.8 + Math.random() * 0.4), scale)
      dummy.rotation.set(Math.random() * 0.2, Math.random() * Math.PI * 2, Math.random() * 0.2)
      dummy.updateMatrix()
      matrices.push(dummy.matrix.clone())
    }
    return matrices
  }, [])

  const fernTransforms = useMemo(() => {
    const matrices = []
    const dummy = new THREE.Object3D()
    for (let i = 0; i < FERN_COUNT; i++) {
      const x = (Math.random() - 0.5) * 10
      const y = 0.2 + Math.random() * 4.0
      const z = 0.5 + Math.random() * 3.0
      const scale = 0.35 + Math.random() * 0.5
      dummy.position.set(x, y, z)
      dummy.scale.set(scale, scale, scale)
      dummy.rotation.set(0, Math.random() * Math.PI * 2, 0)
      dummy.updateMatrix()
      matrices.push(dummy.matrix.clone())
    }
    return matrices
  }, [])

  // Apply instance matrices after mount
  useMemo(() => {
    setTimeout(() => {
      if (bushMeshRef.current) {
        bushTransforms.forEach((matrix, i) => bushMeshRef.current.setMatrixAt(i, matrix))
        bushMeshRef.current.instanceMatrix.needsUpdate = true
      }
      if (fernMeshRef.current) {
        fernTransforms.forEach((matrix, i) => fernMeshRef.current.setMatrixAt(i, matrix))
        fernMeshRef.current.instanceMatrix.needsUpdate = true
      }
    }, 0)
  }, [bushTransforms, fernTransforms])

  // Gentle wind sway animation on foliage instances
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (bushMeshRef.current) {
      bushMeshRef.current.rotation.z = Math.sin(t * 1.2) * 0.015
    }
  })

  return (
    <group>
      {/* Instanced Rainforest Bushes */}
      <instancedMesh ref={bushMeshRef} args={[null, null, BUSH_COUNT]} castShadow>
        <sphereGeometry args={[0.5, 12, 10]} />
        <meshStandardMaterial color="#2d7339" roughness={0.75} />
      </instancedMesh>

      {/* Instanced Fern Fronds */}
      <instancedMesh ref={fernMeshRef} args={[null, null, FERN_COUNT]} castShadow>
        <coneGeometry args={[0.35, 0.7, 6]} />
        <meshStandardMaterial color="#3ea84e" roughness={0.65} side={THREE.DoubleSide} />
      </instancedMesh>
    </group>
  )
}
