import { motion, type Variants } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  Share2,
  Trophy,
  QrCode,
  MessageCircle,
  Smartphone,
  ShieldCheck,
  Wand2,
  ArrowRight,
  Star,
} from 'lucide-react'
import { AnimatedBackground } from '../components/common/AnimatedBackground'
import { AppButton } from '../components/common/AppButton'
import { AppCard } from '../components/common/AppCard'
import { AnimatedCounter } from '../components/common/AnimatedCounter'
import { PhoneMockup } from '../components/quiz/PhoneMockup'
import { DEMO_STATS } from '../lib/constants'

const steps = [
  {
    icon: Wand2,
    title: 'Create your quiz',
    desc: 'Answer a few fun questions about yourself and pick the correct choice for each one.',
  },
  {
    icon: Share2,
    title: 'Share your unique link',
    desc: 'Send your quiz link, QR code, or a WhatsApp message to your friends in seconds.',
  },
  {
    icon: Trophy,
    title: 'See who knows you best',
    desc: 'Watch responses roll in and check your private leaderboard as friends compete.',
  },
]

const features = [
  { icon: Wand2, label: 'Custom friendship questions' },
  { icon: Sparkles, label: 'Instant score' },
  { icon: ShieldCheck, label: 'Private dashboard' },
  { icon: Trophy, label: 'Friend leaderboard' },
  { icon: MessageCircle, label: 'WhatsApp sharing' },
  { icon: QrCode, label: 'QR code' },
  { icon: Smartphone, label: 'Mobile-friendly experience' },
  { icon: Star, label: 'No complicated registration' },
]

const testimonials = [
  { name: 'Sample friend group', text: 'We spent an entire lunch break arguing about who actually knew the answers. So good.', score: '9/10' },
  { name: 'Sample roommate duo', text: 'Made one in five minutes and my roommate got destroyed on the food questions.', score: '10/10' },
  { name: 'Sample college crew', text: 'Way more fun than I expected — the leaderboard turned it into a whole competition.', score: '9/10' },
]

const containerStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:px-8">
        <AnimatedBackground />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div initial="hidden" animate="show" variants={containerStagger} className="text-center lg:text-left">
            <motion.span
              variants={fadeUp}
              className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-vibe-violet-100 px-4 py-1.5 text-sm font-semibold text-vibe-violet-700 dark:bg-white/10 dark:text-vibe-violet-300"
            >
              <Sparkles size={14} /> Free · No signup required
            </motion.span>
            <motion.h1 variants={fadeUp} className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Who really <span className="vibe-gradient-text">knows you?</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-lg text-lg text-slate-500 dark:text-slate-400 lg:mx-0">
              Create a fun quiz about yourself, share it with your friends, and discover who understands you best.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Link to="/create" className="w-full sm:w-auto">
                <AppButton size="lg" fullWidth icon={<Wand2 size={18} />}>
                  Create My Quiz
                </AppButton>
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto">
                <AppButton size="lg" variant="secondary" fullWidth icon={<ArrowRight size={18} />}>
                  See How It Works
                </AppButton>
              </a>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-12 grid grid-cols-3 gap-4 border-t border-slate-200/70 pt-8 dark:border-white/10">
              <div>
                <div className="text-2xl font-extrabold font-display vibe-gradient-text sm:text-3xl">
                  <AnimatedCounter value={DEMO_STATS.quizzesCreated} suffix="+" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">Quizzes created</p>
              </div>
              <div>
                <div className="text-2xl font-extrabold font-display vibe-gradient-text sm:text-3xl">
                  <AnimatedCounter value={DEMO_STATS.friendsTested} suffix="+" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">Friends tested</p>
              </div>
              <div>
                <div className="text-2xl font-extrabold font-display vibe-gradient-text sm:text-3xl">
                  <AnimatedCounter value={DEMO_STATS.answersSubmitted} suffix="+" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">Answers submitted</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <PhoneMockup />
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
          >
            <h2 className="text-3xl font-extrabold font-display sm:text-4xl">How VibeCheck works</h2>
          </motion.div>
          <motion.div
            className="grid gap-6 sm:grid-cols-3"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={containerStagger}
          >
            {steps.map((step, i) => (
              <motion.div key={step.title} variants={fadeUp}>
                <AppCard tilt className="h-full text-center">
                  <motion.div
                    className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-vibe-gradient text-white shadow-glow"
                    whileHover={{ rotate: 8, scale: 1.08 }}
                  >
                    <step.icon size={26} />
                  </motion.div>
                  <div className="mb-1 text-sm font-bold text-vibe-violet-500">Step {i + 1}</div>
                  <h3 className="mb-2 text-lg font-bold font-display">{step.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{step.desc}</p>
                </AppCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative px-4 py-20 sm:px-6 lg:px-8">
        <AnimatedBackground variant="minimal" />
        <div className="relative mx-auto max-w-6xl">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
          >
            <h2 className="text-3xl font-extrabold font-display sm:text-4xl">Everything you need to test your friendships</h2>
          </motion.div>
          <motion.div
            className="grid grid-cols-2 gap-4 sm:grid-cols-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={containerStagger}
          >
            {features.map((feature) => (
              <motion.div key={feature.label} variants={fadeUp} whileHover={{ y: -4 }}>
                <AppCard padding="sm" className="flex h-full flex-col items-center gap-2 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-vibe-violet-100 text-vibe-violet-600 dark:bg-white/10 dark:text-vibe-violet-300">
                    <feature.icon size={18} />
                  </div>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 sm:text-sm">{feature.label}</span>
                </AppCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Social proof */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="mb-3 text-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
          >
            <h2 className="text-3xl font-extrabold font-display sm:text-4xl">People are vibing</h2>
            <p className="mt-2 text-sm text-slate-400">Sample testimonials for illustration purposes</p>
          </motion.div>
          <motion.div
            className="mt-10 grid gap-5 sm:grid-cols-3"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={containerStagger}
          >
            {testimonials.map((testimonial) => (
              <motion.div key={testimonial.name} variants={fadeUp}>
                <AppCard className="h-full">
                  <div className="mb-3 flex gap-0.5 text-vibe-yellow-400">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">"{testimonial.text}"</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">{testimonial.name}</span>
                    <span className="rounded-full bg-vibe-violet-100 px-2 py-0.5 font-bold text-vibe-violet-600 dark:bg-white/10 dark:text-vibe-violet-300">
                      Scored {testimonial.score}
                    </span>
                  </div>
                </AppCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          className="relative mx-auto max-w-4xl overflow-hidden rounded-4xl bg-vibe-gradient p-10 text-center text-white shadow-glow sm:p-16"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.div
            className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <h2 className="mb-4 text-3xl font-extrabold font-display sm:text-4xl">Ready to test your friendships?</h2>
          <Link to="/create">
            <AppButton size="lg" variant="secondary" className="!text-vibe-violet-700">
              Create Your Quiz
            </AppButton>
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
