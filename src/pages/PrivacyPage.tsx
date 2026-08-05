import { motion } from 'framer-motion'
import { PageContainer } from '../components/common/PageContainer'
import { AppCard } from '../components/common/AppCard'

const sections = [
  {
    title: '1. What we collect',
    body: 'When you create a quiz, we store the profile details you enter (name, nickname, avatar, theme) and the questions you write. When a friend takes your quiz, we store the name and avatar they enter and their answers. We do not require an account to create or take a quiz.',
  },
  {
    title: '2. How we use it',
    body: 'Quiz data is used only to run the quiz experience: showing questions to friends, calculating scores, and displaying results to you in your private dashboard. We do not sell your data.',
  },
  {
    title: '3. What friends can see',
    body: 'Friends who take your quiz see the questions and their own result. They never see the correct answers of other friends or your private dashboard.',
  },
  {
    title: '4. What you can see as a creator',
    body: 'As the quiz creator, you can see the names, avatars, answers, and scores of everyone who took your quiz, through your private dashboard link. Keep that link private — anyone who has it can view responses.',
  },
  {
    title: '5. Device information',
    body: 'We may store a general device type (mobile, tablet, desktop) associated with a response to help you understand how people take your quiz. We do not collect precise location data.',
  },
  {
    title: '6. Data deletion',
    body: 'You can delete individual responses or your entire quiz (including all responses) at any time from your dashboard settings.',
  },
  {
    title: '7. Contact',
    body: 'Questions about this policy? Reach out through our Contact page.',
  },
]

export default function PrivacyPage() {
  return (
    <PageContainer maxWidth="max-w-3xl" className="py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-2 text-4xl font-extrabold font-display">Privacy Policy</h1>
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
