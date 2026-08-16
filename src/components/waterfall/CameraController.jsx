import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import gsap from 'gsap'
import { useWaterfallStore } from './useWaterfallStore.js'

const DEFAULT_CAM = { x: 4.5, y: 4.8, z: 12.5 }
const DEFAULT_LOOK = { x: 0, y: 4.5, z: 0.5 }

const CINEMATIC_CAM = { x: 1.2, y: 3.2, z: 6.5 }
const CINEMATIC_LOOK = { x: 0, y: 4.8, z: 0.4 }

export function CameraController() {
  const { camera } = useThree()
  const cameraRef = useRef(null)
  const lookTargetRef = useRef({ ...DEFAULT_LOOK })

  const cameraMode = useWaterfallStore((s) => s.cameraMode)
  const setZoomLevel = useWaterfallStore((s) => s.setZoomLevel)

  // Smooth camera dolly tweening on mode changes using GSAP
  useEffect(() => {
    if (!cameraRef.current) return
    const cam = cameraRef.current

    if (cameraMode === 'cinematic') {
      gsap.to(cam.position, { ...CINEMATIC_CAM, duration: 1.8, ease: 'power2.inOut' })
      gsap.to(lookTargetRef.current, { ...CINEMATIC_LOOK, duration: 1.8, ease: 'power2.inOut' })
    } else if (cameraMode === 'default') {
      gsap.to(cam.position, { ...DEFAULT_CAM, duration: 1.6, ease: 'power2.inOut' })
      gsap.to(lookTargetRef.current, { ...DEFAULT_LOOK, duration: 1.6, ease: 'power2.inOut' })
    }
  }, [cameraMode])

  // Mouse wheel scroll dolly zoom with parallax
  useEffect(() => {
    function handleWheel(e) {
      if (cameraMode === 'cinematic') return
      const cam = cameraRef.current
      if (!cam) return

      const delta = e.deltaY * 0.003
      const currentDist = cam.position.length()
      const newDist = Math.max(5.5, Math.min(18.0, currentDist + delta))

      gsap.to(cam.position, {
        z: newDist * (DEFAULT_CAM.z / DEFAULT_CAM.x),
        x: newDist * (DEFAULT_CAM.x / DEFAULT_CAM.z),
        y: Math.max(2.5, newDist * 0.38),
        duration: 0.5,
        ease: 'power1.out',
      })

      const zoomRatio = (18.0 - newDist) / 12.5
      setZoomLevel(zoomRatio)
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [cameraMode, setZoomLevel])

  useFrame(({ clock }) => {
    const cam = cameraRef.current
    if (!cam) return

    // Subtle breathing / floating parallax motion
    const t = clock.getElapsedTime()
    const floatY = Math.sin(t * 0.8) * 0.08
    const floatX = Math.cos(t * 0.6) * 0.05

    cam.lookAt(lookTargetRef.current.x + floatX, lookTargetRef.current.y + floatY, lookTargetRef.current.z)
  })

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      fov={48}
      position={[DEFAULT_CAM.x, DEFAULT_CAM.y, DEFAULT_CAM.z]}
      near={0.1}
      far={150}
    />
  )
}
