import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function smoothstep(min, max, value) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)))
  return x * x * (3 - 2 * x)
}

function fbmNoise(x, z, seed = 1.0) {
  const n1 = Math.sin(x * 1.6 + seed) * Math.cos(z * 1.5 + seed * 1.4) * 0.42
  const n2 = Math.sin(x * 3.8 - z * 3.2 + seed * 2.3) * 0.22
  const n3 = Math.cos(x * 8.1 + z * 7.6 + seed * 3.7) * 0.09
  return n1 + n2 + n3
}

function useOrganicIslandGeometry(radiusBase = 1.45, heightMax = 0.85, seed = 1.0) {
  return useMemo(() => {
    const GRID_SIZE = 8
    const SEGMENTS = 80
    const geo = new THREE.PlaneGeometry(GRID_SIZE, GRID_SIZE, SEGMENTS, SEGMENTS)
    geo.rotateX(-Math.PI / 2)

    const pos = geo.attributes.position
    const count = pos.count
    const colors = new Float32Array(count * 3)

    const cSand = new THREE.Color('#ebd59b')
    const cWetSand = new THREE.Color('#bfa565')
    const cGrass = new THREE.Color('#378243')
    const cSlope = new THREE.Color('#2d6b33')

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)

      const r = Math.sqrt(x * x + z * z)
      const angle = Math.atan2(z, x)

      const coastNoise = fbmNoise(Math.cos(angle) * 2.2, Math.sin(angle) * 2.2, seed)
      const rCoast = radiusBase * (1.0 + coastNoise * 0.35)
      const norm = r / rCoast

      let y = 0.0
      if (norm >= 1.0) {
        y = -0.3 - (norm - 1.0) * 0.3
      } else {
        const beachNorm = smoothstep(0.7, 1.0, norm)
        const heightProfile = Math.pow(Math.max(0, 1.0 - norm), 1.3) * heightMax
        const ridge = fbmNoise(x * 1.8, z * 1.8, seed * 2.5) * 0.28
        y = heightProfile + ridge * Math.max(0.1, heightProfile)
        y = Math.max(-0.02, y * (1.0 - Math.pow(beachNorm, 3.0)))
      }

      pos.setY(i, y)

      const vertexColor = new THREE.Color()
      if (y <= 0.03) {
        vertexColor.copy(cWetSand).lerp(cSand, Math.max(0, (y + 0.03) / 0.06))
      } else if (y < 0.2) {
        vertexColor.copy(cSand).lerp(cGrass, (y - 0.03) / 0.17)
      } else {
        vertexColor.copy(cGrass).lerp(cSlope, Math.min(1.0, (y - 0.2) / 0.5))
      }

      colors[i * 3] = vertexColor.r
      colors[i * 3 + 1] = vertexColor.g
      colors[i * 3 + 2] = vertexColor.b
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.computeVertexNormals()
    return geo
  }, [radiusBase, heightMax, seed])
}

function createOrganicRingGeometry(getCoastRadius, innerFactor, outerFactor, segments = 96) {
  const geo = new THREE.BufferGeometry()
  const vertexCount = (segments + 1) * 2
  const positions = new Float32Array(vertexCount * 3)
  const uvs = new Float32Array(vertexCount * 2)
  const indices = new Uint16Array(segments * 6)

  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2
    const rCoast = getCoastRadius(theta)

    const cosT = Math.cos(theta)
    const sinT = Math.sin(theta)

    const rIn = rCoast * innerFactor
    const rOut = rCoast * outerFactor

    const idxIn = i * 2
    const idxOut = i * 2 + 1

    positions[idxIn * 3] = rIn * cosT
    positions[idxIn * 3 + 1] = 0
    positions[idxIn * 3 + 2] = rIn * sinT
    uvs[idxIn * 2] = i / segments
    uvs[idxIn * 2 + 1] = 0

    positions[idxOut * 3] = rOut * cosT
    positions[idxOut * 3 + 1] = 0
    positions[idxOut * 3 + 2] = rOut * sinT
    uvs[idxOut * 2] = i / segments
    uvs[idxOut * 2 + 1] = 1
  }

  let ptr = 0
  for (let i = 0; i < segments; i++) {
    const v0 = i * 2
    const v1 = i * 2 + 1
    const v2 = (i + 1) * 2
    const v3 = (i + 1) * 2 + 1

    indices[ptr++] = v0
    indices[ptr++] = v1
    indices[ptr++] = v2

    indices[ptr++] = v1
    indices[ptr++] = v3
    indices[ptr++] = v2
  }

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  geo.setIndex(new THREE.BufferAttribute(indices, 1))
  geo.computeVertexNormals()
  return geo
}

