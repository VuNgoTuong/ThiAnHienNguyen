import { useMemo } from 'react'
import * as THREE from 'three'

// A hand-authored gradient backdrop instead of a physically-simulated
// atmosphere. The Preetham sky model (drei's <Sky>) saturates to a large
// blown-out white band near the horizon at this game's low, deck-level
// camera angles no matter how its turbidity/mie knobs are tuned — the
// grazing view angle always has the longest atmospheric path. A simple
// vertical color ramp gives full, reliable art control over that band
// instead, which suits this game's painterly/stylized look better than a
// physically-accurate sky anyway.
const VERTEX_SHADER = `
  varying vec3 vWorldPosition;
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const FRAGMENT_SHADER = `
  uniform vec3 topColor;
  uniform vec3 horizonColor;
  uniform vec3 bottomColor;
  uniform float exponent;
  varying vec3 vWorldPosition;
  void main() {
    float h = normalize(vWorldPosition).y;
    vec3 upper = mix(horizonColor, topColor, pow(max(h, 0.0), exponent));
    vec3 lower = mix(horizonColor, bottomColor, pow(max(-h, 0.0), exponent));
    vec3 color = h >= 0.0 ? upper : lower;
    // THREE.Color stores these uniforms in linear working space (color
    // management converts the sRGB hex on the way in); this is a bare
    // ShaderMaterial with no <colorspace_fragment> chunk to convert back
    // on the way out, so without this the sky renders far too dark.
    gl_FragColor = vec4(pow(color, vec3(1.0 / 2.2)), 1.0);
  }
`

export function GradientSky({
  topColor = '#3f8fc9',
  horizonColor = '#fdf6e0',
  bottomColor = '#1a7690',
  exponent = 0.7,
  // Must stay under every camera's `far` (200-260 across the three scenes
  // this is used in) or the sphere sits beyond the clip plane and never
  // renders at all — which silently happened here before, making every
  // color/exponent tweak invisible since the DOM's fallback CSS background
  // was showing through instead.
  radius = 150,
}) {
  const uniforms = useMemo(
    () => ({
      topColor: { value: new THREE.Color(topColor) },
      horizonColor: { value: new THREE.Color(horizonColor) },
      bottomColor: { value: new THREE.Color(bottomColor) },
      exponent: { value: exponent },
    }),
    [topColor, horizonColor, bottomColor, exponent],
  )

  return (
    <mesh>
      <sphereGeometry args={[radius, 24, 16]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
        toneMapped={false}
      />
    </mesh>
  )
}
