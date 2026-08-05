import type { HTMLAttributes, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface AppCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  glass?: boolean
  tilt?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function AppCard({ children, glass = true, tilt = false, padding = 'md', className, ...props }: AppCardProps) {
  if (tilt) {
    return (
      <motion.div
        className={cn(
          'rounded-3xl',
          glass ? 'glass-card' : 'bg-white dark:bg-vibe-navy-900 shadow-card border border-slate-100 dark:border-white/10',
          paddingClasses[padding],
          className,
        )}
        whileHover={{ rotateX: -2, rotateY: 2, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{ transformStyle: 'preserve-3d', perspective: 800 }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div
      className={cn(
        'rounded-3xl',
        glass ? 'glass-card' : 'bg-white dark:bg-vibe-navy-900 shadow-card border border-slate-100 dark:border-white/10',
        paddingClasses[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
