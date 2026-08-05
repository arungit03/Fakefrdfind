import { Link } from 'react-router-dom'
import { AtSign, MessageCircleHeart, PlayCircle } from 'lucide-react'
import { VibeCheckLogo } from './VibeCheckLogo'

const footerLinks = [
  { to: '/about', label: 'About' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
  { to: '/contact', label: 'Contact' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-100 bg-white/60 dark:border-white/5 dark:bg-vibe-navy-950/60">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <VibeCheckLogo size={32} />
            <p className="text-sm text-slate-500 dark:text-slate-400">Who really knows you?</p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2" aria-label="Footer">
            {footerLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-slate-500 hover:text-vibe-violet-600 dark:text-slate-400 dark:hover:text-vibe-violet-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href="#" aria-label="VibeCheck on Instagram" className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-vibe-pink-500 dark:hover:bg-white/10">
              <AtSign size={18} />
            </a>
            <a href="#" aria-label="VibeCheck on X" className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-vibe-violet-500 dark:hover:bg-white/10">
              <MessageCircleHeart size={18} />
            </a>
            <a href="#" aria-label="VibeCheck on YouTube" className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-vibe-coral-500 dark:hover:bg-white/10">
              <PlayCircle size={18} />
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6 text-center text-xs text-slate-400 dark:border-white/5">
          © {new Date().getFullYear()} VibeCheck. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
