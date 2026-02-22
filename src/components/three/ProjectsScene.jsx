import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Text, RoundedBox, Edges } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '@/stores/appStore'

/**
 * Floating code bracket
 */
function CodeBracket({ position, rotation, scale = 1, type = 'open', isDark, delay = 0 }) {
  const ref = useRef()
  const primaryColor = isDark ? '#00d4ff' : '#0284c7'

  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.elapsedTime + delay
      ref.current.rotation.y = Math.sin(time * 0.3) * 0.2
      ref.current.rotation.x = Math.cos(time * 0.4) * 0.1
      ref.current.position.y = position[1] + Math.sin(time * 0.5) * 0.15
    }
  })

  const bracket = type === 'open' ? '{' : '}'

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
      <group ref={ref} position={position} rotation={rotation} scale={scale}>
        <Text
          fontSize={1.2}
          color={primaryColor}
          anchorX="center"
          anchorY="middle"
          font="/fonts/JetBrainsMono-Bold.ttf"
        >
          {bracket}
          <meshStandardMaterial
            color={primaryColor}
            emissive={primaryColor}
            emissiveIntensity={0.5}
          />
        </Text>
      </group>
    </Float>
  )
}

/**
 * Floating project cube with wireframe
 */
function ProjectCube({ position, color, delay = 0, size = 0.5 }) {
  const ref = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.elapsedTime + delay
      ref.current.rotation.x = time * 0.3
      ref.current.rotation.y = time * 0.4
      ref.current.position.y = position[1] + Math.sin(time * 0.6) * 0.2
      
      const targetScale = hovered ? 1.2 : 1
      ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group
        ref={ref}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <RoundedBox args={[size, size, size]} radius={0.05} smoothness={4}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 0.8 : 0.3}
            metalness={0.7}
            roughness={0.2}
            transparent
            opacity={0.8}
          />
        </RoundedBox>
        <RoundedBox args={[size, size, size]} radius={0.05} smoothness={4}>
          <Edges
            linewidth={2}
            threshold={15}
            color={color}
          />
        </RoundedBox>
      </group>
    </Float>
  )
}

/**
 * Animated code line
 */
function CodeLine({ position, width, isDark, delay = 0 }) {
  const ref = useRef()
  const primaryColor = isDark ? '#00d4ff' : '#0284c7'

  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.elapsedTime + delay
      ref.current.material.opacity = 0.3 + Math.sin(time * 2) * 0.2
      ref.current.scale.x = 0.8 + Math.sin(time * 1.5) * 0.2
    }
  })

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[width, 0.03, 0.01]} />
      <meshStandardMaterial
        color={primaryColor}
        emissive={primaryColor}
        emissiveIntensity={0.5}
        transparent
        opacity={0.5}
      />
    </mesh>
  )
}

/**
 * Floating octahedron representing ideas
 */
function IdeaGem({ position, color, delay = 0 }) {
  const ref = useRef()

  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.elapsedTime + delay
      ref.current.rotation.x = time * 0.5
      ref.current.rotation.y = time * 0.7
      ref.current.position.y = position[1] + Math.sin(time * 0.8) * 0.3
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={ref} position={position}>
        <octahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>
    </Float>
  )
}

/**
 * Orbiting particles
 */
function OrbitingParticles({ radius = 2, count = 30, isDark }) {
  const ref = useRef()
  const color = isDark ? '#00d4ff' : '#0284c7'

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      positions[i * 3] = Math.cos(angle) * radius * (0.8 + Math.random() * 0.4)
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2
      positions[i * 3 + 2] = Math.sin(angle) * radius * (0.8 + Math.random() * 0.4)
    }
    return positions
  }, [count, radius])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.1
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
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
        size={0.05}
        color={color}
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  )
}

/**
 * Connecting lines between elements
 */
