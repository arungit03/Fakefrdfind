import { motion } from 'framer-motion'
import { Heart, Sparkles, Users } from 'lucide-react'
import { PageContainer } from '../components/common/PageContainer'
import { AppCard } from '../components/common/AppCard'
import { AnimatedBackground } from '../components/common/AnimatedBackground'

const values = [
  { icon: Heart, title: 'Made for real friendships', text: 'VibeCheck exists to spark genuine laughs and conversations between people who actually know each other.' },
  { icon: Sparkles, title: 'Playful by design', text: 'Every animation, color, and interaction is built to feel light, fun, and a little bit delightful.' },
  { icon: Users, title: 'Private by default', text: 'Your quiz answers stay private. Only you see the full dashboard behind your quiz.' },
]

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden py-16">
      <AnimatedBackground variant="minimal" />
      <PageContainer maxWidth="max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="mb-3 text-4xl font-extrabold font-display sm:text-5xl">
            About <span className="vibe-gradient-text">VibeCheck</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-slate-500 dark:text-slate-400">
            VibeCheck is a small, independent project built for one reason: friendship quizzes are fun, and
            they deserve a home that feels modern, fast, and genuinely yours.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {values.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <AppCard className="h-full text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-vibe-gradient text-white">
                  <value.icon size={22} />
                </div>
                <h3 className="mb-1 font-bold font-display">{value.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{value.text}</p>
              </AppCard>
            </motion.div>
          ))}
        </div>

        <AppCard className="mt-12">
          <h2 className="mb-2 text-xl font-bold font-display">Our story</h2>
          <p className="text-slate-600 dark:text-slate-300">
            VibeCheck started as a weekend idea: what if testing how well your friends know you could feel as
            fun and shareable as the games you already play? We built it mobile-first, made it fast, and kept
            it simple — no accounts required to get started, no clutter, just a quiz you can share in seconds.
          </p>
        </AppCard>
      </PageContainer>
    </div>
  )
}
