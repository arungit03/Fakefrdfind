import { motion } from 'framer-motion'
import { VibeCheckLogo } from './VibeCheckLogo'

interface LoadingScreenProps {
  message?: string
  fullscreen?: boolean
}

export function LoadingScreen({ message = 'Loading VibeCheck…', fullscreen = true }: LoadingScreenProps) {
  return (
    <div
      className={
        fullscreen
          ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-vibe-lavender dark:bg-vibe-navy-950'
          : 'flex flex-col items-center justify-center py-20'
      }
    >
      <motion.div
        animate={{ scale: [1, 1.08, 1], rotate: [0, 3, -3, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <VibeCheckLogo size={56} showWordmark={false} />
      </motion.div>
      <div className="mt-5 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2.5 w-2.5 rounded-full bg-vibe-violet-500"
            animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  )
}
