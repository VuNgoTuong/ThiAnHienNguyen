import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { WaterSurfaceShader } from './waterfallShaders.js'

export function WaterSurface() {
  const meshRef = useRef(null)

  const lakeGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(36, 36, 64, 64)
    geo.rotateX(-Math.PI / 2)
    return geo
  }, [])

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      ...WaterSurfaceShader,
      transparent: true,
      depthWrite: true,
      side: THREE.DoubleSide,
    })
  }, [])

  useFrame(({ clock }) => {
    if (shaderMaterial) {
      shaderMaterial.uniforms.uTime.value = clock.getElapsedTime()
    }
  })

  return <mesh ref={meshRef} geometry={lakeGeometry} material={shaderMaterial} position={[0, 0.1, 0]} receiveShadow />
}
