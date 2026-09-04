import { Suspense, useEffect, useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { Ocean3D } from './Ocean3D.jsx'
import { Island3D } from './Island3D.jsx'
import { Ship3D } from './Ship3D.jsx'
import { Route3D } from './Route3D.jsx'
import { GradientSky } from './GradientSky.jsx'
import { SceneEffects } from './SceneEffects.jsx'
import { percentToWorld3D } from '../../utils/world3dCoords.js'
import { START_POSITION } from '../../utils/islandLogic.js'

const ELEVATION_DEG = 52 // camera pitch above the ocean plane
const FRAME_MARGIN = 1.3 // headroom around the island field so nothing touches the viewport edge
const SUN_POSITION = [40, 80, 30]

// Frames the camera so every island + the ship's starting anchorage fits on
// screen, instead of a fixed position tuned for one particular window size.
// Runs whenever the bounds (static, from island data) or the canvas size
// (window resize) change.
function CameraRig({ bounds }) {
  const { camera, size } = useThree()

  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera) || size.height === 0) return

    const centerX = (bounds.minX + bounds.maxX) / 2
    const centerZ = (bounds.minZ + bounds.maxZ) / 2
    const halfWidth = (bounds.maxX - bounds.minX) / 2
    const halfDepth = (bounds.maxZ - bounds.minZ) / 2

    const vFov = (camera.fov * Math.PI) / 180
    const aspect = size.width / size.height
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect)

    const distanceForDepth = halfDepth / Math.sin(vFov / 2)
    const distanceForWidth = halfWidth / Math.sin(hFov / 2)
    const distance = Math.max(distanceForDepth, distanceForWidth) * FRAME_MARGIN

    const elevationRad = (ELEVATION_DEG * Math.PI) / 180
    camera.position.set(centerX, distance * Math.sin(elevationRad), centerZ + distance * Math.cos(elevationRad))
    camera.lookAt(centerX, 0, centerZ)
    camera.updateProjectionMatrix()
  }, [camera, size.width, size.height, bounds.minX, bounds.maxX, bounds.minZ, bounds.maxZ])

  return null
}

// The <Canvas> root for the 3D world map. Keeps the exact prop contract
// WorldMap.jsx already had (islands/finalIsland/finalUnlocked/isUnlocked/
// isSolved/onSelectIsland/shipPosition/shipBearing) so nothing upstream
// (WorldMapPage, useShipVoyage, islandLogic) had to change.
export function WorldScene3D({
  islands,
  finalIsland,
  finalUnlocked,
  isUnlocked,
  isSolved,
  onSelectIsland,
  shipPosition,
  shipBearing,
}) {
  const bounds = useMemo(() => {
    const points = [...islands.map((island) => island.position), finalIsland.position, START_POSITION].map(
      ({ x, y }) => percentToWorld3D(x, y),
    )
    return {
      minX: Math.min(...points.map((p) => p.x)),
      maxX: Math.max(...points.map((p) => p.x)),
      minZ: Math.min(...points.map((p) => p.z)),
      maxZ: Math.max(...points.map((p) => p.z)),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Canvas
      shadows={{ type: THREE.PCFSoftShadowMap }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
    >
      <PerspectiveCamera makeDefault fov={40} near={0.1} far={250} />
      <CameraRig bounds={bounds} />
      <GradientSky sunPosition={SUN_POSITION} />
      <fog attach="fog" args={['#a8d4e6', 32, 85]} />
      <hemisphereLight args={['#e8f4f8', '#0c313d', 0.75]} />
      <ambientLight intensity={0.7} color="#fff6e5" />
      <directionalLight
        position={SUN_POSITION}
        intensity={1.8}
        color="#ffe2b3"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-bias={-0.00015}
      />

      <Suspense fallback={null}>
        <Ocean3D />
        <Route3D islands={islands} finalIsland={finalIsland} finalUnlocked={finalUnlocked} />

        {islands.map((island) => (
          <Island3D
            key={island.id}
            island={island}
            unlocked={isUnlocked(island)}
            solved={isSolved(island)}
            onClick={() => onSelectIsland(island)}
          />
        ))}

        {finalUnlocked ? (
          <Island3D island={finalIsland} unlocked solved={false} isFinal onClick={() => onSelectIsland(finalIsland)} />
        ) : null}

        <Ship3D position={shipPosition} bearing={shipBearing} />
      </Suspense>
      <SceneEffects />
    </Canvas>
  )
}

