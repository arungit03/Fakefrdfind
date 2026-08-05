import { useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { PartyPopper, ExternalLink, LayoutDashboard, ShieldAlert } from 'lucide-react'
import { AnimatedBackground } from '../components/common/AnimatedBackground'
import { PageContainer } from '../components/common/PageContainer'
import { AppCard } from '../components/common/AppCard'
import { AppButton } from '../components/common/AppButton'
import { QRCodeCard } from '../components/share/QRCodeCard'
import { ShareButtons } from '../components/share/ShareButtons'
import { VibeCheckLogo } from '../components/common/VibeCheckLogo'
import { getQuizUrl, buildWhatsAppMessage } from '../lib/share'

export default function SharePage() {
  const { quizId } = useParams<{ quizId: string }>()
  const location = useLocation()
  const creatorToken = (location.state as { creatorToken?: string } | null)?.creatorToken

  useEffect(() => {
    const timeout = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.4 },
        colors: ['#8b5cf6', '#ec4899', '#facc15'],
      })
    }, 300)
    return () => clearTimeout(timeout)
  }, [])

  if (!quizId) return null

  const quizUrl = getQuizUrl(quizId)
  const whatsappMessage = buildWhatsAppMessage('', quizUrl)
  const dashboardUrl = creatorToken ? `/dashboard/${quizId}?token=${creatorToken}` : `/dashboard/${quizId}`

  return (
    <div className="relative min-h-screen overflow-hidden py-12">
      <AnimatedBackground />
      <PageContainer maxWidth="max-w-lg">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        >
          <motion.div
            className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-vibe-gradient text-white shadow-glow"
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
          >
            <PartyPopper size={32} />
          </motion.div>
          <h1 className="mb-1 text-3xl font-extrabold font-display sm:text-4xl">Your quiz is live!</h1>
          <p className="mb-8 text-slate-500 dark:text-slate-400">Share it with friends and watch the responses roll in.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <AppCard className="mb-5">
            <div className="mb-4 flex items-center gap-2 overflow-hidden rounded-xl bg-slate-100 px-3 py-2.5 dark:bg-white/5">
              <span className="flex-1 truncate text-sm font-mono text-slate-600 dark:text-slate-300">{quizUrl}</span>
            </div>
            <ShareButtons url={quizUrl} message={whatsappMessage} />
          </AppCard>

          <div className="mb-5">
            <QRCodeCard url={quizUrl} fileName={`vibecheck-${quizId}`} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <a href={quizUrl} target="_blank" rel="noopener noreferrer">
              <AppButton variant="secondary" fullWidth icon={<ExternalLink size={16} />}>
                Open Quiz
              </AppButton>
            </a>
            <Link to={dashboardUrl}>
              <AppButton variant="secondary" fullWidth icon={<LayoutDashboard size={16} />}>
                View Dashboard
              </AppButton>
            </Link>
          </div>

          <AppCard className="mt-5 flex items-start gap-3 border-vibe-yellow-400/40 bg-vibe-yellow-400/5">
            <ShieldAlert size={18} className="mt-0.5 shrink-0 text-vibe-yellow-500" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Keep your dashboard access private. Anyone with dashboard access may view your quiz responses.
            </p>
          </AppCard>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
            <VibeCheckLogo size={16} showWordmark={false} />
            Made with VibeCheck
          </div>
        </motion.div>
      </PageContainer>
    </div>
  )
}
