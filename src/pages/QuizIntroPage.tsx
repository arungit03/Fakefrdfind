import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Clock, HelpCircle, ShieldCheck, Play, Flag } from 'lucide-react'
import { AnimatedBackground } from '../components/common/AnimatedBackground'
import { PageContainer } from '../components/common/PageContainer'
import { AppCard } from '../components/common/AppCard'
import { AppButton } from '../components/common/AppButton'
import { AppInput, AppTextarea } from '../components/common/AppInput'
import { AppModal } from '../components/common/AppModal'
import { LoadingScreen } from '../components/common/LoadingScreen'
import { ErrorState } from '../components/common/ErrorState'
import { useQuiz } from '../hooks/useQuiz'
import { friendIntroSchema, type FriendIntroFormValues } from '../lib/validators'
import { estimateCompletionMinutes } from '../lib/formatters'
import { getTheme } from '../data/themes'
import { ALL_AVATARS } from '../data/avatars'
import { sanitizeText } from '../lib/security'
import { REPORT_REASONS } from '../lib/constants'
import { callReportQuiz } from '../firebase/functions'
import { isFirebaseConfigured } from '../firebase/config'
import { cn } from '../lib/utils'

export default function QuizIntroPage() {
  const { quizId } = useParams<{ quizId: string }>()
  const navigate = useNavigate()
  const { quiz, status } = useQuiz(quizId)
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [reportReason, setReportReason] = useState<string>('')
  const [reportDetails, setReportDetails] = useState('')
  const [isSubmittingReport, setIsSubmittingReport] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FriendIntroFormValues>({
    resolver: zodResolver(friendIntroSchema),
    defaultValues: { friendName: '', friendAvatar: ALL_AVATARS[0] },
  })

  if (status === 'loading') return <LoadingScreen message="Loading quiz…" />

  if (status === 'not-found') {
    return <ErrorState title="Quiz not found" description="This quiz link doesn't exist or may have been removed." />
  }
  if (status === 'disabled') {
    return <ErrorState title="This quiz is disabled" description="The creator has turned off responses for this quiz." />
  }
  if (status === 'expired') {
    return <ErrorState title="This quiz has expired" description="The creator set an expiration date that has passed." />
  }
  if (status === 'error' || !quiz) {
    return (
      <ErrorState
        title="Something went wrong"
        description="We couldn't load this quiz. Check your connection and try again."
        onRetry={() => window.location.reload()}
      />
    )
  }

  const theme = getTheme(quiz.theme)

  const onSubmit = (values: FriendIntroFormValues) => {
    sessionStorage.setItem(
      `vibecheck.friend.${quizId}`,
      JSON.stringify({ friendName: sanitizeText(values.friendName), friendAvatar: values.friendAvatar }),
    )
    navigate(`/quiz/${quizId}/play`)
  }

  const handleSubmitReport = async () => {
    if (!quizId || !reportReason) return
    setIsSubmittingReport(true)
    try {
      if (isFirebaseConfigured) {
        await callReportQuiz(quizId, reportReason, reportDetails)
      }
      toast.success('Thanks — we\'ll review this quiz.')
      setIsReportOpen(false)
      setReportReason('')
      setReportDetails('')
    } catch {
      toast.error('Could not submit report. Please try again.')
    } finally {
      setIsSubmittingReport(false)
    }
  }

  return (
    <div className={`relative min-h-screen overflow-hidden bg-gradient-to-br ${theme.gradient} py-10`}>
      <AnimatedBackground />
      <PageContainer maxWidth="max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <AppCard className="!bg-white/95 dark:!bg-vibe-navy-900/95">
            <div className="mb-5 text-center">
              <motion.div
                className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-vibe-violet-100 text-3xl dark:bg-white/10"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                {quiz.creatorAvatar}
              </motion.div>
              <p className="text-sm text-slate-400">
                {quiz.creatorName}
                {quiz.creatorNickname ? ` "${quiz.creatorNickname}"` : ''} wants to know...
              </p>
              <h1 className="mt-1 text-2xl font-extrabold font-display">{quiz.quizTitle}</h1>
              {quiz.friendMessage && (
                <p className="mt-3 rounded-xl bg-slate-100 px-3 py-2 text-sm italic text-slate-600 dark:bg-white/5 dark:text-slate-300">
                  "{quiz.friendMessage}"
                </p>
              )}
            </div>

            <div className="mb-6 flex items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <HelpCircle size={16} /> {quiz.questionCount} questions
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={16} /> {estimateCompletionMinutes(quiz.questionCount)}
              </span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <AppInput
                label="Your name"
                placeholder="e.g. Priya"
                maxLength={30}
                {...register('friendName')}
                error={errors.friendName?.message}
              />
              <div>
                <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Pick an avatar</span>
                <Controller
                  control={control}
                  name="friendAvatar"
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-2">
                      {ALL_AVATARS.slice(0, 16).map((emoji) => (
                        <button
                          type="button"
                          key={emoji}
                          onClick={() => field.onChange(emoji)}
                          aria-pressed={field.value === emoji}
                          className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl transition-all ${
                            field.value === emoji
                              ? 'bg-vibe-gradient shadow-glow scale-110'
                              : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/5'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                />
              </div>

              <p className="flex items-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck size={14} /> Your answers will be visible to the quiz creator.
              </p>

              <AppButton type="submit" fullWidth size="lg" icon={<Play size={18} />}>
                Start Quiz
              </AppButton>
            </form>

            <button
              onClick={() => setIsReportOpen(true)}
              className="mx-auto mt-4 flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-vibe-coral-500"
            >
              <Flag size={12} /> Report this quiz
            </button>
          </AppCard>
        </motion.div>
      </PageContainer>

      <AppModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} title="Report this quiz">
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          Let us know what's wrong. Reports are reviewed and kept private.
        </p>
        <div className="mb-4 flex flex-wrap gap-2">
          {REPORT_REASONS.map((reason) => (
            <button
              key={reason}
              type="button"
              onClick={() => setReportReason(reason)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-semibold',
                reportReason === reason ? 'bg-vibe-coral-500 text-white' : 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300',
              )}
            >
              {reason}
            </button>
          ))}
        </div>
        <AppTextarea
          label="Additional details (optional)"
          value={reportDetails}
          onChange={(e) => setReportDetails(e.target.value)}
          maxLength={500}
          rows={3}
          className="mb-4"
        />
        <AppButton fullWidth variant="danger" disabled={!reportReason} isLoading={isSubmittingReport} onClick={handleSubmitReport}>
          Submit Report
        </AppButton>
      </AppModal>
    </div>
  )
}
