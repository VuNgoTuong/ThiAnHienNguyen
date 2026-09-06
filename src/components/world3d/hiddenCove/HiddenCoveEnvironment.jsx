import { useMemo } from 'react'
import { GradientSky } from '../GradientSky.jsx'
import { Ocean3D } from '../Ocean3D.jsx'
import { Birds } from '../Birds.jsx'
import { CoveDustParticles } from './CoveDustParticles.jsx'

const SUN_POSITION = [-14, 5, -10]

function Vegetation({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.05, 0]} castShadow>
        <coneGeometry args={[0.22, 0.5, 6]} />
        <meshStandardMaterial color="#4c7a3d" roughness={0.85} />
      </mesh>
      <mesh position={[0.12, 0.02, 0.08]} scale={0.6} castShadow>
        <coneGeometry args={[0.22, 0.5, 6]} />
        <meshStandardMaterial color="#3f6a34" roughness={0.85} />
      </mesh>
    </group>
  )
}

function Cliffs() {
  const rocks = useMemo(
    () => [
      { position: [4.4, 0.5, 1.6], scale: [1.6, 1.1, 1.3], rotation: 0.25 },
      { position: [5.2, 0.9, 1.0], scale: [1.3, 1.6, 1.1], rotation: -0.15 },
      { position: [5.3, 0.4, 2.6], scale: [1.2, 0.85, 1.1], rotation: 0.5 },
    ],
    [],
  )
  return (
    <group>
      {rocks.map((rock, index) => (
        <mesh key={index} position={rock.position} scale={rock.scale} rotation={[0, rock.rotation, 0.06]} castShadow receiveShadow>
          <dodecahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial color="#7c6a54" roughness={0.95} />
        </mesh>
      ))}
    </group>
  )
}

export function HiddenCoveEnvironment() {
  return (
    <>
      <GradientSky topColor="#7a4a6b" horizonColor="#f2a56a" bottomColor="#3a3a63" exponent={0.9} />
      <fog attach="fog" args={['#e8956b', 9, 26]} />

      <hemisphereLight args={['#f2b28a', '#2c3a4a', 0.5]} />
      <ambientLight intensity={0.45} color="#ffd9b0" />
      <directionalLight position={SUN_POSITION} intensity={1.1} color="#ffb37a" castShadow />
      <pointLight position={[0, 3, 2]} intensity={0.2} color="#ffcf9c" distance={9} />

      {/* ground */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[7.2, 7.6, 0.3, 24]} />
        <meshStandardMaterial color="#dcb883" roughness={0.9} />
      </mesh>
      <mesh position={[0.6, 0.06, 0.4]} receiveShadow>
        <cylinderGeometry args={[5.4, 6, 0.16, 24]} />
        <meshStandardMaterial color="#c7a56f" roughness={0.85} />
      </mesh>

      <Cliffs />

      {[
        [-2.4, 0.1, 1.6], [-3.4, 0.1, 0.4], [-1.6, 0.1, 3], [2.2, 0.1, -2.4], [0.4, 0.1, -3.2], [-4, 0.1, -1.2],
      ].map((position, index) => (
        <Vegetation key={index} position={position} scale={0.85 + (index % 3) * 0.15} />
      ))}

      <CoveDustParticles />
      <Birds />
      <Ocean3D />
    </>
  )
}
