import { useRef, Suspense, lazy } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, Torus, Float, Environment, MeshDistortMaterial } from '@react-three/drei'
import { useReducedMotion } from '../../hooks/useUtils'
import * as THREE from 'three'

/* ─── Floating Sphere ─── */
function FloatingSphere({ position, scale = 1, color = '#B89A5A', speed = 1 }) {
  const meshRef = useRef()
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.15
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.2
    }
  })
  return (
    <Float speed={speed * 1.5} rotationIntensity={0.4} floatIntensity={0.8}>
      <Sphere ref={meshRef} args={[1, 32, 32]} position={position} scale={scale}>
        <MeshDistortMaterial
          color={color}
          metalness={0.7}
          roughness={0.2}
          distort={0.25}
          speed={1.5}
          envMapIntensity={1}
        />
      </Sphere>
    </Float>
  )
}

/* ─── Gold Ring ─── */
function GoldRing({ position, rotation = [0, 0, 0], scale = 1, speed = 0.5 }) {
  const meshRef = useRef()
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3
      meshRef.current.rotation.z = state.clock.elapsedTime * speed * 0.2
    }
  })
  return (
    <Float speed={speed} floatIntensity={0.6}>
      <Torus ref={meshRef} args={[1, 0.06, 16, 100]} position={position} rotation={rotation} scale={scale}>
        <meshStandardMaterial
          color="#B89A5A"
          metalness={0.95}
          roughness={0.1}
          envMapIntensity={1.5}
        />
      </Torus>
    </Float>
  )
}

/* ─── Abstract Prism (octahedron) ─── */
function Prism({ position, scale = 0.5, speed = 0.8 }) {
  const meshRef = useRef()
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.25
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.35
    }
  })
  return (
    <Float speed={speed * 1.2} rotationIntensity={0.6} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#0E1D61"
          metalness={0.6}
          roughness={0.3}
          envMapIntensity={1}
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  )
}

/* ─── Particle Field ─── */
function ParticleField({ count = 80 }) {
  const points = useRef()
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 12
  }

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.025
      points.current.rotation.x = state.clock.elapsedTime * 0.01
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#B89A5A"
        size={0.035}
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  )
}

/* ─── Scene ─── */
function Scene({ pointer }) {
  const groupRef = useRef()

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += (pointer.x * 0.12 - groupRef.current.rotation.y) * 0.04
      groupRef.current.rotation.x += (-pointer.y * 0.06 - groupRef.current.rotation.x) * 0.04
    }
  })

  return (
    <group ref={groupRef}>
      <ParticleField count={90} />

      {/* Spheres */}
      <FloatingSphere position={[-3, 1.5, -2]} scale={0.7} color="#B89A5A" speed={1.2} />
      <FloatingSphere position={[3.5, -1, -3]} scale={0.5} color="#0E1D61" speed={0.8} />
      <FloatingSphere position={[0.5, 2.5, -4]} scale={0.35} color="#B89A5A" speed={1.5} />
      <FloatingSphere position={[-2, -2, -2]} scale={0.3} color="#8C7240" speed={1.0} />

      {/* Gold Rings */}
      <GoldRing position={[2, 1.5, -2]} rotation={[Math.PI / 4, 0, Math.PI / 6]} scale={1.2} speed={0.6} />
      <GoldRing position={[-1.5, -1, -3]} rotation={[0, Math.PI / 3, Math.PI / 4]} scale={0.8} speed={0.9} />
      <GoldRing position={[0, 0, -5]} rotation={[Math.PI / 2, 0, 0]} scale={2.0} speed={0.3} />

      {/* Prisms */}
      <Prism position={[-2.5, 0.5, -1.5]} scale={0.45} speed={1.1} />
      <Prism position={[2, -1.5, -2]} scale={0.35} speed={0.7} />
      <Prism position={[0, 3, -3]} scale={0.25} speed={1.4} />
    </group>
  )
}

/* ─── WebGL not available fallback ─── */
function StaticFallback() {
  return (
    <div className="hero3d__fallback" aria-hidden="true">
      <div className="hero3d__fallback-ring hero3d__fallback-ring--1" />
      <div className="hero3d__fallback-ring hero3d__fallback-ring--2" />
      <div className="hero3d__fallback-orb" />
    </div>
  )
}

/* ─── Main Export ─── */
export default function Hero3D({ pointer }) {
  const prefersReduced = useReducedMotion()

  if (prefersReduced) return <StaticFallback />

  return (
    <div className="hero3d" aria-hidden="true">
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 50 }}
          gl={{ alpha: true, antialias: true }}
          dpr={[1, 1.5]}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
          <pointLight position={[-3, 3, 3]} intensity={0.5} color="#B89A5A" />
          <pointLight position={[3, -2, 2]} intensity={0.3} color="#0E1D61" />
          <Environment preset="city" />
          <Scene pointer={pointer || { x: 0, y: 0 }} />
        </Canvas>
      </Suspense>
    </div>
  )
}
