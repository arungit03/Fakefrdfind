import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'

interface StepIndicatorProps {
  steps: string[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex w-full items-center justify-center" role="list" aria-label="Progress steps">
      {steps.map((step, index) => {
        const isComplete = index < currentStep
        const isCurrent = index === currentStep
        return (
          <div key={step} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold border-2 transition-colors',
                  isComplete && 'bg-vibe-gradient border-transparent text-white',
                  isCurrent && !isComplete && 'border-vibe-violet-500 text-vibe-violet-600 dark:text-vibe-violet-300 bg-white dark:bg-vibe-navy-900',
                  !isComplete && !isCurrent && 'border-slate-200 text-slate-400 dark:border-white/10 dark:text-slate-500',
                )}
                animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1.6, repeat: isCurrent ? Infinity : 0 }}
                role="listitem"
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isComplete ? <Check size={16} /> : index + 1}
              </motion.div>
              <span
                className={cn(
                  'hidden text-xs font-medium sm:block',
                  isCurrent ? 'text-vibe-violet-600 dark:text-vibe-violet-300' : 'text-slate-400',
                )}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="mx-2 h-0.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                <motion.div
                  className="h-full bg-vibe-gradient"
                  initial={{ width: 0 }}
                  animate={{ width: isComplete ? '100%' : '0%' }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
