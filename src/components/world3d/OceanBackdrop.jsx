import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { Ocean3D } from './Ocean3D.jsx'
import { GradientSky } from './GradientSky.jsx'

const SUN_POSITION = [70, 42, -55]

// A gentle, low camera angle (as if standing on deck looking out at the
// sea) rather than the map's top-down framing — used as a decorative,
// non-interactive backdrop behind dialogue/puzzle panels.
function DriftingCamera() {
  const ref = useRef(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.position.y = 5.5 + Math.sin(t * 0.3) * 0.2
    ref.current.rotation.z = Math.sin(t * 0.2) * 0.01
  })
  return <PerspectiveCamera ref={ref} makeDefault fov={55} position={[0, 3.2, 8]} rotation={[-0.09, 0, 0]} near={0.1} far={260} />
}

export function OceanBackdrop() {
  return (
    <Canvas dpr={[1, 1.5]} gl={{ antialias: true }}>
      <DriftingCamera />
      <GradientSky />
      <fog attach="fog" args={['#bfe0ee', 30, 150]} />
      <hemisphereLight args={['#cfe8ef', '#0c3a44', 0.55]} />
      <ambientLight intensity={0.55} color="#fff8ec" />
      <directionalLight position={SUN_POSITION} intensity={1.3} color="#fff4d9" />
      <pointLight position={[0, 6, -4]} intensity={0.2} color="#fff0c8" distance={24} />
      <Suspense fallback={null}>
        <Ocean3D />
      </Suspense>
    </Canvas>
  )
}
