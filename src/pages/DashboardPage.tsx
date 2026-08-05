import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, TrendingUp, Trophy, CheckCircle, Trophy as TrophyIcon, ExternalLink } from 'lucide-react'
import { DashboardShell } from '../components/dashboard/DashboardShell'
import { StatCard } from '../components/dashboard/StatCard'
import { LeaderboardTable } from '../components/dashboard/LeaderboardTable'
import { DashboardCard } from '../components/dashboard/DashboardCard'
import {
  ScoreDistributionChart,
  ResponsesOverTimeChart,
  CategoryPerformanceChart,
} from '../components/dashboard/ResponseChart'
import { LoadingScreen } from '../components/common/LoadingScreen'
import { ErrorState } from '../components/common/ErrorState'
import { EmptyState } from '../components/common/EmptyState'
import { useCreatorAccess } from '../hooks/useCreatorAccess'
import { useDashboardData } from '../hooks/useDashboardData'
import { isFirebaseConfigured } from '../firebase/config'
import { formatRelativeTime } from '../lib/formatters'

export default function DashboardPage() {
  const { quizId } = useParams<{ quizId: string }>()
  const { hasAccess, isResolved, token } = useCreatorAccess(quizId)
  const { quiz, responses, isLoading, totalResponses, averageScore, highestScore, latestResponse, scoreDistribution, responsesOverTime, categoryPerformance } =
    useDashboardData(quizId, token)

  if (!isResolved) return <LoadingScreen message="Checking access…" />

  if (isFirebaseConfigured && !hasAccess) {
    return (
      <ErrorState
        title="Unauthorized dashboard access"
        description="This dashboard link is missing a valid access token. Use the link from your share page."
      />
    )
  }

  if (isFirebaseConfigured && isLoading) return <LoadingScreen message="Loading your dashboard…" />

  const quizTitle = quiz?.quizTitle ?? 'Your Quiz'
  const completionRate = totalResponses > 0 ? 100 : 0

  return (
    <DashboardShell quizId={quizId ?? ''} quizTitle={quizTitle}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold font-display">{quizTitle}</h1>
            <p className="text-sm text-slate-400">
              {quiz?.isActive === false ? 'Disabled' : 'Live'} · {quiz?.questionCount ?? 0} questions
            </p>
          </div>
          {quizId && (
            <a href={`/quiz/${quizId}`} target="_blank" rel="noopener noreferrer">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-vibe-violet-600 hover:underline dark:text-vibe-violet-300">
                <ExternalLink size={14} /> View public quiz
              </span>
            </a>
          )}
        </div>

        {!isFirebaseConfigured && (
          <DashboardCard title="Demo mode">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Firebase isn't configured in this environment, so live response data can't load. Connect Firebase (see
              README) to see real analytics here.
            </p>
          </DashboardCard>
        )}

        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard icon={Users} label="Total responses" value={totalResponses} />
          <StatCard icon={TrendingUp} label="Average score" value={averageScore} suffix="%" />
          <StatCard icon={Trophy} label="Highest score" value={highestScore} suffix="%" />
          <StatCard icon={CheckCircle} label="Completion rate" value={completionRate} suffix="%" />
        </div>

        {latestResponse && (
          <DashboardCard title="Latest response">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{latestResponse.playerAvatar}</span>
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-200">{latestResponse.playerName}</p>
                <p className="text-xs text-slate-400">
                  Scored {latestResponse.percentage}% · {formatRelativeTime(latestResponse.createdAt)}
                </p>
              </div>
            </div>
          </DashboardCard>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <ScoreDistributionChart data={scoreDistribution} />
          <ResponsesOverTimeChart data={responsesOverTime} />
        </div>

        <div className="mt-6" id="analytics">
          <CategoryPerformanceChart data={categoryPerformance} />
        </div>

        <div className="mt-6" id="leaderboard">
          <DashboardCard
            title="Leaderboard"
            action={
              <Link to={`/dashboard/${quizId}/responses`} className="text-xs font-semibold text-vibe-violet-600 dark:text-vibe-violet-300">
                View all
              </Link>
            }
          >
            {totalResponses === 0 ? (
              <EmptyState
                icon={<TrophyIcon size={24} />}
                title="No responses yet"
                description="Share your quiz link to start seeing friends compete."
              />
            ) : (
              <LeaderboardTable responses={responses.slice(0, 10)} />
            )}
          </DashboardCard>
        </div>
      </motion.div>
    </DashboardShell>
  )
}
