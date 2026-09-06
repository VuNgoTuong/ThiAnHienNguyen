import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PalmTree } from './PalmIsland.jsx'

function smoothstep(min, max, value) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)))
  return x * x * (3 - 2 * x)
}

function getParadiseCoastRadius(angle, seed = 1.0) {
  return 4.6 + Math.sin(angle * 3.0 + seed) * 0.8 + Math.cos(angle * 5.0 - seed) * 0.5 + Math.sin(angle * 7.0) * 0.25
}

function createOrganicRingGeometry(getCoastRadius, innerFactor, outerFactor, segments = 128) {
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

    // Inner vertex
    positions[idxIn * 3] = rIn * cosT
    positions[idxIn * 3 + 1] = 0
    positions[idxIn * 3 + 2] = rIn * sinT
    uvs[idxIn * 2] = i / segments
    uvs[idxIn * 2 + 1] = 0

    // Outer vertex
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

    // Physical 3D Wave Swell Vertex Height Displacement
    float wavePhase = uTime * 2.4 + uv.x * 18.84;
    float waveHeight = sin(wavePhase) * 0.5 + 0.5; // 0.0 to 1.0
    
    // Wave profile: swells up in shallow zone (r ~ 0.42) and collapses toward shore
    float crestShape = smoothstep(0.05, 0.42, r) * smoothstep(0.92, 0.42, r);
    float verticalDisplacement = waveHeight * crestShape * 0.12;

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
    float surge = sin(wavePhase) * 0.10 + cos(uTime * 1.5 - vUv.x * 12.0) * 0.04;
    float waveFront = 0.42 + surge;

    vec2 foamUv = vec2(vUv.x * 32.0 + uTime * 0.08, (r - surge) * 18.0 - uTime * 0.12);
    float n1 = fbm(foamUv);
    
    vec2 foamUv2 = vec2(vUv.x * 64.0 - uTime * 0.04, r * 32.0 + uTime * 0.18);
    float n2 = noise(foamUv2);

    float distFromWave = abs(r - waveFront);
    float crestMask = smoothstep(0.20, 0.0, distFromWave);
    float foamIntensity = smoothstep(0.06, 0.40, n1 + n2 * 0.35) * crestMask;

    float washMask = smoothstep(waveFront, waveFront - 0.28, r) * smoothstep(0.0, waveFront - 0.28, r);
    float washFoam = smoothstep(0.15, 0.45, n1 * 1.3) * washMask * 0.65;

    float totalFoam = clamp(foamIntensity * 1.35 + washFoam, 0.0, 0.98);

    // Sun Specular Glint on Physical 3D Wave Surface
    vec3 norm = normalize(vNormal);
    vec3 viewDir = normalize(-vWorldPosition);
    vec3 sunDir = normalize(uSunPosition);
    vec3 halfDir = normalize(sunDir + viewDir);
    float spec = pow(max(dot(norm, halfDir), 0.0), 64.0);
    vec3 sunGlint = vec3(1.0, 0.96, 0.85) * spec * 1.8;

    // Shallow Water Caustics Shimmer
    float caustic = sin(vUv.x * 100.0 + uTime * 3.0) * cos(r * 50.0 - uTime * 2.0) * 0.5 + 0.5;
    caustic = pow(caustic, 4.0) * smoothstep(0.1, 0.6, r) * 0.35;

    vec3 col = mix(uWetSandColor, uShallowColor, smoothstep(0.12, 0.42, r));
    col += vec3(0.08, 0.35, 0.45) * caustic;
    col += sunGlint;

    col = mix(col, uFoamColor, totalFoam);

    float wetSandAlpha = smoothstep(0.35, 0.0, r) * 0.78;
    float waterAlpha = smoothstep(0.08, 0.28, r) * smoothstep(1.0, 0.78, r) * 0.70;
    float alpha = max(wetSandAlpha, max(waterAlpha, totalFoam));

    float edgeFade = smoothstep(0.0, 0.05, r) * smoothstep(1.0, 0.86, r);
    alpha *= edgeFade;

    gl_FragColor = vec4(col, alpha);
  }
