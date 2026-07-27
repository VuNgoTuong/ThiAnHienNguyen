import { Suspense, lazy } from 'react'

// three.js is a heavy dependency — keep it out of the initial bundle and
// only fetch it once the player actually reaches the map.
const WorldScene3D = lazy(() =>
  import('../world3d/WorldScene3D.jsx').then((module) => ({ default: module.WorldScene3D })),
)

export function WorldMap({
  islands,
  finalIsland,
  finalUnlocked,
  isUnlocked,
  isSolved,
  onSelectIsland,
  shipPosition,
  shipBearing,
}) {
  return (
    <div className="relative h-full w-full bg-ocean-950">
      <Suspense fallback={<div className="flex h-full w-full items-center justify-center text-parchment-200/60">…</div>}>
        <WorldScene3D
          islands={islands}
          finalIsland={finalIsland}
          finalUnlocked={finalUnlocked}
          isUnlocked={isUnlocked}
          isSolved={isSolved}
          onSelectIsland={onSelectIsland}
          shipPosition={shipPosition}
          shipBearing={shipBearing}
        />
      </Suspense>
    </div>
  )
}
