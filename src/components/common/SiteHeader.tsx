import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, Moon, Sun, Globe } from 'lucide-react'
import { VibeCheckLogo } from './VibeCheckLogo'
import { AppButton } from './AppButton'
import { useTheme } from '../../hooks/useTheme'
import { useTranslation } from '../../hooks/useTranslation'
import { cn } from '../../lib/utils'

const navLinks = [
  { to: '/', label: 'nav.home' },
  { to: '/#how-it-works', label: 'nav.howItWorks' },
  { to: '/#features', label: 'nav.features' },
]

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { scheme, toggle } = useTheme()
  const { t, language, setLanguage } = useTranslation()
  const location = useLocation()

  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-white/70 backdrop-blur-xl dark:border-white/5 dark:bg-vibe-navy-950/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" aria-label="VibeCheck home">
          <VibeCheckLogo size={36} />
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.to}
              href={link.to}
              className={cn(
                'text-sm font-semibold text-slate-600 transition-colors hover:text-vibe-violet-600 dark:text-slate-300 dark:hover:text-vibe-violet-300',
                location.pathname === link.to && 'text-vibe-violet-600 dark:text-vibe-violet-300',
              )}
            >
              {t(link.label)}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button
            onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
            className="flex items-center gap-1 rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
            aria-label="Change language"
            title="Change language"
          >
            <Globe size={18} />
            <span className="text-xs font-bold uppercase">{language}</span>
          </button>
          <button
            onClick={toggle}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
            aria-label={scheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {scheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link to="/create">
            <AppButton size="sm">{t('nav.createQuiz')}</AppButton>
          </Link>
        </div>

        <button
          className="rounded-full p-2 text-slate-600 dark:text-slate-200 md:hidden"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 right-0 z-50 flex w-72 flex-col gap-6 bg-white p-6 shadow-2xl dark:bg-vibe-navy-900 md:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
            >
              <div className="flex items-center justify-between">
                <VibeCheckLogo size={32} />
                <button onClick={() => setIsMenuOpen(false)} aria-label="Close menu" className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-white/10">
                  <X size={22} />
                </button>
              </div>
              <nav className="flex flex-col gap-4" aria-label="Mobile primary">
                {navLinks.map((link) => (
                  <a
                    key={link.to}
                    href={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-semibold text-slate-700 dark:text-slate-200"
                  >
                    {t(link.label)}
                  </a>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 py-2.5 text-sm font-semibold dark:border-white/10"
                  >
                    <Globe size={16} /> {language.toUpperCase()}
                  </button>
                  <button
                    onClick={toggle}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 py-2.5 text-sm font-semibold dark:border-white/10"
                  >
                    {scheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    {scheme === 'dark' ? 'Light' : 'Dark'}
                  </button>
                </div>
                <Link to="/create" onClick={() => setIsMenuOpen(false)}>
                  <AppButton fullWidth>{t('nav.createQuiz')}</AppButton>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
