import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [text, setText] = useState('Initializing neural network')

  useEffect(() => {
    const texts = [
      'Initializing neural network',
      'Loading synaptic connections',
      'Calibrating thought patterns',
      'Awakening consciousness'
    ]

    let textIndex = 0
    const textInterval = setInterval(() => {
      textIndex = (textIndex + 1) % texts.length
      setText(texts[textIndex])
    }, 500)

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)

    return () => {
      clearInterval(textInterval)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-neural-dark"
    >
      {/* Animated Brain Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-12"
      >
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="w-32 h-32 rounded-full border-2 border-neural-glow/30"
        />
        
        {/* Inner ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-2 rounded-full border border-neural-cyan/40"
        />

        {/* Center brain icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                stroke="#00d4ff"
                strokeWidth="1"
                className="opacity-30"
              />
              <circle cx="12" cy="8" r="2" fill="#00d4ff" />
              <circle cx="8" cy="12" r="2" fill="#00d4ff" />
              <circle cx="16" cy="12" r="2" fill="#00d4ff" />
              <circle cx="10" cy="16" r="2" fill="#00d4ff" />
              <circle cx="14" cy="16" r="2" fill="#00d4ff" />
              <line x1="12" y1="8" x2="8" y2="12" stroke="#00d4ff" strokeWidth="1" />
              <line x1="12" y1="8" x2="16" y2="12" stroke="#00d4ff" strokeWidth="1" />
              <line x1="8" y1="12" x2="10" y2="16" stroke="#00d4ff" strokeWidth="1" />
              <line x1="16" y1="12" x2="14" y2="16" stroke="#00d4ff" strokeWidth="1" />
              <line x1="10" y1="16" x2="14" y2="16" stroke="#00d4ff" strokeWidth="1" />
            </svg>
          </motion.div>
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-neural-glow/10 blur-xl" />
      </motion.div>

      {/* Loading text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-8"
      >
        <h2 className="text-xl font-display text-white mb-2">
          Inside the Mind
        </h2>
        <p className="text-neural-glow font-mono text-sm">
          {text}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            _
          </motion.span>
        </p>
      </motion.div>

      {/* Progress bar */}
      <div className="w-64 h-1 bg-neural-900 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          className="h-full bg-gradient-to-r from-neural-glow to-neural-cyan rounded-full"
          style={{
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)'
          }}
        />
      </div>

      {/* Progress percentage */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-neural-400 font-mono text-xs"
      >
        {Math.min(Math.round(progress), 100)}%
      </motion.p>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0
            }}
            animate={{ 
              y: [null, -100],
              opacity: [0, 0.5, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            className="absolute w-1 h-1 bg-neural-glow rounded-full"
          />
        ))}
      </div>
    </motion.div>
  )
}
