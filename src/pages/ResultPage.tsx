import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { toDataUrl } from '../lib/imageExport'
import { Share2, Repeat, Wand2, Home, CheckCircle2, XCircle, Download } from 'lucide-react'
import { AnimatedBackground } from '../components/common/AnimatedBackground'
import { PageContainer } from '../components/common/PageContainer'
import { AppCard } from '../components/common/AppCard'
import { AppButton } from '../components/common/AppButton'
import { LoadingScreen } from '../components/common/LoadingScreen'
import { ErrorState } from '../components/common/ErrorState'
import { ScoreCircle } from '../components/quiz/ScoreCircle'
import { SocialResultCard } from '../components/share/SocialResultCard'
import { useQuiz } from '../hooks/useQuiz'
import { getScoreMessage } from '../lib/constants'
import { getQuizUrl, nativeShare, copyToClipboard } from '../lib/share'
import { toast } from 'sonner'
import type { SubmitQuizResult } from '../types/response'

interface FriendInfo {
  friendName: string
  friendAvatar: string
}

export default function ResultPage() {
  const { quizId, responseId } = useParams<{ quizId: string; responseId: string }>()
  const location = useLocation()
  const { quiz, status } = useQuiz(quizId)
  const cardRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)

  const friendInfo: FriendInfo = useMemo(() => {
    const stateInfo = (location.state as { friendInfo?: FriendInfo } | null)?.friendInfo
    if (stateInfo) return stateInfo
    return { friendName: 'Friend', friendAvatar: '😄' }
  }, [location.state])

  const result: SubmitQuizResult | null = useMemo(() => {
    if (!responseId) return null
    const raw = sessionStorage.getItem(`vibecheck.result.${responseId}`)
    return raw ? JSON.parse(raw) : null
  }, [responseId])

  useEffect(() => {
    if (!result) return
    const timeout = setTimeout(() => {
      confetti({
        particleCount: result.percentage >= 70 ? 160 : 80,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#8b5cf6', '#ec4899', '#facc15', '#34d399'],
      })
    }, 500)
    return () => clearTimeout(timeout)
  }, [result])

  if (status === 'loading') return <LoadingScreen message="Calculating your score…" />
  if (!quiz || !result) {
    return <ErrorState title="Result not found" description="This result may have expired or the link is invalid." />
  }

  const scoreMessage = getScoreMessage(result.percentage)
  const quizUrl = getQuizUrl(quiz.quizId)

  const handleShareScore = async () => {
    const shared = await nativeShare({
      title: 'My VibeCheck score',
      text: `I scored ${result.percentage}% on ${quiz.creatorName}'s friendship quiz! Think you can beat me?`,
      url: quizUrl,
    })
    if (!shared) {
      await copyToClipboard(quizUrl)
      toast.success('Link copied — share it with a challenge!')
    }
  }

  const handleDownloadCard = async () => {
    if (!cardRef.current) return
    setIsExporting(true)
    try {
      const dataUrl = await toDataUrl(cardRef.current)
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `vibecheck-result-${responseId}.png`
      link.click()
    } catch {
      toast.error('Could not generate image')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden py-10">
      <AnimatedBackground />
      <PageContainer maxWidth="max-w-lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="text-3xl">{friendInfo.friendAvatar}</span>
            <span className="text-2xl">×</span>
            <span className="text-3xl">{quiz.creatorAvatar}</span>
          </div>
          <h1 className="mb-1 text-2xl font-extrabold font-display sm:text-3xl">
            {friendInfo.friendName}, here's your VibeCheck!
          </h1>
        </motion.div>

        <motion.div
          className="my-8 flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <ScoreCircle percentage={result.percentage} label={`${result.score}/${result.totalQuestions}`} />
        </motion.div>

        <AppCard className="mb-5 text-center">
          <p className="text-lg font-bold font-display">{scoreMessage}</p>
        </AppCard>

        <div className="mb-5 grid grid-cols-2 gap-3">
          <AppCard padding="sm" className="flex items-center gap-2">
            <CheckCircle2 className="text-vibe-mint-500" size={20} />
            <div>
              <p className="text-lg font-extrabold">{result.correctCount}</p>
              <p className="text-xs text-slate-400">Correct</p>
            </div>
          </AppCard>
          <AppCard padding="sm" className="flex items-center gap-2">
            <XCircle className="text-vibe-coral-500" size={20} />
            <div>
              <p className="text-lg font-extrabold">{result.incorrectCount}</p>
              <p className="text-xs text-slate-400">Incorrect</p>
            </div>
          </AppCard>
        </div>

        {result.categoryScores.length > 0 && (
          <AppCard className="mb-5">
            <h3 className="mb-3 text-sm font-bold font-display">Category breakdown</h3>
            <div className="space-y-2">
              {result.categoryScores.map((cat) => (
                <div key={cat.category} className="flex items-center justify-between text-sm">
                  <span className="capitalize text-slate-500 dark:text-slate-400">{cat.category}</span>
                  <span className="font-semibold">
                    {cat.correct}/{cat.total}
                  </span>
                </div>
              ))}
            </div>
          </AppCard>
        )}

        <div className="mb-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <AppButton variant="secondary" icon={<Share2 size={16} />} onClick={handleShareScore}>
              Share My Score
            </AppButton>
            <AppButton variant="secondary" icon={<Download size={16} />} isLoading={isExporting} onClick={handleDownloadCard}>
              Download Card
            </AppButton>
          </div>
          <a href={quizUrl}>
            <AppButton fullWidth variant="outline" icon={<Repeat size={16} />}>
              Challenge Another Friend
            </AppButton>
          </a>
          <Link to="/create">
            <AppButton fullWidth icon={<Wand2 size={16} />}>
              Create My Own Quiz
            </AppButton>
          </Link>
          <Link to="/">
            <AppButton fullWidth variant="ghost" icon={<Home size={16} />}>
              Return Home
            </AppButton>
          </Link>
        </div>

        {/* Off-screen render target for the downloadable share card */}
        <div className="pointer-events-none fixed -left-[9999px] top-0 opacity-0" aria-hidden="true">
          <SocialResultCard
            ref={cardRef}
            friendName={friendInfo.friendName}
            friendAvatar={friendInfo.friendAvatar}
            creatorName={quiz.creatorName}
            percentage={result.percentage}
            score={result.score}
            totalQuestions={result.totalQuestions}
            theme={quiz.theme}
          />
        </div>
      </PageContainer>
    </div>
  )
}
