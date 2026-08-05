import type { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { AppCard } from '../common/AppCard'
import { AnimatedCounter } from '../common/AnimatedCounter'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: number
  suffix?: string
  accent?: string
}

export function StatCard({ icon: Icon, label, value, suffix = '', accent = 'text-vibe-violet-500' }: StatCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <AppCard padding="md" className="flex items-center gap-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-vibe-violet-100 dark:bg-white/10 ${accent}`}>
          <Icon size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-extrabold font-display leading-none">
            <AnimatedCounter value={value} suffix={suffix} />
          </p>
          <p className="mt-1 truncate text-xs font-medium text-slate-400">{label}</p>
        </div>
      </AppCard>
    </motion.div>
  )
}
