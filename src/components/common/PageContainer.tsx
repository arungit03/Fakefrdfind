import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface PageContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: string
  withBackground?: boolean
}

export function PageContainer({ children, className, maxWidth = 'max-w-6xl' }: PageContainerProps) {
  return (
    <motion.main
      className={cn('relative mx-auto w-full px-4 sm:px-6 lg:px-8', maxWidth, className)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.main>
  )
}
