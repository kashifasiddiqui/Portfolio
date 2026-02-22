import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/stores/appStore'

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useAppStore()
  const isDark = theme === 'dark'

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${
        isDark 
          ? 'bg-neural-glow/10 border border-neural-glow/30 hover:border-neural-glow/50' 
          : 'bg-amber-100 border border-amber-300 hover:border-amber-400'
      } ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.svg
            key="moon"
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="w-5 h-5 text-neural-glow"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </motion.svg>
        ) : (
          <motion.svg
            key="sun"
            initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="w-5 h-5 text-amber-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </motion.svg>
        )}
      </AnimatePresence>

      {/* Animated background glow */}
      <motion.div
        className={`absolute inset-0 rounded-xl pointer-events-none ${
          isDark ? 'bg-neural-glow/5' : 'bg-amber-300/20'
        }`}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </motion.button>
  )
}

// Compact version for mobile menu
export function ThemeToggleCompact({ className = '' }) {
  const { theme, toggleTheme } = useAppStore()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isDark 
          ? 'bg-neural-900/50 text-neural-300 hover:bg-neural-800/50' 
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      } ${className}`}
    >
      {isDark ? (
        <>
          <svg className="w-5 h-5 text-neural-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <span>Dark Mode</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span>Light Mode</span>
        </>
      )}
    </button>
  )
}
