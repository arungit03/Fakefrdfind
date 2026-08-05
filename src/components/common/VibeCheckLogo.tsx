import { motion } from 'framer-motion'

interface VibeCheckLogoProps {
  size?: number
  showWordmark?: boolean
  className?: string
  animated?: boolean
}

/**
 * Original VibeCheck mark: rounded heart + checkmark + sparkle, wrapped in a
 * gradient squircle. Built entirely from inline SVG paths — no external assets.
 */
export function VibeCheckLogo({ size = 40, showWordmark = true, className = '', animated = false }: VibeCheckLogoProps) {
  const Mark = (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" role="img" aria-label="VibeCheck logo">
      <defs>
        <linearGradient id="vc-logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="55%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill="url(#vc-logo-grad)" />
      <path
        d="M32 47.5 C21 39.5 14 33 14 24.7 C14 18.7 18.6 14 24.5 14 C28 14 30.6 15.7 32 18.2 C33.4 15.7 36 14 39.5 14 C45.4 14 50 18.7 50 24.7 C50 33 43 39.5 32 47.5 Z"
        fill="white"
        fillOpacity="0.95"
      />
      <path
        d="M23.5 27.5 L29.5 33.5 L41 20.5"
        stroke="#7c3aed"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M47 12 L48.4 15.6 L52 17 L48.4 18.4 L47 22 L45.6 18.4 L42 17 L45.6 15.6 Z" fill="#fde047" />
    </svg>
  )

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {animated ? (
        <motion.div animate={{ rotate: [0, -4, 4, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
          {Mark}
        </motion.div>
      ) : (
        Mark
      )}
      {showWordmark && (
        <span className="font-display text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Vibe<span className="vibe-gradient-text">Check</span>
        </span>
      )}
    </div>
  )
}
