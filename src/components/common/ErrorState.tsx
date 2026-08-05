import { motion } from 'framer-motion'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AppButton } from './AppButton'

interface ErrorStateProps {
  title: string
  description?: string
  onRetry?: () => void
  showHomeButton?: boolean
}

export function ErrorState({ title, description, onRetry, showHomeButton = true }: ErrorStateProps) {
  return (
    <motion.div
      className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <motion.div
        className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-vibe-coral-500/10 text-vibe-coral-500"
        animate={{ rotate: [0, -6, 6, -4, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 2 }}
      >
        <AlertTriangle size={36} />
      </motion.div>
      <h2 className="mb-2 text-2xl font-bold font-display text-slate-800 dark:text-white">{title}</h2>
      {description && <p className="mb-6 max-w-sm text-slate-500 dark:text-slate-400">{description}</p>}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <AppButton variant="secondary" icon={<RefreshCw size={16} />} onClick={onRetry}>
            Try Again
          </AppButton>
        )}
        {showHomeButton && (
          <Link to="/">
            <AppButton variant="outline" icon={<Home size={16} />}>
              Return Home
            </AppButton>
          </Link>
        )}
      </div>
    </motion.div>
  )
}
