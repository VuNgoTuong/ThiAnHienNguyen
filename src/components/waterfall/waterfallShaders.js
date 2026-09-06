import * as THREE from 'three'

// Custom Main Water Ribbon Shader with Fresnel, Vertex Displacement, Specular Highlights & Depth Gradient
export const MainWaterShader = {
  uniforms: {
    uTime: { value: 0 },
    uColorShallow: { value: new THREE.Color('#78f3ff') },
    uColorDeep: { value: new THREE.Color('#0d6b63') },
    uColorFoam: { value: new THREE.Color('#ffffff') },
    uFlowSpeed: { value: 1.2 },
    uGlowIntensity: { value: 1.0 },
    uSunPosition: { value: new THREE.Vector3(-12, 18, 8) },
  },
  vertexShader: `
    uniform float uTime;
    uniform float uFlowSpeed;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vec3 pos = position;

      // Multi-layer wave displacement along the waterfall flow
      float flowTime = uTime * uFlowSpeed;
      float wave1 = sin(pos.y * 2.5 - flowTime * 3.0) * 0.08;
      float wave2 = cos(pos.x * 4.0 + flowTime * 4.5) * 0.04;
      float wave3 = sin((pos.x + pos.y) * 6.0 - flowTime * 6.0) * 0.02;

      pos.z += wave1 + wave2 + wave3;
      pos.x += sin(pos.y * 1.5 - flowTime * 2.0) * 0.05;

      vec4 worldPos = modelMatrix * vec4(pos, 1.0);
      vWorldPosition = worldPos.xyz;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vViewPosition = -mvPosition.xyz;
      vNormal = normalize(normalMatrix * normal);

      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColorShallow;
    uniform vec3 uColorDeep;
    uniform vec3 uColorFoam;
    uniform float uGlowIntensity;
    uniform vec3 uSunPosition;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewPosition;

    // Pseudo-random noise helper
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
        f.y
      );
    }

    void main() {
      // Flowing UV textures
      vec2 flowUv1 = vec2(vUv.x * 2.0, vUv.y * 3.0 - uTime * 0.8);
      vec2 flowUv2 = vec2(vUv.x * 3.5 + 0.3, vUv.y * 5.0 - uTime * 1.4);

      float n1 = noise(flowUv1);
      float n2 = noise(flowUv2);
      float foamNoise = clamp(pow(n1 * n2 * 2.2, 1.8), 0.0, 1.0);

      // Depth gradient from top crest to bottom impact
      float heightGradient = smoothstep(0.0, 1.0, vUv.y);
      vec3 waterBaseColor = mix(uColorDeep, uColorShallow, heightGradient * 0.7 + n1 * 0.3);

      // Fresnel Rim Effect
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);

      // Sun Specular Highlight
      vec3 lightDir = normalize(uSunPosition - vWorldPosition);
      vec3 halfVector = normalize(lightDir + viewDir);
      float spec = pow(max(dot(vNormal, halfVector), 0.0), 32.0) * 1.5;

      // Combine Foam, Specular, Fresnel & Base Water Color
      vec3 finalColor = mix(waterBaseColor, uColorFoam, foamNoise * 0.65);
      finalColor += vec3(fresnel * 0.4) + vec3(spec);
      finalColor *= uGlowIntensity;

      // Soft edge alpha transition
      float edgeAlpha = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x);
      float alpha = clamp(0.7 + fresnel * 0.3 + foamNoise * 0.2, 0.0, 0.95) * edgeAlpha;

      gl_FragColor = vec4(pow(finalColor, vec3(1.0 / 2.2)), alpha);
    }
  `,
}

// Lake Surface Shader with Wave Displacement, Fresnel & Foam Crests
export const WaterSurfaceShader = {
  uniforms: {
    uTime: { value: 0 },
    uColorDeep: { value: new THREE.Color('#0a3e47') },
    uColorShallow: { value: new THREE.Color('#1cb3a8') },
    uColorFoam: { value: new THREE.Color('#e0f8ff') },
    uSunPosition: { value: new THREE.Vector3(-12, 18, 8) },
  },
  vertexShader: `
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vViewPosition;
    varying vec3 vNormal;

    void main() {
      vUv = uv;
      vec3 pos = position;

      // Multi-directional sine swells
      float wave1 = sin(pos.x * 0.8 + uTime * 1.5) * 0.08;
      float wave2 = cos(pos.z * 0.7 + uTime * 1.2) * 0.07;
      float chop = sin((pos.x * 2.0 + pos.z * 1.8) + uTime * 2.5) * 0.03;

      pos.y += wave1 + wave2 + chop;

      vec4 worldPos = modelMatrix * vec4(pos, 1.0);
      vWorldPosition = worldPos.xyz;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vViewPosition = -mvPosition.xyz;

      // Compute perturbed normal
      vec3 normalBase = vec3(
        -cos(pos.x * 0.8 + uTime * 1.5) * 0.08 * 0.8,
        1.0,
        sin(pos.z * 0.7 + uTime * 1.2) * 0.07 * 0.7
      );
      vNormal = normalize(normalMatrix * normalBase);

      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColorDeep;
    uniform vec3 uColorShallow;
    uniform vec3 uColorFoam;
    uniform vec3 uSunPosition;

    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vViewPosition;
    varying vec3 vNormal;

    void main() {
      // Distance from lake center / waterfall impact zone
      float distFromImpact = length(vUv - vec2(0.5, 0.5));
      float ripple = sin(distFromImpact * 25.0 - uTime * 4.0) * 0.5 + 0.5;

      vec3 waterColor = mix(uColorShallow, uColorDeep, smoothstep(0.1, 0.6, distFromImpact));

      // Fresnel effect
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 4.0);

      // Specular highlight
      vec3 lightDir = normalize(uSunPosition - vWorldPosition);
      vec3 halfVector = normalize(lightDir + viewDir);
      float spec = pow(max(dot(vNormal, halfVector), 0.0), 64.0) * 2.0;

      // Foam near impact center
      float foamImpact = smoothstep(0.35, 0.05, distFromImpact) * (ripple * 0.5 + 0.5);
      vec3 finalColor = mix(waterColor, uColorFoam, foamImpact * 0.7);
      finalColor += vec3(fresnel * 0.35) + vec3(spec);

      gl_FragColor = vec4(pow(finalColor, vec3(1.0 / 2.2)), 0.88);
    }
  `,
}
