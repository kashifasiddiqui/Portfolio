import { Suspense, lazy, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/stores/appStore'
import { useSmoothScroll, useScrollProgress, useSectionObserver, usePerformanceDetection } from '@/hooks'
import LoadingScreen from '@/components/ui/LoadingScreen'
import Navigation from '@/components/ui/Navigation'
import ScrollProgress from '@/components/ui/ScrollProgress'
import CustomCursor from '@/components/ui/CustomCursor'

// Lazy load sections for code splitting
const HeroSection = lazy(() => import('@/sections/HeroSection'))
const TimelineSection = lazy(() => import('@/sections/TimelineSection'))
const ProjectsSection = lazy(() => import('@/sections/ProjectsSection'))
const SkillsSection = lazy(() => import('@/sections/SkillsSection'))
const ContactSection = lazy(() => import('@/sections/ContactSection'))

function App() {
  const [isReady, setIsReady] = useState(false)
  const { isLoading, setLoading, isMobile, theme, setTheme } = useAppStore()
  
  // Initialize theme on mount
  useEffect(() => {
    const stored = localStorage.getItem('portfolio-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = stored || (prefersDark ? 'dark' : 'light')
    setTheme(initialTheme)
  }, [setTheme])
  
  // Initialize performance detection
  usePerformanceDetection()
  
  // Initialize smooth scroll
  const { scrollTo } = useSmoothScroll()
  
  // Track scroll progress
  useScrollProgress()
  
  // Track active section
  useSectionObserver()

  useEffect(() => {
    // Simulate asset loading
    const loadAssets = async () => {
      // Add minimum loading time for visual effect
      await new Promise(resolve => setTimeout(resolve, 2000))
      setLoading(false)
      
      // Small delay before showing content
      setTimeout(() => setIsReady(true), 300)
    }

    loadAssets()
  }, [setLoading])

  return (
    <div className={`relative min-h-screen overflow-x-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-neural-dark' : 'bg-slate-50'
    }`}>
      {/* Loading Screen */}
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      {/* Custom Cursor (desktop only) */}
      {!isMobile && <CustomCursor />}

      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Navigation */}
      <Navigation scrollTo={scrollTo} />

      {/* Main Content */}
      <main className="relative">
        <Suspense fallback={null}>
          {isReady && (
            <>
              {/* Section 0: Hero / Neural Awakening */}
              <section data-section="0" id="hero">
                <HeroSection />
              </section>

              {/* Section 1: Learning Timeline */}
              <section data-section="1" id="timeline">
                <TimelineSection />
              </section>

              {/* Section 2: Intelligence Lab / Projects */}
              <section data-section="2" id="projects">
                <ProjectsSection />
              </section>

              {/* Section 3: Skills Galaxy */}
              <section data-section="3" id="skills">
                <SkillsSection />
              </section>

              {/* Section 4: Contact Terminal */}
              <section data-section="4" id="contact">
                <ContactSection />
              </section>
            </>
          )}
        </Suspense>
      </main>

      {/* Background Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none neural-grid-bg opacity-50" />
      
      {/* Radial Glow Effect */}
      <div className="fixed inset-0 pointer-events-none bg-radial-glow opacity-30" />
    </div>
  )
}

export default App
