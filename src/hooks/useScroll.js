import { useEffect, useRef, useState, useCallback } from 'react'
import { useAppStore } from '@/stores/appStore'

/**
 * Hook for smooth scrolling with Lenis
 */
export function useSmoothScroll() {
  const lenisRef = useRef(null)

  useEffect(() => {
    const initLenis = async () => {
      const Lenis = (await import('lenis')).default
      
      lenisRef.current = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false
      })

      function raf(time) {
        lenisRef.current?.raf(time)
        requestAnimationFrame(raf)
      }

      requestAnimationFrame(raf)
    }

    initLenis()

    return () => {
      lenisRef.current?.destroy()
    }
  }, [])

  const scrollTo = useCallback((target, options = {}) => {
    lenisRef.current?.scrollTo(target, {
      offset: 0,
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      ...options
    })
  }, [])

  return { lenis: lenisRef.current, scrollTo }
}

/**
 * Hook for tracking scroll progress
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  const setScrollProgress = useAppStore((state) => state.setScrollProgress)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0
      
      setProgress(scrollPercent)
      setScrollProgress(scrollPercent)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [setScrollProgress])

  return progress
}

/**
 * Hook for section visibility detection
 */
export function useSectionObserver(threshold = 0.5) {
  const [activeSection, setActiveSection] = useState(0)
  const setCurrentSection = useAppStore((state) => state.setCurrentSection)

  useEffect(() => {
    const sections = document.querySelectorAll('[data-section]')
    
    // Find which section is most visible in viewport
    const handleScroll = () => {
      let mostVisibleSection = 0
      let maxVisibleRatio = 0
      
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        
        // Calculate how much of the section is visible
        const visibleTop = Math.max(0, rect.top)
        const visibleBottom = Math.min(viewportHeight, rect.bottom)
        const visibleHeight = Math.max(0, visibleBottom - visibleTop)
        
        // Give higher weight to sections that fill more of the viewport
        const sectionIndex = parseInt(section.dataset.section, 10)
        const visibleRatio = visibleHeight / viewportHeight
        
        // Boost last section when at bottom of page
        const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 100
        const boost = (atBottom && sectionIndex === sections.length - 1) ? 0.5 : 0
        
        if ((visibleRatio + boost) > maxVisibleRatio) {
          maxVisibleRatio = visibleRatio + boost
          mostVisibleSection = sectionIndex
        }
      })
      
      setActiveSection(mostVisibleSection)
      setCurrentSection(mostVisibleSection)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [setCurrentSection])

  return activeSection
}

/**
 * Hook for element in view animation trigger
 */
export function useInView(options = {}) {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (options.once) {
            observer.unobserve(element)
          }
        } else if (!options.once) {
          setIsInView(false)
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px'
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [options.once, options.threshold, options.rootMargin])

  return [ref, isInView]
}
