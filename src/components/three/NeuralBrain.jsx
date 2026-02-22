import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Float, Trail } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '@/stores/appStore'

// Neural connection line component
function NeuralConnection({ start, end, color = '#00d4ff' }) {
  const lineRef = useRef()
  
  const curve = useMemo(() => {
    const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
    midPoint.y += 0.3
    return new THREE.QuadraticBezierCurve3(start, midPoint, end)
  }, [start, end])

  const points = useMemo(() => curve.getPoints(20), [curve])
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points])

  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
  })

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={0.5} linewidth={1} />
    </line>
  )
}

// Neural node component
function NeuralNode({ position, color = '#00d4ff', size = 0.08, pulseSpeed = 1 }) {
  const meshRef = useRef()
  const glowRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.2
      meshRef.current.scale.setScalar(scale)
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.2
    }
  })

  return (
    <group position={position}>
      {/* Core node */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      
      {/* Glow effect */}
      <mesh ref={glowRef} scale={2}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

// Main Neural Brain component
export default function NeuralBrain({ scrollProgress = 0 }) {
  const groupRef = useRef()
  const { performanceMode } = useAppStore()
  
  // Generate neural network nodes
  const nodes = useMemo(() => {
    const nodeCount = performanceMode === 'low' ? 15 : performanceMode === 'medium' ? 25 : 40
    const positions = []
    
    // Create nodes in a brain-like spherical pattern
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount)
      const theta = Math.sqrt(nodeCount * Math.PI) * phi
      
      const radius = 1.2 + Math.random() * 0.3
      const x = radius * Math.cos(theta) * Math.sin(phi)
      const y = radius * Math.sin(theta) * Math.sin(phi)
      const z = radius * Math.cos(phi)
      
      positions.push({
        position: new THREE.Vector3(x, y, z),
        color: ['#00d4ff', '#22d3ee', '#a855f7', '#f472b6'][Math.floor(Math.random() * 4)],
        size: 0.05 + Math.random() * 0.05,
        pulseSpeed: 0.5 + Math.random() * 2
      })
    }
    
    return positions
  }, [performanceMode])

  // Generate connections between nearby nodes
  const connections = useMemo(() => {
    const conns = []
    const maxConnections = performanceMode === 'low' ? 20 : performanceMode === 'medium' ? 40 : 60
    
    for (let i = 0; i < Math.min(nodes.length, maxConnections); i++) {
      // Connect to 1-3 nearby nodes
      const connectCount = Math.floor(Math.random() * 3) + 1
      
      for (let j = 0; j < connectCount; j++) {
        const targetIndex = (i + j + 1) % nodes.length
        if (targetIndex !== i) {
          const distance = nodes[i].position.distanceTo(nodes[targetIndex].position)
          if (distance < 1.5) {
            conns.push({
              start: nodes[i].position,
              end: nodes[targetIndex].position,
              color: nodes[i].color
            })
          }
        }
      }
    }
    
    return conns
  }, [nodes, performanceMode])

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Gentle rotation
      groupRef.current.rotation.y += delta * 0.1
      
      // Respond to scroll
      groupRef.current.rotation.x = scrollProgress * Math.PI * 0.5
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Central brain sphere */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        <Sphere args={[1, 64, 64]}>
          <MeshDistortMaterial
            color="#0a0f1a"
            attach="material"
            distort={0.3}
            speed={2}
            roughness={0.2}
            metalness={0.8}
            transparent
            opacity={0.9}
          />
        </Sphere>
        
        {/* Inner glow */}
        <Sphere args={[0.98, 32, 32]}>
          <meshBasicMaterial
            color="#00d4ff"
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </Sphere>
      </Float>

      {/* Neural nodes */}
      {nodes.map((node, index) => (
        <NeuralNode
          key={index}
          position={node.position}
          color={node.color}
          size={node.size}
          pulseSpeed={node.pulseSpeed}
        />
      ))}

      {/* Neural connections */}
      {connections.map((conn, index) => (
        <NeuralConnection
          key={index}
          start={conn.start}
          end={conn.end}
          color={conn.color}
        />
      ))}

      {/* Ambient particles around the brain */}
      <AmbientParticles count={performanceMode === 'low' ? 50 : 150} />
    </group>
  )
}

// Ambient particles floating around
function AmbientParticles({ count = 150 }) {
  const particlesRef = useRef()
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    const colorPalette = [
      new THREE.Color('#00d4ff'),
      new THREE.Color('#22d3ee'),
      new THREE.Color('#a855f7')
    ]
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      // Spherical distribution
      const radius = 2 + Math.random() * 1.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)
      
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
    }
    
    return { positions, colors }
  }, [count])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <points ref={particlesRef}>
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
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}
