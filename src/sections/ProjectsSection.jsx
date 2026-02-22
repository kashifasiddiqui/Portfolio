import { motion, useScroll } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { usePortfolioStore, useAppStore } from '@/stores/appStore'
import { useInView } from '@/hooks'
import { Scene, ProjectsScene } from '@/components/three'

// Project color schemes
const projectColors = [
  { primary: '#00d4ff', secondary: '#0ea5e9', gradient: 'from-cyan-400 to-blue-500', glow: 'rgba(0, 212, 255, 0.4)' },
  { primary: '#a855f7', secondary: '#ec4899', gradient: 'from-purple-400 to-pink-500', glow: 'rgba(168, 85, 247, 0.4)' },
  { primary: '#22c55e', secondary: '#14b8a6', gradient: 'from-emerald-400 to-teal-500', glow: 'rgba(34, 197, 94, 0.4)' },
  { primary: '#f59e0b', secondary: '#f97316', gradient: 'from-amber-400 to-orange-500', glow: 'rgba(245, 158, 11, 0.4)' },
]

// Project icons
const projectIcons = {
  'SmartPick': (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'AI Mock Interviewer': (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'Cassandra Smart Safety Jacket': (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'Voltera': (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'Portfolio': (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'default': (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// Year mapping for projects
const projectYears = {
  'SmartPick': '2025',
  'AI Mock Interviewer': '2025',
  'Cassandra Smart Safety Jacket': '2023',
  'Voltera': '2026',
  'Portfolio': '2026'
}

// Individual Project Card - Refined
function ProjectCard({ project, index, colorScheme, isDark, onHover }) {
  const [isHovered, setIsHovered] = useState(false)
  const ProjectIcon = projectIcons[project.title] || projectIcons.default
  const year = projectYears[project.title] || '2025'

  const handleMouseEnter = () => {
    setIsHovered(true)
    onHover?.(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    onHover?.(false)
  }

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative flex-shrink-0 w-[300px] sm:w-[340px] md:w-[380px] select-none"
    >
      <motion.div 
        className={`relative h-[400px] sm:h-[440px] md:h-[480px] rounded-[28px] overflow-hidden transition-all duration-500 ${
          isDark 
            ? 'bg-gradient-to-br from-neural-900/98 via-neural-950 to-neural-900/98' 
            : 'bg-gradient-to-br from-white via-slate-50/80 to-white'
        }`}
        style={{
          border: `1.5px solid ${isHovered ? colorScheme.primary + '60' : (isDark ? 'rgba(55, 55, 55, 0.5)' : 'rgba(226, 232, 240, 0.9)')}`,
          boxShadow: isHovered 
            ? `0 25px 60px -15px ${colorScheme.glow}, 0 0 0 1px ${colorScheme.primary}20`
            : isDark 
              ? '0 10px 40px -15px rgba(0,0,0,0.5)' 
              : '0 10px 40px -15px rgba(0,0,0,0.1)'
        }}
        animate={isHovered ? { y: -8, scale: 1.02 } : { y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Top gradient line */}
        <motion.div 
          className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colorScheme.gradient}`}
          initial={{ scaleX: 0.3, opacity: 0.6 }}
          animate={{ scaleX: isHovered ? 1 : 0.3, opacity: isHovered ? 1 : 0.6 }}
          transition={{ duration: 0.4 }}
          style={{ transformOrigin: 'left' }}
        />

        {/* Animated background orbs */}
        <motion.div
          className="absolute -top-24 -right-24 w-56 h-56 rounded-full blur-[80px]"
          style={{ background: colorScheme.primary }}
          animate={{ 
            opacity: isHovered ? 0.25 : 0.08,
            scale: isHovered ? 1.2 : 1,
            x: isHovered ? -20 : 0,
            y: isHovered ? 20 : 0
          }}
          transition={{ duration: 0.6 }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-44 h-44 rounded-full blur-[60px]"
          style={{ background: colorScheme.secondary }}
          animate={{ 
            opacity: isHovered ? 0.2 : 0.05,
            scale: isHovered ? 1.15 : 1
          }}
          transition={{ duration: 0.6 }}
        />

        {/* Animated grid pattern on hover */}
        <motion.div
          className="absolute inset-0 opacity-0"
          animate={{ opacity: isHovered ? 0.03 : 0 }}
          style={{
            backgroundImage: `linear-gradient(${colorScheme.primary}20 1px, transparent 1px), linear-gradient(90deg, ${colorScheme.primary}20 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col p-5 sm:p-6 md:p-7">
          {/* Top row: Icon + Year badge */}
          <div className="flex items-start justify-between mb-5">
            <motion.div
              className="p-2.5 sm:p-3 rounded-xl"
              style={{ 
                backgroundColor: `${colorScheme.primary}12`,
                border: `1px solid ${colorScheme.primary}25`,
                color: colorScheme.primary
              }}
              animate={isHovered ? { scale: 1.08, rotate: 3 } : { scale: 1, rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7">{ProjectIcon}</div>
            </motion.div>

            <div className="flex items-center gap-2">
              {project.featured && (
                <motion.span
                  className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-md"
                  style={{ 
                    backgroundColor: `${colorScheme.primary}15`,
                    color: colorScheme.primary,
                    border: `1px solid ${colorScheme.primary}30`
                  }}
                  animate={{ scale: isHovered ? 1.05 : 1 }}
                >
                  Featured
                </motion.span>
              )}
              <span className={`px-2.5 py-1 text-xs font-mono rounded-lg ${
                isDark ? 'bg-neural-800/60 text-neural-400' : 'bg-slate-100 text-slate-500'
              }`}>
                {year}
              </span>
            </div>
          </div>

          {/* Project number - subtle watermark */}
          <motion.div 
            className="absolute top-16 right-5 text-6xl sm:text-7xl font-display font-black pointer-events-none"
            style={{ color: colorScheme.primary }}
            animate={{ opacity: isHovered ? 0.12 : 0.04 }}
          >
            {String(index + 1).padStart(2, '0')}
          </motion.div>

          {/* Title */}
          <motion.h3
            className={`text-lg sm:text-xl md:text-2xl font-display font-bold mb-2 leading-tight pr-12 ${isDark ? 'text-white' : 'text-slate-800'}`}
            animate={{ x: isHovered ? 3 : 0 }}
            transition={{ duration: 0.25 }}
          >
            {project.title}
          </motion.h3>

          {/* Animated accent line */}
          <motion.div 
            className="h-0.5 rounded-full mb-4"
            style={{ background: `linear-gradient(90deg, ${colorScheme.primary}, ${colorScheme.secondary})` }}
            initial={{ width: 48 }}
            animate={{ width: isHovered ? 80 : 48 }}
            transition={{ duration: 0.35 }}
          />

          {/* Description */}
          <p className={`text-sm leading-relaxed mb-auto line-clamp-3 ${isDark ? 'text-neural-400' : 'text-slate-600'}`}>
            {project.description}
          </p>

          {/* Tech stack */}
          <div className="mt-4 mb-5">
            <div className="flex flex-wrap gap-1.5">
              {project.tags.slice(0, 4).map((tag) => (
                <motion.span
                  key={tag}
                  className={`px-2 py-0.5 text-[11px] font-mono rounded-md transition-colors ${
                    isDark 
                      ? 'bg-neural-800/70 text-neural-300 border border-neural-700/50' 
                      : 'bg-slate-100 text-slate-600 border border-slate-200/80'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  style={isHovered ? { borderColor: `${colorScheme.primary}30` } : {}}
                >
                  {tag}
                </motion.span>
              ))}
              {project.tags.length > 4 && (
                <span className={`px-2 py-0.5 text-[11px] ${isDark ? 'text-neural-500' : 'text-slate-400'}`}>
                  +{project.tags.length - 4}
                </span>
              )}
            </div>
          </div>

          {/* Action button */}
          <motion.a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
              isHovered 
                ? 'text-white' 
                : isDark ? 'text-neural-400' : 'text-slate-500'
            }`}
            style={{ 
              background: isHovered 
                ? `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.secondary})` 
                : isDark ? 'rgba(38, 38, 38, 0.6)' : 'rgba(241, 245, 249, 0.9)',
              border: isHovered ? 'none' : `1px solid ${isDark ? 'rgba(64, 64, 64, 0.5)' : 'rgba(203, 213, 225, 0.8)'}`,
              boxShadow: isHovered ? `0 8px 24px ${colorScheme.glow}` : 'none'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>View Code</span>
            <motion.svg 
              className="w-3.5 h-3.5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              animate={{ x: isHovered ? 2 : 0 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </motion.svg>
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Carousel with smooth infinite scroll using CSS animation
function InfiniteCarousel({ projects, isDark, isPaused, onCardHover }) {
  const trackRef = useRef(null)
  const positionRef = useRef(0)
  const animationRef = useRef(null)
  const cardWidth = 380 + 24 // card width + gap (md size)
  const totalWidth = projects.length * cardWidth
  
  // Create double set for seamless loop
  const doubleProjects = [...projects, ...projects]

  useEffect(() => {
    const speed = 0.5 // pixels per frame
    
    const animate = () => {
      if (!isPaused && trackRef.current) {
        positionRef.current += speed
        
        // Reset when we've scrolled past the first set
        if (positionRef.current >= totalWidth) {
          positionRef.current = 0
        }
        
        trackRef.current.style.transform = `translateX(-${positionRef.current}px)`
      }
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPaused, totalWidth])

  return (
    <div className="relative overflow-hidden py-6">
      {/* Edge fade gradients */}
      <div className={`absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-40 z-20 pointer-events-none ${
        isDark 
          ? 'bg-gradient-to-r from-neural-dark via-neural-dark/90 to-transparent' 
          : 'bg-gradient-to-r from-slate-100 via-slate-100/90 to-transparent'
      }`} />
      <div className={`absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-40 z-20 pointer-events-none ${
        isDark 
          ? 'bg-gradient-to-l from-neural-dark via-neural-dark/90 to-transparent' 
          : 'bg-gradient-to-l from-slate-100 via-slate-100/90 to-transparent'
      }`} />

      {/* Scrolling track */}
      <div
        ref={trackRef}
        className="flex gap-6 will-change-transform"
        style={{ width: 'fit-content', transform: 'translateZ(0)' }}
      >
        {doubleProjects.map((project, index) => (
          <ProjectCard
            key={`${project.id}-${index}`}
            project={project}
            index={index % projects.length}
            colorScheme={projectColors[(index % projects.length) % projectColors.length]}
            isDark={isDark}
            onHover={onCardHover}
          />
        ))}
      </div>
    </div>
  )
}

// Control button component
function ControlButton({ onClick, children, isDark, isActive }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`p-3 rounded-xl transition-all ${
        isActive
          ? isDark 
            ? 'bg-neural-glow/20 text-neural-glow border border-neural-glow/40' 
            : 'bg-sky-500/20 text-sky-600 border border-sky-500/40'
          : isDark 
            ? 'bg-neural-900/60 text-neural-400 border border-neural-700/50 hover:border-neural-600 hover:text-neural-300' 
            : 'bg-white text-slate-500 border border-slate-200 shadow-sm hover:shadow-md hover:text-slate-700'
      }`}
    >
      {children}
    </motion.button>
  )
}

export default function ProjectsSection() {
  const { projects } = usePortfolioStore()
  const { theme } = useAppStore()
  const isDark = theme === 'dark'
  const [isPaused, setIsPaused] = useState(false)
  const [isCardHovered, setIsCardHovered] = useState(false)
  const [titleRef, titleInView] = useInView({ threshold: 0.3, once: true })
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  const effectivePaused = isPaused || isCardHovered

  return (
    <section ref={containerRef} className={`relative overflow-hidden py-16 sm:py-24 md:py-32 ${
      isDark 
        ? 'bg-gradient-to-b from-neural-dark via-neural-950 to-neural-dark' 
        : 'bg-gradient-to-b from-slate-100 via-white to-slate-100'
    }`}>
      {/* 3D Background */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <Scene>
          <ProjectsScene scrollProgress={scrollYProgress} isDark={isDark} />
        </Scene>
      </div>

      <div className="relative z-10">
        {/* Section Header */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14 md:mb-16 px-4"
        >
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={titleInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.15 }}
            className="inline-block mb-4 sm:mb-5"
          >
            <span className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-full ${
              isDark 
                ? 'text-neural-glow bg-neural-glow/8 border border-neural-glow/25' 
                : 'text-sky-600 bg-sky-500/8 border border-sky-500/25'
            }`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
              </span>
              My Work
            </span>
          </motion.div>
          
          {/* Title */}
          <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-3 sm:mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Featured <span className="neural-text">Projects</span>
          </h2>
          
          {/* Subtitle */}
          <p className={`text-sm sm:text-base md:text-lg max-w-xl mx-auto ${isDark ? 'text-neural-400' : 'text-slate-600'}`}>
            AI-powered solutions & production-ready applications
          </p>

          {/* Decorative line */}
          <motion.div 
            className="mx-auto mt-6 sm:mt-8 h-px w-24 sm:w-32"
            style={{ background: `linear-gradient(90deg, transparent, ${isDark ? '#00d4ff' : '#0ea5e9'}, transparent)` }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={titleInView ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          />
        </motion.div>

        {/* Carousel Controls Header */}
        <div className="flex items-center justify-center gap-3 mb-6 px-4">
          <ControlButton 
            onClick={() => setIsPaused(!isPaused)} 
            isDark={isDark}
            isActive={effectivePaused}
          >
            {effectivePaused ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            )}
          </ControlButton>
          
          <motion.div 
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium ${
              isDark ? 'bg-neural-900/50 text-neural-500' : 'bg-white/80 text-slate-500 shadow-sm'
            }`}
            animate={{ opacity: effectivePaused ? 1 : 0.7 }}
          >
            {effectivePaused ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>Paused</span>
              </>
            ) : (
              <>
                <motion.span 
                  className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span>Auto-scrolling</span>
                <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </>
            )}
          </motion.div>

          <span className={`text-xs ${isDark ? 'text-neural-600' : 'text-slate-400'}`}>
            Drag to explore
          </span>
        </div>

        {/* Infinite Carousel */}
        <InfiniteCarousel 
          projects={projects} 
          isDark={isDark} 
          isPaused={effectivePaused}
          onCardHover={setIsCardHovered}
        />

        {/* Project counter */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center gap-2 mt-8"
        >
          {projects.map((_, i) => (
            <motion.div
              key={i}
              className={`w-2 h-2 rounded-full ${isDark ? 'bg-neural-700' : 'bg-slate-300'}`}
              style={{ backgroundColor: projectColors[i % projectColors.length].primary + '60' }}
              whileHover={{ scale: 1.3 }}
            />
          ))}
        </motion.div>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center mt-10 sm:mt-14 px-4"
        >
          <motion.a
            href="https://github.com/kashifasiddiqui"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl font-semibold text-sm transition-all ${
              isDark 
                ? 'bg-neural-900/70 border border-neural-700/60 text-white hover:border-neural-glow/50 hover:shadow-lg hover:shadow-neural-glow/10' 
                : 'bg-white border border-slate-200 text-slate-700 hover:border-sky-400/60 hover:text-sky-600 shadow-md hover:shadow-lg'
            }`}
          >
            <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>View All on GitHub</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
