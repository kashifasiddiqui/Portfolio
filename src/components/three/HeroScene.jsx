import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '@/stores/appStore'

/**
 * Neural Network Node - Pulsing sphere with glow
 */
function NeuralNode({ position, color = '#00d4ff', size = 0.06, delay = 0 }) {
  const meshRef = useRef()
  const glowRef = useRef()
  const pulseOffset = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state) => {
    const time = state.clock.elapsedTime + pulseOffset
    const pulse = 0.8 + Math.sin(time * 1.5 + delay) * 0.2
    
    if (meshRef.current) {
      meshRef.current.scale.setScalar(pulse)
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.15 + Math.sin(time * 1.5 + delay) * 0.1
    }
  })

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh ref={glowRef} scale={2.5}>
        <sphereGeometry args={[size, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>
    </group>
  )
}

/**
 * Neural Connection Line - Animated curve between nodes
 */
function NeuralConnection({ start, end, color = '#00d4ff', delay = 0 }) {
  const lineRef = useRef()
  
  const { curve, points } = useMemo(() => {
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
    // Add slight curve upward
    mid.y += 0.2 + Math.random() * 0.3
    mid.x += (Math.random() - 0.5) * 0.2
    
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end)
    return { curve, points: curve.getPoints(16) }
  }, [start, end])

  useFrame((state) => {
    if (lineRef.current) {
      const pulse = 0.15 + Math.sin(state.clock.elapsedTime * 2 + delay) * 0.1
      lineRef.current.material.opacity = pulse
    }
  })

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={0.2} />
    </line>
  )
}

/**
 * Ambient Particles - Floating dust particles
 */
function AmbientParticles({ count = 100 }) {
  const pointsRef = useRef()
  const { performanceMode } = useAppStore()
  
  const particleCount = performanceMode === 'low' ? 50 : performanceMode === 'medium' ? 80 : count

  const { positions, velocities, sizes } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      // Spread particles in a spherical volume
      const radius = 3 + Math.random() * 4
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)

      // Very slow drift velocities
      velocities[i3] = (Math.random() - 0.5) * 0.002
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.002
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.002

      sizes[i] = Math.random() * 0.02 + 0.01
    }

    return { positions, velocities, sizes }
  }, [particleCount])

  useFrame((state, delta) => {
    if (!pointsRef.current) return

    const posArray = pointsRef.current.geometry.attributes.position.array

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // Update positions with velocity
      posArray[i3] += velocities[i3]
      posArray[i3 + 1] += velocities[i3 + 1]
      posArray[i3 + 2] += velocities[i3 + 2]

      // Soft boundary - reverse velocity near edges
      const dist = Math.sqrt(
        posArray[i3] ** 2 + posArray[i3 + 1] ** 2 + posArray[i3 + 2] ** 2
      )
      
      if (dist > 7 || dist < 2) {
        velocities[i3] *= -1
        velocities[i3 + 1] *= -1
        velocities[i3 + 2] *= -1
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
    
    // Gentle rotation
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#00d4ff"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/**
 * Central Brain Core - Subtle glowing sphere
 */
function BrainCore() {
  const coreRef = useRef()
  const glowRef = useRef()
  const ringsRef = useRef()

  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.1
      coreRef.current.rotation.x = Math.sin(time * 0.2) * 0.1
    }
    
    if (glowRef.current) {
      const pulse = 0.08 + Math.sin(time * 1.2) * 0.03
      glowRef.current.material.opacity = pulse
    }

    if (ringsRef.current) {
      ringsRef.current.rotation.z = time * 0.15
      ringsRef.current.rotation.x = Math.sin(time * 0.3) * 0.2
    }
  })

  return (
    <group>
      {/* Inner core */}
      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[0.6, 1]} />
          <meshBasicMaterial
            color="#0a1628"
            wireframe
            transparent
            opacity={0.6}
          />
        </mesh>
        
        {/* Core glow */}
        <mesh ref={glowRef} scale={1.2}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshBasicMaterial
            color="#00d4ff"
            transparent
            opacity={0.08}
            side={THREE.BackSide}
          />
        </mesh>
      </Float>

      {/* Orbital ring */}
      <mesh ref={ringsRef}>
        <torusGeometry args={[1.2, 0.008, 8, 64]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.3} />
      </mesh>

      {/* Second orbital ring */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.4, 0.005, 8, 64]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

/**
 * Main Hero Scene Component
 */
export default function HeroScene({ scrollProgress = 0 }) {
  const groupRef = useRef()
  const { camera } = useThree()
  const { performanceMode } = useAppStore()
  
  // Generate neural network nodes
  const nodes = useMemo(() => {
    const nodeCount = performanceMode === 'low' ? 12 : performanceMode === 'medium' ? 20 : 28
    const positions = []
    
    // Create nodes in layered shells
    for (let i = 0; i < nodeCount; i++) {
      const layer = Math.floor(i / 8)
      const radius = 1.5 + layer * 0.6
      const phi = Math.acos(-1 + (2 * (i % 8 + 0.5)) / 8)
      const theta = (i % 8) * Math.PI * 0.25 + layer * 0.5
      
      positions.push({
        position: new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        ),
        color: ['#00d4ff', '#22d3ee', '#a855f7', '#0ea5e9'][i % 4],
        size: 0.04 + Math.random() * 0.03,
        delay: i * 0.2
      })
    }
    
    return positions
  }, [performanceMode])

  // Generate connections between nearby nodes
  const connections = useMemo(() => {
    const conns = []
    const maxConnections = performanceMode === 'low' ? 15 : performanceMode === 'medium' ? 25 : 35
    let connCount = 0
    
    for (let i = 0; i < nodes.length && connCount < maxConnections; i++) {
      for (let j = i + 1; j < nodes.length && connCount < maxConnections; j++) {
        const dist = nodes[i].position.distanceTo(nodes[j].position)
        if (dist < 1.2 && dist > 0.3) {
          conns.push({
            start: nodes[i].position,
            end: nodes[j].position,
            color: nodes[i].color,
            delay: connCount * 0.3
          })
          connCount++
        }
      }
    }
    
    return conns
  }, [nodes, performanceMode])

  // Cinematic camera movement based on scroll
  useEffect(() => {
    const targetZ = 5 - scrollProgress * 2
    const targetY = scrollProgress * 1.5
    
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05)
  }, [scrollProgress, camera])

  // Ambient scene animation
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Very slow rotation
      groupRef.current.rotation.y += delta * 0.03
      
      // Gentle floating motion
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Central brain visualization */}
      <BrainCore />

      {/* Neural network nodes */}
      {nodes.map((node, index) => (
        <NeuralNode
          key={`node-${index}`}
          position={node.position}
          color={node.color}
          size={node.size}
          delay={node.delay}
        />
      ))}

      {/* Neural connections */}
      {connections.map((conn, index) => (
        <NeuralConnection
          key={`conn-${index}`}
          start={conn.start}
          end={conn.end}
          color={conn.color}
          delay={conn.delay}
        />
      ))}

      {/* Ambient floating particles */}
      <AmbientParticles />
    </group>
  )
}
