import { useCallback, useRef, useState } from 'react'
import gsap from 'gsap'

// `shipRef` is a plain mutable object ({ x, y, bearing } in map-percent
// coordinates), not React state — GSAP tweens it directly every tick. Ship3D
// reads it straight out of its own useFrame loop, so a 1.8s voyage never
// forces a single React re-render of the map tree; only Three.js's own
// render loop (already running every frame regardless) picks up the motion.
// Before this, `onUpdate` called `setPosition(...)` ~60x/sec, which meant a
// full React reconciliation pass down through WorldMapPage -> WorldMap ->
// WorldScene3D -> Ship3D competing with the R3F render loop on every single
// frame of every voyage — the single most visible source of sailing jank.
export function useShipVoyage(initialPosition) {
  const [isSailing, setIsSailing] = useState(false)
  const shipRef = useRef({ x: initialPosition.x, y: initialPosition.y, bearing: 0 })

  const sailTo = useCallback((to, onArrive) => {
    const from = { x: shipRef.current.x, y: shipRef.current.y }
    shipRef.current.bearing = Math.atan2(to.y - from.y, to.x - from.x) * (180 / Math.PI)
    setIsSailing(true)

    gsap.to(shipRef.current, {
      x: to.x,
      y: to.y,
      duration: 1.8,
      ease: 'power1.inOut',
      onComplete: () => {
        setIsSailing(false)
        onArrive?.()
      },
    })
  }, [])

  return { shipRef, isSailing, sailTo }
}