function ConnectionLines({ isDark }) {
  const ref = useRef()
  const primaryColor = isDark ? '#00d4ff' : '#0284c7'

  const points = useMemo(() => {
    const pts = []
    const connections = [
      [[-2, 1, 0], [0, 0, 0]],
      [[0, 0, 0], [2, -0.5, 0]],
      [[0, 0, 0], [-1, -1.5, 0]],
      [[0, 0, 0], [1.5, 1, 0]],
    ]
    return connections
  }, [])

  useFrame((state) => {
    if (ref.current) {
      ref.current.children.forEach((child, i) => {
        if (child.material) {
          child.material.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.1
        }
      })
    }
  })

  return (
    <group ref={ref}>
      {points.map((conn, i) => {
        const start = new THREE.Vector3(...conn[0])
        const end = new THREE.Vector3(...conn[1])
        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
        const direction = new THREE.Vector3().subVectors(end, start)
        const length = direction.length()
        direction.normalize()
        
        const quaternion = new THREE.Quaternion()
        quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), direction)
        
        return (
          <mesh key={i} position={mid} quaternion={quaternion}>
            <boxGeometry args={[length, 0.01, 0.01]} />
            <meshBasicMaterial
              color={primaryColor}
              transparent
              opacity={0.15}
            />
          </mesh>
        )
      })}
    </group>
  )
}

/**
 * Main Projects Scene
 */
export default function ProjectsScene({ scrollProgress = 0 }) {
  const { theme } = useAppStore()
  const isDark = theme === 'dark'
  const groupRef = useRef()

  const projectColors = ['#00d4ff', '#a855f7', '#10b981', '#f59e0b']

  useFrame(() => {
    if (groupRef.current) {
      // Entry/exit animation
      const progress = Math.max(0, Math.min(1, scrollProgress))
      const entryProgress = Math.min(1, progress * 3)
      const exitProgress = progress > 0.7 ? (progress - 0.7) / 0.3 : 0
      const scale = entryProgress * (1 - exitProgress * 0.5)
      
      groupRef.current.scale.setScalar(Math.max(0.1, scale))
      groupRef.current.rotation.y = progress * 0.5
      groupRef.current.position.y = (1 - entryProgress) * 2 - exitProgress * 1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Floating project cubes */}
      <ProjectCube position={[-2, 0.5, 0]} color={projectColors[0]} delay={0} />
      <ProjectCube position={[2, 0, 0.5]} color={projectColors[1]} delay={1} size={0.4} />
      <ProjectCube position={[-1.5, -1, -0.3]} color={projectColors[2]} delay={2} size={0.35} />
      <ProjectCube position={[1.5, 1, -0.2]} color={projectColors[3]} delay={3} size={0.45} />

      {/* Code brackets */}
      <CodeBracket position={[-3, 0, 0]} rotation={[0, 0.3, 0]} isDark={isDark} type="open" delay={0.5} />
      <CodeBracket position={[3, -0.5, 0]} rotation={[0, -0.3, 0]} isDark={isDark} type="close" delay={1} />

      {/* Idea gems */}
      <IdeaGem position={[0, 2, 0]} color={isDark ? '#00d4ff' : '#0284c7'} delay={0} />
      <IdeaGem position={[-0.5, -2, 0.5]} color={isDark ? '#a855f7' : '#7c3aed'} delay={1.5} />

      {/* Code lines */}
      <group position={[0, 0, -1]}>
        <CodeLine position={[-1, 0.5, 0]} width={1.5} isDark={isDark} delay={0} />
        <CodeLine position={[0.5, 0.2, 0]} width={1} isDark={isDark} delay={0.3} />
        <CodeLine position={[-0.5, -0.1, 0]} width={1.2} isDark={isDark} delay={0.6} />
        <CodeLine position={[0.2, -0.4, 0]} width={0.8} isDark={isDark} delay={0.9} />
      </group>

      {/* Orbiting particles */}
      <OrbitingParticles radius={3} count={40} isDark={isDark} />

      {/* Connection lines */}
      <ConnectionLines isDark={isDark} />

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1} color={isDark ? '#00d4ff' : '#0284c7'} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color={isDark ? '#a855f7' : '#7c3aed'} />
    </group>
  )
}
