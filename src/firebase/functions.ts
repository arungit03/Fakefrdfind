import { httpsCallable } from 'firebase/functions'
import { getFirebaseFunctions } from './config'
import type { SubmitQuizPayload, SubmitQuizResult, QuizResponse } from '../types/response'
import type { PublicQuiz, QuizStats } from '../types/quiz'

export interface PublishQuizPayload {
  profile: {
    creatorName: string
    nickname: string
    avatar: string
    profileImageUrl?: string
    theme: string
    language: string
    friendMessage?: string
  }
  quizTitle: string
  questions: Array<{
    id: string
    question: string
    options: { id: string; text: string }[]
    correctOptionId: string
    category: string
    difficulty: string
  }>
  settings: {
    attemptPolicy: 'one' | 'unlimited' | 'limited'
    maxAttemptsPerBrowser?: number
    allowLeaderboard: boolean
    allowAnswerReview: boolean
    expiresAt?: string | null
    maxResponses?: number | null
  }
}

export interface PublishQuizResult {
  quizId: string
  creatorToken: string
}

export async function callSubmitQuizResponse(payload: SubmitQuizPayload): Promise<SubmitQuizResult> {
  const fn = httpsCallable<SubmitQuizPayload, SubmitQuizResult>(getFirebaseFunctions(), 'submitQuizResponse')
  const result = await fn(payload)
  return result.data
}

export async function callPublishQuiz(payload: PublishQuizPayload): Promise<PublishQuizResult> {
  const fn = httpsCallable<PublishQuizPayload, PublishQuizResult>(getFirebaseFunctions(), 'publishQuiz')
  const result = await fn(payload)
  return result.data
}

export async function callDeleteQuizResponse(quizId: string, responseId: string, creatorToken: string): Promise<void> {
  const fn = httpsCallable(getFirebaseFunctions(), 'deleteQuizResponse')
  await fn({ quizId, responseId, creatorToken })
}

export async function callDeleteQuiz(quizId: string, creatorToken: string): Promise<void> {
  const fn = httpsCallable(getFirebaseFunctions(), 'deleteQuiz')
  await fn({ quizId, creatorToken })
}

export async function callRegenerateQuizLink(
  quizId: string,
  creatorToken: string,
): Promise<{ newQuizId: string; newToken: string }> {
  const fn = httpsCallable<{ quizId: string; creatorToken: string }, { newQuizId: string; newToken: string }>(
    getFirebaseFunctions(),
    'regenerateQuizLink',
  )
  const result = await fn({ quizId, creatorToken })
  return result.data
}

export async function callExportQuizResponses(quizId: string, creatorToken: string): Promise<{ csv: string }> {
  const fn = httpsCallable<{ quizId: string; creatorToken: string }, { csv: string }>(
    getFirebaseFunctions(),
    'exportQuizResponses',
  )
  const result = await fn({ quizId, creatorToken })
  return result.data
}

export async function callReportQuiz(quizId: string, reason: string, details?: string): Promise<void> {
  const fn = httpsCallable(getFirebaseFunctions(), 'reportQuiz')
  await fn({ quizId, reason, details })
}

export interface DashboardData {
  quiz: PublicQuiz
  stats: QuizStats | null
  responses: QuizResponse[]
}

export async function callGetDashboardData(quizId: string, creatorToken: string): Promise<DashboardData> {
  const fn = httpsCallable<{ quizId: string; creatorToken: string }, DashboardData>(
    getFirebaseFunctions(),
    'getDashboardData',
  )
  const result = await fn({ quizId, creatorToken })
  return result.data
}

export interface UpdateQuizSettingsPayload {
  quizId: string
  creatorToken: string
  quizTitle?: string
  friendMessage?: string
  isActive?: boolean
  allowLeaderboard?: boolean
  allowAnswerReview?: boolean
}

export async function callUpdateQuizSettings(payload: UpdateQuizSettingsPayload): Promise<void> {
  const fn = httpsCallable(getFirebaseFunctions(), 'updateQuizSettings')
  await fn(payload)
}
