import { Line } from '@react-three/drei'
import { percentToWorld3D } from '../../utils/world3dCoords.js'

function toPoint(position) {
  const { x, z } = percentToWorld3D(position.x, position.y)
  return [x, 0.02, z]
}

// 3D counterpart of the old world/RouteLine.jsx (SVG dashed polyline).
export function Route3D({ islands, finalIsland, finalUnlocked }) {
  const sorted = [...islands].sort((a, b) => a.order - b.order)
  const points = sorted.map((island) => toPoint(island.position))
  const last = sorted[sorted.length - 1]

  return (
    <>
      {points.length > 1 ? (
        <Line points={points} color="#f2e6c4" transparent opacity={0.25} lineWidth={1} dashed dashSize={0.3} gapSize={0.25} />
      ) : null}
      {finalUnlocked && last ? (
        <Line
          points={[toPoint(last.position), toPoint(finalIsland.position)]}
          color="#e8c368"
          transparent
          opacity={0.7}
          lineWidth={1.4}
          dashed
          dashSize={0.3}
          gapSize={0.25}
        />
      ) : null}
    </>
  )
}
