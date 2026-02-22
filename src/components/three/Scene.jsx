import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment,
  AdaptiveDpr,
  AdaptiveEvents,
  Preload
} from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { useAppStore } from '@/stores/appStore'

// Scene wrapper with performance optimization
export default function Scene({ 
  children, 
  cameraPosition = [0, 0, 5],
  enableOrbit = false,
  enablePostProcessing = true,
  className = ''
}) {
  const { performanceMode, isMobile, prefersReducedMotion } = useAppStore()
  
  // Determine settings based on performance mode
  const settings = {
    low: {
      dpr: 1,
      antialias: false,
      postProcessing: false,
      bloomIntensity: 0
    },
    medium: {
      dpr: Math.min(1.5, window.devicePixelRatio),
      antialias: true,
      postProcessing: true,
      bloomIntensity: 0.3
    },
    high: {
      dpr: Math.min(2, window.devicePixelRatio),
      antialias: true,
      postProcessing: true,
      bloomIntensity: 0.5
    }
  }

  const currentSettings = settings[performanceMode] || settings.medium
  const shouldEnablePostProcessing = enablePostProcessing && 
    currentSettings.postProcessing && 
    !isMobile && 
    !prefersReducedMotion

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        dpr={currentSettings.dpr}
        gl={{ 
          antialias: currentSettings.antialias,
          powerPreference: 'high-performance',
          alpha: true,
          stencil: false,
          depth: true
        }}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          {/* Camera */}
          <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />
          
          {/* Lighting */}
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#00d4ff" />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#a855f7" />
          
          {/* Scene content */}
          {children}
          
          {/* Optional orbit controls */}
          {enableOrbit && (
            <OrbitControls 
              enableZoom={false}
              enablePan={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
              autoRotate
              autoRotateSpeed={0.5}
            />
          )}
          
          {/* Post-processing effects */}
          {shouldEnablePostProcessing && (
            <EffectComposer>
              <Bloom 
                intensity={currentSettings.bloomIntensity}
                luminanceThreshold={0.2}
                luminanceSmoothing={0.9}
                mipmapBlur
              />
              <Vignette 
                offset={0.3}
                darkness={0.7}
                blendFunction={BlendFunction.NORMAL}
              />
            </EffectComposer>
          )}
          
          {/* Performance optimization */}
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  )
}

// Simplified scene without post-processing for lower performance needs
export function SimpleScene({ children, cameraPosition = [0, 0, 5], className = '' }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        dpr={1}
        gl={{ 
          antialias: false,
          powerPreference: 'high-performance',
          alpha: true
        }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={0.5} />
          {children}
        </Suspense>
      </Canvas>
    </div>
  )
}
