import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'

interface AnswerOptionProps {
  letter: string
  text: string
  isSelected?: boolean
  isCorrect?: boolean
  isIncorrectSelection?: boolean
  showResult?: boolean
  onClick?: () => void
  disabled?: boolean
}

export function AnswerOption({
  letter,
  text,
  isSelected,
  isCorrect,
  isIncorrectSelection,
  showResult,
  onClick,
  disabled,
}: AnswerOptionProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={isSelected}
      className={cn(
        'flex w-full min-h-[56px] items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-colors',
        'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10',
        isSelected && !showResult && 'border-vibe-violet-500 bg-vibe-violet-50 dark:bg-vibe-violet-500/10',
        showResult && isCorrect && 'border-vibe-mint-500 bg-vibe-mint-50 dark:bg-vibe-mint-500/10',
        showResult && isIncorrectSelection && 'border-vibe-coral-500 bg-vibe-coral-50 dark:bg-vibe-coral-500/10',
        !disabled && 'hover:border-vibe-violet-300 active:scale-[0.99]',
      )}
      whileTap={disabled ? undefined : { scale: 0.98 }}
    >
      <span
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold',
          isSelected || (showResult && isCorrect)
            ? 'bg-vibe-gradient text-white'
            : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300',
        )}
      >
        {letter}
      </span>
      <span className="flex-1 text-sm font-semibold text-slate-700 dark:text-slate-200 sm:text-base">{text}</span>
      {(isSelected || (showResult && isCorrect)) && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded-full text-white',
            showResult && isCorrect ? 'bg-vibe-mint-500' : 'bg-vibe-violet-500',
          )}
        >
          <Check size={14} strokeWidth={3} />
        </motion.span>
      )}
    </motion.button>
  )
}
