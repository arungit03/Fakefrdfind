import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Trophy, BarChart3, Share2, Settings, LogOut } from 'lucide-react'
import { cn } from '../../lib/utils'
import { VibeCheckLogo } from '../common/VibeCheckLogo'

interface DashboardSidebarProps {
  quizId: string
  quizTitle: string
}

export function DashboardSidebar({ quizId, quizTitle }: DashboardSidebarProps) {
  const navItems = [
    { to: `/dashboard/${quizId}`, label: 'Overview', icon: LayoutDashboard, end: true },
    { to: `/dashboard/${quizId}/responses`, label: 'Responses', icon: Users, end: false },
    { to: `/dashboard/${quizId}`, label: 'Leaderboard', icon: Trophy, end: true, hash: '#leaderboard' },
    { to: `/dashboard/${quizId}`, label: 'Question Analytics', icon: BarChart3, end: true, hash: '#analytics' },
    { to: `/share/${quizId}`, label: 'Share Quiz', icon: Share2, end: false },
    { to: `/dashboard/${quizId}/settings`, label: 'Quiz Settings', icon: Settings, end: false },
  ]

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-100 bg-white/50 p-5 dark:border-white/5 dark:bg-white/[0.02] lg:block">
      <div className="mb-6">
        <VibeCheckLogo size={30} />
      </div>
      <p className="mb-4 truncate text-xs font-semibold uppercase tracking-wide text-slate-400">{quizTitle}</p>
      <nav className="space-y-1" aria-label="Dashboard">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to + (item.hash ?? '')}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
                isActive
                  ? 'bg-vibe-violet-100 text-vibe-violet-700 dark:bg-white/10 dark:text-vibe-violet-300'
                  : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5',
              )
            }
          >
            <item.icon size={17} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <a
        href="/"
        className="mt-8 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
      >
        <LogOut size={17} /> Logout Dashboard
      </a>
    </aside>
  )
}

export function DashboardMobileNav({ quizId }: { quizId: string }) {
  const navItems = [
    { to: `/dashboard/${quizId}`, label: 'Overview', icon: LayoutDashboard },
    { to: `/dashboard/${quizId}/responses`, label: 'Responses', icon: Users },
    { to: `/share/${quizId}`, label: 'Share', icon: Share2 },
    { to: `/dashboard/${quizId}/settings`, label: 'Settings', icon: Settings },
  ]

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-slate-100 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-vibe-navy-900/95 lg:hidden"
      aria-label="Dashboard mobile"
    >
      {navItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          end
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-semibold',
              isActive ? 'text-vibe-violet-600 dark:text-vibe-violet-300' : 'text-slate-400',
            )
          }
        >
          <item.icon size={20} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
