import type { ReactNode } from 'react'
import { AppCard } from '../common/AppCard'

interface DashboardCardProps {
  title: string
  action?: ReactNode
  children: ReactNode
}

export function DashboardCard({ title, action, children }: DashboardCardProps) {
  return (
    <AppCard>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold font-display">{title}</h3>
        {action}
      </div>
      {children}
    </AppCard>
  )
}
