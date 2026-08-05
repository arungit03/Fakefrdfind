import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, XCircle, Smartphone, Clock, Calendar } from 'lucide-react'
import { DashboardShell } from '../components/dashboard/DashboardShell'
import { DashboardCard } from '../components/dashboard/DashboardCard'
import { AppCard } from '../components/common/AppCard'
import { LoadingScreen } from '../components/common/LoadingScreen'
import { ErrorState } from '../components/common/ErrorState'
import { useCreatorAccess } from '../hooks/useCreatorAccess'
import { useDashboardData } from '../hooks/useDashboardData'
import { isFirebaseConfigured } from '../firebase/config'
import { formatDateTime, formatDuration } from '../lib/formatters'

export default function ResponseDetailsPage() {
  const { quizId, responseId } = useParams<{ quizId: string; responseId: string }>()
  const { hasAccess, isResolved, token } = useCreatorAccess(quizId)
  const { quiz, responses, isLoading } = useDashboardData(quizId, token)

  if (!isResolved) return <LoadingScreen message="Checking access…" />
  if (isFirebaseConfigured && !hasAccess) {
    return <ErrorState title="Unauthorized dashboard access" description="Use the dashboard link from your share page." />
  }
  if (isFirebaseConfigured && isLoading) return <LoadingScreen message="Loading response…" />

  const response = responses.find((r) => r.responseId === responseId)

  if (!response) {
    return (
      <DashboardShell quizId={quizId ?? ''} quizTitle={quiz?.quizTitle ?? 'Response'}>
        <ErrorState title="Response not found" description="This response may have been deleted." showHomeButton={false} />
      </DashboardShell>
    )
  }

  const questionMap = new Map((quiz?.publicQuestions ?? []).map((q) => [q.questionId, q]))

  return (
    <DashboardShell quizId={quizId ?? ''} quizTitle={quiz?.quizTitle ?? 'Response'}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          to={`/dashboard/${quizId}/responses`}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-vibe-violet-600 dark:text-vibe-violet-300"
        >
          <ArrowLeft size={16} /> Back to responses
        </Link>

        <AppCard className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{response.playerAvatar}</span>
              <div>
                <h1 className="text-xl font-extrabold font-display">{response.playerName}</h1>
                <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} /> {formatDateTime(response.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} /> {formatDuration(response.durationSeconds)}
                  </span>
                  <span className="flex items-center gap-1 capitalize">
                    <Smartphone size={13} /> {response.deviceType}
                  </span>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-vibe-gradient px-5 py-3 text-center text-white">
              <p className="text-2xl font-extrabold font-display">{response.percentage}%</p>
              <p className="text-xs opacity-80">
                {response.correctCount}/{response.totalQuestions}
              </p>
            </div>
          </div>
        </AppCard>

        <DashboardCard title="Answer breakdown">
          <div className="space-y-3">
            {response.selectedAnswers.map((answer, i) => {
              const question = questionMap.get(answer.questionId)
              if (!question) return null
              const selectedOption = question.options.find((o) => o.id === answer.selectedOptionId)
              return (
                <div key={answer.questionId} className="rounded-xl border border-slate-100 p-3 dark:border-white/10">
                  <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Q{i + 1}. {question.question}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 size={16} className="text-slate-300" />
                    <span className="text-slate-500 dark:text-slate-400">Answered: {selectedOption?.text ?? '—'}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </DashboardCard>

        {response.categoryScores.length > 0 && (
          <div className="mt-6">
            <DashboardCard title="Category breakdown">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {response.categoryScores.map((cs) => (
                  <div key={cs.category} className="rounded-xl bg-slate-50 p-3 text-center dark:bg-white/5">
                    <p className="text-xs capitalize text-slate-400">{cs.category}</p>
                    <p className="mt-1 flex items-center justify-center gap-1 font-bold">
                      {cs.correct === cs.total ? (
                        <CheckCircle2 size={14} className="text-vibe-mint-500" />
                      ) : (
                        <XCircle size={14} className="text-vibe-coral-500" />
                      )}
                      {cs.correct}/{cs.total}
                    </p>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </div>
        )}
      </motion.div>
    </DashboardShell>
  )
}
