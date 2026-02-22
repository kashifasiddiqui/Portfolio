# Kashif Siddiqui - AI & ML Developer Portfolio

A cinematic, scroll-driven 3D portfolio showcasing Backend, AI & Machine Learning expertise through an interactive digital brain environment.

**Location:** Mumbai, Maharashtra  
**Email:** kashif.arshad.siddiqui@gmail.com

![Portfolio Preview](./preview.png)

## 🎯 Project Overview

An immersive, production-ready portfolio that takes recruiters and tech leads on a journey through an AI engineer's mind, featuring:

- **Neural Awakening** - Interactive 3D brain hero section
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
│       └── ScrollProgress.jsx
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
- [ ] Performance optimization
- [ ] Mobile testing
- [ ] Accessibility audit
- [ ] SEO optimization
- [ ] Deployment setup

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
