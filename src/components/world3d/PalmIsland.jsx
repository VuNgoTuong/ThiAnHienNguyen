// Purely decorative scenery for the Title intro — same cone/cylinder
// language as the map's Island3D, topped with a couple of simple palm
// trees. Not part of the game's island data; never interactive.
function PalmTree({ position, scale = 1, lean = 0 }) {
  return (
    <group position={position} scale={scale} rotation={[0, 0, lean]}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.02, 0.035, 1, 6]} />
        <meshStandardMaterial color="#6b4a2a" roughness={0.8} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[Math.cos((i / 5) * Math.PI * 2) * 0.12, 1.02, Math.sin((i / 5) * Math.PI * 2) * 0.12]}
          rotation={[Math.PI / 2.6, 0, (i / 5) * Math.PI * 2]}
        >
          <coneGeometry args={[0.09, 0.42, 4]} />
          <meshStandardMaterial color="#2f7d3a" roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

export function PalmIsland({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, -0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.1, 1.4, 0.3, 12]} />
        <meshStandardMaterial color="#d8c485" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.28, 0]} castShadow>
        <coneGeometry args={[0.85, 0.55, 12]} />
        <meshStandardMaterial color="#4d8a52" roughness={0.85} />
      </mesh>
      <PalmTree position={[0.25, 0.5, 0.1]} scale={0.75} lean={0.12} />
      <PalmTree position={[-0.3, 0.48, -0.15]} scale={0.6} lean={-0.08} />
    </group>
  )
}
