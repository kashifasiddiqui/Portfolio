import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '@/stores/appStore'

export default function ParticleField({ count: propCount, color = '#00d4ff' }) {
  const pointsRef = useRef()
  const { performanceMode } = useAppStore()
  
  // Adjust particle count based on performance
  const count = propCount || (performanceMode === 'low' ? 500 : performanceMode === 'medium' ? 1500 : 3000)

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const colors = new Float32Array(count * 3)

    const colorPalette = [
      new THREE.Color('#00d4ff'),
      new THREE.Color('#22d3ee'),
      new THREE.Color('#a855f7'),
      new THREE.Color('#0ea5e9')
    ]

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Distribute particles in a large box
      positions[i3] = (Math.random() - 0.5) * 50
      positions[i3 + 1] = (Math.random() - 0.5) * 50
      positions[i3 + 2] = (Math.random() - 0.5) * 50

      // Random velocities
      velocities[i3] = (Math.random() - 0.5) * 0.02
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02

      // Random sizes
      sizes[i] = Math.random() * 2 + 0.5

      // Random colors from palette
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
    }

    return { positions, velocities, sizes, colors }
  }, [count])

  useFrame((state, delta) => {
    if (!pointsRef.current) return

    const positions = pointsRef.current.geometry.attributes.position.array
    const { velocities } = particles

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Update positions
      positions[i3] += velocities[i3]
      positions[i3 + 1] += velocities[i3 + 1]
      positions[i3 + 2] += velocities[i3 + 2]

      // Wrap around boundaries
      if (positions[i3] > 25) positions[i3] = -25
      if (positions[i3] < -25) positions[i3] = 25
      if (positions[i3 + 1] > 25) positions[i3 + 1] = -25
      if (positions[i3 + 1] < -25) positions[i3 + 1] = 25
      if (positions[i3 + 2] > 25) positions[i3 + 2] = -25
      if (positions[i3 + 2] < -25) positions[i3 + 2] = 25
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true

    // Subtle rotation
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
  })

  return (
    <points ref={pointsRef}>
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
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// Animated grid plane for background
export function GridPlane({ size = 50, divisions = 50, color = '#00d4ff' }) {
  const gridRef = useRef()

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.material.opacity = 0.1 + Math.sin(state.clock.elapsedTime) * 0.05
    }
  })

  return (
    <gridHelper
      ref={gridRef}
      args={[size, divisions, color, color]}
      position={[0, -5, 0]}
      rotation={[0, 0, 0]}
    >
      <meshBasicMaterial attach="material" color={color} transparent opacity={0.1} />
    </gridHelper>
  )
}

// Floating data streams effect
export function DataStreams({ count = 20 }) {
  const streamsRef = useRef([])
  const { performanceMode } = useAppStore()
  
  const streamCount = performanceMode === 'low' ? 10 : count

  const streams = useMemo(() => {
    return Array.from({ length: streamCount }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 30,
        Math.random() * 20 - 10,
        (Math.random() - 0.5) * 30
      ],
      speed: 0.02 + Math.random() * 0.03,
      length: 2 + Math.random() * 3,
      color: ['#00d4ff', '#22d3ee', '#a855f7'][Math.floor(Math.random() * 3)]
    }))
  }, [streamCount])

  useFrame((state, delta) => {
    streamsRef.current.forEach((stream, i) => {
      if (stream) {
        stream.position.y -= streams[i].speed
        if (stream.position.y < -10) {
          stream.position.y = 10
        }
      }
    })
  })

  return (
    <group>
      {streams.map((stream, index) => (
        <mesh
          key={index}
          ref={(el) => (streamsRef.current[index] = el)}
          position={stream.position}
        >
          <boxGeometry args={[0.02, stream.length, 0.02]} />
          <meshBasicMaterial color={stream.color} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  )
}
