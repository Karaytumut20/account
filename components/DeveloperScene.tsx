    // components/DeveloperScene.tsx
    "use client";

    import { Suspense, useRef, useMemo, useEffect, useState } from 'react';
    import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
    import { Float, Stars, Text3D, Center, shaderMaterial, OrbitControls, Sparkles, useTexture } from '@react-three/drei';
    import * as THREE from 'three';

    // 1. Gelişmiş Nebula Shader Material
    const CosmicNebulaMaterial = shaderMaterial(
    {
        uTime: 0,
        uMouse: new THREE.Vector3(0, 0, 0),
        uResolution: new THREE.Vector2(800, 600),
        uHover: 0,
        uColor1: new THREE.Color('#6d28d9'),
        uColor2: new THREE.Color('#8b5cf6'),
        uColor3: new THREE.Color('#a78bfa'),
        uIntensity: 1.0
    },
    `
        uniform float uTime;
        uniform vec3 uMouse;
        uniform float uHover;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        varying float vDistortion;

        // Simplex Noise fonksiyonu
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
        
        // Fare etkileşimi ile distortion
        float mouseDistance = distance(position, uMouse);
        vDistortion = 1.0 - smoothstep(0.0, 3.0, mouseDistance);
        vDistortion = pow(vDistortion, 2.0) * uHover;
        
        // Çok katmanlı noise ile organik nebula hareketi
        float noise1 = snoise(position * 0.8 + uTime * 0.3);
        float noise2 = snoise(position * 1.2 + uTime * 0.5);
        float noise3 = snoise(position * 2.0 + uTime * 0.2);
        
        vec3 distortedPosition = position;
        distortedPosition += normal * (noise1 * 0.4 + noise2 * 0.2 + noise3 * 0.1);
        distortedPosition += normalize(position - uMouse) * vDistortion * 2.0;
        
        vec4 modelViewPosition = modelViewMatrix * vec4(distortedPosition, 1.0);
        gl_Position = projectionMatrix * modelViewPosition;
        }
    `,
    `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform float uIntensity;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        varying float vDistortion;

        // RGB to HSV conversion
        vec3 rgb2hsv(vec3 c) {
        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
        vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
        float d = q.x - min(q.w, q.y);
        float e = 1.0e-10;
        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
        }

        // HSV to RGB conversion
        vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }

        void main() {
        // Çok katmanlı renk geçişleri
        float noise1 = sin(vPosition.x * 2.0 + uTime * 0.5) * 0.5 + 0.5;
        float noise2 = cos(vPosition.y * 2.0 + uTime * 0.3) * 0.5 + 0.5;
        float noise3 = sin(vPosition.z * 2.0 + uTime * 0.7) * 0.5 + 0.5;
        
        vec3 colorA = mix(uColor1, uColor2, noise1);
        vec3 colorB = mix(colorA, uColor3, noise2);
        vec3 finalColor = mix(colorB, vec3(1.0, 0.9, 1.0), vDistortion * 0.5);
        
        // Distortion ile parlaklık artışı
        float brightness = 0.6 + vDistortion * 0.4 + noise3 * 0.2;
        finalColor *= brightness * uIntensity;
        
        // Merkezden uzaklaştıkça şeffaflık
        float distanceFromCenter = length(vPosition);
        float alpha = 1.0 - smoothstep(0.0, 8.0, distanceFromCenter);
        alpha *= 0.8 + vDistortion * 0.4;
        
        gl_FragColor = vec4(finalColor, alpha * 0.9);
        }
    `
    );
    extend({ CosmicNebulaMaterial });

    // 2. Hologram Etkili Yazı Material
    const HologramMaterial = shaderMaterial(
    {
        uTime: 0,
        uColor: new THREE.Color('#8b5cf6'),
        uScanlineSpeed: 2.0,
        uHover: 0
    },
    `
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
    `
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uScanlineSpeed;
        uniform float uHover;
        
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
        // Hologram tarama çizgileri
        float scanline = sin(vUv.y * 100.0 + uTime * uScanlineSpeed) * 0.5 + 0.5;
        scanline = pow(scanline, 2.0);
        
        // Kenar parlaması
        float edgeGlow = 1.0 - smoothstep(0.0, 0.1, abs(vUv.x - 0.5));
        edgeGlow += 1.0 - smoothstep(0.0, 0.1, abs(vUv.y - 0.5));
        
        // Hover efekti ile titreşim
        float hoverPulse = sin(uTime * 8.0 + vPosition.y * 10.0) * 0.1 * uHover;
        
        // Final renk
        vec3 finalColor = uColor;
        finalColor += scanline * 0.3;
        finalColor += edgeGlow * 0.2;
        finalColor *= 1.0 + hoverPulse;
        
        // Şeffaflık
        float alpha = 0.9 + scanline * 0.3 + edgeGlow * 0.2 + uHover * 0.3;
        
        gl_FragColor = vec4(finalColor, alpha);
        }
    `
    );
    extend({ HologramMaterial });

    // 3. Kuantum Parçacık Sistemi
    function QuantumParticles({ count = 2000 }) {
    const points = useRef<any>();
    const [hovered, setHovered] = useState(false);
    
    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        
        const color = new THREE.Color();
        
        for (let i = 0; i < count; i++) {
        // Küresel dağılım
        const radius = 4 + Math.random() * 8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        const i3 = i * 3;
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);
        
        // Mor tonlarında renkler
        const hue = 0.75 + Math.random() * 0.1;
        color.setHSL(hue, 0.8, 0.6 + Math.random() * 0.3);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
        
        sizes[i] = Math.random() * 0.1 + 0.05;
        }
        
        return { positions, colors, sizes };
    }, [count]);

    useFrame((state, delta) => {
        if (points.current) {
        points.current.rotation.y += delta * 0.1;
        points.current.rotation.x += delta * 0.05;
        
        // Parçacık hareketi
        const positions = points.current.geometry.attributes.position.array;
        const time = state.clock.elapsedTime;
        
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const x = positions[i3], y = positions[i3 + 1], z = positions[i3 + 2];
            
            // Kuantum dalga hareketi
            positions[i3] = x + Math.sin(time + y) * 0.01;
            positions[i3 + 1] = y + Math.cos(time + z) * 0.01;
            positions[i3 + 2] = z + Math.sin(time + x) * 0.01;
        }
        
        points.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <points 
        ref={points}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        >
        <bufferGeometry>
            <bufferAttribute
            attach="attributes-position"
            count={count}
            array={particles.positions}
            itemSize={3}
            />
            <bufferAttribute
            attach="attributes-color"
            count={count}
            array={particles.colors}
            itemSize={3}
            />
            <bufferAttribute
            attach="attributes-size"
            count={count}
            array={particles.sizes}
            itemSize={1}
            />
        </bufferGeometry>
        <pointsMaterial
            size={0.1}
            vertexColors
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
            sizeAttenuation
        />
        </points>
    );
    }

    // 4. Ana Nebula Küresi
    function CosmicNebula() {
    const mesh = useRef<any>();
    const material = useRef<any>();
    const [hovered, setHovered] = useState(false);
    
    const { mouse } = useThree();

    useFrame((state, delta) => {
        if (mesh.current && material.current) {
        mesh.current.rotation.y += delta * 0.1;
        material.current.uTime += delta;
        
        // Fare pozisyonunu güncelle
        material.current.uMouse.lerp(
            new THREE.Vector3(mouse.x * 5, mouse.y * 5, 0),
            0.1
        );
        
        // Hover animasyonu
        material.current.uHover = THREE.MathUtils.lerp(
            material.current.uHover,
            hovered ? 1 : 0,
            0.1
        );
        }
    });

    return (
        <mesh 
        ref={mesh} 
        scale={[2, 2, 2]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        >
        <sphereGeometry args={[1.5, 64, 64]} />
        {/* @ts-ignore */}
        <cosmicNebulaMaterial 
            ref={material}
            transparent
            blending={THREE.AdditiveBlending}
            depthWrite={false}
        />
        </mesh>
    );
    }

    // 5. Hologram Yazı
    function HologramText() {
    const textRef = useRef<any>();
    const material = useRef<any>();
    const [hovered, setHovered] = useState(false);
    
    useFrame((state, delta) => {
        if (textRef.current && material.current) {
        textRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
        material.current.uTime = state.clock.elapsedTime;
        material.current.uHover = THREE.MathUtils.lerp(
            material.current.uHover,
            hovered ? 1 : 0,
            0.1
        );
        }
    });

    return (
        <Float
        speed={1.5}
        rotationIntensity={0.3}
        floatIntensity={0.5}
        position={[0, 0, 0]}
        >
        <Center>
            <group ref={textRef}>
            <Text3D
                font="/fonts/helvetiker_bold.typeface.json"
                size={0.5}
                height={0.1}
                curveSegments={12}
                bevelEnabled
                bevelThickness={0.02}
                bevelSize={0.02}
                bevelOffset={0}
                bevelSegments={8}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                UMUT KARAYTUĞ
                {/* @ts-ignore */}
                <hologramMaterial ref={material} transparent />
            </Text3D>
            
            <Center position={[0, -0.8, 0]}>
                <Text3D
                font="/fonts/helvetiker_bold.typeface.json"
                size={0.2}
                height={0.05}
                curveSegments={8}
                >
                FULL-STACK DEVELOPER
                <meshBasicMaterial color="#c4b5fd" transparent opacity={0.9} />
                </Text3D>
            </Center>
            </group>
        </Center>
        </Float>
    );
    }

    // 6. Dönen Teknoloji İkonları
    function TechIcons() {
    const group = useRef<any>();
    
    const icons = useMemo(() => [
        { position: [3, 0, 0], rotation: [0, 0, 0] },
        { position: [-3, 0, 0], rotation: [0, Math.PI, 0] },
        { position: [0, 0, 3], rotation: [0, Math.PI / 2, 0] },
        { position: [0, 0, -3], rotation: [0, -Math.PI / 2, 0] },
    ], []);

    useFrame((state, delta) => {
        if (group.current) {
        group.current.rotation.y += delta * 0.2;
        }
    });

    return (
        <group ref={group}>
        {icons.map((icon, index) => (
            <mesh key={index} position={icon.position as [number, number, number]} rotation={icon.rotation as [number, number, number]}>
            <ringGeometry args={[0.8, 1, 32]} />
            <meshBasicMaterial color="#8b5cf6" transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>
        ))}
        </group>
    );
    }

    // 7. Ana Sahne
    export default function DeveloperScene() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="w-full h-screen bg-black relative">
        <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
            <color attach="background" args={['#000000']} />
            
            {/* Kontroller */}
            <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            maxPolarAngle={Math.PI}
            minPolarAngle={0}
            autoRotate
            autoRotateSpeed={0.5}
            />
            
            {/* Işıklandırma */}
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#8b5cf6" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#6d28d9" />
            
            <Suspense fallback={null}>
            {/* Ana Elementler */}
            <CosmicNebula />
            <HologramText />
            <QuantumParticles count={3000} />
            <TechIcons />
            
            {/* Efektler */}
            <Sparkles 
                count={200} 
                scale={[20, 20, 20]} 
                size={2} 
                speed={0.3} 
                color="#a78bfa"
            />
            <Stars 
                radius={100} 
                depth={50} 
                count={2000} 
                factor={4} 
                saturation={1} 
                fade 
                speed={0.5}
            />
            </Suspense>

            {/* Sis efekti */}
            <fog attach="fog" args={['#000000', 5, 25]} />
        </Canvas>
        
        {/* Arayüz bilgisi */}
        <div className="absolute bottom-4 left-4 text-purple-300 text-sm font-mono">
            <div>🚀 Interactive 3D Portfolio</div>
            <div>✨ Hover & Explore</div>
        </div>
        </div>
    );
    }