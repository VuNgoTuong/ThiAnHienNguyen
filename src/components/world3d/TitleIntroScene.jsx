import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
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

function useCloudPuffTextureUrl() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.6)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    return canvas.toDataURL()
  }, [])
}

// Cinematic drone flight trajectory keyframes over tropical sea
const START = { x: -2, y: 18, z: 22, rotX: -0.42, rotY: 0.04, fogNear: 30, fogFar: 160 }
const MID = { x: 2, y: 10, z: 15, rotX: -0.22, rotY: -0.02, fogNear: 25, fogFar: 160 }
const REST = { x: 0, y: 3.2, z: 8.5, rotX: -0.09, rotY: 0, fogNear: 25, fogFar: 160 }

const HOLD_S = 0.5
const DIVE_S = 1.9
const SETTLE_S = 1.9

function IntroCamera({ onSettled, onDiveStart }) {
  const cameraRef = useRef(null)
  const fogRef = useRef(null)
  const isSettledRef = useRef(false)

  useEffect(() => {
    if (!cameraRef.current || !fogRef.current) return
    const camera = cameraRef.current
    const fog = fogRef.current
    camera.position.set(START.x, START.y, START.z)
    camera.rotation.set(START.rotX, START.rotY, 0)
    fog.near = START.fogNear
    fog.far = START.fogFar

    const timeline = gsap.timeline({
      delay: HOLD_S,
      onComplete: () => {
        isSettledRef.current = true
        onSettled?.()
      },
    })

    timeline
      .call(() => onDiveStart?.())
      .to(camera.position, { x: MID.x, y: MID.y, z: MID.z, duration: DIVE_S, ease: 'sine.inOut' }, 0)
      .to(camera.rotation, { x: MID.rotX, y: MID.rotY, duration: DIVE_S, ease: 'sine.inOut' }, 0)
      .to(fog, { near: MID.fogNear, far: MID.fogFar, duration: DIVE_S, ease: 'sine.inOut' }, 0)
      .to(camera.position, { x: REST.x, y: REST.y, z: REST.z, duration: SETTLE_S, ease: 'power2.out' }, DIVE_S)
      .to(camera.rotation, { x: REST.rotX, y: REST.rotY, duration: SETTLE_S, ease: 'power2.out' }, DIVE_S)
      .to(fog, { near: REST.fogNear, far: REST.fogFar, duration: SETTLE_S, ease: 'power2.out' }, DIVE_S)

    return () => timeline.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame(({ clock }) => {
    if (!cameraRef.current || !isSettledRef.current) return
    const t = clock.getElapsedTime()
    cameraRef.current.position.y = REST.y + Math.sin(t * 0.7) * 0.12
    cameraRef.current.rotation.z = Math.sin(t * 0.5) * 0.008
  })

  return (
    <>
      <fog ref={fogRef} attach="fog" args={['#bae6fd', START.fogNear, START.fogFar]} />
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
  const cloudTextureUrl = useCloudPuffTextureUrl()

  return (
    <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}>
      <GradientSky sunPosition={SUN_POSITION} topColor="#0284c7" horizonColor="#e0f2fe" sunColor="#fff7ed" />
      <IntroCamera onSettled={onSettled} onDiveStart={() => setDiveStarted(true)} />
      <hemisphereLight args={['#e8f4f8', '#0e3a47', 0.7]} />
      <ambientLight intensity={0.65} color="#fff6e5" />
      <directionalLight
        position={SUN_POSITION}
        intensity={1.8}
        color="#fffae5"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.00015}
      />
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

      <Clouds material={undefined} texture={cloudTextureUrl} limit={40}>
        <Cloud seed={1} position={[-18, 28, -40]} scale={2.8} opacity={0.8} speed={0.08} bounds={[10, 3, 6]} color="#ffffff" />
        <Cloud seed={2} position={[16, 34, -55]} scale={3.4} opacity={0.7} speed={0.06} bounds={[12, 3, 6]} color="#ffffff" />
        <Cloud seed={3} position={[0, 40, -70]} scale={2.5} opacity={0.65} speed={0.07} bounds={[9, 3, 5]} color="#ffffff" />
      </Clouds>

      <Birds />

      {/* Photorealistic Grand Volcanic Paradise Island */}
      <ParadiseIsland position={[-7.8, -0.05, -11.5]} scale={1.95} rotation={[0, 0.42, 0]} />
      <PalmIsland position={[15, 0, -24]} scale={1.1} />

      <Suspense fallback={null}>
        <Ocean3D />
        <ArrivingShip start={diveStarted} />
      </Suspense>
      <SceneEffects sunMesh={sunMesh} />
    </Canvas>
  )
}
