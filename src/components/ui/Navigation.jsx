import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAppStore } from '@/stores/appStore'
import ThemeToggle, { ThemeToggleCompact } from './ThemeToggle'

const navItems = [
  { id: 'hero', label: 'Home', index: 0 },
  { id: 'timeline', label: 'Journey', index: 1 },
  { id: 'projects', label: 'Projects', index: 2 },
  { id: 'skills', label: 'Skills', index: 3 },
  { id: 'contact', label: 'Contact', index: 4 }
]

export default function Navigation({ scrollTo }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { currentSection, isMobile, theme } = useAppStore()
  const isDark = theme === 'dark'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (id) => {
    scrollTo(`#${id}`)
    setIsOpen(false)
  }

  return (
    <>
      {/* Desktop Navigation */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 2.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? isDark 
              ? 'bg-neural-dark/90 backdrop-blur-lg border-b border-neural-glow/10' 
              : 'bg-white/95 backdrop-blur-lg border-b border-slate-300 shadow-md'
            : ''
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.button
            onClick={() => handleNavClick('hero')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 group"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              isDark 
                ? 'bg-neural-glow/10 border border-neural-glow/30 group-hover:border-neural-glow/50'
                : 'bg-sky-100 border-2 border-sky-400 group-hover:border-sky-500'
            }`}>
              <span className={`font-display font-bold text-lg ${
                isDark ? 'text-neural-glow' : 'text-sky-700'
              }`}>KS</span>
            </div>
            <span className={`hidden sm:block font-display font-semibold ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Kashif Siddiqui
            </span>
          </motion.button>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                  currentSection === item.index
                    ? isDark ? 'text-neural-glow' : 'text-sky-700'
                    : isDark ? 'text-neural-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {item.label}
                {currentSection === item.index && (
                  <motion.div
                    layoutId="activeNav"
                    className={`absolute inset-0 rounded-lg border ${
                      isDark 
                        ? 'bg-neural-glow/10 border-neural-glow/20' 
                        : 'bg-sky-100 border-sky-300'
                    }`}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Theme Toggle & CTA */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle className="w-10 h-10" />
            <motion.button
              onClick={() => handleNavClick('contact')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-300 ${
                isDark 
                  ? 'bg-neural-glow/10 border border-neural-glow/30 text-neural-glow hover:bg-neural-glow/20'
                  : 'bg-sky-600 text-white hover:bg-sky-700'
              }`}
            >
              Get in Touch
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle className="w-10 h-10" />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="relative w-10 h-10 flex items-center justify-center"
            >
            <div className="w-6 h-5 flex flex-col justify-between">
              <motion.span
                animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className={`w-full h-0.5 origin-left transition-colors ${isDark ? 'bg-white' : 'bg-slate-800'}`}
              />
              <motion.span
                animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                className={`w-full h-0.5 transition-colors ${isDark ? 'bg-white' : 'bg-slate-800'}`}
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className={`w-full h-0.5 origin-left transition-colors ${isDark ? 'bg-white' : 'bg-slate-800'}`}
              />
            </div>
          </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className={`absolute inset-0 backdrop-blur-xl ${
                isDark ? 'bg-neural-dark/95' : 'bg-white/95'
              }`}
            />

            {/* Menu Content */}
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.1 }}
              className="relative h-full flex flex-col items-center justify-center gap-8"
            >
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`text-2xl font-display font-semibold transition-colors ${
                    currentSection === item.index
                      ? isDark ? 'text-neural-glow' : 'text-sky-600'
                      : isDark ? 'text-white hover:text-neural-glow' : 'text-slate-800 hover:text-sky-600'
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}

              <motion.button
                onClick={() => handleNavClick('contact')}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.3 }}
                className={`mt-4 px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${
                  isDark
                    ? 'bg-gradient-to-r from-neural-glow to-neural-accent text-neural-dark'
                    : 'bg-sky-600 text-white hover:bg-sky-700'
                }`}
              >
                Get in Touch
              </motion.button>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Dots Navigation (Desktop) */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 3 }}
          className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-4"
        >
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              whileHover={{ scale: 1.2 }}
              className="group relative"
            >
              <div
                className={`w-3 h-3 rounded-full border transition-all duration-300 ${
                  currentSection === item.index
                    ? isDark 
                      ? 'bg-neural-glow border-neural-glow scale-125'
                      : 'bg-sky-600 border-sky-600 scale-125'
                    : isDark
                      ? 'bg-transparent border-neural-500 group-hover:border-neural-glow'
                      : 'bg-transparent border-slate-400 group-hover:border-sky-600'
                }`}
              />
              <span className={`absolute right-6 top-1/2 -translate-y-1/2 text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ${
                isDark ? 'text-neural-300' : 'text-slate-600'
              }`}>
                {item.label}
              </span>
            </motion.button>
          ))}
        </motion.div>
      )}
    </>
  )
}
