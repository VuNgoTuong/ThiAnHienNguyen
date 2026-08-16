import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'

// Generic wrapper around any set-piece mesh (tree/well/footprints/cave/
// chest): shows a short prompt only on hover, a subtle ground glow at rest
// so the player can actually tell something's there before finding it (an
// early build had zero idle affordance — it read as "nothing responds"
// rather than "hover to investigate"), and a hand cursor while hovered so
// clicking a 3D object doesn't feel like a shot in the dark.
export function ClueHotspot({ position, children, discovered = false, prompt, onSelect, disabled = false }) {
  const [hovered, setHovered] = useState(false)
  const glowRef = useRef(null)

  useFrame(({ clock }) => {
    if (!glowRef.current) return
    if (disabled) {
      glowRef.current.material.opacity = 0
      return
    }
    const pulse = 0.3 + Math.sin(clock.getElapsedTime() * 1.6) * 0.15
    const idle = 0.16 + Math.sin(clock.getElapsedTime() * 1.1) * 0.06
    glowRef.current.material.opacity = discovered || hovered ? pulse : idle
  })

  return (
    <group
      position={position}
      onPointerOver={(event) => {
        event.stopPropagation()
        if (disabled) return
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={(event) => {
        event.stopPropagation()
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
      onClick={(event) => {
        event.stopPropagation()
        onSelect?.()
      }}
    >
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.55, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {children}

      <mesh ref={glowRef} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.62, 24]} />
        <meshBasicMaterial color="#f0c675" transparent opacity={0} depthWrite={false} />
      </mesh>

      {hovered && !disabled ? (
        <Html center distanceFactor={9} position={[0, 1.15, 0]} style={{ pointerEvents: 'none' }}>
          <div className="whitespace-nowrap rounded-full border border-gold-500/50 bg-ocean-950/80 px-3 py-1 font-display text-xs tracking-wide text-parchment-100 backdrop-blur">
            {prompt}
          </div>
        </Html>
      ) : null}
    </group>
  )
}