`

// Photorealistic Organic GLSL Shoreline Wave & Foam Lacework Shader System
function ShoreFoamSurge({ seed = 1.0 }) {
  const matRef = useRef(null)

  const getCoast = useMemo(() => (angle) => getParadiseCoastRadius(angle, seed), [seed])
  const shoreRibbonGeo = useMemo(() => createOrganicRingGeometry(getCoast, 0.80, 1.38, 160), [getCoast])

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
    <mesh geometry={shoreRibbonGeo} position={[0, 0.018, 0]}>
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

function useOrganicParadiseTerrainGeometry(seed = 1.0) {
  return useMemo(() => {
    const GRID_SIZE = 16
    const SEGMENTS = 140
    const geo = new THREE.PlaneGeometry(GRID_SIZE, GRID_SIZE, SEGMENTS, SEGMENTS)
    geo.rotateX(-Math.PI / 2)

    const pos = geo.attributes.position
    const count = pos.count
    const colors = new Float32Array(count * 3)

    const cSand = new THREE.Color('#ebd59b')
    const cWetSand = new THREE.Color('#bfa565')
    const cGrassLow = new THREE.Color('#22c55e')
    const cGrassHigh = new THREE.Color('#15803d')
    const cBasalt = new THREE.Color('#57534e')
    const cDarkBasalt = new THREE.Color('#292524')
    const cMagma = new THREE.Color('#ea580c')

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)

      const r = Math.sqrt(x * x + z * z)
      const angle = Math.atan2(z, x)

      const rCoast = getParadiseCoastRadius(angle, seed)
      const norm = r / rCoast

      let y = 0.0
      if (norm >= 1.0) {
        y = -0.35 - (norm - 1.0) * 0.4
      } else {
        const beachNorm = smoothstep(0.78, 1.0, norm)

        // Sweeping natural volcanic shield profile
        const baseCone = Math.pow(Math.max(0.0, 1.0 - norm), 1.25) * 2.1

        // Multi-frequency radial erosion ridges & ravines
        const radialRidge = (Math.sin(angle * 5.0 + seed) * 0.3 + Math.cos(angle * 9.0 - seed) * 0.16) * Math.sin(norm * Math.PI) * 0.45
        const microTerrain = (Math.sin(x * 1.5) * Math.cos(z * 1.5) + Math.sin(x * 3.2 + z * 2.8) * 0.25) * 0.3 * (1.0 - norm)

        // Volcanic Caldera Crater Dip at summit center (norm < 0.25)
        let craterDip = 0.0
        if (norm < 0.25) {
          const cNorm = norm / 0.25
          craterDip = Math.pow(1.0 - cNorm, 1.8) * 0.95
        }

        y = baseCone + radialRidge + microTerrain - craterDip
        y = Math.max(-0.02, y * (1.0 - Math.pow(beachNorm, 3.0)))
      }

      pos.setY(i, y)
    }

    // Compute normals first to calculate slope-based rock exposure
    geo.computeVertexNormals()
    const normals = geo.attributes.normal

    for (let i = 0; i < count; i++) {
      const y = pos.getY(i)
      const ny = normals.getY(i) // 1.0 = flat ground, 0.0 = sheer vertical cliff

      const vertexColor = new THREE.Color()

      if (y <= 0.04) {
        const t = Math.max(0, (y + 0.04) / 0.08)
        vertexColor.copy(cWetSand).lerp(cSand, t)
      } else if (y < 0.28) {
        const t = (y - 0.04) / 0.24
        vertexColor.copy(cSand).lerp(cGrassLow, t)
      } else {
        // Slope-based rock exposure: steep slopes show bare craggy rock cliff faces!
        const slopeRockFactor = smoothstep(0.72, 0.48, ny)
        const heightGrass = new THREE.Color().copy(cGrassLow).lerp(cGrassHigh, Math.min(1.0, (y - 0.28) / 0.92))
        const heightRock = new THREE.Color().copy(cBasalt).lerp(cDarkBasalt, Math.min(1.0, (y - 0.9) / 0.9))

        vertexColor.copy(heightGrass).lerp(heightRock, slopeRockFactor)
      }

      // Molten lava pool blending inside crater floor (norm < 0.15)
      const r = Math.sqrt(pos.getX(i) ** 2 + pos.getZ(i) ** 2)
      const angle = Math.atan2(pos.getZ(i), pos.getX(i))
      const norm = r / getParadiseCoastRadius(angle, seed)
      if (norm < 0.15 && y < 1.1) {
        const tMagma = smoothstep(0.15, 0.02, norm)
        vertexColor.lerp(cMagma, tMagma * 0.85)
      }

      colors[i * 3] = vertexColor.r
      colors[i * 3 + 1] = vertexColor.g
      colors[i * 3 + 2] = vertexColor.b
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geo
  }, [seed])
}

// Glowing Volcanic Caldera Magma Pool & Ember Smoke
function VolcanoCaldera() {
  const embersRef = useRef(null)

  const emberPositions = useMemo(() => {
    const pos = []
    for (let i = 0; i < 20; i++) {
      pos.push((Math.random() - 0.5) * 1.2, 1.0 + Math.random() * 1.2, (Math.random() - 0.5) * 1.2)
    }
    return new Float32Array(pos)
  }, [])

  useFrame(({ clock }) => {
    if (!embersRef.current) return
    const t = clock.getElapsedTime()
    const posAttr = embersRef.current.geometry.attributes.position
    for (let i = 0; i < 20; i++) {
      let y = posAttr.getY(i) + 0.012
      if (y > 2.4) y = 1.0
      posAttr.setY(i, y)
      posAttr.setX(i, posAttr.getX(i) + Math.sin(t * 2 + i) * 0.004)
    }
    posAttr.needsUpdate = true
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Molten Magma Lake Pool inside Crater Cavity */}
      <mesh position={[0, 0.95, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.9, 32]} />
        <meshStandardMaterial
          color="#f97316"
          emissive="#ef4444"
          emissiveIntensity={2.8}
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>

      {/* Volcanic Lava Glow Point Light */}
      <pointLight position={[0, 1.1, 0]} color="#f97316" intensity={3.8} distance={7.5} />

      {/* Volcanic Embers Particle System */}
      <points ref={embersRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[emberPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.10} color="#fef08a" transparent opacity={0.85} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  )
}

function RainforestFoliage() {
  const treeClusters = useMemo(() => {
    return [
      { pos: [1.1, 0.62, 0.8], scale: 0.85, color: '#16a34a' },
      { pos: [-1.2, 0.58, 0.7], scale: 0.75, color: '#15803d' },
      { pos: [0.8, 0.95, -0.9], scale: 0.8, color: '#166534' },
      { pos: [-0.9, 0.82, -1.1], scale: 0.7, color: '#15803d' },
      { pos: [1.4, 0.45, -0.6], scale: 0.9, color: '#22c55e' },
      { pos: [-1.4, 0.52, -0.5], scale: 0.85, color: '#16a34a' },
      { pos: [0.3, 1.25, 0.9], scale: 0.65, color: '#14532d' },
      { pos: [-0.4, 1.18, -0.8], scale: 0.7, color: '#166534' },
    ]
  }, [])

  return (
    <group>
      {treeClusters.map((t, idx) => (
        <group key={idx} position={t.pos} scale={t.scale}>
          <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
            <dodecahedronGeometry args={[0.32, 1]} />
            <meshStandardMaterial color={t.color} roughness={0.8} />
          </mesh>
          <mesh position={[0.1, 0.28, -0.08]} scale={0.75} castShadow receiveShadow>
            <dodecahedronGeometry args={[0.26, 1]} />
            <meshStandardMaterial color={t.color} roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function CoastalReefRock({ position, scale = 1, rotation = 0 }) {
  return (
    <mesh position={position} scale={[scale, scale * 0.7, scale * 0.85]} rotation={[0.1, rotation, 0.05]} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.22, 1]} />
      <meshStandardMaterial color="#44403c" roughness={0.85} />
    </mesh>
  )
}

export function ParadiseIsland({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0], seed = 1.0 }) {
  const terrainGeo = useOrganicParadiseTerrainGeometry(seed)

  return (
    <group position={position} scale={scale} rotation={rotation}>
      {/* Dynamic 3D Wave Shore Surge */}
      <ShoreFoamSurge seed={seed} />

      {/* Grand Volcanic Terrain Mesh with Slope-Based Rock Shading */}
      <mesh geometry={terrainGeo} position={[0, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.78} metalness={0.06} flatShading={false} />
      </mesh>

      {/* Dense Tropical Rainforest Canopy Clusters */}
      <RainforestFoliage />

      {/* Active Volcanic Crater Magma Lake & Glowing Light */}
      <VolcanoCaldera />

      {/* Realistic Tropical Palms along lower beach slopes */}
      <PalmTree position={[1.8, 0.32, 1.4]} scale={0.9} lean={0.12} />
      <PalmTree position={[-1.9, 0.28, 1.1]} scale={0.8} lean={-0.1} />
      <PalmTree position={[2.0, 0.24, -1.4]} scale={0.85} lean={0.08} />
      <PalmTree position={[-1.6, 0.28, -1.6]} scale={0.75} lean={-0.12} />
      <PalmTree position={[0.3, 0.65, -2.0]} scale={0.7} lean={0.05} />

      {/* Coastal Volcanic Reef Boulders */}
      <CoastalReefRock position={[2.6, 0.08, 1.8]} scale={1.1} rotation={0.4} />
      <CoastalReefRock position={[-2.8, 0.08, 1.2]} scale={0.95} rotation={1.2} />
      <CoastalReefRock position={[2.2, 0.08, -2.4]} scale={1.0} rotation={2.1} />
      <CoastalReefRock position={[-2.4, 0.08, -2.2]} scale={0.85} rotation={0.7} />
    </group>
  )
}
