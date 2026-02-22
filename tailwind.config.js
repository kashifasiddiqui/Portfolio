/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neural: {
          50: '#e6f7ff',
          100: '#b3e0ff',
          200: '#80caff',
          300: '#4db3ff',
          400: '#1a9dff',
          500: '#0080e6',
          600: '#0066b3',
          700: '#004d80',
          800: '#00334d',
          900: '#001a26',
          950: '#0a0f1a',
          dark: '#050810',
          glow: '#00d4ff',
          accent: '#0ea5e9',
          cyan: '#22d3ee',
          purple: '#a855f7'
        },
        light: {
          bg: '#f8fafc',
          surface: '#ffffff',
          text: '#1e293b',
          muted: '#64748b',
          border: '#e2e8f0',
          accent: '#0284c7'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Space Grotesk', 'Inter', 'sans-serif']
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'neural-flicker': 'neural-flicker 3s ease-in-out infinite',
        'scan-line': 'scan-line 8s linear infinite',
        'typing': 'typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite'
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
            borderColor: 'rgba(0, 212, 255, 0.5)'
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(0, 212, 255, 0.6)',
            borderColor: 'rgba(0, 212, 255, 0.8)'
          }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        'neural-flicker': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 }
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' }
        },
        'typing': {
          'from': { width: '0' },
          'to': { width: '100%' }
        },
        'blink-caret': {
          'from, to': { borderColor: 'transparent' },
          '50%': { borderColor: '#00d4ff' }
        }
      },
      backgroundImage: {
        'neural-grid': 'linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px)',
        'radial-glow': 'radial-gradient(ellipse at center, rgba(0, 212, 255, 0.15) 0%, transparent 70%)',
        'gradient-neural': 'linear-gradient(135deg, #0a0f1a 0%, #050810 50%, #0a0f1a 100%)'
      },
      backgroundSize: {
        'grid': '50px 50px'
      },
      boxShadow: {
        'neural': '0 0 30px rgba(0, 212, 255, 0.3)',
        'neural-lg': '0 0 60px rgba(0, 212, 255, 0.4)',
        'inner-glow': 'inset 0 0 30px rgba(0, 212, 255, 0.1)'
      }
    }
  },
  plugins: [],
}
