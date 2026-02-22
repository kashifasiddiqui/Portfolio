import { useEffect, useState, useCallback } from 'react'
import { useAppStore } from '@/stores/appStore'

/**
 * Detect device performance and set appropriate quality
 */
export function usePerformanceDetection() {
  const setPerformanceMode = useAppStore((state) => state.setPerformanceMode)
  const setIsMobile = useAppStore((state) => state.setIsMobile)
  const setPrefersReducedMotion = useAppStore((state) => state.setPrefersReducedMotion)

  useEffect(() => {
    // Check for mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
      window.innerWidth < 768

    setIsMobile(isMobile)

    // Check for reduced motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setPrefersReducedMotion(prefersReduced)

    // Detect performance capability
    const detectPerformance = () => {
      // Check hardware concurrency (CPU cores)
      const cores = navigator.hardwareConcurrency || 2
      
      // Check device memory (if available)
      const memory = navigator.deviceMemory || 4
      
      // Check for WebGL support and capabilities
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
      
      let gpuTier = 'medium'
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
          // Basic GPU detection
          if (/intel|hd graphics|uhd graphics/i.test(renderer)) {
            gpuTier = 'low'
          } else if (/nvidia|amd|radeon|geforce|rtx|gtx/i.test(renderer)) {
            gpuTier = 'high'
          }
        }
      }

      // Determine performance mode
      if (isMobile || prefersReduced || cores <= 2 || memory <= 2 || gpuTier === 'low') {
        return 'low'
      } else if (cores >= 8 && memory >= 8 && gpuTier === 'high') {
        return 'high'
      }
      return 'medium'
    }

    const mode = detectPerformance()
    setPerformanceMode(mode)

    // Listen for reduced motion changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches)
      if (e.matches) {
        setPerformanceMode('low')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [setPerformanceMode, setIsMobile, setPrefersReducedMotion])
}

/**
 * Hook for responsive breakpoints
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    const handler = (e) => setMatches(e.matches)
    mediaQuery.addEventListener('change', handler)
    
    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}

/**
 * Common breakpoint hooks
 */
export function useIsMobile() {
  return useMediaQuery('(max-width: 767px)')
}

export function useIsTablet() {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
}

export function useIsDesktop() {
  return useMediaQuery('(min-width: 1024px)')
}

/**
 * Hook for FPS monitoring (development only)
 */
export function useFPSMonitor(enabled = false) {
  const [fps, setFps] = useState(60)

  useEffect(() => {
    if (!enabled || process.env.NODE_ENV !== 'development') return

    let frameCount = 0
    let lastTime = performance.now()
    let animationId

    const measure = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime - lastTime >= 1000) {
        setFps(frameCount)
        frameCount = 0
        lastTime = currentTime
      }
      
      animationId = requestAnimationFrame(measure)
    }

    animationId = requestAnimationFrame(measure)
    
    return () => cancelAnimationFrame(animationId)
  }, [enabled])

  return fps
}

/**
 * Hook for window resize with debounce
 */
export function useWindowSize(debounceMs = 100) {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  })

  useEffect(() => {
    let timeoutId

    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setSize({
          width: window.innerWidth,
          height: window.innerHeight
        })
      }, debounceMs)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [debounceMs])

  return size
}

/**
 * Hook for mouse position tracking
 */
export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return position
}
