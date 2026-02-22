import { motion } from 'framer-motion'
import { useState, Suspense } from 'react'
import { Scene, SkillsGalaxy } from '@/components/three'
import { usePortfolioStore, useAppStore } from '@/stores/appStore'
import { useInView, useIsMobile } from '@/hooks'

// Skill category badge
function CategoryBadge({ category, color, count }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neural-900/50 border border-neural-800">
      <div 
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-sm text-neural-300">{category}</span>
      <span className="text-xs text-neural-500">({count})</span>
    </div>
  )
}

// Skill bar for mobile/fallback view
function SkillBar({ skill, index }) {
  const [ref, isInView] = useInView({ threshold: 0.3, once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-white group-hover:text-neural-glow transition-colors">
          {skill.name}
        </span>
        <span className="text-xs font-mono text-neural-400">
          {skill.level}%
        </span>
      </div>
      <div className="h-2 bg-neural-900 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.level}%` } : {}}
          transition={{ duration: 0.8, delay: index * 0.05, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ 
            backgroundColor: skill.color,
            boxShadow: `0 0 10px ${skill.color}50`
          }}
        />
      </div>
    </motion.div>
  )
}

// Hovered skill detail panel
function SkillDetail({ skill }) {
  if (!skill) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-4 left-1/2 -translate-x-1/2 neural-card p-4 min-w-[200px]"
    >
      <div className="flex items-center gap-3 mb-2">
        <div 
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: skill.color }}
        />
        <h4 className="text-lg font-semibold text-white">{skill.name}</h4>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-neural-400 capitalize">{skill.category}</span>
        <span className="text-lg font-mono text-neural-glow">{skill.level}%</span>
      </div>
      <div className="mt-2 h-1 bg-neural-900 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full"
          style={{ 
            width: `${skill.level}%`,
            backgroundColor: skill.color
          }}
        />
      </div>
    </motion.div>
  )
}

export default function SkillsSection() {
  const { skills } = usePortfolioStore()
  const { prefersReducedMotion, theme } = useAppStore()
  const isDark = theme === 'dark'
  const [hoveredSkill, setHoveredSkill] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)
  const [titleRef, titleInView] = useInView({ threshold: 0.3, once: true })
  const isMobile = useIsMobile()

  // Group skills by category
  const categories = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = { skills: [], color: skill.color }
    }
    acc[skill.category].skills.push(skill)
    return acc
  }, {})

  const categoryLabels = {
    ml: 'AI & ML',
    lang: 'Languages',
    framework: 'Frameworks',
    tool: 'Tools'
  }

  // Show simplified view on mobile or if reduced motion is preferred
  const showSimplifiedView = isMobile || prefersReducedMotion

  return (
    <div className={`relative py-20 px-4 md:px-8 lg:px-16 overflow-hidden ${
      isDark ? 'bg-neural-dark' : 'bg-slate-50'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className={`inline-block px-4 py-2 text-sm font-mono rounded-full border mb-6 ${
            isDark 
              ? 'text-neural-glow bg-neural-glow/10 border-neural-glow/20'
              : 'text-sky-700 bg-sky-100 border-sky-300'
          }`}>
            Technical Arsenal
          </span>
          <h2 className={`section-title ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Skills <span className="neural-text">Galaxy</span>
          </h2>
          <p className={`section-subtitle mx-auto ${isDark ? '' : 'text-slate-600'}`}>
            Navigate through my constellation of technical expertise
          </p>
        </motion.div>

        {/* Interactive category filter badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          <button
            onClick={() => setActiveCategory(null)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 border ${
              activeCategory === null
                ? isDark 
                  ? 'bg-neural-glow/20 border-neural-glow text-white'
                  : 'bg-sky-100 border-sky-500 text-sky-700'
                : isDark
                  ? 'bg-neural-900/50 border-neural-800 text-neural-400 hover:border-neural-600'
                  : 'bg-white border-slate-300 text-slate-600 hover:border-slate-400 shadow-sm'
            }`}
          >
            <span className="text-sm">All</span>
            <span className={`text-xs ${isDark ? 'text-neural-500' : 'text-slate-400'}`}>({skills.length})</span>
          </button>
          {Object.entries(categories).map(([key, { skills: catSkills, color }]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(activeCategory === key ? null : key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 border ${
                activeCategory === key
                  ? isDark
                    ? 'bg-neural-glow/20 border-neural-glow text-white scale-105'
                    : 'bg-sky-100 border-sky-500 text-sky-700 scale-105'
                  : isDark
                    ? 'bg-neural-900/50 border-neural-800 text-neural-400 hover:border-neural-600'
                    : 'bg-white border-slate-300 text-slate-600 hover:border-slate-400 shadow-sm'
              }`}
            >
              <div 
                className="w-3 h-3 rounded-full transition-transform duration-300"
                style={{ 
                  backgroundColor: color,
                  boxShadow: activeCategory === key ? `0 0 10px ${color}` : 'none'
                }}
              />
              <span className="text-sm">{categoryLabels[key] || key}</span>
              <span className={`text-xs ${isDark ? 'text-neural-500' : 'text-slate-400'}`}>({catSkills.length})</span>
            </button>
          ))}
        </motion.div>

        {/* Main content area */}
        {showSimplifiedView ? (
          // Simplified skill bars for mobile
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {skills.map((skill, index) => (
              <SkillBar key={skill.name} skill={skill} index={index} />
            ))}
          </div>
        ) : (
          // 3D Galaxy visualization for desktop
          <div className="relative h-[500px] lg:h-[550px]">
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-12 h-12 border-2 border-neural-glow border-t-transparent rounded-full"
                />
              </div>
            }>
              <Scene 
                cameraPosition={[0, 0, 7]}
                enablePostProcessing={true}
              >
                <SkillsGalaxy 
                  onSkillHover={setHoveredSkill} 
                  activeCategory={activeCategory}
                />
              </Scene>
            </Suspense>

            {/* Hovered skill detail */}
            {hoveredSkill && <SkillDetail skill={hoveredSkill} />}

            {/* Interaction hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className={`absolute bottom-2 right-4 flex items-center gap-2 text-sm font-mono ${
                isDark ? 'text-neural-500' : 'text-slate-500'
              }`}
            >
              <motion.span
                animate={{ x: [-3, 3, -3] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                👆
              </motion.span>
              Hover nodes • Click badges to filter
            </motion.div>
          </div>
        )}

        {/* Stats summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
        >
          {[
            { value: skills.length, label: 'Technologies', icon: '🔧' },
            { value: `${Math.round(skills.reduce((a, s) => a + s.level, 0) / skills.length)}%`, label: 'Proficiency', icon: '📊' },
            { value: '4+', label: 'Years Freelance', icon: '💼' },
            { value: '20+', label: 'Projects', icon: '🚀' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`p-3 sm:p-5 text-center cursor-default group rounded-xl border ${
                isDark 
                  ? 'bg-neural-900/50 border-neural-800 hover:border-neural-glow/30'
                  : 'bg-white border-slate-200 hover:border-sky-300 shadow-md hover:shadow-lg'
              }`}
            >
              <div className="text-xl md:text-2xl mb-1.5 sm:mb-2 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-display font-bold neural-text mb-0.5 sm:mb-1">
                {stat.value}
              </div>
              <div className={`text-[10px] sm:text-xs ${isDark ? 'text-neural-400' : 'text-slate-500'}`}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
