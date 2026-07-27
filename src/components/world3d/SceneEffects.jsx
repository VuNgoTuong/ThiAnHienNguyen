import { EffectComposer, Bloom, GodRays, Vignette } from '@react-three/postprocessing'

// Shared post-processing stack — bloom catches the gold point-light glow
// and directional highlights already set up in Ocean3D/OceanBackdrop, the
// vignette adds a bit of cinematic framing. Used by every 3D scene so the
// upgrade reads as one consistent look, not a one-off on the intro alone.
// `sunMesh` is optional — only the Title intro (which has an actual sun
// mesh to cast light shafts from) passes one, and only once it has actually
// mounted (see TitleIntroScene's `ref={setSunMesh}` callback — GodRays
// needs the real Object3D, not a ref that's still empty on first render).
export function SceneEffects({ sunMesh }) {
  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={0.3} luminanceThreshold={0.85} luminanceSmoothing={0.15} radius={0.4} />
      {sunMesh ? <GodRays sun={sunMesh} exposure={0.16} decay={0.88} density={0.85} weight={0.3} samples={40} blur /> : null}
      <Vignette eskil={false} offset={0.15} darkness={0.6} />
    </EffectComposer>
  )
}
