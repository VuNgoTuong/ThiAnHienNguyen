import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import * as THREE from 'three'

export function PostProcessing() {
  // multisampling: 0 — the Canvas already runs `gl={{ antialias: true }}`
  // (see WaterfallScene.jsx), so MSAA-ing the effect composer's render
  // target on top of that is pure redundant GPU cost for no visible gain.
  // Same call SceneEffects.jsx already makes for every other 3D scene.
  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={0.4} luminanceThreshold={0.8} luminanceSmoothing={0.2} radius={0.5} />
      <Vignette eskil={false} offset={0.3} darkness={0.4} />
      <ChromaticAberration offset={new THREE.Vector2(0.0008, 0.0008)} radialModulation={false} modulationOffset={0.15} />
    </EffectComposer>
  )
}
