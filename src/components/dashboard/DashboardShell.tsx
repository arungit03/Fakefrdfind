import type { ReactNode } from 'react'
import { DashboardSidebar, DashboardMobileNav } from './DashboardSidebar'

interface DashboardShellProps {
  quizId: string
  quizTitle: string
  children: ReactNode
}

export function DashboardShell({ quizId, quizTitle, children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar quizId={quizId} quizTitle={quizTitle} />
      <div className="min-w-0 flex-1 pb-20 lg:pb-0">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </div>
      <DashboardMobileNav quizId={quizId} />
    </div>
  )
}
