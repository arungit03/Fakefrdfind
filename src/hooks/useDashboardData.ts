import { useCallback, useEffect, useMemo, useState } from 'react'
import { isFirebaseConfigured } from '../firebase/config'
import { callGetDashboardData } from '../firebase/functions'
import type { PublicQuiz, QuizStats } from '../types/quiz'
import type { QuizResponse } from '../types/response'

/**
 * Dashboard data is fetched through the getDashboardData callable, which
 * verifies the creator token server-side before returning anything —
 * Firestore rules deny all direct client reads of a quiz's responses, so
 * this callable is the only path to that data.
 */
export function useDashboardData(quizId: string | undefined, creatorToken: string | null) {
  const [quiz, setQuiz] = useState<PublicQuiz | null>(null)
  const [responses, setResponses] = useState<QuizResponse[]>([])
  const [stats, setStats] = useState<QuizStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(() => {
    if (!quizId || !creatorToken) {
      setIsLoading(false)
      return
    }
    if (!isFirebaseConfigured) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)
    callGetDashboardData(quizId, creatorToken)
      .then((data) => {
        setQuiz(data.quiz)
        setStats(data.stats)
        setResponses(data.responses)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Could not load dashboard data.')
      })
      .finally(() => setIsLoading(false))
  }, [quizId, creatorToken])

  useEffect(() => {
    refresh()
  }, [refresh])

  const derived = useMemo(() => {
    const totalResponses = responses.length
    const averageScore = totalResponses
      ? Math.round(responses.reduce((sum, r) => sum + r.percentage, 0) / totalResponses)
      : 0
    const highestScore = totalResponses ? Math.max(...responses.map((r) => r.percentage)) : 0
    const latestResponse = responses[0] ?? null

    const scoreDistribution = [
      { range: '0-30%', count: responses.filter((r) => r.percentage <= 30).length },
      { range: '31-50%', count: responses.filter((r) => r.percentage > 30 && r.percentage <= 50).length },
      { range: '51-70%', count: responses.filter((r) => r.percentage > 50 && r.percentage <= 70).length },
      { range: '71-89%', count: responses.filter((r) => r.percentage > 70 && r.percentage <= 89).length },
      { range: '90-100%', count: responses.filter((r) => r.percentage >= 90).length },
    ]

    const responsesByDate = new Map<string, number>()
    responses.forEach((r) => {
      const date = new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      responsesByDate.set(date, (responsesByDate.get(date) ?? 0) + 1)
    })
    const responsesOverTime = Array.from(responsesByDate.entries()).map(([date, count]) => ({ date, responses: count }))

    const categoryTotals = new Map<string, { correct: number; total: number }>()
    responses.forEach((r) => {
      r.categoryScores.forEach((cs) => {
        const existing = categoryTotals.get(cs.category) ?? { correct: 0, total: 0 }
        categoryTotals.set(cs.category, { correct: existing.correct + cs.correct, total: existing.total + cs.total })
      })
    })
    const categoryPerformance = Array.from(categoryTotals.entries()).map(([category, { correct, total }]) => ({
      category,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
    }))

    return { totalResponses, averageScore, highestScore, latestResponse, scoreDistribution, responsesOverTime, categoryPerformance }
  }, [responses])

  return { quiz, responses, stats, isLoading, error, refresh, ...derived }
}
