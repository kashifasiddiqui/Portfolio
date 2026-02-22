import { motion, useSpring } from 'framer-motion'
import { useAppStore } from '@/stores/appStore'

export default function ScrollProgress() {
  const scrollProgress = useAppStore((state) => state.scrollProgress)
  
  const scaleX = useSpring(scrollProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, #00d4ff 0%, #22d3ee 50%, #a855f7 100%)',
        boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)'
      }}
    />
  )
}
