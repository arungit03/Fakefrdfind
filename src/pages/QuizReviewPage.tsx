import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'
import { ArrowLeft, Edit2, Sparkles, Clock, ShieldCheck, Rocket } from 'lucide-react'
import { AnimatedBackground } from '../components/common/AnimatedBackground'
import { PageContainer } from '../components/common/PageContainer'
import { AppCard } from '../components/common/AppCard'
import { AppButton } from '../components/common/AppButton'
import { StepIndicator } from '../components/common/StepIndicator'
import { CategoryBadge, DifficultyBadge } from '../components/quiz/Badges'
import { useQuizDraft } from '../hooks/useQuizDraft'
import { getTheme } from '../data/themes'
import { estimateCompletionMinutes } from '../lib/formatters'
import { isFirebaseConfigured } from '../firebase/config'
import { callPublishQuiz } from '../firebase/functions'
import { generateId } from '../lib/security'

const BUILDER_STEPS = ['Profile', 'Questions', 'Review']

export default function QuizReviewPage() {
  const navigate = useNavigate()
  const draft = useQuizDraft()
  const [isPublishing, setIsPublishing] = useState(false)
  const theme = getTheme(draft.profile.theme)

  const quizTitle = draft.quizTitle || `${draft.profile.creatorName || 'My'}'s Friendship Quiz`

  const handlePublish = async () => {
    if (!draft.profile.creatorName.trim()) {
      toast.error('Go back and add your name first')
      navigate('/create/profile')
      return
    }
    if (draft.questions.length < 5) {
      toast.error('You need at least 5 questions')
      navigate('/create/questions')
      return
    }

    setIsPublishing(true)
    try {
      let quizId: string
      let creatorToken: string

      if (isFirebaseConfigured) {
        const result = await callPublishQuiz({
          profile: {
            creatorName: draft.profile.creatorName,
            nickname: draft.profile.nickname,
            avatar: draft.profile.avatar,
            profileImageUrl: draft.profile.profileImageUrl,
            theme: draft.profile.theme,
            language: draft.profile.language,
            friendMessage: draft.profile.friendMessage,
          },
          quizTitle,
          questions: draft.questions.map((q) => ({
            id: q.id,
            question: q.question,
            options: q.options,
            correctOptionId: q.correctOptionId,
            category: q.category,
            difficulty: q.difficulty,
          })),
          settings: draft.settings,
        })
        quizId = result.quizId
        creatorToken = result.creatorToken
      } else {
        // Local fallback so the flow is demonstrable without a live Firebase project.
        quizId = generateId('quiz')
        creatorToken = generateId('tok')
        await new Promise((resolve) => setTimeout(resolve, 900))
      }

      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#ec4899', '#facc15', '#34d399'],
      })

      toast.success('Quiz published!')
      draft.reset()
      navigate(`/share/${quizId}`, { state: { creatorToken } })
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong publishing your quiz. Please try again.')
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="relative overflow-hidden py-10 sm:py-14">
      <AnimatedBackground variant="minimal" />
      <PageContainer maxWidth="max-w-3xl">
        <div className="mb-8">
          <StepIndicator steps={BUILDER_STEPS} currentStep={2} />
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="mb-1 text-2xl font-extrabold font-display">Review your quiz</h1>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
            Double-check everything before it goes live. Friends will never see correct answers.
          </p>

          {/* Profile preview */}
          <AppCard className="mb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${theme.gradient} text-2xl`}>
                  {draft.profile.avatar}
                </div>
                <div>
                  <h2 className="font-bold font-display">
                    {draft.profile.creatorName || 'Your name'}
                    {draft.profile.nickname ? ` "${draft.profile.nickname}"` : ''}
                  </h2>
                  <p className="text-xs text-slate-400">{theme.name} theme · {draft.profile.language === 'ta' ? 'Tamil' : 'English'}</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/create/profile')}
                className="flex items-center gap-1 text-sm font-semibold text-vibe-violet-600 hover:underline dark:text-vibe-violet-300"
              >
                <Edit2 size={14} /> Edit
              </button>
            </div>
            {draft.profile.friendMessage && (
              <p className="mt-3 rounded-xl bg-slate-100 px-3 py-2 text-sm italic text-slate-600 dark:bg-white/5 dark:text-slate-300">
                "{draft.profile.friendMessage}"
              </p>
            )}
          </AppCard>

          {/* Quiz stats */}
          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <AppCard padding="sm" className="text-center">
              <p className="text-2xl font-extrabold font-display vibe-gradient-text">{draft.questions.length}</p>
              <p className="text-xs text-slate-400">Questions</p>
            </AppCard>
            <AppCard padding="sm" className="text-center">
              <p className="flex items-center justify-center gap-1 text-2xl font-extrabold font-display vibe-gradient-text">
                <Clock size={18} /> {estimateCompletionMinutes(draft.questions.length)}
              </p>
              <p className="text-xs text-slate-400">Est. time</p>
            </AppCard>
            <AppCard padding="sm" className="col-span-2 text-center sm:col-span-1">
              <p className="flex items-center justify-center gap-1 text-2xl font-extrabold font-display vibe-gradient-text">
                <ShieldCheck size={18} /> Private
              </p>
              <p className="text-xs text-slate-400">Answers hidden</p>
            </AppCard>
          </div>

          {/* Question list */}
          <AppCard className="mb-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold font-display">Questions ({draft.questions.length})</h3>
              <button
                onClick={() => navigate('/create/questions')}
                className="flex items-center gap-1 text-sm font-semibold text-vibe-violet-600 hover:underline dark:text-vibe-violet-300"
              >
                <Edit2 size={14} /> Edit
              </button>
            </div>
            <div className="space-y-2.5">
              {draft.questions.map((q, i) => (
                <div key={q.id} className="rounded-xl border border-slate-100 p-3 dark:border-white/10">
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="text-xs font-bold text-vibe-violet-500">Q{i + 1}</span>
                    <CategoryBadge category={q.category} />
                    <DifficultyBadge difficulty={q.difficulty} />
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{q.question}</p>
                  <p className="mt-1 text-xs text-vibe-mint-600 dark:text-vibe-mint-400">
                    Correct: {q.options.find((o) => o.id === q.correctOptionId)?.text}
                  </p>
                </div>
              ))}
            </div>
          </AppCard>

          <AppCard className="mb-8 flex items-start gap-3 border-vibe-yellow-400/40 bg-vibe-yellow-400/5">
            <Sparkles size={18} className="mt-0.5 shrink-0 text-vibe-yellow-500" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Once published, correct answers are stored securely and are never exposed in the public quiz data —
              friends only see the questions and options.
            </p>
          </AppCard>

          <div className="flex items-center justify-between">
            <AppButton variant="ghost" icon={<ArrowLeft size={18} />} onClick={() => navigate('/create/questions')}>
              Back
            </AppButton>
            <AppButton size="lg" icon={<Rocket size={18} />} isLoading={isPublishing} onClick={handlePublish}>
              Publish Quiz
            </AppButton>
          </div>
        </motion.div>
      </PageContainer>
    </div>
  )
}
