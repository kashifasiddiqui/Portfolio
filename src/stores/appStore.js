import { create } from 'zustand'

// Get initial theme from localStorage or system preference
const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('portfolio-theme')
    if (stored) return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'dark'
}

// Main app store for global state management
export const useAppStore = create((set, get) => ({
  // Theme state
  theme: getInitialTheme(),
  setTheme: (theme) => {
    localStorage.setItem('portfolio-theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.classList.toggle('light', theme === 'light')
    set({ theme })
  },
  toggleTheme: () => {
    const newTheme = get().theme === 'dark' ? 'light' : 'dark'
    get().setTheme(newTheme)
  },

  // Loading state
  isLoading: true,
  loadingProgress: 0,
  setLoading: (isLoading) => set({ isLoading }),
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),

  // Current section tracking
  currentSection: 0,
  setCurrentSection: (section) => set({ currentSection: section }),

  // Scroll progress (0-1)
  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),

  // Mobile detection
  isMobile: false,
  setIsMobile: (isMobile) => set({ isMobile }),

  // Reduced motion preference
  prefersReducedMotion: false,
  setPrefersReducedMotion: (prefers) => set({ prefersReducedMotion: prefers }),

  // Sound enabled
  soundEnabled: false,
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

  // Performance mode (low, medium, high)
  performanceMode: 'high',
  setPerformanceMode: (mode) => set({ performanceMode: mode }),

  // 3D quality settings based on performance
  get3DSettings: () => {
    const mode = get().performanceMode
    const settings = {
      low: {
        particleCount: 500,
        enablePostProcessing: false,
        shadowQuality: 'none',
        antialias: false,
        pixelRatio: 1
      },
      medium: {
        particleCount: 1500,
        enablePostProcessing: true,
        shadowQuality: 'low',
        antialias: true,
        pixelRatio: Math.min(1.5, window.devicePixelRatio)
      },
      high: {
        particleCount: 3000,
        enablePostProcessing: true,
        shadowQuality: 'high',
        antialias: true,
        pixelRatio: Math.min(2, window.devicePixelRatio)
      }
    }
    return settings[mode]
  }
}))

