import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, Clouds, Cloud } from '@react-three/drei'
import gsap from 'gsap'
import { Ocean3D } from './Ocean3D.jsx'
import { Ship3D } from './Ship3D.jsx'
import { Birds } from './Birds.jsx'
import { PalmIsland } from './PalmIsland.jsx'
import { RockyIsland } from './RockyIsland.jsx'
import { GradientSky } from './GradientSky.jsx'
import { SceneEffects } from './SceneEffects.jsx'
import { useShipVoyage } from '../../hooks/useShipVoyage.js'

const SUN_POSITION = [70, 42, -55]

const REST = { x: 0, y: 3.2, z: 8, rotX: -0.09, fogNear: 30, fogFar: 150 }
const START = { x: 0, y: 52, z: 12, rotX: -1.15, rotY: -0.18, fogNear: 45, fogFar: 170 }
const MID = { x: 22, y: 26, z: 36, rotX: -0.78, rotY: -0.06, fogNear: 35, fogFar: 120 }

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
      <fog ref={fogRef} attach="fog" args={['#bfe0ee', START.fogNear, START.fogFar]} />
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
  // A state setter as the ref callback (not useRef) — GodRays needs the
  // *mounted* mesh instance, and only a state update forces SceneEffects to
  // re-render once that mesh actually exists (a plain ref wouldn't).
  const [sunMesh, setSunMesh] = useState(null)
  const [diveStarted, setDiveStarted] = useState(false)

  return (
    <Canvas dpr={[1, 1.5]} gl={{ antialias: true }}>
      <GradientSky />
      <IntroCamera onSettled={onSettled} onDiveStart={() => setDiveStarted(true)} />
      <hemisphereLight args={['#cfe8ef', '#0c3a44', 0.55]} />
      <ambientLight intensity={0.55} color="#fff8ec" />
      <directionalLight position={SUN_POSITION} intensity={1.3} color="#fff4d9" />
      <pointLight position={[0, 6, -4]} intensity={0.2} color="#fff0c8" distance={10} />
      <mesh ref={setSunMesh} position={SUN_POSITION}>
        <sphereGeometry args={[3.6, 16, 16]} />
        <meshBasicMaterial color="#fffbe8" />
      </mesh>

      <Clouds material={undefined} limit={40}>
        <Cloud seed={1} position={[-18, 28, -40]} scale={2.6} opacity={0.7} speed={0.08} bounds={[10, 3, 6]} />
        <Cloud seed={2} position={[16, 34, -55]} scale={3.2} opacity={0.6} speed={0.06} bounds={[12, 3, 6]} />
        <Cloud seed={3} position={[0, 40, -70]} scale={2.2} opacity={0.55} speed={0.07} bounds={[9, 3, 5]} />
      </Clouds>

      <Birds />
      <RockyIsland position={[-13, 0, -18]} scale={1.4} />
      <PalmIsland position={[15, 0, -24]} scale={1.1} />

      <Suspense fallback={null}>
        <Ocean3D />
        <ArrivingShip start={diveStarted} />
      </Suspense>
      <SceneEffects sunMesh={sunMesh} />
    </Canvas>
  )
}
