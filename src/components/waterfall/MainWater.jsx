import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { MainWaterShader } from './waterfallShaders.js'
import { useWaterfallStore } from './useWaterfallStore.js'

export function MainWater() {
  const meshRef = useRef(null)
  const materialRef = useRef(null)

  const isHovered = useWaterfallStore((s) => s.isHovered)
  const isSelected = useWaterfallStore((s) => s.isSelected)
  const setHovered = useWaterfallStore((s) => s.setHovered)
  const setSelected = useWaterfallStore((s) => s.setSelected)

  // Curved vertical ribbon geometry for the main 10m waterfall cascade
  const ribbonGeometry = useMemo(() => {
    const height = 10
    const widthTop = 1.4
    const widthBottom = 2.6
    const geo = new THREE.PlaneGeometry(widthBottom, height, 32, 64)
    const pos = geo.attributes.position

    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i)
      let y = pos.getY(i)
      let z = pos.getZ(i)

      const normY = (y + height / 2) / height // 0 (bottom) to 1 (top)

      // Width taper from top to bottom
      const widthFactor = THREE.MathUtils.lerp(widthBottom, widthTop, normY) / widthBottom
      x *= widthFactor

      // Forward parabolic curve out from the cliff face
      z += Math.sin(normY * Math.PI) * 0.45 + (1.0 - normY) * 0.35

      pos.setXYZ(i, x, y, z)
    }

    geo.computeVertexNormals()
    return geo
  }, [])

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      ...MainWaterShader,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  }, [])

  useFrame(({ clock }) => {
    if (!shaderMaterial) return
    shaderMaterial.uniforms.uTime.value = clock.getElapsedTime()
    // Subtle glow boost on hover or click
    const targetGlow = isSelected ? 1.4 : isHovered ? 1.25 : 1.0
    shaderMaterial.uniforms.uGlowIntensity.value = THREE.MathUtils.lerp(
      shaderMaterial.uniforms.uGlowIntensity.value,
      targetGlow,
      0.08,
    )
  })

  return (
    <mesh
      ref={meshRef}
      geometry={ribbonGeometry}
      material={shaderMaterial}
      position={[0, 5.2, 0.4]}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
      onClick={(e) => {
        e.stopPropagation()
        setSelected(!isSelected)
      }}
    />
  )
}
