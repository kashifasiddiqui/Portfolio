# Kashif Siddiqui - AI & ML Developer Portfolio

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Portfolio-00d4ff?style=for-the-badge&logo=vercel)](https://kashif-portfolio-sigma.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-black?style=flat-square&logo=three.js)](https://threejs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Framer Motion](https://img.shields.io/badge/Framer-Motion-FF0055?style=flat-square&logo=framer)](https://www.framer.com/motion)

A cinematic, scroll-driven 3D portfolio showcasing Backend, AI & Machine Learning expertise through an interactive digital brain environment.

## 🔗 Live Demo

**[👉 Visit Portfolio: https://kashif-portfolio-sigma.vercel.app](https://kashif-portfolio-sigma.vercel.app)**

**Location:** Mumbai, Maharashtra  
**Email:** kashif.arshad.siddiqui@gmail.com  
**LinkedIn:** [kashif-arshad-siddiqui](https://www.linkedin.com/in/kashif-arshad-siddiqui/)  
**GitHub:** [kashifasiddiqui](https://github.com/kashifasiddiqui)

![Portfolio Preview](./preview.png)

## 🎯 Project Overview

An immersive, production-ready portfolio that takes recruiters and tech leads on a journey through an AI engineer's mind, featuring:

- **Neural Awakening** - Interactive 3D brain hero section
- **Live Visitor Counter** - Real-time visitor tracking with animated display
- **Learning Timeline** - Animated career progression
- **Intelligence Lab** - Project showcase with 3D elements
- **Skills Galaxy** - Interactive 3D skill constellation
- **Contact Terminal** - Developer-themed contact section

## 🛠 Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | React 18 + Vite |
| **3D Engine** | React Three Fiber + Drei |
| **Animation** | Framer Motion |
| **Styling** | Tailwind CSS |
| **State** | Zustand |
| **Scroll** | Lenis |

## 📁 Project Structure

```
src/
├── components/
│   ├── three/           # 3D components
│   │   ├── NeuralBrain.jsx
│   │   ├── ParticleField.jsx
│   │   ├── Scene.jsx
│   │   └── SkillsGalaxy.jsx
│   └── ui/              # UI components
│       ├── CustomCursor.jsx
│       ├── LoadingScreen.jsx
│       ├── Navigation.jsx
│       ├── ScrollProgress.jsx
│       └── VisitorCounter.jsx
├── sections/            # Page sections
│   ├── HeroSection.jsx
│   ├── TimelineSection.jsx
│   ├── ProjectsSection.jsx
│   ├── SkillsSection.jsx
│   └── ContactSection.jsx
├── stores/              # State management
│   └── appStore.js
├── hooks/               # Custom hooks
│   ├── useScroll.js
│   └── usePerformance.js
├── styles/              # Global styles
│   └── index.css
├── App.jsx
└── main.jsx
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## ⚡ Performance Strategy

### Adaptive Quality System

The portfolio automatically adjusts quality based on device capabilities:

| Mode | Particle Count | Post-Processing | DPR |
|------|---------------|-----------------|-----|
| **Low** | 500 | Disabled | 1x |
| **Medium** | 1,500 | Basic | 1.5x |
| **High** | 3,000 | Full | 2x |

### Performance Optimizations

1. **Code Splitting** - Lazy-loaded sections with React.lazy
2. **3D Optimization**
   - Geometry instancing for particles
   - Frustum culling
   - Level of Detail (LOD) adjustments
3. **Animation**
   - GPU-accelerated transforms
   - RequestAnimationFrame for 3D loops
   - Debounced scroll handlers
4. **Assets**
   - Preloaded 3D scenes
   - Optimized texture sizes
   - Font subsetting

### Bundle Optimization

```javascript
// vite.config.js
rollupOptions: {
  output: {
    manualChunks: {
      three: ['three'],
      'react-three': ['@react-three/fiber', '@react-three/drei'],
      framer: ['framer-motion']
    }
  }
}
```

## 📱 Mobile Strategy

### Responsive Breakpoints

```javascript
- Mobile: < 768px (simplified 3D, skill bars)
- Tablet: 768px - 1023px (reduced particles)
- Desktop: ≥ 1024px (full experience)
```

### Mobile Adaptations

1. **3D Scenes** - Replaced with elegant 2D fallbacks
2. **Particles** - Reduced count by 80%
3. **Post-processing** - Disabled
4. **Custom Cursor** - Disabled
5. **Touch** - Optimized gesture handling

### Accessibility

- Respects `prefers-reduced-motion`
- Keyboard navigation support
- ARIA labels on interactive elements
- Color contrast compliance

## 🎨 Customization

### Personal Information

Edit `src/stores/appStore.js`:

```javascript
personalInfo: {
  name: 'Your Name',
  title: 'Your Title',
  tagline: 'Your tagline',
  email: 'your@email.com',
  social: {
    github: 'https://github.com/...',
    linkedin: 'https://linkedin.com/in/...',
    twitter: 'https://twitter.com/...'
  }
}
```

### Projects

Add to the `projects` array in `appStore.js`:

```javascript
{
  id: 7,
  title: 'Project Name',
  description: 'Project description',
  tags: ['Tech1', 'Tech2'],
  github: '#',
  demo: '#',
  featured: true
}
```

### Skills

Add to the `skills` array:

```javascript
{
  name: 'Skill Name',
  level: 90,
  category: 'ml', // ml, lang, framework, tool
  color: '#hexcolor'
}
```

### Theme Colors

Modify `tailwind.config.js`:

```javascript
colors: {
  neural: {
    glow: '#00d4ff',    // Primary accent
    cyan: '#22d3ee',    // Secondary accent
    purple: '#a855f7',  // Tertiary accent
    dark: '#050810',    // Background
    // ...
  }
}
```

## ⚠️ Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| **Heavy 3D assets** | Lazy loading, LOD system |
| **Mobile performance** | Adaptive quality, fallbacks |
| **Browser compatibility** | Feature detection, polyfills |
| **Large bundle size** | Code splitting, tree shaking |
| **SEO limitations** | SSR-ready structure, meta tags |

## 📋 Development Milestones

### Phase 1: Foundation (Week 1)
- [x] Project setup with Vite + React
- [x] Tailwind configuration
- [x] Core component architecture
- [x] State management setup

### Phase 2: 3D Development (Week 2)
- [x] Neural Brain component
- [x] Particle systems
- [x] Skills Galaxy visualization
- [x] Post-processing effects

### Phase 3: Sections (Week 3)
- [x] Hero section with 3D integration
- [x] Timeline with scroll animations
- [x] Projects grid with filters
- [x] Contact terminal

### Phase 4: Polish (Week 4)
- [x] Performance optimization
- [x] Mobile testing
- [x] Accessibility audit
- [x] SEO optimization
- [x] Deployment setup
- [x] Visitor counter integration
- [x] Portfolio project showcase

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Deploy dist/ folder
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 4173
CMD ["npm", "run", "preview"]
```

## 📄 License

MIT License - Feel free to use this for your own portfolio!

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

**Built with 💙 using React Three Fiber**

## 🏷️ Keywords

`portfolio` `react` `three.js` `react-three-fiber` `3d-portfolio` `developer-portfolio` `ai-engineer` `machine-learning` `framer-motion` `tailwindcss` `vite` `zustand` `interactive-portfolio` `webgl` `frontend` `fullstack` `neural-network` `data-science` `python` `tensorflow` `fastapi` `backend-developer`
