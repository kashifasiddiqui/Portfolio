import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sphere, Ring, Trail } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '@/stores/appStore'

/**
 * DNA-like helix representing growth and learning journey
 */
function DNAHelix({ scrollProgress = 0, isDark }) {
  const groupRef = useRef()
  const primaryColor = isDark ? '#00d4ff' : '#0284c7'
  const secondaryColor = isDark ? '#a855f7' : '#7c3aed'

  // Generate helix points
  const { strand1, strand2, connections } = useMemo(() => {
    const s1 = []
    const s2 = []
    const conn = []
    const segments = 20
    const height = 6
    const radius = 0.8

    for (let i = 0; i < segments; i++) {
      const t = i / segments
      const y = (t - 0.5) * height
      const angle = t * Math.PI * 4

      s1.push({
        position: [Math.cos(angle) * radius, y, Math.sin(angle) * radius],
        index: i
      })
      s2.push({
        position: [Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius],
        index: i
      })

      if (i % 3 === 0) {
        conn.push({
          start: [Math.cos(angle) * radius, y, Math.sin(angle) * radius],
          end: [Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius],
          index: i
        })
      }
    }

    return { strand1: s1, strand2: s2, connections: conn }
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime
      groupRef.current.rotation.y = time * 0.2
      // Scroll-based scale and position
      const progress = Math.max(0, Math.min(1, scrollProgress))
      const scale = 0.3 + progress * 0.7
      groupRef.current.scale.setScalar(scale)
      groupRef.current.position.y = (1 - progress) * 2
      groupRef.current.material && (groupRef.current.material.opacity = progress)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Strand 1 spheres */}
      {strand1.map((point, i) => (
        <Float
          key={`s1-${i}`}
          speed={2}
          rotationIntensity={0.2}
          floatIntensity={0.3}
        >
          <mesh position={point.position}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color={primaryColor}
              emissive={primaryColor}
              emissiveIntensity={0.5}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        </Float>
      ))}

      {/* Strand 2 spheres */}
      {strand2.map((point, i) => (
        <Float
          key={`s2-${i}`}
          speed={2}
          rotationIntensity={0.2}
          floatIntensity={0.3}
        >
          <mesh position={point.position}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color={secondaryColor}
              emissive={secondaryColor}
              emissiveIntensity={0.5}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        </Float>
      ))}

      {/* Connections */}
      {connections.map((conn, i) => (
        <ConnectionBar
          key={`conn-${i}`}
          start={conn.start}
          end={conn.end}
          color={i % 2 === 0 ? primaryColor : secondaryColor}
        />
      ))}

      {/* Central glow */}
      <Sphere args={[0.3, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={0.15}
        />
      </Sphere>
    </group>
  )
}

function ConnectionBar({ start, end, color }) {
  const ref = useRef()

  const { position, rotation, length } = useMemo(() => {
    const startVec = new THREE.Vector3(...start)
    const endVec = new THREE.Vector3(...end)
    const midpoint = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5)
    const direction = new THREE.Vector3().subVectors(endVec, startVec)
    const len = direction.length()
    direction.normalize()

    const quaternion = new THREE.Quaternion()
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction)
    const euler = new THREE.Euler().setFromQuaternion(quaternion)

    return {
      position: [midpoint.x, midpoint.y, midpoint.z],
      rotation: [euler.x, euler.y, euler.z],
      length: len
    }
  }, [start, end])

  useFrame((state) => {
    if (ref.current) {
      ref.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
  })

  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <cylinderGeometry args={[0.02, 0.02, length, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        transparent
        opacity={0.4}
      />
    </mesh>
  )
}

/**
 * Floating time nodes representing milestones
 */
function TimeNode({ position, delay, isDark }) {
  const ref = useRef()
  const primaryColor = isDark ? '#00d4ff' : '#0284c7'

  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.elapsedTime + delay
      ref.current.rotation.x = Math.sin(time * 0.5) * 0.3
      ref.current.rotation.y = time * 0.3
      ref.current.position.y = position[1] + Math.sin(time * 0.8) * 0.2
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={ref} position={position}>
        <Ring args={[0.15, 0.2, 32]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial
            color={primaryColor}
            emissive={primaryColor}
            emissiveIntensity={0.6}
            metalness={0.9}
            roughness={0.1}
            side={THREE.DoubleSide}
          />
        </Ring>
        <Sphere args={[0.08, 16, 16]}>
          <meshStandardMaterial
            color={primaryColor}
            emissive={primaryColor}
            emissiveIntensity={0.8}
          />
        </Sphere>
      </group>
    </Float>
  )
}

/**
 * Ambient particles
 */
function TimelineParticles({ count = 50, isDark }) {
  const ref = useRef()

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4
    }
    return positions
  }, [count])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={isDark ? '#00d4ff' : '#0284c7'}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

/**
 * Main Timeline Scene
 */
export default function TimelineScene({ scrollProgress = 0 }) {
  const { theme } = useAppStore()
  const isDark = theme === 'dark'
  const groupRef = useRef()

  useFrame(() => {
    if (groupRef.current) {
      // Entry/exit animation based on scroll
      const progress = Math.max(0, Math.min(1, scrollProgress))
      const opacity = progress < 0.1 ? progress * 10 : progress > 0.9 ? (1 - progress) * 10 : 1
      groupRef.current.children.forEach(child => {
        if (child.material) {
          child.material.opacity = opacity
        }
      })
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main DNA helix */}
      <DNAHelix scrollProgress={scrollProgress} isDark={isDark} />

      {/* Time milestone nodes */}
      <TimeNode position={[-2, 1.5, 0]} delay={0} isDark={isDark} />
      <TimeNode position={[2, 0, 0.5]} delay={1} isDark={isDark} />
      <TimeNode position={[-1.5, -1.5, -0.5]} delay={2} isDark={isDark} />
      <TimeNode position={[1.8, -0.8, 0]} delay={3} isDark={isDark} />

      {/* Ambient particles */}
      <TimelineParticles count={40} isDark={isDark} />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} intensity={0.8} color={isDark ? '#00d4ff' : '#0284c7'} />
      <pointLight position={[-3, -3, -3]} intensity={0.4} color={isDark ? '#a855f7' : '#7c3aed'} />
    </group>
  )
}
