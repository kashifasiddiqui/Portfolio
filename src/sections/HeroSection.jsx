import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { useRef, Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, AdaptiveDpr, Preload } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import HeroScene from '@/components/three/HeroScene'
import { usePortfolioStore, useAppStore } from '@/stores/appStore'
import { useIsMobile, useWindowSize } from '@/hooks'
import { VisitorCounter, MagneticButton } from '@/components/ui'

/**
 * Typewriter text effect component
 */
function TypewriterText({ text, delay = 0, speed = 40, onComplete, className = '', isDark = true }) {
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(startTimer)
  }, [delay])

  useEffect(() => {
    if (!started) return

    let index = 0
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(interval)
        setIsComplete(true)
        onComplete?.()
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, onComplete, started])

  return (
    <span className={className}>
      {displayText}
      {started && !isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className={`inline-block w-[3px] h-[1em] ml-1 align-middle ${isDark ? 'bg-neural-glow' : 'bg-sky-600'}`}
        />
      )}
    </span>
  )
}

/**
 * Animated scroll indicator
 */
function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3.5, duration: 0.6 }}
      className="absolute bottom-8 left-0 right-0 flex flex-col items-center justify-center gap-3"
    >
      <motion.span 
        className="text-xs font-mono text-neural-400 uppercase tracking-widest text-center"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Scroll to explore
      </motion.span>
      
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="w-6 h-10 rounded-full border-2 border-neural-glow/30 flex items-start justify-center p-2"
      >
        <motion.div
          animate={{ 
            y: [0, 12, 0],
            opacity: [1, 0.3, 1]
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-1 h-2 bg-neural-glow rounded-full"
        />
      </motion.div>
    </motion.div>
  )
}

/**
 * Role badge with rotating titles
 */
