import { useMemo } from 'react'
import * as THREE from 'three'
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

export function CaveMouthMesh() {
  return (
    <group>
      <mesh position={[-0.55, 0.4, -0.25]} scale={[0.9, 1.1, 0.9]} rotation={[0.1, 0.4, 0]} castShadow>
        <dodecahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial color="#6e5c47" roughness={0.95} />
      </mesh>
      <mesh position={[0.6, 0.5, -0.2]} scale={[1, 1.3, 1]} rotation={[0, -0.3, 0.1]} castShadow>
        <dodecahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial color="#7c6a54" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.9, -0.35]} scale={[1.4, 0.8, 1]} castShadow>
        <dodecahedronGeometry args={[0.65, 0]} />
        <meshStandardMaterial color="#6e5c47" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.5, 0.05]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="#0b0805" />
      </mesh>
      <pointLight position={[0, 0.5, -0.1]} intensity={0.35} distance={2.2} color="#4fd1c5" />
    </group>
  )
}

export function OldTreeMesh() {
  return (
    <group>
      <mesh position={[0, 0.55, 0]} rotation={[0, 0, 0.08]} castShadow>
        <cylinderGeometry args={[0.07, 0.14, 1.1, 7]} />
        <meshStandardMaterial color="#5b4630" roughness={0.9} />
      </mesh>
      <mesh position={[0.18, 1.05, -0.05]} rotation={[0.2, 0, 0.6]} castShadow>
        <cylinderGeometry args={[0.03, 0.06, 0.55, 6]} />
        <meshStandardMaterial color="#5b4630" roughness={0.9} />
      </mesh>
      {[[0, 1.25, 0], [0.22, 1.15, -0.12], [-0.18, 1.18, 0.1]].map((position, index) => (
        <mesh key={index} position={position} scale={0.42} castShadow>
          <icosahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial color="#3f5a34" roughness={0.85} />
        </mesh>
      ))}
      {/* faded carving — a thin dark sliver on the trunk facing the player */}
      <mesh position={[0.14, 0.6, 0.02]} rotation={[0, 0.3, 0]}>
        <planeGeometry args={[0.09, 0.22]} />
        <meshStandardMaterial color="#2b2015" roughness={1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

export function WellMesh() {
  return (
    <group>
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.44, 0.44, 16]} />
        <meshStandardMaterial color="#8f8875" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.44, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.02, 16]} />
        <meshStandardMaterial color="#100d0a" />
      </mesh>
      {[[-0.4, 0.75, -0.25], [0.4, 0.75, -0.25]].map((position, index) => (
        <mesh key={index} position={position} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.85, 6]} />
          <meshStandardMaterial color="#6b4a2a" roughness={0.85} />
        </mesh>
      ))}
      <mesh position={[0, 1.18, -0.25]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <coneGeometry args={[0.55, 0.4, 4]} />
        <meshStandardMaterial color="#8a5a34" roughness={0.8} />
      </mesh>
    </group>
  )
}

export function FootprintsMesh() {
  const prints = useMemo(
    () => [
      { position: [0, 0.011, 0], rotation: -0.1, scale: [1, 1.3, 1] },
      { position: [0.22, 0.011, 0.32], rotation: 0.15, scale: [0.95, 1.25, 1] },
      { position: [0.02, 0.011, 0.66], rotation: -0.05, scale: [1, 1.3, 1] },
      { position: [0.26, 0.011, 0.98], rotation: 0.2, scale: [0.95, 1.25, 1] },
    ],
    [],
  )
  return (
    <group>
      {prints.map((print, index) => (
        <mesh key={index} position={print.position} rotation={[-Math.PI / 2, 0, print.rotation]} scale={print.scale}>
          <circleGeometry args={[0.11, 10]} />
          <meshStandardMaterial color="#2b2015" roughness={1} transparent opacity={0.8} />
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
