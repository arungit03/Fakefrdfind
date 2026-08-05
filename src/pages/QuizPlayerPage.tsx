import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useSwipeable } from 'react-swipeable'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { AnimatedBackground } from '../components/common/AnimatedBackground'
import { PageContainer } from '../components/common/PageContainer'
import { AppCard } from '../components/common/AppCard'
import { AppButton } from '../components/common/AppButton'
import { AppModal } from '../components/common/AppModal'
import { LoadingScreen } from '../components/common/LoadingScreen'
import { ErrorState } from '../components/common/ErrorState'
import { QuizProgress } from '../components/quiz/QuizProgress'
import { AnswerOption } from '../components/quiz/AnswerOption'
import { CategoryBadge, DifficultyBadge } from '../components/quiz/Badges'
import { useQuiz } from '../hooks/useQuiz'
import { getTheme } from '../data/themes'
import { getOrCreateBrowserSubmissionId } from '../lib/security'
import { callSubmitQuizResponse } from '../firebase/functions'
import { isFirebaseConfigured } from '../firebase/config'
import type { SelectedAnswer } from '../types/response'

interface FriendInfo {
  friendName: string
  friendAvatar: string
}

export default function QuizPlayerPage() {
  const { quizId } = useParams<{ quizId: string }>()
  const navigate = useNavigate()
  const { quiz, status } = useQuiz(quizId)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime] = useState(() => Date.now())
  const [direction, setDirection] = useState(1)

  const friendInfo: FriendInfo | null = useMemo(() => {
    if (!quizId) return null
    const raw = sessionStorage.getItem(`vibecheck.friend.${quizId}`)
    return raw ? JSON.parse(raw) : null
  }, [quizId])

  useEffect(() => {
    if (!quizId) return
    const saved = localStorage.getItem(`vibecheck.progress.${quizId}`)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setAnswers(parsed.answers ?? {})
        setCurrentIndex(parsed.currentIndex ?? 0)
      } catch {
        // Ignore malformed saved progress.
      }
    }
  }, [quizId])

  useEffect(() => {
    if (!quizId) return
    localStorage.setItem(`vibecheck.progress.${quizId}`, JSON.stringify({ answers, currentIndex }))
  }, [answers, currentIndex, quizId])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const questions = quiz?.publicQuestions ?? []
  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1
  const allAnswered = questions.every((q) => answers[q.questionId])

  const goNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setDirection(1)
      setCurrentIndex((i) => i + 1)
    }
  }, [currentIndex, questions.length])

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1)
      setCurrentIndex((i) => i - 1)
    }
  }, [currentIndex])

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => goNext(),
    onSwipedRight: () => goPrev(),
    trackMouse: false,
  })

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goNext, goPrev])

  if (!friendInfo && quizId) {
    navigate(`/quiz/${quizId}`, { replace: true })
    return null
  }

  if (status === 'loading') return <LoadingScreen message="Loading questions…" />
  if (status !== 'ready' || !quiz) {
    return <ErrorState title="Quiz unavailable" description="This quiz can no longer be played." />
  }

  const handleSelect = (optionId: string) => {
    if (!currentQuestion) return
    setAnswers((prev) => ({ ...prev, [currentQuestion.questionId]: optionId }))
  }

  const handleSubmit = async () => {
    if (!allAnswered) {
      toast.error('Please answer every question first')
      return
    }
    if (!friendInfo || !quizId) return

    setIsSubmitting(true)
    try {
      const selectedAnswers: SelectedAnswer[] = questions.map((q) => ({
        questionId: q.questionId,
        selectedOptionId: answers[q.questionId],
      }))
      const durationSeconds = Math.round((Date.now() - startTime) / 1000)
      const browserSubmissionId = getOrCreateBrowserSubmissionId(quizId)

      let responseId: string

      if (isFirebaseConfigured) {
        const result = await callSubmitQuizResponse({
          quizId,
          playerName: friendInfo.friendName,
          playerAvatar: friendInfo.friendAvatar,
          answers: selectedAnswers,
          durationSeconds,
          browserSubmissionId,
        })
        responseId = result.responseId
        sessionStorage.setItem(`vibecheck.result.${responseId}`, JSON.stringify(result))
      } else {
        responseId = `local_${Date.now()}`
        sessionStorage.setItem(
          `vibecheck.result.${responseId}`,
          JSON.stringify({
            responseId,
            score: Math.round(questions.length * 0.7),
            totalQuestions: questions.length,
            percentage: 70,
            correctCount: Math.round(questions.length * 0.7),
            incorrectCount: questions.length - Math.round(questions.length * 0.7),
            categoryScores: [],
          }),
        )
      }

      localStorage.removeItem(`vibecheck.progress.${quizId}`)
      navigate(`/quiz/${quizId}/result/${responseId}`, { state: { friendInfo } })
    } catch (error) {
      console.error(error)
      toast.error('Could not submit your answers. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const theme = getTheme(quiz.theme)

  return (
    <div className={`relative min-h-screen overflow-hidden bg-gradient-to-br ${theme.gradient} py-8`} {...swipeHandlers}>
      <AnimatedBackground variant="quiz" />
      <PageContainer maxWidth="max-w-lg">
        <AppCard className="!bg-white/95 dark:!bg-vibe-navy-900/95">
          <QuizProgress current={currentIndex + 1} total={questions.length} />

          <AnimatePresence mode="wait" custom={direction}>
            {currentQuestion && (
              <motion.div
                key={currentQuestion.questionId}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
                transition={{ duration: 0.25 }}
                className="mt-4"
              >
                <div className="mb-3 flex gap-2">
                  <CategoryBadge category={currentQuestion.category} />
                  <DifficultyBadge difficulty={currentQuestion.difficulty} />
                </div>
                <h2 className="mb-5 text-xl font-bold font-display leading-snug sm:text-2xl">{currentQuestion.question}</h2>
                <div className="space-y-3">
                  {currentQuestion.options.map((opt, i) => (
                    <AnswerOption
                      key={opt.id}
                      letter={String.fromCharCode(65 + i)}
                      text={opt.text}
                      isSelected={answers[currentQuestion.questionId] === opt.id}
                      onClick={() => handleSelect(opt.id)}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-between">
            <AppButton variant="ghost" icon={<ArrowLeft size={18} />} onClick={goPrev} disabled={currentIndex === 0}>
              Previous
            </AppButton>
            {isLastQuestion ? (
              <AppButton icon={<CheckCircle2 size={18} />} onClick={() => setIsReviewOpen(true)}>
                Submit Answers
              </AppButton>
            ) : (
              <AppButton
                icon={<ArrowRight size={18} />}
                onClick={goNext}
                disabled={!answers[currentQuestion?.questionId ?? '']}
              >
                Next
              </AppButton>
            )}
          </div>
        </AppCard>
      </PageContainer>

      <AppModal isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} title="Review your answers" maxWidth="max-w-md">
        <div className="mb-4 max-h-72 space-y-2 overflow-y-auto">
          {questions.map((q, i) => (
            <button
              key={q.questionId}
              onClick={() => {
                setCurrentIndex(i)
                setIsReviewOpen(false)
              }}
              className="flex w-full items-center justify-between rounded-xl border border-slate-100 p-3 text-left text-sm hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
            >
              <span className="truncate pr-2 text-slate-600 dark:text-slate-300">
                Q{i + 1}. {q.question}
              </span>
              {answers[q.questionId] ? (
                <CheckCircle2 size={16} className="shrink-0 text-vibe-mint-500" />
              ) : (
                <span className="shrink-0 text-xs font-bold text-vibe-coral-500">Unanswered</span>
              )}
            </button>
          ))}
        </div>
        <AppButton fullWidth isLoading={isSubmitting} disabled={!allAnswered} onClick={handleSubmit}>
          {allAnswered ? 'Confirm & Submit' : 'Answer all questions first'}
        </AppButton>
      </AppModal>
    </div>
  )
}
