import { useMemo } from 'react'
import * as THREE from 'three'

const VERTEX_SHADER = `
  varying vec3 vWorldPosition;
  varying vec3 vSunVector;
  uniform vec3 sunPosition;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    vSunVector = normalize(sunPosition);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const FRAGMENT_SHADER = `
  uniform vec3 topColor;
  uniform vec3 horizonColor;
  uniform vec3 bottomColor;
  uniform vec3 sunColor;
  uniform float exponent;
  varying vec3 vWorldPosition;
  varying vec3 vSunVector;

  void main() {
    vec3 dir = normalize(vWorldPosition);
    float h = max(dir.y, 0.0);
    
    // Smooth vertical atmospheric color gradient (bright sunny tropical sky)
    vec3 skyBase = mix(horizonColor, topColor, pow(h, exponent));
    if (dir.y < 0.0) {
      skyBase = mix(horizonColor, bottomColor, pow(max(-dir.y, 0.0), 0.5));
    }

    // Sun atmospheric halo
    float cosTheta = max(dot(dir, vSunVector), 0.0);
    float sunGlow = pow(cosTheta, 24.0) * 0.5 + pow(cosTheta, 3.5) * 0.25;
    vec3 finalColor = skyBase + sunColor * sunGlow;

    gl_FragColor = vec4(pow(finalColor, vec3(1.0 / 2.2)), 1.0);
  }
`

export function GradientSky({
  topColor = '#0284c7',
  horizonColor = '#e0f2fe',
  bottomColor = '#0369a1',
  sunColor = '#fff7ed',
  exponent = 0.45,
  radius = 160,
  sunPosition = [70, 42, -55],
}) {
  const uniforms = useMemo(
    () => ({
      topColor: { value: new THREE.Color(topColor) },
      horizonColor: { value: new THREE.Color(horizonColor) },
      bottomColor: { value: new THREE.Color(bottomColor) },
      sunColor: { value: new THREE.Color(sunColor) },
      sunPosition: { value: new THREE.Vector3(...sunPosition) },
      exponent: { value: exponent },
    }),
    [topColor, horizonColor, bottomColor, sunColor, exponent, sunPosition],
  )

  return (
    <mesh>
      <sphereGeometry args={[radius, 32, 24]} />
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
