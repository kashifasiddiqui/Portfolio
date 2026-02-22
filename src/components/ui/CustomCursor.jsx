import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useAppStore } from '@/stores/appStore'

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const { theme } = useAppStore()
  const isDark = theme === 'dark'

  // Use motion values for smooth cursor tracking
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 }
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)

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
  const cursorGlow = isDark ? 'rgba(0, 212, 255, 0.5)' : 'rgba(2, 132, 199, 0.4)'
  const ringColor = isDark ? 'rgba(0, 212, 255, 0.4)' : 'rgba(2, 132, 199, 0.3)'
  const ringHoverColor = isDark ? 'rgba(0, 212, 255, 0.8)' : 'rgba(2, 132, 199, 0.6)'

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%'
        }}
      >
        <motion.div
          animate={{
            scale: isClicking ? 0.5 : isHovering ? 0.5 : 1,
          }}
          transition={{ duration: 0.15 }}
          className="w-full h-full rounded-full"
          style={{ 
            backgroundColor: cursorColor,
            boxShadow: `0 0 10px ${cursorGlow}`
          }}
        />
      </motion.div>

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 pointer-events-none z-[9998]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%'
        }}
      >
        <motion.div
          animate={{
            scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
            opacity: isHovering ? 0.8 : 0.4,
            borderColor: isHovering ? ringHoverColor : ringColor
          }}
          transition={{ duration: 0.2 }}
          className="w-full h-full rounded-full border-2"
          style={{ borderColor: ringColor }}
        />
      </motion.div>
    </>
  )
}