function RoleBadge({ roles, isDark = true }) {
  const [currentRole, setCurrentRole] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [roles.length])

  return (
    <div className="h-8 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentRole}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className={`block text-lg md:text-xl font-mono ${isDark ? 'text-neural-glow' : 'text-sky-600'}`}
        >
          {roles[currentRole]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

/**
 * Mobile fallback background
 */
function MobileFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-neural-950 via-neural-dark to-neural-950" />
      
      {/* Animated grid */}
      <div className="absolute inset-0 neural-grid-bg opacity-30" />
      
      {/* Floating orbs */}
      <motion.div
        animate={{
          y: [-20, 20, -20],
          x: [-10, 10, -10],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)'
        }}
      />
      <motion.div
        animate={{
          y: [20, -20, 20],
          x: [10, -10, 10],
          scale: [1.1, 1, 1.1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
          filter: 'blur(30px)'
        }}
      />

      {/* Central glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-50"
        style={{
          background: 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 60%)'
        }}
      />
    </div>
  )
}

/**
 * 3D Scene Canvas with optimized settings
 */
function Scene3D({ scrollProgress }) {
  const { performanceMode, prefersReducedMotion } = useAppStore()
  
  const settings = {
    low: { dpr: 1, bloom: false },
    medium: { dpr: 1.5, bloom: true },
    high: { dpr: 2, bloom: true }
  }

  const current = settings[performanceMode] || settings.medium
  const enableEffects = current.bloom && !prefersReducedMotion

  return (
    <Canvas
      dpr={Math.min(current.dpr, window.devicePixelRatio)}
      gl={{
        antialias: performanceMode !== 'low',
        powerPreference: 'high-performance',
        alpha: true,
        stencil: false
      }}
      performance={{ min: 0.5 }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
      
      {/* Subtle ambient lighting */}
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} intensity={0.3} color="#00d4ff" />
      <pointLight position={[-5, -5, -5]} intensity={0.15} color="#a855f7" />
      
      <Suspense fallback={null}>
        <HeroScene scrollProgress={scrollProgress} />
      </Suspense>

      {/* Post-processing */}
      {enableEffects && (
        <EffectComposer>
          <Bloom
            intensity={0.3}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <Vignette
            offset={0.3}
            darkness={0.6}
            blendFunction={BlendFunction.NORMAL}
          />
        </EffectComposer>
      )}

      <AdaptiveDpr pixelated />
      <Preload all />
    </Canvas>
  )
}

/**
 * Main Hero Section Component
 */
export default function HeroSection() {
  const containerRef = useRef(null)
  const { personalInfo } = usePortfolioStore()
  const { prefersReducedMotion, theme } = useAppStore()
  const isMobile = useIsMobile()
  const { height } = useWindowSize()
  const isDark = theme === 'dark'
  
  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })

  const scrollProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Transform values for parallax effects
  const contentY = useTransform(scrollProgress, [0, 1], [0, 100])
  const contentOpacity = useTransform(scrollProgress, [0, 0.5], [1, 0])
  const sceneOpacity = useTransform(scrollProgress, [0, 0.8], [1, 0.3])

  const roles = [
    'Backend Developer',
    'AI Engineer', 
    'ML Specialist',
    'Full Stack Developer'
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        when: 'beforeChildren',
        staggerChildren: 0.15
      }
    }
  }

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const scaleVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: height || '100vh', minHeight: '100vh' }}
    >
      {/* 3D Background or Mobile Fallback */}
      <motion.div 
        className="absolute inset-0"
        style={{ opacity: sceneOpacity }}
      >
        {isMobile || prefersReducedMotion ? (
          <MobileFallback />
        ) : (
          <Scene3D scrollProgress={scrollProgress.get()} />
        )}
      </motion.div>

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-b from-neural-dark/60 via-transparent to-neural-dark' 
            : 'bg-gradient-to-b from-slate-100/80 via-transparent to-slate-100'
        }`} />
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-r from-neural-dark/30 via-transparent to-neural-dark/30'
            : 'bg-gradient-to-r from-slate-100/50 via-transparent to-slate-100/50'
        }`} />
      </div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8"
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Status Badge */}
          <motion.div variants={scaleVariants} className="mb-6 md:mb-8">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm text-sm font-mono ${
              isDark 
                ? 'bg-neural-950/80 border border-neural-glow/20 text-neural-glow' 
                : 'bg-white/90 border-2 border-sky-300 text-sky-700 shadow-md'
            }`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              Available for opportunities
            </span>
          </motion.div>

          {/* Name - Main Focus */}
          <motion.h1 
            variants={fadeUpVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-4 md:mb-6 tracking-tight"
          >
            <span className={isDark ? 'text-white' : 'text-slate-900'}>
              {prefersReducedMotion ? (
                personalInfo.name
              ) : (
                <TypewriterText text={personalInfo.name} delay={500} speed={80} isDark={isDark} />
              )}
            </span>
          </motion.h1>

          {/* Role Badge */}
          <motion.div variants={fadeUpVariants} className="mb-4 md:mb-6">
            <RoleBadge roles={roles} isDark={isDark} />
          </motion.div>

          {/* Divider */}
          <motion.div 
            variants={scaleVariants}
            className="w-24 h-px mx-auto mb-6 md:mb-8"
            style={{
              background: isDark 
                ? 'linear-gradient(90deg, transparent, #00d4ff, transparent)'
                : 'linear-gradient(90deg, transparent, #0284c7, transparent)'
            }}
          />

          {/* Tagline */}
          <motion.p
            variants={fadeUpVariants}
            className={`text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed px-4 ${
              isDark ? 'text-neural-300' : 'text-slate-600'
            }`}
          >
            {personalInfo.tagline}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUpVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <MagneticButton strength={0.2}>
              <motion.a
                href="#projects"
                data-cursor-text="VIEW"
                whileHover={{ scale: 1.05, boxShadow: isDark ? '0 0 40px rgba(0, 212, 255, 0.5)' : '0 0 40px rgba(2, 132, 199, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                className={`relative w-full sm:w-auto px-8 py-4 font-semibold rounded-xl transition-all duration-300 overflow-hidden group ${
                  isDark 
                    ? 'bg-gradient-to-r from-neural-glow to-neural-accent text-neural-dark'
                    : 'bg-gradient-to-r from-sky-600 to-teal-500 text-white shadow-lg'
                }`}
              >
                <span className="relative z-10">View My Work</span>
                <motion.div 
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: '-100%', skewX: '-15deg' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
              </motion.a>
            </MagneticButton>
            <MagneticButton strength={0.2}>
              <motion.a
                href="#contact"
                data-cursor-text="CONTACT"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative w-full sm:w-auto px-8 py-4 backdrop-blur-sm font-medium rounded-xl transition-all duration-300 overflow-hidden group ${
                  isDark 
                    ? 'bg-neural-950/50 border-2 border-neural-glow/30 text-neural-glow hover:border-neural-glow/60 hover:bg-neural-glow/10'
                    : 'bg-white/80 border-2 border-sky-400 text-sky-700 shadow-md hover:bg-sky-50'
                }`}
              >
                <span className="relative z-10">Get in Touch</span>
              </motion.a>
            </MagneticButton>
          </motion.div>

          {/* Visitor Counter */}
          <motion.div
            variants={fadeUpVariants}
            className="mt-8 flex justify-center"
          >
            <VisitorCounter />
          </motion.div>
        </div>

        {/* Location badge - bottom left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.5, duration: 0.5 }}
          className={`absolute bottom-8 left-6 hidden lg:flex items-center gap-2 ${
            isDark ? 'text-neural-500' : 'text-slate-600'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm font-mono">{personalInfo.location || 'Mumbai, India'}</span>
        </motion.div>

        {/* Tech stack - bottom right */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.8, duration: 0.5 }}
          className="absolute bottom-8 right-6 hidden lg:flex flex-col items-end gap-2"
        >
          <span className={`text-xs font-mono uppercase tracking-wider ${
            isDark ? 'text-neural-500' : 'text-slate-500'
          }`}>Tech Stack</span>
          <div className="flex items-center gap-2">
            {['Python', 'TensorFlow', 'FastAPI'].map((tech) => (
              <span
                key={tech}
                className={`px-3 py-1 text-xs font-mono backdrop-blur-sm rounded ${
                  isDark 
                    ? 'text-neural-400 bg-neural-950/80 border border-neural-800/50'
                    : 'text-slate-700 bg-white/90 border border-slate-300 shadow-sm'
                }`}
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <ScrollIndicator />

      {/* Subtle scan line effect */}
      {!isMobile && !prefersReducedMotion && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          <motion.div
            animate={{ y: ['0%', '100%'] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-neural-glow to-transparent"
          />
        </div>
      )}
    </div>
  )
}
