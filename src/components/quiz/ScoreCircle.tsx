import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface ScoreCircleProps {
  percentage: number
  size?: number
  strokeWidth?: number
  label?: string
}

export function ScoreCircle({ percentage, size = 180, strokeWidth = 14, label }: ScoreCircleProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (displayValue / 100) * circumference

  useEffect(() => {
    const timeout = setTimeout(() => setDisplayValue(percentage), 200)
    return () => clearTimeout(timeout)
  }, [percentage])

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-200 dark:text-white/10"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#score-gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="score-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span
          className="text-4xl font-extrabold font-display vibe-gradient-text"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {Math.round(displayValue)}%
        </motion.span>
        {label && <span className="text-xs font-semibold text-slate-400">{label}</span>}
      </div>
    </div>
  )
}
