import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { MainWater } from './MainWater.jsx'
import { SideStreams } from './SideStreams.jsx'
import { WaterFoam } from './WaterFoam.jsx'
import { WaterMist } from './WaterMist.jsx'
import { Cliff } from './Cliff.jsx'
import { Rocks } from './Rocks.jsx'
import { Vegetation } from './Vegetation.jsx'
import { WaterSurface } from './WaterSurface.jsx'
import { Particles } from './Particles.jsx'
import { Lighting } from './Lighting.jsx'
import { Environment } from './Environment.jsx'
import { CameraController } from './CameraController.jsx'
import { PostProcessing } from './PostProcessing.jsx'

export function WaterfallScene() {
  return (
    <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true, alpha: false }}>
      <CameraController />
      <Lighting />
      <Environment />

      <Suspense fallback={null}>
        {/* Cliff Wall & Rocks */}
        <Cliff />
        <Rocks />
        <Vegetation />

        {/* Water Stream & Lake Surface */}
        <MainWater />
        <SideStreams />
        <WaterFoam />
        <WaterMist />
        <WaterSurface />

        {/* Airborne Particles & Dust */}
        <Particles />
      </Suspense>

      <PostProcessing />
    </Canvas>
  )
}
