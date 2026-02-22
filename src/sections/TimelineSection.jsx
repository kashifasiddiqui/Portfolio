import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { usePortfolioStore, useAppStore } from '@/stores/appStore'
import { useInView } from '@/hooks'
import { Scene, TimelineScene } from '@/components/three'

// Timeline item icons
const icons = {
  spark: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  brain: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path d="M12 2a9 9 0 0 0-9 9c0 3.6 2.4 6.6 5.7 7.7.3.1.5.3.5.6v1.7c0 .6.4 1 1 1h3.6c.6 0 1-.4 1-1v-1.7c0-.3.2-.5.5-.6 3.3-1.1 5.7-4.1 5.7-7.7a9 9 0 0 0-9-9z" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 6v4M10 8h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  language: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 0 1 6.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  rocket: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  cube: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2"/>
      <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}

// Individual timeline item
function TimelineItem({ item, index, isLast, isDark }) {
  const [ref, isInView] = useInView({ threshold: 0.3, once: true })
  const isEven = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative flex items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col md:gap-8`}
    >
      {/* Content card */}
      <div className={`w-full md:w-5/12 ${isEven ? 'md:text-right' : 'md:text-left'}`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-6 md:p-8 rounded-xl border backdrop-blur-sm ${
            isDark 
              ? 'bg-neural-900/50 border-neural-800' 
              : 'bg-white/80 border-slate-200 shadow-lg'
          }`}
        >
          <span 
            className="inline-block px-3 py-1 text-sm font-mono rounded-full mb-4"
            style={{ 
              backgroundColor: `${item.color}15`,
              color: item.color,
              border: `1px solid ${item.color}30`
            }}
          >
            {item.year}
          </span>
          <h3 className={`text-xl md:text-2xl font-display font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {item.title}
          </h3>
          <p className={`leading-relaxed ${isDark ? 'text-neural-400' : 'text-slate-600'}`}>
            {item.description}
          </p>
        </motion.div>
      </div>

      {/* Center line and icon */}
      <div className="relative flex items-center justify-center w-full md:w-2/12 my-4 md:my-0">
        {/* Vertical line */}
        <div className="absolute h-full w-px bg-gradient-to-b from-neural-glow/50 via-neural-glow/20 to-transparent hidden md:block" />
        
        {/* Icon circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, delay: index * 0.1 + 0.3, type: 'spring' }}
          className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center border-2"
          style={{ 
            borderColor: item.color,
            backgroundColor: `${item.color}15`,
            boxShadow: `0 0 20px ${item.color}30`
          }}
        >
          <span style={{ color: item.color }}>
            {icons[item.icon] || icons.spark}
          </span>
        </motion.div>

        {/* Connection dot to next item */}
        {!isLast && (
          <div 
            className="absolute bottom-0 translate-y-full w-2 h-2 rounded-full hidden md:block"
            style={{ backgroundColor: item.color }}
          />
        )}
      </div>

      {/* Empty space for alternating layout */}
      <div className="hidden md:block w-5/12" />
    </motion.div>
  )
}

export default function TimelineSection() {
  const containerRef = useRef(null)
  const { timeline } = usePortfolioStore()
  const { theme } = useAppStore()
  const isDark = theme === 'dark'
  const [titleRef, titleInView] = useInView({ threshold: 0.3, once: true })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <div ref={containerRef} className={`section-container relative overflow-hidden ${isDark ? 'bg-neural-dark' : 'bg-slate-50'}`}>
      {/* 3D Background Scene */}
      <div className="absolute inset-0 pointer-events-none">
        <Scene>
          <TimelineScene scrollProgress={scrollYProgress} isDark={isDark} />
        </Scene>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-24"
        >
          <span className={`inline-block px-4 py-2 text-sm font-mono rounded-full border mb-6 ${
            isDark 
              ? 'text-neural-glow bg-neural-glow/10 border-neural-glow/20' 
              : 'text-sky-600 bg-sky-500/10 border-sky-500/30'
          }`}>
            My Journey
          </span>
          <h2 className={`section-title ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Learning <span className="neural-text">Timeline</span>
          </h2>
          <p className={`section-subtitle mx-auto ${isDark ? '' : 'text-slate-600'}`}>
            A chronicle of growth, from curious beginner to AI solutions architect
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Animated progress line */}
          <motion.div
            className="absolute left-1/2 top-0 w-px bg-gradient-to-b from-neural-glow to-neural-purple hidden md:block"
            style={{ height: lineHeight, transform: 'translateX(-50%)' }}
          />

          {/* Timeline items */}
          <div className="space-y-8 md:space-y-0">
            {timeline.map((item, index) => (
              <TimelineItem
                key={item.id}
                item={item}
                index={index}
                isLast={index === timeline.length - 1}
                isDark={isDark}
              />
            ))}
          </div>
        </div>

        {/* Future indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-16"
        >
          <div className={`flex flex-col items-center ${isDark ? 'text-neural-500' : 'text-slate-400'}`}>
            <div className={`w-px h-12 bg-gradient-to-b ${isDark ? 'from-neural-glow/50' : 'from-sky-500/50'} to-transparent`} />
            <span className="mt-4 text-sm font-mono">The journey continues...</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
