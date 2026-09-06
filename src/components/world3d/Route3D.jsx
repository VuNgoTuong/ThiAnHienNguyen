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
        <Line
          points={points}
          color="#f3cf73"
          transparent
          opacity={0.45}
          lineWidth={2.2}
          dashed
          dashSize={0.4}
          gapSize={0.3}
        />
      ) : null}
      {finalUnlocked && last ? (
        <Line
          points={[toPoint(last.position), toPoint(finalIsland.position)]}
          color="#f3cf73"
          transparent
          opacity={0.85}
          lineWidth={2.8}
          dashed
          dashSize={0.4}
          gapSize={0.3}
        />
      ) : null}
    </>
  )
}