// Portfolio data store
export const usePortfolioStore = create((set) => ({
  // Personal info
  personalInfo: {
    name: 'Kashif Siddiqui',
    title: 'Backend, AI & Machine Learning Developer',
    tagline: 'Building intelligent, scalable AI-powered systems with real-world impact.',
    email: 'kashif.arshad.siddiqui@gmail.com',
    location: 'Mumbai, Maharashtra',
    phone: '+91-8010367167',
    social: {
      github: 'https://github.com/kashifasiddiqui',
      linkedin: 'https://www.linkedin.com/in/kashif-arshad-siddiqui/'
    }
  },

  // Timeline data
  timeline: [
    {
      id: 1,
      year: '2022',
      title: 'The Beginning',
      description: 'Started my journey into Backend Development and AI/ML',
      icon: 'spark',
      color: '#00d4ff'
    },
    {
      id: 2,
      year: '2023',
      title: 'Deep Learning & IoT',
      description: 'Built Cassandra Smart Safety Jacket - IoT-enabled safety solution',
      icon: 'brain',
      color: '#22d3ee'
    },
    {
      id: 3,
      year: '2024',
      title: 'VNPS Winner',
      description: 'Won VNPS National Level Project Competition',
      icon: 'rocket',
      color: '#a855f7'
    },
    {
      id: 4,
      year: '2024',
      title: 'HackWart Success',
      description: '2nd Runner-Up at HackWart 24-Hour Hackathon',
      icon: 'cube',
      color: '#f472b6'
    },
    {
      id: 5,
      year: '2025',
      title: 'AI Solutions Developer',
      description: 'Building SmartPick & AI Mock Interviewer - Production AI systems',
      icon: 'language',
      color: '#fbbf24'
    },
    {
      id: 6,
      year: '2026',
      title: 'GIS & Solar Tech',
      description: 'Building Voltera - Web-based GIS platform for rooftop solar potential estimation',
      icon: 'globe',
      color: '#22c55e'
    }
  ],

  // Projects data
  projects: [
    {
      id: 1,
      title: 'SmartPick',
      description: 'AI-driven recommendation and decision system for smarter choices using machine learning algorithms.',
      tags: ['Python', 'TensorFlow', 'FastAPI', 'PostgreSQL'],
      image: '/projects/smartpick.jpg',
      github: 'https://github.com/kashifasiddiqui/SmartPick',
      demo: '#',
      featured: true
    },
    {
      id: 2,
      title: 'AI Mock Interviewer',
      description: 'Real-time AI-powered mock interview platform with intelligent feedback and scoring system.',
      tags: ['React', 'Node.js', 'OpenAI', 'WebRTC'],
      image: '/projects/mock-interviewer.jpg',
      github: 'https://github.com/kashifasiddiqui/AI-Mock-Interviewer2',
      demo: '#',
      featured: true
    },
    {
      id: 3,
      title: 'Cassandra Smart Safety Jacket',
      description: 'IoT-enabled safety jacket with real-time sensor monitoring and emergency alerts for workers.',
      tags: ['IoT', 'Arduino', 'Python', 'Cloud'],
      image: '/projects/cassandra.jpg',
      github: '#',
      demo: '#',
      featured: true
    },
    {
      id: 4,
      title: 'Voltera',
      description: 'Web-based GIS platform to estimate rooftop solar potential and energy generation for residential buildings using satellite imagery.',
      tags: ['React', 'Node.js', 'Leaflet.js', 'GIS', 'Python', 'TensorFlow'],
      image: '/projects/voltera.jpg',
      github: 'https://github.com/reyansh-byte/Voltera--Your-Solar-Energy-Solution-',
      demo: '#',
      featured: true
    }
  ],

  // Skills data
  skills: [
    // Core AI/ML
    { name: 'TensorFlow', level: 90, category: 'ml', color: '#ff6f00' },
    { name: 'PyTorch', level: 88, category: 'ml', color: '#ee4c2c' },
    { name: 'OpenAI API', level: 85, category: 'ml', color: '#00a67e' },
    { name: 'LangChain', level: 82, category: 'ml', color: '#2dd4bf' },
    
    // Languages
    { name: 'Python', level: 95, category: 'lang', color: '#3776ab' },
    { name: 'TypeScript', level: 80, category: 'lang', color: '#3178c6' },
    { name: 'SQL', level: 85, category: 'lang', color: '#f29111' },
    
    // Frameworks
    { name: 'FastAPI', level: 90, category: 'framework', color: '#009688' },
    { name: 'Flask', level: 88, category: 'framework', color: '#ffffff' },
    { name: 'React', level: 82, category: 'framework', color: '#61dafb' },
    
    // Databases
    { name: 'PostgreSQL', level: 88, category: 'tool', color: '#336791' },
    { name: 'MongoDB', level: 85, category: 'tool', color: '#47a248' },
    
    // Tools
    { name: 'Docker', level: 85, category: 'tool', color: '#2496ed' },
    { name: 'Kubernetes', level: 75, category: 'tool', color: '#326ce5' },
    { name: 'AWS', level: 80, category: 'tool', color: '#ff9900' },
    { name: 'GCP', level: 78, category: 'tool', color: '#4285f4' },
    { name: 'Leaflet.js', level: 82, category: 'tool', color: '#199900' },
    { name: 'GIS', level: 80, category: 'tool', color: '#34a853' }
  ],

  // Update functions
  updatePersonalInfo: (info) => set((state) => ({
    personalInfo: { ...state.personalInfo, ...info }
  })),

  addProject: (project) => set((state) => ({
    projects: [...state.projects, project]
  })),

  updateSkill: (skillName, updates) => set((state) => ({
    skills: state.skills.map(skill =>
      skill.name === skillName ? { ...skill, ...updates } : skill
    )
  }))
}))
