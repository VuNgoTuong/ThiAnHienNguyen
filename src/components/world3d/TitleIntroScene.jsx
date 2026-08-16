import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, Clouds, Cloud } from '@react-three/drei'
import gsap from 'gsap'
import { Ocean3D } from './Ocean3D.jsx'
import { Ship3D } from './Ship3D.jsx'
import { Birds } from './Birds.jsx'
import { PalmIsland } from './PalmIsland.jsx'
import { ParadiseIsland } from './ParadiseIsland.jsx'
import { GradientSky } from './GradientSky.jsx'
import { SceneEffects } from './SceneEffects.jsx'
import { useShipVoyage } from '../../hooks/useShipVoyage.js'

const SUN_POSITION = [70, 42, -55]

const REST = { x: 0, y: 3.2, z: 8, rotX: -0.09, fogNear: 25, fogFar: 160 }
const START = { x: 0, y: 52, z: 12, rotX: -1.15, rotY: -0.18, fogNear: 35, fogFar: 180 }
const MID = { x: 22, y: 26, z: 36, rotX: -0.78, rotY: -0.06, fogNear: 30, fogFar: 140 }

const HOLD_S = 0.6
const DIVE_S = 1.7
const SETTLE_S = 1.8

function IntroCamera({ onSettled, onDiveStart }) {
  const cameraRef = useRef(null)
  const fogRef = useRef(null)

  useEffect(() => {
    if (!cameraRef.current || !fogRef.current) return
    const camera = cameraRef.current
    const fog = fogRef.current
    camera.position.set(START.x, START.y, START.z)
    camera.rotation.set(START.rotX, START.rotY, 0)
    fog.near = START.fogNear
    fog.far = START.fogFar

    const timeline = gsap.timeline({ delay: HOLD_S, onComplete: () => onSettled?.() })
    timeline
      .call(() => onDiveStart?.())
      .to(camera.position, { x: MID.x, y: MID.y, z: MID.z, duration: DIVE_S, ease: 'power1.in' }, 0)
      .to(camera.rotation, { x: MID.rotX, y: MID.rotY, duration: DIVE_S, ease: 'power1.in' }, 0)
      .to(fog, { near: MID.fogNear, far: MID.fogFar, duration: DIVE_S, ease: 'power1.in' }, 0)
      .to(camera.position, { x: REST.x, y: REST.y, z: REST.z, duration: SETTLE_S, ease: 'power3.out' }, DIVE_S)
      .to(camera.rotation, { x: REST.rotX, y: 0, duration: SETTLE_S, ease: 'power3.out' }, DIVE_S)
      .to(fog, { near: REST.fogNear, far: REST.fogFar, duration: SETTLE_S, ease: 'power3.out' }, DIVE_S)

    return () => timeline.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <fog ref={fogRef} attach="fog" args={['#a8d4e6', START.fogNear, START.fogFar]} />
      <PerspectiveCamera ref={cameraRef} makeDefault fov={55} near={0.1} far={260} />
    </>
  )
}

function ArrivingShip({ start }) {
  const { position, bearing, sailTo } = useShipVoyage()

  useEffect(() => {
    if (!start) return
    sailTo({ x: 92, y: 78 }, { x: 63, y: 50 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start])

  if (!position) return null
  return <Ship3D position={position} bearing={bearing} />
}

export function TitleIntroScene({ onSettled }) {
  const [sunMesh, setSunMesh] = useState(null)
  const [diveStarted, setDiveStarted] = useState(false)

  return (
    <Canvas dpr={[1, 1.5]} gl={{ antialias: true }}>
      <GradientSky sunPosition={SUN_POSITION} />
      <IntroCamera onSettled={onSettled} onDiveStart={() => setDiveStarted(true)} />
      <hemisphereLight args={['#e8f4f8', '#0e3a47', 0.65]} />
      <ambientLight intensity={0.65} color="#fff6e5" />
      <directionalLight position={SUN_POSITION} intensity={1.5} color="#ffe2b3" castShadow />
      <pointLight position={[-8, 4, -8]} intensity={0.8} color="#ffe585" distance={15} />

      {/* Sun Mesh with Glowing Corona */}
      <group position={SUN_POSITION}>
        <mesh ref={setSunMesh}>
          <sphereGeometry args={[4.2, 24, 24]} />
          <meshBasicMaterial color="#fffbe6" />
        </mesh>
        <mesh>
          <sphereGeometry args={[6.5, 16, 16]} />
          <meshBasicMaterial color="#ffeab3" transparent opacity={0.35} />
        </mesh>
      </group>

      <Clouds material={undefined} limit={40}>
        <Cloud seed={1} position={[-18, 28, -40]} scale={2.8} opacity={0.75} speed={0.08} bounds={[10, 3, 6]} color="#fffcf5" />
        <Cloud seed={2} position={[16, 34, -55]} scale={3.4} opacity={0.65} speed={0.06} bounds={[12, 3, 6]} color="#fff8ea" />
        <Cloud seed={3} position={[0, 40, -70]} scale={2.5} opacity={0.6} speed={0.07} bounds={[9, 3, 5]} color="#fffcf5" />
      </Clouds>

      <Birds />

      {/* Ultra-beautiful Tropical Paradise Island */}
      <ParadiseIsland position={[-7.5, -0.2, -11]} scale={1.85} rotation={[0, 0.4, 0]} />
      <PalmIsland position={[15, 0, -24]} scale={1.1} />

      <Suspense fallback={null}>
        <Ocean3D />
        <ArrivingShip start={diveStarted} />
      </Suspense>
      <SceneEffects sunMesh={sunMesh} />
    </Canvas>
  )
}
