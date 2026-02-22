import { useRef, useMemo, useState, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text, Billboard, Ring, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { usePortfolioStore, useAppStore } from '@/stores/appStore'

/**
 * Enhanced Skill Node with orbital rings and pulse effects
 */
function SkillNode({ skill, position, index, onHover, activeCategory, isDark }) {
  const groupRef = useRef()
  const meshRef = useRef()
  const glowRef = useRef()
  const ringRef = useRef()
  const [hovered, setHovered] = useState(false)
  
  const isActive = !activeCategory || skill.category === activeCategory
  const baseY = useRef(position[1])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (groupRef.current) {
      // Orbital float animation - each node has unique phase
      const floatY = Math.sin(time * 0.8 + index * 0.5) * 0.15
      const floatX = Math.cos(time * 0.6 + index * 0.3) * 0.05
      groupRef.current.position.y = baseY.current + floatY
      groupRef.current.position.x = position[0] + floatX
    }
    
    if (meshRef.current) {
      // Smooth scale transition
      const targetScale = hovered ? 1.4 : (isActive ? 1 : 0.7)
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale), 
        0.08
      )
      // Rotation on hover
      if (hovered) {
        meshRef.current.rotation.y += 0.02
        meshRef.current.rotation.x += 0.01
      }
    }
    
    if (glowRef.current) {
      // Pulsing glow
      const pulseIntensity = hovered ? 0.6 : 0.15 + Math.sin(time * 2 + index) * 0.1
      glowRef.current.material.opacity = isActive ? pulseIntensity : pulseIntensity * 0.3
    }

    if (ringRef.current) {
      // Spinning orbital ring
      ringRef.current.rotation.x = Math.PI * 0.5 + Math.sin(time + index) * 0.2
      ringRef.current.rotation.z = time * 0.5
      ringRef.current.material.opacity = hovered ? 0.8 : 0.2
    }
  })

  const handlePointerOver = useCallback(() => {
    setHovered(true)
    onHover?.(skill)
    document.body.style.cursor = 'pointer'
  }, [skill, onHover])

  const handlePointerOut = useCallback(() => {
    setHovered(false)
    onHover?.(null)
    document.body.style.cursor = 'auto'
  }, [onHover])

  // Size based on skill level with better scaling
  const size = 0.12 + (skill.level / 100) * 0.18

  return (
    <group ref={groupRef} position={position}>
      {/* Orbital ring */}
      <Ring
        ref={ringRef}
        args={[size * 1.3, size * 1.5, 32]}
        rotation={[Math.PI * 0.5, 0, 0]}
      >
        <meshBasicMaterial
          color={skill.color}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </Ring>

      {/* Main sphere - dodecahedron for more interesting shape */}
      <mesh 
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <dodecahedronGeometry args={[size, 0]} />
        <meshStandardMaterial
          color={skill.color}
          emissive={skill.color}
          emissiveIntensity={hovered ? 0.8 : 0.3}
          metalness={0.6}
          roughness={0.2}
          transparent
          opacity={isActive ? 1 : 0.4}
        />
      </mesh>

      {/* Multi-layer glow effect */}
      <mesh ref={glowRef} scale={2.2}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial
          color={skill.color}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Inner glow */}
      <mesh scale={1.5}>
        <sphereGeometry args={[size, 12, 12]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={hovered ? 0.15 : 0.05}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Skill label */}
      <Billboard position={[0, size + 0.25, 0]}>
        <Text
          fontSize={hovered ? 0.14 : 0.1}
          color={hovered 
            ? (isDark ? '#ffffff' : '#1e293b') 
            : (isActive 
              ? (isDark ? '#aaaaaa' : '#334155') 
              : (isDark ? '#555555' : '#94a3b8')
            )
          }
          anchorX="center"
          anchorY="middle"
          outlineWidth={hovered ? 0.01 : 0.005}
          outlineColor={isDark ? '#000000' : '#ffffff'}
        >
          {skill.name}
        </Text>
        {hovered && (
          <Text
            position={[0, -0.18, 0]}
            fontSize={0.1}
            color={skill.color}
            anchorX="center"
            anchorY="middle"
          >
            {skill.level}%
          </Text>
        )}
      </Billboard>

      {/* Sparkle effect on hover */}
      {hovered && (
        <Sparkles
          count={20}
          scale={size * 4}
          size={2}
          speed={0.4}
          color={skill.color}
        />
      )}
    </group>
  )
}

/**
 * Animated data stream connection between skills
 */
