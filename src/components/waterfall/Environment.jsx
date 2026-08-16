import { Clouds, Cloud } from '@react-three/drei'
import { GradientSky } from '../world3d/GradientSky.jsx'
import { useWaterfallStore } from './useWaterfallStore.js'

export function Environment() {
  const fogEnabled = useWaterfallStore((s) => s.fogEnabled)

  return (
    <>
      <GradientSky
        topColor="#10436b"
        horizonColor="#ffd8a8"
        bottomColor="#0c2e26"
        sunColor="#ffe0a3"
        sunPosition={[-12, 18, 8]}
        radius={180}
      />

      {fogEnabled ? <fog attach="fog" args={['#a2dbe8', 12, 45]} /> : null}

      <Clouds limit={24}>
        <Cloud seed={1} position={[-12, 14, -20]} scale={2.4} opacity={0.65} speed={0.06} color="#fff8eb" />
        <Cloud seed={2} position={[14, 16, -25]} scale={2.8} opacity={0.55} speed={0.05} color="#fffaef" />
      </Clouds>
    </>
  )
}
