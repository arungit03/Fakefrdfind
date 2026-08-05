import { forwardRef, useId } from 'react'
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface AppInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  maxLength?: number
}

export const AppInput = forwardRef<HTMLInputElement, AppInputProps>(
  ({ label, error, hint, maxLength, className, id, value, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const errorId = `${inputId}-error`
    const currentLength = typeof value === 'string' ? value.length : 0

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          value={value}
          maxLength={maxLength}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none',
            'placeholder:text-slate-400 transition-colors duration-150 min-h-[44px]',
            'focus:border-vibe-violet-500',
            'dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder:text-slate-500',
            error && 'border-vibe-coral-500 focus:border-vibe-coral-500',
            className,
          )}
          {...props}
        />
        <div className="mt-1 flex items-center justify-between">
          <div>
            {error && (
              <p id={errorId} role="alert" className="text-sm text-vibe-coral-500">
                {error}
              </p>
            )}
            {!error && hint && <p className="text-sm text-slate-400">{hint}</p>}
          </div>
          {maxLength && (
            <span className="text-xs text-slate-400">
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      </div>
    )
  },
)

AppInput.displayName = 'AppInput'

interface AppTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  maxLength?: number
}

export const AppTextarea = forwardRef<HTMLTextAreaElement, AppTextareaProps>(
  ({ label, error, hint, maxLength, className, id, value, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const errorId = `${inputId}-error`
    const currentLength = typeof value === 'string' ? value.length : 0

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          value={value}
          maxLength={maxLength}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none',
            'placeholder:text-slate-400 transition-colors duration-150 resize-none',
            'focus:border-vibe-violet-500',
            'dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder:text-slate-500',
            error && 'border-vibe-coral-500 focus:border-vibe-coral-500',
            className,
          )}
          {...props}
        />
        <div className="mt-1 flex items-center justify-between">
          <div>
            {error && (
              <p id={errorId} role="alert" className="text-sm text-vibe-coral-500">
                {error}
              </p>
            )}
            {!error && hint && <p className="text-sm text-slate-400">{hint}</p>}
          </div>
          {maxLength && (
            <span className="text-xs text-slate-400">
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      </div>
    )
  },
)

AppTextarea.displayName = 'AppTextarea'
