import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { useAppStore } from '@/stores/appStore'

// Particle trail system
function CursorTrail({ mouseX, mouseY, isDark }) {
  const [trails, setTrails] = useState([])
  const trailRef = useRef([])
  const lastPos = useRef({ x: 0, y: 0 })
  
  useEffect(() => {
    const unsubX = mouseX.on('change', (x) => {
      const y = mouseY.get()
      const distance = Math.hypot(x - lastPos.current.x, y - lastPos.current.y)
      
      if (distance > 8) {
        lastPos.current = { x, y }
        const newTrail = {
          id: Date.now() + Math.random(),
          x,
          y,
          size: Math.random() * 4 + 2,
          opacity: 0.6
        }
        
        trailRef.current = [...trailRef.current.slice(-15), newTrail]
        setTrails([...trailRef.current])
      }
    })
    
    return () => unsubX()
  }, [mouseX, mouseY])

  // Fade out trails
  useEffect(() => {
    const interval = setInterval(() => {
      trailRef.current = trailRef.current
        .map(t => ({ ...t, opacity: t.opacity - 0.08, size: t.size * 0.95 }))
        .filter(t => t.opacity > 0)
      setTrails([...trailRef.current])
    }, 30)
    
    return () => clearInterval(interval)
  }, [])

  const color = isDark ? '#00d4ff' : '#0284c7'

  return (
    <>
      {trails.map((trail) => (
        <div
          key={trail.id}
          className="fixed pointer-events-none z-[9997] rounded-full"
          style={{
            left: trail.x,
            top: trail.y,
            width: trail.size,
            height: trail.size,
            backgroundColor: color,
            opacity: trail.opacity,
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 ${trail.size * 2}px ${color}`,
          }}
        />
      ))}
    </>
  )
}

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [hoverText, setHoverText] = useState('')
  const { theme } = useAppStore()
  const isDark = theme === 'dark'

  // Use motion values for smooth cursor tracking
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 }
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)
  
  // Slower following ring
  const ringSpring = { damping: 20, stiffness: 200, mass: 0.8 }
  const ringX = useSpring(mouseX, ringSpring)
  const ringY = useSpring(mouseY, ringSpring)

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    const handleMouseEnter = (e) => {
      const target = e.target
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-pointer') ||
        target.closest('[role="button"]') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovering(true)
        // Get custom cursor text if available
        const cursorText = target.dataset?.cursorText || target.closest('[data-cursor-text]')?.dataset?.cursorText
        if (cursorText) setHoverText(cursorText)
      }
    }

    const handleMouseLeave = (e) => {
      const target = e.target
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-pointer') ||
        target.closest('[role="button"]')
      ) {
        setIsHovering(false)
        setHoverText('')
      }
    }

    const handleMouseOut = () => {
      setIsVisible(false)
    }

    const handleMouseOver = () => {
      setIsVisible(true)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseover', handleMouseEnter)
    document.addEventListener('mouseout', handleMouseLeave)
    document.documentElement.addEventListener('mouseleave', handleMouseOut)
    document.documentElement.addEventListener('mouseenter', handleMouseOver)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseover', handleMouseEnter)
      document.removeEventListener('mouseout', handleMouseLeave)
      document.documentElement.removeEventListener('mouseleave', handleMouseOut)
      document.documentElement.removeEventListener('mouseenter', handleMouseOver)
    }
  }, [mouseX, mouseY, isVisible])

  if (!isVisible) return null

  const cursorColor = isDark ? '#00d4ff' : '#0284c7'
  const cursorGlow = isDark ? 'rgba(0, 212, 255, 0.6)' : 'rgba(2, 132, 199, 0.5)'
  const ringColor = isDark ? 'rgba(0, 212, 255, 0.3)' : 'rgba(2, 132, 199, 0.25)'

  return (
    <>
      {/* Particle trail */}
      <CursorTrail mouseX={mouseX} mouseY={mouseY} isDark={isDark} />
      
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%'
        }}
      >
        <motion.div
          animate={{
            scale: isClicking ? 0.5 : isHovering ? 0.3 : 1,
            width: isHovering ? 60 : 12,
            height: isHovering ? 60 : 12,
          }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="rounded-full flex items-center justify-center"
          style={{ 
            backgroundColor: '#fff',
          }}
        >
          {isHovering && hoverText && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-[8px] font-bold text-black uppercase tracking-wider"
            >
              {hoverText}
            </motion.span>
          )}
        </motion.div>
      </motion.div>

      {/* Outer ring with gradient border */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%'
        }}
      >
        <motion.div
          animate={{
            scale: isClicking ? 0.6 : isHovering ? 1.8 : 1,
            opacity: isHovering ? 1 : 0.5,
            rotate: isHovering ? 90 : 0,
          }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="w-10 h-10 rounded-full"
          style={{ 
            border: `2px solid ${cursorColor}`,
            boxShadow: `0 0 20px ${cursorGlow}, inset 0 0 20px ${cursorGlow}`,
          }}
        />
      </motion.div>
      
      {/* Glow orb */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9996]"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%'
        }}
      >
        <motion.div
          animate={{
            scale: isHovering ? 2.5 : 1.5,
            opacity: isHovering ? 0.15 : 0.08,
          }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 rounded-full blur-xl"
          style={{ backgroundColor: cursorColor }}
        />
      </motion.div>
    </>
  )
}
