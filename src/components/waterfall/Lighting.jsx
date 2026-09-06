export function Lighting() {
  return (
    <>
      {/* Soft Ambient & Hemisphere Sky/Ground Light */}
      <hemisphereLight args={['#d4f2ff', '#142921', 0.55]} />
      <ambientLight intensity={0.45} color="#fff4e0" />

      {/* Primary Directional Golden Sunlight from Top-Left */}
      <directionalLight
        position={[-12, 18, 8]}
        intensity={1.65}
        color="#ffe3b3"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />

      {/* Secondary Fill Light for Shadow Depth */}
      <directionalLight position={[10, 8, -6]} intensity={0.35} color="#8ccbe6" />

      {/* Cool Blue Waterfall Point Light contrasting against Golden Sunlight */}
      <pointLight position={[0, 4, 1.2]} intensity={0.8} distance={7} color="#4ae0f5" />
    </>
  )
}
