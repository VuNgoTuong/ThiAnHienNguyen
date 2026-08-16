import { useMemo } from 'react'
import * as THREE from 'three'

const LAKE_ROCKS = [
  { position: [-2.2, 0.2, 1.8], scale: [1.4, 0.9, 1.2], rotation: 0.3, isWet: true },
  { position: [2.5, 0.15, 1.4], scale: [1.6, 1.1, 1.3], rotation: -0.4, isWet: true },
  { position: [0.8, -0.1, 2.8], scale: [1.1, 0.7, 1.0], rotation: 0.8, isWet: true },
  { position: [-1.1, -0.05, 3.2], scale: [0.9, 0.6, 0.85], rotation: 1.2, isWet: true },
  { position: [-4.2, 0.6, -0.2], scale: [2.2, 1.8, 1.9], rotation: 0.15, isWet: false },
  { position: [4.5, 0.8, -0.3], scale: [2.5, 2.0, 2.1], rotation: -0.2, isWet: false },
]

export function Rocks() {
  return (
    <group>
      {LAKE_ROCKS.map((rock, idx) => (
        <mesh
          key={idx}
          position={rock.position}
          scale={rock.scale}
          rotation={[0.1, rock.rotation, 0.05]}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[0.7, 1]} />
          <meshStandardMaterial
            color={rock.isWet ? '#2b241d' : '#4f463c'}
            roughness={rock.isWet ? 0.28 : 0.85}
            metalness={rock.isWet ? 0.3 : 0.05}
          />
        </mesh>
      ))}
    </group>
  )
}
