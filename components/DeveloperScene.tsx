// components/DeveloperScene.tsx
"use client";

import { Suspense, useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, extend, useThree, ReactThreeFiber } from "@react-three/fiber";
import { Float, Stars, Text3D, Center, shaderMaterial, OrbitControls, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/** ===== Shader Materials ===== */
const CosmicNebulaMaterial = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector3(0, 0, 0),
    uResolution: new THREE.Vector2(800, 600),
    uHover: 0,
    // No purple: icy blue/white palette
    uColor1: new THREE.Color("#cfe9ff"),
    uColor2: new THREE.Color("#7dd3fc"),
    uColor3: new THREE.Color("#e0f2fe"),
    uIntensity: 0.9,
  },
  /* vertex */ `
    uniform float uTime;
    uniform vec3 uMouse;
    uniform float uHover;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying float vDistortion;

    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(
                  i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m*m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
      vUv = uv;
      vPosition = position;

      float mouseDistance = distance(position, uMouse);
      vDistortion = 1.0 - smoothstep(0.0, 3.0, mouseDistance);
      vDistortion = pow(vDistortion, 2.0) * uHover;

      float n1 = snoise(position * 0.8 + uTime * 0.3);
      float n2 = snoise(position * 1.2 + uTime * 0.5);
      float n3 = snoise(position * 2.0 + uTime * 0.2);

      vec3 dp = position;
      dp += normal * (n1 * 0.35 + n2 * 0.18 + n3 * 0.08);
      dp += normalize(position - uMouse) * vDistortion * 1.6;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(dp, 1.0);
    }
  `,
  /* fragment */ `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform float uIntensity;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying float vDistortion;

    void main() {
      float n1 = sin(vPosition.x * 2.0 + uTime * 0.5) * 0.5 + 0.5;
      float n2 = cos(vPosition.y * 2.0 + uTime * 0.3) * 0.5 + 0.5;
      float n3 = sin(vPosition.z * 2.0 + uTime * 0.7) * 0.5 + 0.5;

      vec3 colorA = mix(uColor1, uColor2, n1);
      vec3 colorB = mix(colorA, uColor3, n2);
      vec3 finalColor = mix(colorB, vec3(0.95, 0.98, 1.0), vDistortion * 0.5);

      float brightness = 0.55 + vDistortion * 0.35 + n3 * 0.15;
      finalColor *= brightness * uIntensity;

      float distanceFromCenter = length(vPosition);
      float alpha = 1.0 - smoothstep(0.0, 8.0, distanceFromCenter);
      alpha *= 0.8 + vDistortion * 0.35;

      gl_FragColor = vec4(finalColor, alpha * 0.9);
    }
  `
);

const HologramMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color("#7dd3fc"),
    uScanlineSpeed: 2.0,
    uHover: 0,
  },
  /* vertex */ `
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vNormal = normal;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* fragment */ `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uScanlineSpeed;
    uniform float uHover;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      float scanline = sin(vUv.y * 100.0 + uTime * uScanlineSpeed) * 0.5 + 0.5;
      scanline = pow(scanline, 2.0);
      float edgeGlow = 1.0 - smoothstep(0.0, 0.1, abs(vUv.x - 0.5));
      edgeGlow += 1.0 - smoothstep(0.0, 0.1, abs(vUv.y - 0.5));
      float hoverPulse = sin(uTime * 8.0 + vPosition.y * 10.0) * 0.08 * uHover;

      vec3 finalColor = uColor;
      finalColor += scanline * 0.25;
      finalColor += edgeGlow * 0.15;
      finalColor *= 1.0 + hoverPulse;

      float alpha = 0.85 + scanline * 0.25 + edgeGlow * 0.15 + uHover * 0.25;
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
);

/** Register with R3F runtime */
extend({ CosmicNebulaMaterial, HologramMaterial });

/** ===== TypeScript: make JSX aware of custom tags ===== */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Key fix: let TS know about these custom elements produced by `extend(...)`
      cosmicNebulaMaterial: ReactThreeFiber.Object3DNode<
        typeof THREE.ShaderMaterial,
        typeof THREE.ShaderMaterial
      >;
      hologramMaterial: ReactThreeFiber.Object3DNode<
        typeof THREE.ShaderMaterial,
        typeof THREE.ShaderMaterial
      >;
    }
  }
}

/** ===== Quantum Particles ===== */
function QuantumParticles({ count = 1200 }) {
  const points = useRef<THREE.Points>(null);
  const particles = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const radius = 4 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const i3 = i * 3;
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // cyan/blue range
      const hue = 0.56 + Math.random() * 0.06;
      color.setHSL(hue, 0.55, 0.65 + Math.random() * 0.2);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() * 0.08 + 0.04;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return geometry;
  }, [count]);

  useFrame((state, delta) => {
    if (!points.current) return;
    points.current.rotation.y += delta * 0.08;
    points.current.rotation.x += delta * 0.04;

    const positions = particles.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = positions[i3],
        y = positions[i3 + 1],
        z = positions[i3 + 2];
      positions[i3] = x + Math.sin(time + y) * 0.008;
      positions[i3 + 1] = y + Math.cos(time + z) * 0.008;
      positions[i3 + 2] = z + Math.sin(time + x) * 0.008;
    }
    particles.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points} geometry={particles}>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/** ===== Nebula Sphere ===== */
