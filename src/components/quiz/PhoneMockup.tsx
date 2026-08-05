import { motion } from 'framer-motion'
import { Heart, Sparkles, Check } from 'lucide-react'

const demoOptions = [
  { label: 'A', text: 'Pizza night', color: 'from-vibe-violet-500 to-vibe-indigo-500' },
  { label: 'B', text: 'Movie marathon', color: 'from-vibe-pink-500 to-vibe-coral-500' },
  { label: 'C', text: 'Road trip', color: 'from-vibe-mint-400 to-vibe-cyan-400' },
  { label: 'D', text: 'Sleep all day', color: 'from-vibe-peach-300 to-vibe-yellow-400' },
]

export function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[280px] sm:w-[320px]">
      <motion.div
        className="absolute -left-8 -top-6 text-vibe-pink-400"
        animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 3.5, repeat: Infinity }}
      >
        <Heart size={28} fill="currentColor" />
      </motion.div>
      <motion.div
        className="absolute -right-6 top-10 text-vibe-yellow-400"
        animate={{ y: [0, 10, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
      >
        <Sparkles size={24} />
      </motion.div>

      <motion.div
        className="relative rounded-[2.5rem] border-[10px] border-slate-900 bg-slate-900 shadow-2xl dark:border-slate-700"
        initial={{ opacity: 0, y: 30, rotate: -3 }}
        animate={{ opacity: 1, y: 0, rotate: -2 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className="absolute left-1/2 top-0 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-slate-900" />
        <div className="min-h-[520px] overflow-hidden rounded-[1.8rem] bg-gradient-to-b from-vibe-violet-50 to-white p-4 dark:from-vibe-navy-900 dark:to-vibe-navy-950">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-bold text-vibe-violet-500">Question 3 of 10</span>
            <div className="flex -space-x-2">
              {['🐶', '🎮', '⭐'].map((emoji, i) => (
                <span
                  key={i}
                  className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-vibe-violet-100 text-xs dark:border-vibe-navy-900"
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
            <motion.div
              className="h-full bg-vibe-gradient"
              initial={{ width: '10%' }}
              animate={{ width: '30%' }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>

          <p className="mb-4 text-sm font-bold leading-snug text-slate-800 dark:text-white">
            What would I choose on a completely free day?
          </p>

          <div className="space-y-2.5">
            {demoOptions.map((opt, i) => (
              <motion.div
                key={opt.label}
                className={`flex items-center gap-3 rounded-2xl bg-gradient-to-r ${opt.color} p-3 text-white shadow-md`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.12 }}
                whileHover={{ scale: 1.02 }}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/25 text-xs font-bold">
                  {opt.label}
                </span>
                <span className="flex-1 text-sm font-semibold">{opt.text}</span>
                {i === 1 && (
                  <motion.span
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-vibe-violet-600"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.4, type: 'spring' }}
                  >
                    <Check size={12} strokeWidth={3} />
                  </motion.span>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-white/70 p-3 text-center shadow-inner dark:bg-white/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
          >
            <span className="text-2xl font-extrabold vibe-gradient-text">87%</span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">match so far</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
