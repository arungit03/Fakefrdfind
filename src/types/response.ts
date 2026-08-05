import type { QuestionCategory } from './quiz'

export interface SelectedAnswer {
  questionId: string
  selectedOptionId: string
}

export interface CategoryScore {
  category: QuestionCategory
  correct: number
  total: number
}

export interface QuizResponse {
  responseId: string
  playerName: string
  playerAvatar: string
  selectedAnswers: SelectedAnswer[]
  score: number
  totalQuestions: number
  percentage: number
  correctCount: number
  incorrectCount: number
  categoryScores: CategoryScore[]
  durationSeconds: number
  browserSubmissionId: string
  deviceType: 'mobile' | 'tablet' | 'desktop'
  createdAt: string
}

export interface SubmitQuizPayload {
  quizId: string
  playerName: string
  playerAvatar: string
  answers: SelectedAnswer[]
  durationSeconds: number
  browserSubmissionId: string
}

export interface SubmitQuizResult {
  responseId: string
  score: number
  totalQuestions: number
  percentage: number
  correctCount: number
  incorrectCount: number
  categoryScores: CategoryScore[]
}