function CosmicNebula({ seg = 64, scale = 1.7 }: { seg?: number; scale?: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);
  const { mouse } = useThree();

  useFrame((state, delta) => {
    if (!mesh.current || !materialRef.current) return;
    mesh.current.rotation.y += delta * 0.09;
    materialRef.current.uTime += delta;
    materialRef.current.uMouse.lerp(new THREE.Vector3(mouse.x * 5, mouse.y * 5, 0), 0.1);
    materialRef.current.uHover = THREE.MathUtils.lerp(materialRef.current.uHover, hovered ? 1 : 0, 0.1);
  });

  return (
    <mesh
      ref={mesh}
      scale={[scale, scale, scale]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[1.5, seg, seg]} />
      <cosmicNebulaMaterial ref={materialRef} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

/** ===== Hologram Text ===== */
function HologramText() {
  const textRef = useRef<THREE.Group>(null);
  const materialRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!textRef.current || !materialRef.current) return;
    textRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
    materialRef.current.uTime = state.clock.elapsedTime;
    materialRef.current.uHover = THREE.MathUtils.lerp(materialRef.current.uHover, hovered ? 1 : 0, 0.1);
  });

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.45} position={[0, 0, 0]}>
      <Center>
        <group ref={textRef}>
          <Text3D
            font="/fonts/helvetiker_bold.typeface.json"
            size={0.5}
            height={0.08}
            curveSegments={10}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={6}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
          >
            UMUT KARAYTUĞ
            <hologramMaterial ref={materialRef} transparent />
          </Text3D>

          <Center position={[0, -0.8, 0]}>
            <Text3D font="/fonts/helvetiker_bold.typeface.json" size={0.2} height={0.05} curveSegments={8}>
              FULL-STACK DEVELOPER
              <meshBasicMaterial color="#dbeafe" transparent opacity={0.9} />
            </Text3D>
          </Center>
        </group>
      </Center>
    </Float>
  );
}

/** ===== Icons ===== */
function TechIcons() {
  const group = useRef<THREE.Group>(null);
  const icons = useMemo(
    () => [
      { position: [3, 0, 0], rotation: [0, 0, 0] },
      { position: [-3, 0, 0], rotation: [0, Math.PI, 0] },
      { position: [0, 0, 3], rotation: [0, Math.PI / 2, 0] },
      { position: [0, 0, -3], rotation: [0, -Math.PI / 2, 0] },
    ],
    []
  );

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.18;
  });

  return (
    <group ref={group}>
      {icons.map((icon, index) => (
        <mesh key={index} position={icon.position as [number, number, number]} rotation={icon.rotation as [number, number, number]}>
          <ringGeometry args={[0.8, 1, 32]} />
          <meshBasicMaterial color="#7dd3fc" transparent opacity={0.25} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

/** ===== Scene ===== */
export default function DeveloperScene() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-slate-300 text-lg">Loading 3D Scene...</div>
      </div>
    );
  }

  const quality = isMobile ? 0.6 : 1.0;
  const nebulaSeg = isMobile ? 32 : 56;
  const nebulaScale = isMobile ? 1.4 : 1.7;
  const particleCount = Math.round((isMobile ? 800 : 1800) * quality);
  const sparkleCount = Math.round((isMobile ? 40 : 100) * quality);
  const starsCount = Math.round((isMobile ? 400 : 1200) * quality);
  const starsFactor = isMobile ? 2.5 : 3.5;

  return (
    <div className="w-full h-screen bg-black relative">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        shadows={false}
      >
        <color attach="background" args={["#000000"]} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI}
          minPolarAngle={0}
          autoRotate={!isMobile}
          autoRotateSpeed={0.4}
        />

        <ambientLight intensity={0.35} />
        <pointLight position={[10, 10, 10]} intensity={1.1} color="#cfe9ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.7} color="#7dd3fc" />

        <Suspense fallback={null}>
          <CosmicNebula seg={nebulaSeg} scale={nebulaScale} />
          <HologramText />
          <QuantumParticles count={particleCount} />
          <TechIcons />

          <Sparkles count={sparkleCount} scale={[18, 18, 18]} size={isMobile ? 1.2 : 1.6} speed={0.25} color="#ffffff" />
          <Stars radius={100} depth={50} count={starsCount} factor={starsFactor} saturation={0.2} fade speed={0.4} />
        </Suspense>

        <fog attach="fog" args={["#000000", 5, 25]} />
      </Canvas>

      <div className="absolute bottom-4 left-4 text-slate-300 text-sm font-mono">
        <div>🚀 Interactive 3D Portfolio</div>
        <div>✨ Hover & Explore</div>
      </div>
    </div>
  );
}
