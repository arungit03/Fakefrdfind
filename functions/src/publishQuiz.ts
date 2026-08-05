import * as admin from 'firebase-admin'
import { onCall } from 'firebase-functions/v2/https'
import { generateId, hashToken } from './helpers/crypto'
import { enforceRateLimit } from './helpers/rateLimit'
import {
  assertString,
  assertOptionalString,
  assertQuestions,
  MAX_NAME_LENGTH,
  MAX_TITLE_LENGTH,
  MAX_MESSAGE_LENGTH,
} from './validators/schemas'

const THEMES = ['purple-dream', 'ocean-glow', 'sunset-pop', 'mint-fresh', 'midnight-neon', 'candy-pink']
const LANGUAGES = ['en', 'ta']

interface PublishQuizRequest {
  profile: {
    creatorName: string
    nickname?: string
    avatar: string
    profileImageUrl?: string
    theme: string
    language: string
    friendMessage?: string
  }
  quizTitle: string
  questions: unknown[]
  settings: {
    attemptPolicy?: 'one' | 'unlimited' | 'limited'
    maxAttemptsPerBrowser?: number
    allowLeaderboard?: boolean
    allowAnswerReview?: boolean
    expiresAt?: string | null
    maxResponses?: number | null
  }
}

export const publishQuiz = onCall<PublishQuizRequest>({ region: 'us-central1' }, async (request) => {
  // No sign-in required to publish — "ownership" of a quiz is modeled entirely
  // by possession of the creator token returned below, not by Firebase Auth
  // identity. See helpers/auth.ts (verifyCreatorToken) for how dashboard
  // actions re-check this token server-side.
  const identifier = request.rawRequest?.ip ?? 'anonymous'
  await enforceRateLimit(identifier, 'publishQuiz')

  const data = request.data
  const creatorName = assertString(data.profile?.creatorName, 'Creator name', MAX_NAME_LENGTH)
  const nickname = assertOptionalString(data.profile?.nickname, 'Nickname', 15)
  const avatar = assertString(data.profile?.avatar, 'Avatar', 8)
  const friendMessage = assertOptionalString(data.profile?.friendMessage, 'Friend message', MAX_MESSAGE_LENGTH)
  const quizTitle = assertString(data.quizTitle || `${creatorName}'s Friendship Quiz`, 'Quiz title', MAX_TITLE_LENGTH)

  const theme = THEMES.includes(data.profile?.theme) ? data.profile.theme : 'purple-dream'
  const language = LANGUAGES.includes(data.profile?.language) ? data.profile.language : 'en'

  const questions = assertQuestions(data.questions)

  const settings = data.settings ?? {}
  const allowLeaderboard = settings.allowLeaderboard !== false
  const allowAnswerReview = settings.allowAnswerReview !== false
  const attemptPolicy = ['one', 'unlimited', 'limited'].includes(settings.attemptPolicy ?? '')
    ? settings.attemptPolicy
    : 'unlimited'
  const expiresAt = typeof settings.expiresAt === 'string' ? settings.expiresAt : null
  const maxResponses = typeof settings.maxResponses === 'number' ? settings.maxResponses : null

  const quizId = generateId('quiz')
  const creatorToken = generateId('tok')
  const creatorTokenHash = hashToken(creatorToken)
  const now = admin.firestore.FieldValue.serverTimestamp()

  const publicQuestions = questions.map((q, index) => ({
    questionId: q.id,
    question: q.question,
    options: q.options,
    category: q.category,
    difficulty: q.difficulty,
    order: index,
  }))

  const correctAnswers: Record<string, string> = {}
  questions.forEach((q) => {
    correctAnswers[q.id] = q.correctOptionId
  })

  const db = admin.firestore()
  const batch = db.batch()

  const publicRef = db.collection('publicQuizzes').doc(quizId)
  batch.set(publicRef, {
    creatorName,
    creatorNickname: nickname,
    creatorAvatar: avatar,
    creatorImageUrl: data.profile?.profileImageUrl ?? null,
    quizTitle,
    friendMessage,
    theme,
    language,
    questionCount: questions.length,
    publicQuestions,
    allowLeaderboard,
    allowAnswerReview,
    isActive: true,
    expiresAt,
    createdAt: now,
    updatedAt: now,
  })

  const privateRef = db.collection('privateQuizzes').doc(quizId)
  batch.set(privateRef, {
    ownerUid: null,
    creatorTokenHash,
    correctAnswers,
    totalResponses: 0,
    averageScore: 0,
    highestScore: 0,
    lowestScore: 0,
    settings: { attemptPolicy, maxAttemptsPerBrowser: settings.maxAttemptsPerBrowser ?? null, allowLeaderboard, allowAnswerReview, expiresAt, maxResponses },
    moderationStatus: 'ok',
    createdAt: now,
    updatedAt: now,
  })

  const statsRef = db.collection('quizStats').doc(quizId)
  batch.set(statsRef, {
    totalViews: 0,
    totalStarts: 0,
    totalCompletions: 0,
    totalResponses: 0,
    averageScore: 0,
    highestScore: 0,
    completionRate: 0,
    lastResponseAt: null,
  })

  await batch.commit()

  return { quizId, creatorToken }
})
