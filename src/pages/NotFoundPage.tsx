import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HelpCircle } from 'lucide-react'
import { PageContainer } from '../components/common/PageContainer'
import { AppButton } from '../components/common/AppButton'
import { AnimatedBackground } from '../components/common/AnimatedBackground'

export default function NotFoundPage() {
  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
      <AnimatedBackground variant="minimal" />
      <PageContainer maxWidth="max-w-lg">
        <motion.div
          className="glass-card flex flex-col items-center rounded-4xl p-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-vibe-violet-100 text-vibe-violet-500 dark:bg-white/10"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          >
            <HelpCircle size={36} />
          </motion.div>
          <h1 className="mb-2 text-4xl font-extrabold font-display">404</h1>
          <p className="mb-6 text-slate-500 dark:text-slate-400">
            This page wandered off. Maybe it went to take someone else's quiz.
          </p>
          <Link to="/">
            <AppButton>Return Home</AppButton>
          </Link>
        </motion.div>
      </PageContainer>
    </div>
  )
}
