import { motion, AnimatePresence, useScroll } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { usePortfolioStore, useAppStore } from '@/stores/appStore'
import { useInView } from '@/hooks'
import { Scene, ContactScene } from '@/components/three'

// Terminal typing effect component
function TypingText({ text, onComplete, speed = 50 }) {
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(interval)
        setIsComplete(true)
        onComplete?.()
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, onComplete])

  return (
    <span>
      {displayText}
      {!isComplete && <span className="terminal-cursor" />}
    </span>
  )
}

// Terminal line component
function TerminalLine({ prompt = '>', children, delay = 0 }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  if (!show) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="terminal-line mb-2"
    >
      <span className="terminal-prompt">{prompt}</span>
      <span className="text-white ml-2">{children}</span>
    </motion.div>
  )
}

// Social link component
function SocialLink({ href, icon, label, isDark }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition-all group ${
        isDark 
          ? 'bg-neural-900/50 border-neural-800 hover:border-neural-glow/50' 
          : 'bg-white border-slate-200 hover:border-sky-400 shadow-md hover:shadow-lg'
      }`}
    >
      <span className={`group-hover:scale-110 transition-transform ${
        isDark ? 'text-neural-glow' : 'text-sky-600'
      }`}>
        {icon}
      </span>
      <span className={`transition-colors ${
        isDark 
          ? 'text-white group-hover:text-neural-glow' 
          : 'text-slate-700 group-hover:text-sky-600'
      }`}>
        {label}
      </span>
    </motion.a>
  )
}

// Contact form component - Configured with Web3Forms
function ContactForm() {
  const { theme } = useAppStore()
  const isDark = theme === 'dark'
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('')

  // Web3Forms access key - Set in .env file as VITE_WEB3FORMS_KEY
  const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)
    setErrorMessage('')

    // Validate form
    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) {
      setErrorMessage('Please fill in all fields')
      setIsSubmitting(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formState.email)) {
      setErrorMessage('Please enter a valid email address')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: formState.name,
          email: formState.email,
          message: formState.message,
          subject: `Portfolio Contact: ${formState.name}`,
          from_name: 'Portfolio Website'
        })
      })

      const result = await response.json()

      if (result.success) {
        setSubmitStatus('success')
        setFormState({ name: '', email: '', message: '' })
        
        // Reset success state after 5 seconds
        setTimeout(() => {
          setSubmitStatus(null)
        }, 5000)
      } else {
        throw new Error(result.message || 'Failed to send message')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
      setErrorMessage(error.message || 'Failed to send message. Please try again.')
      
      // Reset error after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null)
        setErrorMessage('')
      }, 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormState(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    // Clear error when user starts typing
    if (errorMessage) setErrorMessage('')
  }

  // Alternative: Open email client directly
  const handleEmailFallback = () => {
    const subject = encodeURIComponent(`Portfolio Contact from ${formState.name || 'Visitor'}`)
    const body = encodeURIComponent(`Name: ${formState.name}\nEmail: ${formState.email}\n\nMessage:\n${formState.message}`)
    window.open(`mailto:kashif.arshad.siddiqui@gmail.com?subject=${subject}&body=${body}`, '_blank')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error message */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3 rounded-lg border text-sm ${
              isDark 
                ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                : 'bg-red-50 border-red-200 text-red-600'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errorMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className={`block text-sm mb-2 ${isDark ? 'text-neural-400' : 'text-slate-600'}`}>
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formState.name}
            onChange={handleChange}
            required
            className={`w-full px-4 py-3 rounded-lg transition-all focus:outline-none focus:ring-2 ${
              isDark 
                ? 'bg-neural-950 border border-neural-800 text-white placeholder-neural-500 focus:border-neural-glow focus:ring-neural-glow/30' 
                : 'bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:ring-sky-500/30'
            }`}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className={`block text-sm mb-2 ${isDark ? 'text-neural-400' : 'text-slate-600'}`}>
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formState.email}
            onChange={handleChange}
            required
            className={`w-full px-4 py-3 rounded-lg transition-all focus:outline-none focus:ring-2 ${
              isDark 
                ? 'bg-neural-950 border border-neural-800 text-white placeholder-neural-500 focus:border-neural-glow focus:ring-neural-glow/30' 
                : 'bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:ring-sky-500/30'
            }`}
            placeholder="mail@example.com"
          />
        </div>
      </div>
      <div>
        <label htmlFor="message" className={`block text-sm mb-2 ${isDark ? 'text-neural-400' : 'text-slate-600'}`}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formState.message}
          onChange={handleChange}
          required
          rows={5}
          className={`w-full px-4 py-3 rounded-lg transition-all resize-none focus:outline-none focus:ring-2 ${
            isDark 
              ? 'bg-neural-950 border border-neural-800 text-white placeholder-neural-500 focus:border-neural-glow focus:ring-neural-glow/30' 
              : 'bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:ring-sky-500/30'
          }`}
          placeholder="Tell me about your project..."
        />
      </div>

      {/* Submit button */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
          submitStatus === 'success'
            ? isDark 
              ? 'bg-green-500/20 border border-green-500/50 text-green-400' 
              : 'bg-green-50 border border-green-200 text-green-600'
            : submitStatus === 'error'
              ? isDark 
                ? 'bg-red-500/20 border border-red-500/50 text-red-400' 
                : 'bg-red-50 border border-red-200 text-red-600'
              : isDark
                ? 'neural-button-primary'
                : 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30 hover:shadow-xl'
        }`}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Sending...</span>
          </>
        ) : submitStatus === 'success' ? (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Message Sent!</span>
          </>
        ) : submitStatus === 'error' ? (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Failed to Send</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Send Message</span>
          </>
        )}
      </motion.button>

      {/* Email fallback link */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={handleEmailFallback}
          className={`text-sm transition-colors ${
            isDark 
              ? 'text-neural-500 hover:text-neural-glow' 
              : 'text-slate-500 hover:text-sky-600'
          }`}
        >
          Or open in email client →
        </button>
      </div>
    </form>
  )
}

