import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAppStore } from '@/stores/appStore'

/**
 * Visitor Counter Component
 * Uses CounterAPI.dev for free, persistent visitor counting
 */
export default function VisitorCounter() {
  const { theme } = useAppStore()
  const isDark = theme === 'dark'
  const [count, setCount] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const fetchAndIncrement = async () => {
      try {
        // Use CounterAPI.dev - a free visitor counter API
        const response = await fetch(
          'https://api.counterapi.dev/v1/kashif-portfolio/visitors/up'
        )
        const data = await response.json()
        if (data.count !== undefined) {
          setCount(data.count)
        }
      } catch (error) {
        console.error('Counter API error:', error)
        // Fallback to localStorage-based counter
        const stored = localStorage.getItem('portfolio-visitor-count')
        const localCount = stored ? parseInt(stored, 10) + 1 : 1
        localStorage.setItem('portfolio-visitor-count', localCount.toString())
        setCount(localCount)
      } finally {
        setIsLoading(false)
        setTimeout(() => setHasAnimated(true), 100)
      }
    }

    fetchAndIncrement()
  }, [])

  // Format number with commas
  const formatNumber = (num) => {
    if (num === null) return '---'
    return num.toLocaleString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.5, duration: 0.6 }}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm text-sm font-mono ${
        isDark
          ? 'bg-neural-950/80 border border-neural-glow/20'
          : 'bg-white/90 border-2 border-sky-200 shadow-md'
      }`}
    >
      {/* Eye Icon */}
      <svg
        className={`w-4 h-4 ${isDark ? 'text-neural-glow' : 'text-sky-600'}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>

      {/* Counter Display */}
      <div className="flex items-center gap-1">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={isDark ? 'text-neural-400' : 'text-slate-400'}
            >
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ...
              </motion.span>
            </motion.span>
          ) : (
            <motion.span
              key="count"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`font-bold ${isDark ? 'text-neural-glow' : 'text-sky-600'}`}
            >
              {hasAnimated ? (
                formatNumber(count)
              ) : (
                <CountUpAnimation target={count || 0} />
              )}
            </motion.span>
          )}
        </AnimatePresence>
        <span className={isDark ? 'text-neural-400' : 'text-slate-500'}>
          visitors
        </span>
      </div>
    </motion.div>
  )
}

/**
 * Count up animation component
 */
function CountUpAnimation({ target, duration = 1500 }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (target === 0) {
      setCurrent(0)
      return
    }

    const startTime = Date.now()
    const startValue = 0

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const value = Math.floor(startValue + (target - startValue) * eased)
      
      setCurrent(value)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [target, duration])

  return <>{current.toLocaleString()}</>
}
