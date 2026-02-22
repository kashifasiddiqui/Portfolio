import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'

/**
 * Magnetic Button - Awwwards-style magnetic hover effect
 * Button follows cursor within its bounds
 */
export default function MagneticButton({ 
  children, 
  className = '', 
  strength = 0.3,
  ...props 
}) {
  const ref = useRef(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springConfig = { damping: 15, stiffness: 150 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const handleMouseMove = (e) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY
    
    x.set(distanceX * strength)
    y.set(distanceY * strength)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`magnetic-btn ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * Text Reveal - Character by character animation
 */
export function TextReveal({ 
  children, 
  className = '',
  delay = 0,
  stagger = 0.03,
  ...props 
}) {
  const text = typeof children === 'string' ? children : ''
  const characters = text.split('')

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      }
    }
  }

  const child = {
    hidden: { 
      opacity: 0, 
      y: 20,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 200,
      }
    }
  }

  return (
    <motion.span
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={`inline-block ${className}`}
      style={{ perspective: '1000px' }}
      {...props}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  )
}

/**
 * Split Text - Word by word reveal with blur
 */
export function SplitText({ 
  children, 
  className = '',
  delay = 0,
  ...props 
}) {
  const text = typeof children === 'string' ? children : ''
  const words = text.split(' ')

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay,
      }
    }
  }

  const child = {
    hidden: { 
      opacity: 0, 
      y: 30,
      filter: 'blur(10px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        ease: [0.23, 1, 0.32, 1],
      }
    }
  }

  return (
    <motion.span
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={`inline-block ${className}`}
      {...props}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}

/**
 * Scramble Text - Matrix-style text scramble effect
 */
export function ScrambleText({ 
  children, 
  className = '',
  ...props 
}) {
  const text = typeof children === 'string' ? children : ''
  const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  
  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={className}
      {...props}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            delay: i * 0.03,
            duration: 0.1,
          }}
          className="inline-block"
          style={{ fontFamily: 'monospace' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  )
}

/**
 * Floating Element - Subtle floating animation
 */
export function FloatingElement({ 
  children, 
  className = '',
  amplitude = 10,
  duration = 4,
  delay = 0,
  ...props 
}) {
  return (
    <motion.div
      animate={{
        y: [-amplitude, amplitude, -amplitude],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * Parallax Wrapper - Mouse-reactive parallax effect
 */
export function ParallaxWrapper({ 
  children, 
  className = '',
  strength = 20,
  ...props 
}) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springConfig = { damping: 20, stiffness: 100 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)
  
  const rotateX = useTransform(springY, [-0.5, 0.5], [strength, -strength])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-strength, strength])

  const handleMouseMove = (e) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    x.set((e.clientX - centerX) / rect.width)
    y.set((e.clientY - centerY) / rect.height)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * Gradient Border Card - Animated gradient border
 */
export function GradientBorderCard({ 
  children, 
  className = '',
  ...props 
}) {
  return (
    <div className={`gradient-border rounded-2xl ${className}`} {...props}>
      {children}
    </div>
  )
}
