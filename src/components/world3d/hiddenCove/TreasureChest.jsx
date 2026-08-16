export function TreasureChest({ lidRef, lockRef }) {
  return (
    <group>
      <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.62, 0.32, 0.4]} />
        <meshStandardMaterial color="#6b4a2a" roughness={0.8} />
      </mesh>
      {[-0.26, 0.26].map((x) => (
        <mesh key={x} position={[x, 0.16, 0]}>
          <boxGeometry args={[0.05, 0.34, 0.42]} />
          <meshStandardMaterial color="#d3a24a" roughness={0.5} metalness={0.3} />
        </mesh>
      ))}

      <group position={[0, 0.32, -0.2]} ref={lidRef}>
        <mesh position={[0, 0.07, 0.2]} castShadow>
          <boxGeometry args={[0.64, 0.16, 0.42]} />
          <meshStandardMaterial color="#7a552f" roughness={0.8} />
        </mesh>
        <mesh ref={lockRef} position={[0, 0.02, 0.4]}>
          <boxGeometry args={[0.1, 0.12, 0.05]} />
          <meshStandardMaterial color="#d3a24a" roughness={0.4} metalness={0.4} emissive="#caa14a" emissiveIntensity={0} />
        </mesh>
      </group>
    </group>
  )
}
