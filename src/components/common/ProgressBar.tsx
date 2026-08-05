import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface ProgressBarProps {
  value: number
  max: number
  className?: string
  label?: string
  showPercentage?: boolean
}

export function ProgressBar({ value, max, className, label, showPercentage = false }: ProgressBarProps) {
  const percentage = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercentage) && (
        <div className="mb-1.5 flex items-center justify-between text-sm font-medium text-slate-500 dark:text-slate-400">
          {label && <span>{label}</span>}
          {showPercentage && <span>{percentage}%</span>}
        </div>
      )}
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200/70 dark:bg-white/10"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <motion.div
          className="h-full rounded-full bg-vibe-gradient"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        />
      </div>
    </div>
  )
}