function SkillConnection({ start, end, color, index }) {
  const lineRef = useRef()
  const particleRef = useRef()
  const progressRef = useRef(0)

  const { points, curve } = useMemo(() => {
    const midHeight = 0.3 + Math.random() * 0.4
    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(
        start[0] + (end[0] - start[0]) * 0.25,
        start[1] + midHeight,
        start[2] + (end[2] - start[2]) * 0.25
      ),
      new THREE.Vector3(
        start[0] + (end[0] - start[0]) * 0.75,
        end[1] + midHeight,
        start[2] + (end[2] - start[2]) * 0.75
      ),
      new THREE.Vector3(...end)
    )
    return { points: curve.getPoints(30), curve }
  }, [start, end])

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime
    
    if (lineRef.current) {
      // Pulsing opacity
      lineRef.current.material.opacity = 0.08 + Math.sin(time * 1.5 + index) * 0.06
    }

    // Animate particle along the curve
    if (particleRef.current && curve) {
      progressRef.current = (progressRef.current + delta * 0.3) % 1
      const point = curve.getPoint(progressRef.current)
      particleRef.current.position.copy(point)
      particleRef.current.material.opacity = 0.5 + Math.sin(progressRef.current * Math.PI) * 0.5
    }
  })

  return (
    <group>
      {/* Main connection line */}
      <line ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length}
            array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.12} linewidth={1} />
      </line>

      {/* Traveling data particle */}
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>
    </group>
  )
}

/**
 * Pulsing central core of the galaxy
 */
function GalaxyCore({ isDark }) {
  const coreRef = useRef()
  const glowRef = useRef()
  const ring1Ref = useRef()
  const ring2Ref = useRef()

  // Theme-aware colors
  const primaryColor = isDark ? '#00d4ff' : '#0284c7'
  const secondaryColor = isDark ? '#a855f7' : '#7c3aed'

  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (coreRef.current) {
      // Breathing pulse
      const scale = 1 + Math.sin(time * 1.5) * 0.1
      coreRef.current.scale.setScalar(scale)
      coreRef.current.rotation.y = time * 0.3
      coreRef.current.rotation.x = Math.sin(time * 0.5) * 0.2
    }

    if (glowRef.current) {
      glowRef.current.material.opacity = isDark 
        ? (0.15 + Math.sin(time * 2) * 0.08)
        : (0.25 + Math.sin(time * 2) * 0.1)
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = time * 0.4
      ring1Ref.current.rotation.z = time * 0.2
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = time * 0.3
      ring2Ref.current.rotation.z = -time * 0.15
    }
  })

  return (
    <group>
      {/* Central icosahedron */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.35, 1]} />
        <meshStandardMaterial
          color={primaryColor}
          emissive={primaryColor}
          emissiveIntensity={isDark ? 0.6 : 0.8}
          metalness={0.9}
          roughness={0.1}
          wireframe
        />
      </mesh>

      {/* Inner solid core */}
      <mesh>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial
          color={primaryColor}
          emissive={primaryColor}
          emissiveIntensity={isDark ? 0.5 : 0.7}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Outer glow layers */}
      <mesh ref={glowRef} scale={3}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={isDark ? 0.12 : 0.2}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh scale={4}>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshBasicMaterial
          color={secondaryColor}
          transparent
          opacity={isDark ? 0.05 : 0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Orbital rings */}
      <Ring ref={ring1Ref} args={[0.5, 0.55, 64]}>
        <meshBasicMaterial color={primaryColor} transparent opacity={isDark ? 0.3 : 0.5} side={THREE.DoubleSide} />
      </Ring>

      <Ring ref={ring2Ref} args={[0.7, 0.73, 64]} rotation={[Math.PI * 0.5, 0, 0]}>
        <meshBasicMaterial color={secondaryColor} transparent opacity={isDark ? 0.2 : 0.4} side={THREE.DoubleSide} />
      </Ring>
    </group>
  )
}

/**
 * Main Skills Galaxy component
 */
