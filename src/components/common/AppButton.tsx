import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface AppButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> {
  variant?: Variant
  size?: Size
  isLoading?: boolean
  icon?: ReactNode
  fullWidth?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-vibe-gradient text-white shadow-soft hover:shadow-glow disabled:opacity-60',
  secondary:
    'bg-white text-vibe-violet-700 border border-vibe-violet-200 hover:bg-vibe-violet-50 dark:bg-white/10 dark:text-white dark:border-white/15 dark:hover:bg-white/15',
  outline:
    'bg-transparent border-2 border-vibe-violet-500 text-vibe-violet-600 hover:bg-vibe-violet-50 dark:text-vibe-violet-300 dark:hover:bg-white/5',
  ghost:
    'bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10',
  danger:
    'bg-vibe-coral-500 text-white hover:bg-rose-600 shadow-soft',
}

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm px-4 py-2 rounded-xl gap-1.5',
  md: 'text-base px-6 py-3 rounded-2xl gap-2',
  lg: 'text-lg px-8 py-4 rounded-2xl gap-2.5',
}

export const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, icon, fullWidth, className, children, disabled, ...props }, ref) => {
    const motionProps: HTMLMotionProps<'button'> = {
      whileHover: disabled || isLoading ? undefined : { scale: 1.03 },
      whileTap: disabled || isLoading ? undefined : { scale: 0.97 },
      transition: { type: 'spring', stiffness: 400, damping: 20 },
    }

    return (
      <motion.button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-semibold tracking-tight transition-colors duration-200',
          'min-h-[44px] select-none touch-manipulation',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          (disabled || isLoading) && 'cursor-not-allowed',
          className,
        )}
        disabled={disabled || isLoading}
        {...motionProps}
        {...props}
      >
        {isLoading ? <Loader2 className="animate-spin" size={18} /> : icon}
        {children}
      </motion.button>
    )
  },
)

AppButton.displayName = 'AppButton'
