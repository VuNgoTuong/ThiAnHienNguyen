import { useCallback, useRef, useState } from 'react'
import gsap from 'gsap'

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
