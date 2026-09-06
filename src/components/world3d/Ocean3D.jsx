import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { WORLD_WIDTH, WORLD_DEPTH } from '../../utils/world3dCoords.js'

const SEGMENTS = 192
const PLANE_SCALE = 8
const SUN_POS = [70, 42, -55]

const VERTEX_SHADER = `
  uniform float uTime;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  vec3 GerstnerWave(vec4 wave, vec3 p, inout vec3 tangent, inout vec3 binormal) {
    float steepness = wave.z;
    float wavelength = wave.w;
    float k = 2.0 * 3.14159265 / wavelength;
    float c = sqrt(9.8 / k);
    vec2 d = normalize(wave.xy);
    float f = k * (dot(d, p.xz) - c * uTime * 0.65);
    float a = steepness / k;

    tangent += vec3(-d.x * d.x * (steepness * sin(f)), d.x * (steepness * cos(f)), -d.x * d.y * (steepness * sin(f)));
    binormal += vec3(-d.x * d.y * (steepness * sin(f)), d.y * (steepness * cos(f)), -d.y * d.y * (steepness * sin(f)));

    return vec3(
      d.x * (a * cos(f)),
      a * sin(f),
      d.y * (a * cos(f))
    );
  }

  void main() {
    vec3 gridPoint = position;
    vec3 tangent = vec3(1.0, 0.0, 0.0);
    vec3 binormal = vec3(0.0, 0.0, 1.0);
    vec3 p = gridPoint;

    // Gentle, natural sea wave heights (no massive tsunami rollers)
    p += GerstnerWave(vec4(1.0, 0.3, 0.05, 18.0), gridPoint, tangent, binormal);
    p += GerstnerWave(vec4(0.35, 0.85, 0.035, 11.0), gridPoint, tangent, binormal);
    p += GerstnerWave(vec4(-0.65, 0.5, 0.02, 6.0), gridPoint, tangent, binormal);
    p += GerstnerWave(vec4(0.8, -0.6, 0.012, 3.0), gridPoint, tangent, binormal);

    vec3 normal = normalize(cross(binormal, tangent));
    vNormal = normalMatrix * normal;

    vec4 worldPosition = modelMatrix * vec4(p, 1.0);
    vWorldPosition = worldPosition.xyz;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    vViewPosition = -mvPosition.xyz;

    gl_Position = projectionMatrix * mvPosition;
  }
`

const FRAGMENT_SHADER = `
  uniform float uTime;
  uniform vec3 uSunPosition;
  uniform vec3 uDeepColor;
  uniform vec3 uShallowColor;
  uniform vec3 uSkyColor;
  uniform vec3 uFogColor;
  uniform float uFogNear;
  uniform float uFogFar;

  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    vec3 sunDir = normalize(uSunPosition);

    // Fresnel reflection
    float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.5);
    fresnel = clamp(fresnel, 0.1, 0.82);

    float height = vWorldPosition.y;
    float depthFactor = smoothstep(-0.15, 0.15, height);
    vec3 waterColor = mix(uDeepColor, uShallowColor, depthFactor);

    vec3 color = mix(waterColor, uSkyColor, fresnel * 0.65);

    // Sun Specular Glint (Sparkling water highlights)
    vec3 halfDir = normalize(sunDir + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 140.0);
    vec3 sunGlint = vec3(1.0, 0.98, 0.9) * spec * 3.0;

    float wideSpec = pow(max(dot(normal, halfDir), 0.0), 18.0);
    sunGlint += vec3(0.4, 0.85, 1.0) * wideSpec * 0.35;

    color += sunGlint;

    // Atmospheric horizon fog blending
    float viewDist = length(vViewPosition);
    float fogFactor = smoothstep(uFogNear, uFogFar, viewDist);
    color = mix(color, uFogColor, fogFactor);

    gl_FragColor = vec4(pow(color, vec3(1.0 / 2.2)), 0.96);
  }
`

export function Ocean3D() {
  const meshRef = useRef(null)
  const materialRef = useRef(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSunPosition: { value: new THREE.Vector3(...SUN_POS) },
      uDeepColor: { value: new THREE.Color('#0077b6') },
      uShallowColor: { value: new THREE.Color('#00e5ff') },
      uSkyColor: { value: new THREE.Color('#38bdf8') },
      uFogColor: { value: new THREE.Color('#7dd3fc') },
      uFogNear: { value: 30.0 },
      uFogFar: { value: 160.0 },
    }),
    [],
  )

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(WORLD_WIDTH * PLANE_SCALE, WORLD_DEPTH * PLANE_SCALE, SEGMENTS, SEGMENTS)
    geo.rotateX(-Math.PI / 2)
    return geo
  }, [])

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime()
    }
  })

  return (
    <mesh ref={meshRef} geometry={geometry} receiveShadow position={[0, -0.05, 0]}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
