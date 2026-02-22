import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sphere, Ring, Torus } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '@/stores/appStore'

/**
 * 3D Envelope shape
 */
function Envelope3D({ position, isDark, scrollProgress }) {
  const groupRef = useRef()
  const flapRef = useRef()
  const [isOpen, setIsOpen] = useState(false)
  
  const primaryColor = isDark ? '#00d4ff' : '#0284c7'
  const secondaryColor = isDark ? '#a855f7' : '#7c3aed'

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime
      groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.15
      groupRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.1
      
      // Scale based on scroll
      const progress = Math.max(0, Math.min(1, scrollProgress))
      groupRef.current.scale.setScalar(0.5 + progress * 0.5)
    }

    if (flapRef.current) {
      // Animate envelope flap
      const targetRotation = scrollProgress > 0.5 ? -Math.PI * 0.6 : 0
      flapRef.current.rotation.x = THREE.MathUtils.lerp(
        flapRef.current.rotation.x,
        targetRotation,
        0.05
      )
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef} position={position}>
        {/* Envelope body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.5, 0.9, 0.1]} />
          <meshStandardMaterial
            color={primaryColor}
            emissive={primaryColor}
            emissiveIntensity={0.3}
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>

        {/* Envelope flap (top triangle) */}
        <group ref={flapRef} position={[0, 0.45, 0.05]}>
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <coneGeometry args={[0.75, 0.6, 4]} />
            <meshStandardMaterial
              color={secondaryColor}
              emissive={secondaryColor}
              emissiveIntensity={0.4}
              metalness={0.5}
              roughness={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>

        {/* Inner glow when open */}
        <mesh position={[0, 0, 0.1]}>
          <planeGeometry args={[1.3, 0.7]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={scrollProgress > 0.5 ? 0.3 : 0}
          />
        </mesh>

        {/* @ symbol coming out */}
        {scrollProgress > 0.6 && (
          <mesh position={[0, 0.3, 0.2]}>
            <torusGeometry args={[0.15, 0.03, 16, 32]} />
            <meshStandardMaterial
              color={primaryColor}
              emissive={primaryColor}
              emissiveIntensity={0.8}
            />
          </mesh>
        )}
      </group>
    </Float>
  )
}

/**
 * Communication network node
 */
