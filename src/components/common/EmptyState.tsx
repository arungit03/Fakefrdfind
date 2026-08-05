import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { AppButton } from './AppButton'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-vibe-violet-200 dark:border-white/10 px-6 py-16 text-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-vibe-violet-100 text-vibe-violet-500 dark:bg-white/10 dark:text-vibe-violet-300"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {icon ?? <Sparkles size={28} />}
      </motion.div>
      <h3 className="mb-1 text-lg font-bold font-display text-slate-800 dark:text-white">{title}</h3>
      {description && <p className="mb-5 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>}
      {actionLabel && onAction && (
        <AppButton size="sm" onClick={onAction}>
          {actionLabel}
        </AppButton>
      )}
    </motion.div>
  )
}