export default function ContactSection() {
  const { personalInfo } = usePortfolioStore()
  const { theme } = useAppStore()
  const isDark = theme === 'dark'
  const [titleRef, titleInView] = useInView({ threshold: 0.3, once: true })
  const [terminalStarted, setTerminalStarted] = useState(false)
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  useEffect(() => {
    if (titleInView) {
      const timer = setTimeout(() => setTerminalStarted(true), 500)
      return () => clearTimeout(timer)
    }
  }, [titleInView])

  const socialLinks = [
    {
      href: personalInfo.social.github,
      label: 'GitHub',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    },
    {
      href: personalInfo.social.linkedin,
      label: 'LinkedIn',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      href: `mailto:${personalInfo.email}`,
      label: 'Email',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ]

  return (
    <div ref={containerRef} className={`section-container relative overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-b from-neural-dark to-neural-950' 
        : 'bg-gradient-to-b from-slate-100 to-white'
    }`}>
      {/* 3D Background Scene */}
      <div className="absolute inset-0 pointer-events-none">
        <Scene>
          <ContactScene scrollProgress={scrollYProgress} isDark={isDark} />
        </Scene>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
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
              : 'text-sky-600 bg-sky-500/10 border-sky-500/30'
          }`}>
            Establish Connection
          </span>
          <h2 className={`section-title ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Contact <span className="neural-text">Terminal</span>
          </h2>
          <p className={`section-subtitle mx-auto ${isDark ? '' : 'text-slate-600'}`}>
            Ready to collaborate? Let's build something intelligent together
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Terminal section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="terminal"
          >
            <div className="terminal-header">
              <div className="terminal-dot bg-red-500" />
              <div className="terminal-dot bg-yellow-500" />
              <div className="terminal-dot bg-green-500" />
              <span className="ml-4 text-xs text-neural-500 font-mono">contact.sh</span>
            </div>
            <div className="terminal-body min-h-[300px]">
              {terminalStarted && (
                <>
                  <TerminalLine prompt="$" delay={0}>
                    <TypingText text="whoami" speed={80} />
                  </TerminalLine>
                  <TerminalLine prompt="" delay={500}>
                    <span className="text-neural-glow">{personalInfo.name}</span> - {personalInfo.title}
                  </TerminalLine>
                  
                  <TerminalLine prompt="$" delay={1000}>
                    <TypingText text="cat about.txt" speed={60} />
                  </TerminalLine>
                  <TerminalLine prompt="" delay={1500}>
                    {personalInfo.tagline}
                  </TerminalLine>

                  <TerminalLine prompt="$" delay={2000}>
                    <TypingText text="echo $AVAILABILITY" speed={60} />
                  </TerminalLine>
                  <TerminalLine prompt="" delay={2500}>
                    <span className="text-green-400">✓ Open to opportunities</span>
                  </TerminalLine>

                  <TerminalLine prompt="$" delay={3000}>
                    <TypingText text="./connect --help" speed={60} />
                  </TerminalLine>
                  <TerminalLine prompt="" delay={3500}>
                    <span className="text-neural-400">
                      Use the form or connect via social links →
                    </span>
                  </TerminalLine>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 4 }}
                    className="mt-4"
                  >
                    <TerminalLine prompt="$">
                      <span className="terminal-cursor" />
                    </TerminalLine>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>

          {/* Contact form section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="neural-card p-6 md:p-8"
          >
            <h3 className="text-xl font-display font-semibold text-white mb-6">
              Send a Message
            </h3>
            <ContactForm />
          </motion.div>
        </div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          <h4 className={`text-center mb-6 ${isDark ? 'text-neural-400' : 'text-slate-600'}`}>Or connect via</h4>
          <div className="flex flex-wrap justify-center gap-4">
            {socialLinks.map((link) => (
              <SocialLink key={link.label} {...link} isDark={isDark} />
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 pt-8 border-t border-neural-800 text-center"
        >
          <p className="text-neural-500 text-sm">
            Designed & Built by <span className="text-neural-glow">{personalInfo.name}</span>
          </p>
          <p className="text-neural-600 text-xs mt-2">
            © {new Date().getFullYear()} All rights reserved
          </p>
        </motion.footer>
      </div>
    </div>
  )
}
