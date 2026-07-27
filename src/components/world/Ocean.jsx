import { Suspense, lazy } from 'react'

// three.js is heavy — keep it out of the initial bundle and only fetch it
// once a screen that actually needs the ocean backdrop mounts.
const OceanBackdrop = lazy(() =>
  import('../world3d/OceanBackdrop.jsx').then((module) => ({ default: module.OceanBackdrop })),
)

export function Ocean() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-teal-400 via-teal-500 to-ocean-800">
      <Suspense fallback={null}>
        <OceanBackdrop />
      </Suspense>
    </div>
  )
}