const FOAM_VERTEX_SHADER = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vec3 p = position;

    float r = uv.y; // 0.0 = beach inner sand, 1.0 = shallow ocean outer edge

    float wavePhase = uTime * 2.4 + uv.x * 18.84;
    float waveHeight = sin(wavePhase) * 0.5 + 0.5;
    
    float crestShape = smoothstep(0.05, 0.42, r) * smoothstep(0.92, 0.42, r);
    float verticalDisplacement = waveHeight * crestShape * 0.10;

    p.y += verticalDisplacement;

    vec4 worldPos = modelMatrix * vec4(p, 1.0);
    vWorldPosition = worldPos.xyz;

    vec3 n = normal;
    n.y += cos(wavePhase) * crestShape * 0.35;
    vNormal = normalize(normalMatrix * n);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`

const FOAM_FRAGMENT_SHADER = `
  uniform float uTime;
  uniform vec3 uSunPosition;
  uniform vec3 uWetSandColor;
  uniform vec3 uShallowColor;
  uniform vec3 uFoamColor;

  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;

  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(dot(hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                   dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
               mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                   dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 3; ++i) {
      v += a * noise(p);
      p = rot * p * 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    float r = vUv.y;

    float wavePhase = uTime * 2.4 + vUv.x * 18.84;
    float surge = sin(wavePhase) * 0.10 + cos(uTime * 1.4 - vUv.x * 12.0) * 0.04;
    float waveFront = 0.42 + surge;

    vec2 foamUv = vec2(vUv.x * 24.0 + uTime * 0.06, (r - surge) * 16.0 - uTime * 0.1);
    float n1 = fbm(foamUv);
    
    vec2 foamUv2 = vec2(vUv.x * 48.0 - uTime * 0.04, r * 28.0 + uTime * 0.15);
    float n2 = noise(foamUv2);

    float distFromWave = abs(r - waveFront);
    float crestMask = smoothstep(0.20, 0.0, distFromWave);
    float foamIntensity = smoothstep(0.08, 0.42, n1 + n2 * 0.35) * crestMask;

    float washMask = smoothstep(waveFront, waveFront - 0.25, r) * smoothstep(0.0, waveFront - 0.25, r);
    float washFoam = smoothstep(0.18, 0.48, n1 * 1.2) * washMask * 0.6;

    float totalFoam = clamp(foamIntensity * 1.25 + washFoam, 0.0, 0.95);

    vec3 norm = normalize(vNormal);
    vec3 viewDir = normalize(-vWorldPosition);
    vec3 sunDir = normalize(uSunPosition);
    vec3 halfDir = normalize(sunDir + viewDir);
    float spec = pow(max(dot(norm, halfDir), 0.0), 64.0);
    vec3 sunGlint = vec3(1.0, 0.96, 0.85) * spec * 1.8;

    float caustic = sin(vUv.x * 90.0 + uTime * 3.0) * cos(r * 45.0 - uTime * 2.0) * 0.5 + 0.5;
    caustic = pow(caustic, 4.0) * smoothstep(0.1, 0.6, r) * 0.30;

    vec3 col = mix(uWetSandColor, uShallowColor, smoothstep(0.15, 0.45, r));
    col += vec3(0.08, 0.35, 0.45) * caustic;
    col += sunGlint;

    col = mix(col, uFoamColor, totalFoam);

    float wetSandAlpha = smoothstep(0.35, 0.0, r) * 0.75;
    float waterAlpha = smoothstep(0.1, 0.3, r) * smoothstep(1.0, 0.75, r) * 0.65;
    float alpha = max(wetSandAlpha, max(waterAlpha, totalFoam));

    float edgeFade = smoothstep(0.0, 0.06, r) * smoothstep(1.0, 0.88, r);
    alpha *= edgeFade;

    gl_FragColor = vec4(col, alpha);
  }
`

function ShoreFoamRing({ radiusBase = 1.35, seed = 1.0 }) {
  const matRef = useRef(null)

  const getCoast = useMemo(() => (angle) => {
    const coastNoise = fbmNoise(Math.cos(angle) * 2.2, Math.sin(angle) * 2.2, seed)
    return radiusBase * (1.0 + coastNoise * 0.35)
  }, [radiusBase, seed])

  const shoreRibbonGeo = useMemo(() => createOrganicRingGeometry(getCoast, 0.80, 1.35, 120), [getCoast])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSunPosition: { value: new THREE.Vector3(70, 42, -55) },
      uWetSandColor: { value: new THREE.Color('#947942') },
      uShallowColor: { value: new THREE.Color('#06b6d4') },
      uFoamColor: { value: new THREE.Color('#ffffff') },
    }),
    [],
  )

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.getElapsedTime()
    }
  })

  return (
    <mesh geometry={shoreRibbonGeo} position={[0, 0.015, 0]}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={FOAM_VERTEX_SHADER}
        fragmentShader={FOAM_FRAGMENT_SHADER}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function OrganicBush({ position, scale = 1, color = '#2e7a3e' }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.24, 12, 10]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0.1, 0.06, 0.08]} scale={0.75} castShadow>
        <sphereGeometry args={[0.2, 10, 8]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
    </group>
  )
}

function Rock({ position, scale = 1, rotation = 0 }) {
  return (
    <mesh position={position} scale={[scale, scale * 0.75, scale * 0.85]} rotation={[0.2, rotation, 0.1]} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.15, 1]} />
      <meshStandardMaterial color="#4d4439" roughness={0.88} />
    </mesh>
  )
}

export function IslandTerrain({
  shoreColor = '#ebd59b',
  landColor = '#378243',
  transitionColor,
  slopeColor,
  rocks = [],
  seed = 1.0,
  scale = 1,
}) {
  const islandGeo = useOrganicIslandGeometry(1.35, 0.75, seed)

  return (
    <group scale={scale}>
      <ShoreFoamRing radiusBase={1.35} seed={seed} />

      {/* Photorealistic Seamless Island Heightfield Mesh */}
      <mesh geometry={islandGeo} castShadow receiveShadow position={[0, 0, 0]}>
        <meshStandardMaterial vertexColors roughness={0.78} metalness={0.06} flatShading={false} />
      </mesh>

      {/* Lush Foliage Bush Clusters */}
      <OrganicBush position={[0.22, 0.38, 0.18]} scale={0.9} color={landColor} />
      <OrganicBush position={[-0.3, 0.35, -0.15]} scale={0.8} color="#2d6b33" />
      <OrganicBush position={[0.05, 0.42, -0.32]} scale={0.75} color={shoreColor} />
      <OrganicBush position={[-0.15, 0.38, 0.35]} scale={0.85} color={landColor} />

      {rocks.map((rock, index) => (
        <Rock key={index} {...rock} />
      ))}
    </group>
  )
}
