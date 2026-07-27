import { useCallback, useRef, useState } from 'react'
import gsap from 'gsap'

// Animates the ship's map position from one island to another with a GSAP
// tween (rather than Framer Motion) so the voyage can use an eased timeline
// independent of React re-renders driving it frame-by-frame.
export function useShipVoyage() {
  const [position, setPosition] = useState(null)
  const [bearing, setBearing] = useState(0)
  const [isSailing, setIsSailing] = useState(false)
  const proxyRef = useRef({ x: 0, y: 0 })

  const sailTo = useCallback((from, to, onArrive) => {
    proxyRef.current = { ...from }
    setPosition({ ...from })
    setBearing(Math.atan2(to.y - from.y, to.x - from.x) * (180 / Math.PI))
    setIsSailing(true)

    gsap.to(proxyRef.current, {
      x: to.x,
      y: to.y,
      duration: 1.8,
      ease: 'power1.inOut',
      onUpdate: () => setPosition({ x: proxyRef.current.x, y: proxyRef.current.y }),
      onComplete: () => {
        setIsSailing(false)
        onArrive?.()
      },
    })
  }, [])

  return { position, bearing, isSailing, sailTo }
}
