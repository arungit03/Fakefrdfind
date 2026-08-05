import { motion } from 'framer-motion'
import { PageContainer } from '../components/common/PageContainer'
import { AppCard } from '../components/common/AppCard'

const sections = [
  {
    title: '1. Acceptable use',
    body: 'VibeCheck is meant for fun, friendly quizzes. Do not use it to bully, harass, share personal information without consent, or post spam or inappropriate content. Quizzes that violate this may be disabled without notice.',
  },
  {
    title: '2. Content you create',
    body: 'You are responsible for the questions and messages you write in your quiz. Do not include content that is illegal, hateful, or harmful.',
  },
  {
    title: '3. Reporting',
    body: 'Anyone can report a quiz for review using the report option on the quiz page. Reports are reviewed and may result in the quiz being disabled.',
  },
  {
    title: '4. No guarantee of availability',
    body: 'VibeCheck is provided as-is. We aim for high availability but do not guarantee the service will always be online or error-free.',
  },
  {
    title: '5. Account upgrade',
    body: 'Quizzes are created anonymously by default. If you choose to upgrade to a permanent account, your existing quizzes and dashboard access are preserved.',
  },
  {
    title: '6. Changes to these terms',
    body: 'We may update these terms occasionally. Continued use of VibeCheck after changes means you accept the updated terms.',
  },
]

export default function TermsPage() {
  return (
    <PageContainer maxWidth="max-w-3xl" className="py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-2 text-4xl font-extrabold font-display">Terms of Service</h1>
        <p className="mb-8 text-slate-500 dark:text-slate-400">Last updated: {new Date().getFullYear()}</p>
        <div className="space-y-4">
          {sections.map((section) => (
            <AppCard key={section.title}>
              <h2 className="mb-1.5 font-bold font-display">{section.title}</h2>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{section.body}</p>
            </AppCard>
          ))}
        </div>
      </motion.div>
    </PageContainer>
  )
}
