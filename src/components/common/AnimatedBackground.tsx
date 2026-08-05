import { memo, useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Heart, Sparkles, Star, HelpCircle } from 'lucide-react'

type FloatingShape = {
  id: number
  icon: 'heart' | 'sparkle' | 'star' | 'question' | 'dot'
  top: string
  left: string
  size: number
  duration: number
  delay: number
  opacity: number
}

function generateShapes(count: number): FloatingShape[] {
  const icons: FloatingShape['icon'][] = ['heart', 'sparkle', 'star', 'question', 'dot']
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    icon: icons[i % icons.length],
    top: `${Math.round((i * 37) % 100)}%`,
    left: `${Math.round((i * 53) % 100)}%`,
    size: 14 + (i % 4) * 6,
    duration: 7 + (i % 5) * 2,
    delay: (i % 6) * 0.6,
    opacity: 0.12 + (i % 3) * 0.06,
  }))
}

function ShapeIcon({ type, size }: { type: FloatingShape['icon']; size: number }) {
  if (type === 'heart') return <Heart size={size} fill="currentColor" />
  if (type === 'sparkle') return <Sparkles size={size} />
  if (type === 'star') return <Star size={size} fill="currentColor" />
  if (type === 'question') return <HelpCircle size={size} />
  return <span className="block rounded-full bg-current" style={{ width: size * 0.4, height: size * 0.4 }} />
}

interface AnimatedBackgroundProps {
  variant?: 'default' | 'quiz' | 'minimal'
  className?: string
}

function AnimatedBackgroundBase({ variant = 'default', className = '' }: AnimatedBackgroundProps) {
  const prefersReducedMotion = useReducedMotion()
  const shapeCount = variant === 'minimal' ? 6 : variant === 'quiz' ? 10 : 16
  const shapes = useMemo(() => generateShapes(shapeCount), [shapeCount])

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div className="absolute inset-0 bg-vibe-radial dark:opacity-40" />

      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-vibe-violet-300/30 blur-3xl dark:bg-vibe-violet-700/20" />
      <div className="absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-vibe-pink-300/30 blur-3xl dark:bg-vibe-pink-700/15" />
      <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-vibe-mint-300/25 blur-3xl dark:bg-vibe-mint-700/15" />

      {!prefersReducedMotion &&
        shapes.map((shape) => (
          <motion.div
            key={shape.id}
            className="absolute text-vibe-violet-400 dark:text-vibe-violet-300"
            style={{ top: shape.top, left: shape.left, opacity: shape.opacity }}
            animate={{
              y: [0, -20, 10, 0],
              x: [0, 10, -10, 0],
              rotate: [0, 8, -6, 0],
            }}
            transition={{
              duration: shape.duration,
              delay: shape.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <ShapeIcon type={shape.icon} size={shape.size} />
          </motion.div>
        ))}
    </div>
  )
}

export const AnimatedBackground = memo(AnimatedBackgroundBase)
