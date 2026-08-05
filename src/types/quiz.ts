export type QuestionCategory =
  | 'favorites'
  | 'personality'
  | 'food'
  | 'travel'
  | 'movies'
  | 'music'
  | 'gaming'
  | 'college'
  | 'childhood'
  | 'habits'
  | 'dreams'
  | 'funny'
  | 'friendship'
  | 'random'

export type QuestionDifficulty = 'easy' | 'medium' | 'hard'

export type ThemeId =
  | 'purple-dream'
  | 'ocean-glow'
  | 'sunset-pop'
  | 'mint-fresh'
  | 'midnight-neon'
  | 'candy-pink'

export type QuizLanguage = 'en' | 'ta'

export interface AnswerOption {
  id: string
  text: string
}

export interface BankQuestion {
  id: string
  question: string
  options: [string, string, string, string]
  category: QuestionCategory
  difficulty: QuestionDifficulty
}

/** A question as authored in the builder, before publish (still holds the correct answer). */
export interface DraftQuestion {
  id: string
  question: string
  options: AnswerOption[]
  correctOptionId: string
  category: QuestionCategory
  difficulty: QuestionDifficulty
  order: number
}

/** Public-facing question shape stored in publicQuizzes — never contains the answer. */
export interface PublicQuestion {
  questionId: string
  question: string
  options: AnswerOption[]
  category: QuestionCategory
  difficulty: QuestionDifficulty
  order: number
}

export interface CreatorProfileDraft {
  creatorName: string
  nickname: string
  avatar: string
  profileImageUrl?: string
  theme: ThemeId
  language: QuizLanguage
  friendMessage?: string
}

export interface QuizSettings {
  attemptPolicy: 'one' | 'unlimited' | 'limited'
  maxAttemptsPerBrowser?: number
  allowLeaderboard: boolean
  allowAnswerReview: boolean
  expiresAt?: string | null
  maxResponses?: number | null
}

export interface QuizDraft {
  profile: CreatorProfileDraft
  quizTitle: string
  questions: DraftQuestion[]
  settings: QuizSettings
  updatedAt: number
}

export interface PublicQuiz {
  quizId: string
  creatorName: string
  creatorNickname: string
  creatorAvatar: string
  creatorImageUrl?: string
  quizTitle: string
  friendMessage: string
  theme: ThemeId
  language: QuizLanguage
  questionCount: number
  publicQuestions: PublicQuestion[]
  allowLeaderboard: boolean
  allowAnswerReview: boolean
  isActive: boolean
  expiresAt: string | null
  createdAt: string
  updatedAt: string
}

export interface PrivateQuiz {
  ownerUid: string
  creatorTokenHash: string
  correctAnswers: Record<string, string>
  totalResponses: number
  averageScore: number
  highestScore: number
  lowestScore: number
  settings: QuizSettings
  createdAt: string
  updatedAt: string
  moderationStatus: 'ok' | 'reported' | 'disabled'
  disabledReason?: string
}

export interface QuizStats {
  totalViews: number
  totalStarts: number
  totalCompletions: number
  totalResponses: number
  averageScore: number
  highestScore: number
  completionRate: number
  lastResponseAt: string | null
}