function NetworkNode({ position, color, size = 0.15, delay = 0 }) {
  const ref = useRef()
  const glowRef = useRef()
  const [active, setActive] = useState(false)

  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.elapsedTime + delay
      ref.current.position.y = position[1] + Math.sin(time * 0.8) * 0.1
      
      // Pulse effect
      const pulse = 1 + Math.sin(time * 3) * 0.1
      ref.current.scale.setScalar(pulse * (active ? 1.3 : 1))
    }

    if (glowRef.current) {
      const time = state.clock.elapsedTime + delay
      glowRef.current.material.opacity = 0.15 + Math.sin(time * 2) * 0.1
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
      <group
        position={position}
        onPointerOver={() => setActive(true)}
        onPointerOut={() => setActive(false)}
      >
        <mesh ref={ref}>
          <dodecahedronGeometry args={[size, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={active ? 0.8 : 0.4}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
        <mesh ref={glowRef} scale={2}>
          <sphereGeometry args={[size, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.15}
          />
        </mesh>
      </group>
    </Float>
  )
}

/**
 * Animated connection beam between nodes
 */
function ConnectionBeam({ start, end, color, delay = 0 }) {
  const ref = useRef()
  const particleRef = useRef()
  const progressRef = useRef(0)

  const { midpoint, direction, length, quaternion } = useMemo(() => {
    const startVec = new THREE.Vector3(...start)
    const endVec = new THREE.Vector3(...end)
    const mid = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5)
    const dir = new THREE.Vector3().subVectors(endVec, startVec)
    const len = dir.length()
    dir.normalize()
    
    const quat = new THREE.Quaternion()
    quat.setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir)
    
    return { midpoint: mid, direction: dir, length: len, quaternion: quat }
  }, [start, end])

  useFrame((state, delta) => {
    if (ref.current) {
      const time = state.clock.elapsedTime + delay
      ref.current.material.opacity = 0.1 + Math.sin(time * 2) * 0.08
    }

    // Animate particle along beam
    if (particleRef.current) {
      progressRef.current = (progressRef.current + delta * 0.5) % 1
      const t = progressRef.current
      const pos = new THREE.Vector3(
        start[0] + (end[0] - start[0]) * t,
        start[1] + (end[1] - start[1]) * t,
        start[2] + (end[2] - start[2]) * t
      )
      particleRef.current.position.copy(pos)
      particleRef.current.material.opacity = 0.5 + Math.sin(t * Math.PI) * 0.5
    }
  })

  return (
    <group>
      <mesh ref={ref} position={midpoint} quaternion={quaternion}>
        <cylinderGeometry args={[0.01, 0.01, length, 8]} rotation={[0, 0, Math.PI / 2]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
        />
      </mesh>
      
      {/* Traveling particle */}
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  )
}

/**
 * Signal waves emanating from center
 */
function SignalWaves({ isDark }) {
  const wave1Ref = useRef()
  const wave2Ref = useRef()
  const wave3Ref = useRef()
  const primaryColor = isDark ? '#00d4ff' : '#0284c7'

  useFrame((state) => {
    const time = state.clock.elapsedTime

    const animateWave = (ref, offset) => {
      if (ref.current) {
        const scale = 1 + ((time * 0.3 + offset) % 1) * 2
        ref.current.scale.setScalar(scale)
        ref.current.material.opacity = 0.3 * (1 - ((time * 0.3 + offset) % 1))
      }
    }

    animateWave(wave1Ref, 0)
    animateWave(wave2Ref, 0.33)
    animateWave(wave3Ref, 0.66)
  })

  return (
    <group>
      <Ring ref={wave1Ref} args={[0.8, 0.85, 32]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color={primaryColor} transparent opacity={0.3} side={THREE.DoubleSide} />
      </Ring>
      <Ring ref={wave2Ref} args={[0.8, 0.85, 32]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color={primaryColor} transparent opacity={0.3} side={THREE.DoubleSide} />
      </Ring>
      <Ring ref={wave3Ref} args={[0.8, 0.85, 32]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color={primaryColor} transparent opacity={0.3} side={THREE.DoubleSide} />
      </Ring>
    </group>
  )
}

/**
 * Floating message bubbles
 */
function MessageBubble({ position, size = 0.2, delay = 0, isDark }) {
  const ref = useRef()
  const primaryColor = isDark ? '#00d4ff' : '#0284c7'

  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.elapsedTime + delay
      ref.current.position.y = position[1] + Math.sin(time * 0.6) * 0.2
      ref.current.rotation.z = Math.sin(time * 0.3) * 0.1
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.4}>
      <group ref={ref} position={position}>
        {/* Bubble body */}
        <mesh>
          <sphereGeometry args={[size, 16, 16]} />
          <meshStandardMaterial
            color={primaryColor}
            emissive={primaryColor}
            emissiveIntensity={0.3}
            metalness={0.4}
            roughness={0.3}
            transparent
            opacity={0.7}
          />
        </mesh>
        {/* Three dots */}
        <group position={[0, 0, size + 0.01]}>
          <mesh position={[-0.05, 0, 0]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.05, 0, 0]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      </group>
    </Float>
  )
}

/**
 * Main Contact Scene
 */
export default function ContactScene({ scrollProgress = 0 }) {
  const { theme } = useAppStore()
  const isDark = theme === 'dark'
  const groupRef = useRef()

  const primaryColor = isDark ? '#00d4ff' : '#0284c7'
  const secondaryColor = isDark ? '#a855f7' : '#7c3aed'
  const accentColor = isDark ? '#10b981' : '#059669'

  // Network node positions
  const nodes = [
    { position: [-2, 1, 0], color: primaryColor },
    { position: [2, 0.5, 0], color: secondaryColor },
    { position: [-1.5, -1, 0.5], color: accentColor },
    { position: [1.5, -0.8, -0.3], color: primaryColor },
    { position: [0, 1.5, 0.3], color: secondaryColor },
  ]

  // Connections between nodes
  const connections = [
    { start: [0, 0, 0], end: [-2, 1, 0] },
    { start: [0, 0, 0], end: [2, 0.5, 0] },
    { start: [0, 0, 0], end: [-1.5, -1, 0.5] },
    { start: [0, 0, 0], end: [1.5, -0.8, -0.3] },
    { start: [0, 0, 0], end: [0, 1.5, 0.3] },
  ]

  useFrame(() => {
    if (groupRef.current) {
      // Entry/exit animation
      const progress = Math.max(0, Math.min(1, scrollProgress))
      const entryProgress = Math.min(1, progress * 2.5)
      const exitProgress = progress > 0.8 ? (progress - 0.8) / 0.2 : 0
      
      const scale = entryProgress * (1 - exitProgress * 0.3)
      groupRef.current.scale.setScalar(Math.max(0.1, scale))
      
      groupRef.current.rotation.y = progress * 0.3
      groupRef.current.position.y = (1 - entryProgress) * 1.5
    }
  })

  return (
    <group ref={groupRef}>
      {/* Central envelope */}
      <Envelope3D position={[0, 0, 0]} isDark={isDark} scrollProgress={scrollProgress} />

      {/* Signal waves */}
      <SignalWaves isDark={isDark} />

      {/* Network nodes */}
      {nodes.map((node, i) => (
        <NetworkNode
          key={i}
          position={node.position}
          color={node.color}
          delay={i * 0.5}
        />
      ))}

      {/* Connection beams */}
      {connections.map((conn, i) => (
        <ConnectionBeam
          key={i}
          start={conn.start}
          end={conn.end}
          color={primaryColor}
          delay={i * 0.3}
        />
      ))}

      {/* Message bubbles */}
      <MessageBubble position={[-2.5, 0.3, 0]} size={0.15} delay={0} isDark={isDark} />
      <MessageBubble position={[2.3, 1, 0]} size={0.12} delay={1} isDark={isDark} />
      <MessageBubble position={[-1, 1.8, 0]} size={0.1} delay={2} isDark={isDark} />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} intensity={0.8} color={primaryColor} />
      <pointLight position={[-3, -3, 2]} intensity={0.5} color={secondaryColor} />
    </group>
  )
}