export default function SkillsGalaxy({ onSkillHover, activeCategory }) {
  const groupRef = useRef()
  const { skills } = usePortfolioStore()
  const { performanceMode, theme } = useAppStore()
  const isDark = theme === 'dark'
  const rotationSpeed = useRef(0.05)

  // Calculate positions for skills in a spiral galaxy pattern
  const skillPositions = useMemo(() => {
    const positions = []
    const categoryRadius = {
      ml: 2.2,
      lang: 1.6,
      framework: 2.8,
      tool: 3.4
    }

    const categoryAngles = {
      ml: 0,
      lang: Math.PI * 0.5,
      framework: Math.PI,
      tool: Math.PI * 1.5
    }

    const categoryCount = { ml: 0, lang: 0, framework: 0, tool: 0 }

    skills.forEach((skill) => {
      const category = skill.category
      const baseAngle = categoryAngles[category] || 0
      const radius = categoryRadius[category] || 2
      const count = categoryCount[category]
      
      // Spiral arm offset
      const spiralOffset = count * 0.35
      const angle = baseAngle + spiralOffset
      const adjustedRadius = radius + count * 0.15
      
      const x = Math.cos(angle) * adjustedRadius
      const z = Math.sin(angle) * adjustedRadius
      // Height variation based on skill level
      const y = (skill.level / 100 - 0.5) * 1.2 + (Math.sin(count) * 0.3)

      positions.push([x, y, z])
      categoryCount[category]++
    })

    return positions
  }, [skills])

  // Generate connections between skills in same category
  const connections = useMemo(() => {
    if (performanceMode === 'low') return []
    
    const conns = []
    skills.forEach((skill, i) => {
      skills.forEach((otherSkill, j) => {
        if (i < j && skill.category === otherSkill.category) {
          const distance = Math.sqrt(
            Math.pow(skillPositions[i][0] - skillPositions[j][0], 2) +
            Math.pow(skillPositions[i][1] - skillPositions[j][1], 2) +
            Math.pow(skillPositions[i][2] - skillPositions[j][2], 2)
          )
          if (distance < 2.5) {
            conns.push({
              start: skillPositions[i],
              end: skillPositions[j],
              color: skill.color
            })
          }
        }
      })
    })
    return conns
  }, [skills, skillPositions, performanceMode])

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Smooth rotation with slight variation
      groupRef.current.rotation.y += delta * rotationSpeed.current
      
      // Subtle vertical oscillation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Enhanced central core */}
      <GalaxyCore isDark={isDark} />

      {/* Skill nodes */}
      {skills.map((skill, index) => (
        <SkillNode
          key={skill.name}
          skill={skill}
          position={skillPositions[index]}
          index={index}
          onHover={onSkillHover}
          activeCategory={activeCategory}
          isDark={isDark}
        />
      ))}

      {/* Animated connections */}
      {connections.map((conn, index) => (
        <SkillConnection
          key={index}
          start={conn.start}
          end={conn.end}
          color={conn.color}
          index={index}
        />
      ))}

      {/* Multi-layer galaxy dust */}
      <GalaxyDust count={performanceMode === 'low' ? 150 : 400} isDark={isDark} />
      <NebulaCloud isDark={isDark} />
    </group>
  )
}

/**
 * Enhanced galaxy dust with color variation and depth
 */
function GalaxyDust({ count = 400, isDark }) {
  const particlesRef = useRef()
  const colorsRef = useRef()

  const { particles, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colorArray = new Float32Array(count * 3)
    
    // Theme-aware colors
    const colorOptions = isDark 
      ? [
          new THREE.Color('#00d4ff'),
          new THREE.Color('#a855f7'),
          new THREE.Color('#ffffff')
        ]
      : [
          new THREE.Color('#0284c7'),
          new THREE.Color('#7c3aed'),
          new THREE.Color('#0f172a')
        ]

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      // Spiral distribution
      const arm = Math.floor(Math.random() * 4)
      const armAngle = (arm / 4) * Math.PI * 2
      const spreadAngle = armAngle + (Math.random() - 0.5) * 0.8
      const radius = 0.5 + Math.random() * 4.5
      
      positions[i3] = Math.cos(spreadAngle + radius * 0.2) * radius
      positions[i3 + 1] = (Math.random() - 0.5) * 1.5 * (1 - radius / 5)
      positions[i3 + 2] = Math.sin(spreadAngle + radius * 0.2) * radius

      // Random color assignment
      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)]
      colorArray[i3] = color.r
      colorArray[i3 + 1] = color.g
      colorArray[i3 + 2] = color.b
    }

    return { particles: positions, colors: colorArray }
  }, [count, isDark])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.03
      // Slight wobble
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isDark ? 0.025 : 0.035}
        vertexColors
        transparent
        opacity={isDark ? 0.5 : 0.7}
        sizeAttenuation
        blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  )
}

/**
 * Ambient nebula cloud effect
 */
function NebulaCloud({ isDark }) {
  const cloud1Ref = useRef()
  const cloud2Ref = useRef()

  // Theme-aware colors
  const primaryColor = isDark ? '#00d4ff' : '#0284c7'
  const secondaryColor = isDark ? '#a855f7' : '#7c3aed'

  useFrame((state) => {
    const time = state.clock.elapsedTime
    if (cloud1Ref.current) {
      cloud1Ref.current.rotation.z = time * 0.02
      cloud1Ref.current.material.opacity = isDark 
        ? (0.03 + Math.sin(time * 0.5) * 0.01)
        : (0.08 + Math.sin(time * 0.5) * 0.02)
    }
    if (cloud2Ref.current) {
      cloud2Ref.current.rotation.z = -time * 0.015
      cloud2Ref.current.material.opacity = isDark 
        ? (0.025 + Math.cos(time * 0.4) * 0.01)
        : (0.06 + Math.cos(time * 0.4) * 0.02)
    }
  })

  return (
    <group>
      <mesh ref={cloud1Ref} rotation={[Math.PI * 0.5, 0, 0]}>
        <ringGeometry args={[1, 4, 64]} />
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={isDark ? 0.03 : 0.08}
          side={THREE.DoubleSide}
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </mesh>
      <mesh ref={cloud2Ref} rotation={[Math.PI * 0.5, 0, 0]}>
        <ringGeometry args={[2, 5, 64]} />
        <meshBasicMaterial
          color={secondaryColor}
          transparent
          opacity={isDark ? 0.025 : 0.06}
          side={THREE.DoubleSide}
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </mesh>
    </group>
  )
}
