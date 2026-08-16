import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Multiple smaller trickling side streams cascading over cliff ledges
const STREAMS = [
  { position: [-1.6, 4.8, 0.2], width: 0.4, height: 7.5, speed: 1.5, curve: -0.2 },
  { position: [1.8, 4.2, 0.35], width: 0.5, height: 6.8, speed: 1.8, curve: 0.25 },
  { position: [-2.4, 3.5, -0.1], width: 0.3, height: 5.2, speed: 1.3, curve: -0.15 },
]

export function SideStreams() {
  const materialsRef = useRef([])

  const streamGeometries = useMemo(() => {
    return STREAMS.map((s) => {
      const geo = new THREE.PlaneGeometry(s.width, s.height, 16, 32)
      const pos = geo.attributes.position
      for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i)
        let y = pos.getY(i)
        let z = pos.getZ(i)
        const normY = (y + s.height / 2) / s.height
        x += Math.sin(normY * Math.PI * 2) * s.curve
        z += Math.sin(normY * Math.PI) * 0.2
        pos.setXYZ(i, x, y, z)
      }
      geo.computeVertexNormals()
      return geo
    })
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    materialsRef.current.forEach((mat, index) => {
      if (mat) {
        mat.map.offset.y = -t * STREAMS[index].speed * 0.5
      }
    })
  })

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#2b9bb5'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * canvas.width
      const w = 1 + Math.random() * 3
      const h = 15 + Math.random() * 50
      const y = Math.random() * canvas.height
      ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + Math.random() * 0.5})`
      ctx.fillRect(x, y, w, h)
    }
    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(1, 2)
    return tex
  }, [])

  return (
    <group>
      {STREAMS.map((s, idx) => (
        <mesh key={idx} geometry={streamGeometries[idx]} position={s.position}>
          <meshStandardMaterial
            ref={(el) => (materialsRef.current[idx] = el)}
            map={texture}
            transparent
            opacity={0.8}
            color="#8ce6f5"
            emissive="#3ebae8"
            emissiveIntensity={0.6}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}
