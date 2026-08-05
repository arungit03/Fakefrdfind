import * as admin from 'firebase-admin'
import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { generateId } from './helpers/crypto'
import { enforceRateLimit } from './helpers/rateLimit'
import { assertString, MAX_NAME_LENGTH } from './validators/schemas'

interface SelectedAnswerInput {
  questionId?: unknown
  selectedOptionId?: unknown
}

interface SubmitQuizRequest {
  quizId: string
  playerName: string
  playerAvatar: string
  answers: SelectedAnswerInput[]
  durationSeconds: number
  browserSubmissionId: string
}

function detectDeviceType(userAgent: string | undefined): 'mobile' | 'tablet' | 'desktop' {
  if (!userAgent) return 'desktop'
  if (/tablet|ipad/i.test(userAgent)) return 'tablet'
  if (/mobile|android|iphone/i.test(userAgent)) return 'mobile'
  return 'desktop'
}

export const submitQuizResponse = onCall<SubmitQuizRequest>({ region: 'us-central1' }, async (request) => {
  const data = request.data
  const quizId = assertString(data.quizId, 'Quiz ID', 64)
  const playerName = assertString(data.playerName, 'Your name', MAX_NAME_LENGTH)
  const playerAvatar = assertString(data.playerAvatar, 'Avatar', 8)
  const browserSubmissionId = assertString(data.browserSubmissionId, 'Submission ID', 128)

  if (!Array.isArray(data.answers) || data.answers.length === 0) {
    throw new HttpsError('invalid-argument', 'Answers are required.')
  }
  const durationSeconds = typeof data.durationSeconds === 'number' && data.durationSeconds >= 0 ? data.durationSeconds : 0

  await enforceRateLimit(browserSubmissionId, 'submitQuizResponse')

  const db = admin.firestore()
  const publicRef = db.collection('publicQuizzes').doc(quizId)
  const privateRef = db.collection('privateQuizzes').doc(quizId)

  const [publicSnap, privateSnap] = await Promise.all([publicRef.get(), privateRef.get()])

  if (!publicSnap.exists || !privateSnap.exists) {
    throw new HttpsError('not-found', 'This quiz does not exist.')
  }

  const publicData = publicSnap.data()!
  const privateData = privateSnap.data()!

  if (!publicData.isActive) {
    throw new HttpsError('failed-precondition', 'This quiz is currently disabled.')
  }
  if (publicData.expiresAt && new Date(publicData.expiresAt).getTime() < Date.now()) {
    throw new HttpsError('failed-precondition', 'This quiz has expired.')
  }

  const settings = privateData.settings ?? {}
  if (typeof settings.maxResponses === 'number' && privateData.totalResponses >= settings.maxResponses) {
    throw new HttpsError('resource-exhausted', 'This quiz has reached its maximum number of responses.')
  }

  // Casual duplicate-submission guard (not airtight — a determined user could
  // clear storage or use a new browser, but it stops accidental double-taps
  // and simple refresh-resubmits).
  if (settings.attemptPolicy === 'one') {
    const existing = await db
      .collection('privateQuizzes')
      .doc(quizId)
      .collection('responses')
      .where('browserSubmissionId', '==', browserSubmissionId)
      .limit(1)
      .get()
    if (!existing.empty) {
      throw new HttpsError('already-exists', 'You have already taken this quiz.')
    }
  }

  const correctAnswers: Record<string, string> = privateData.correctAnswers ?? {}
  const validQuestionIds = new Set(Object.keys(correctAnswers))
  const publicQuestions: Array<{ questionId: string; category: string; options: { id: string }[] }> =
    publicData.publicQuestions ?? []
  const optionIdsByQuestion = new Map(publicQuestions.map((q) => [q.questionId, new Set(q.options.map((o) => o.id))]))
  const categoryByQuestion = new Map(publicQuestions.map((q) => [q.questionId, q.category]))

  let correctCount = 0
  const categoryTally = new Map<string, { correct: number; total: number }>()
  const cleanedAnswers: { questionId: string; selectedOptionId: string }[] = []

  for (const raw of data.answers) {
    const questionId = typeof raw.questionId === 'string' ? raw.questionId : ''
    const selectedOptionId = typeof raw.selectedOptionId === 'string' ? raw.selectedOptionId : ''

    if (!validQuestionIds.has(questionId)) {
      throw new HttpsError('invalid-argument', 'Submission references a question that does not belong to this quiz.')
    }
    const validOptionIds = optionIdsByQuestion.get(questionId)
    if (!validOptionIds || !validOptionIds.has(selectedOptionId)) {
      throw new HttpsError('invalid-argument', 'Submission references an invalid answer option.')
    }

    cleanedAnswers.push({ questionId, selectedOptionId })

    const category = categoryByQuestion.get(questionId) ?? 'random'
    const tally = categoryTally.get(category) ?? { correct: 0, total: 0 }
    tally.total += 1
    if (correctAnswers[questionId] === selectedOptionId) {
      correctCount += 1
      tally.correct += 1
    }
    categoryTally.set(category, tally)
  }

  const totalQuestions = validQuestionIds.size
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0
  const incorrectCount = cleanedAnswers.length - correctCount

  const categoryScores = Array.from(categoryTally.entries()).map(([category, tally]) => ({
    category,
    correct: tally.correct,
    total: tally.total,
  }))

  const responseId = generateId('res')
  const now = admin.firestore.FieldValue.serverTimestamp()
  const userAgent = request.rawRequest?.headers['user-agent'] as string | undefined

  const responseRef = privateRef.collection('responses').doc(responseId)

  await db.runTransaction(async (tx) => {
    tx.set(responseRef, {
      playerName,
      playerAvatar,
      selectedAnswers: cleanedAnswers,
      score: correctCount,
      totalQuestions,
      percentage,
      correctCount,
      incorrectCount,
      categoryScores,
      durationSeconds,
      browserSubmissionId,
      deviceType: detectDeviceType(userAgent),
      createdAt: now,
    })

    const newTotal = (privateData.totalResponses ?? 0) + 1
    const newAverage = Math.round(((privateData.averageScore ?? 0) * (newTotal - 1) + percentage) / newTotal)
    const newHighest = Math.max(privateData.highestScore ?? 0, percentage)
    const newLowest = privateData.totalResponses > 0 ? Math.min(privateData.lowestScore ?? 100, percentage) : percentage

    tx.update(privateRef, {
      totalResponses: newTotal,
      averageScore: newAverage,
      highestScore: newHighest,
      lowestScore: newLowest,
      updatedAt: now,
    })

    const statsRef = db.collection('quizStats').doc(quizId)
    tx.set(
      statsRef,
      {
        totalResponses: admin.firestore.FieldValue.increment(1),
        totalCompletions: admin.firestore.FieldValue.increment(1),
        averageScore: newAverage,
        highestScore: newHighest,
        lastResponseAt: now,
      },
      { merge: true },
    )
  })

  return {
    responseId,
    score: correctCount,
    totalQuestions,
    percentage,
    correctCount,
    incorrectCount,
    categoryScores,
  }
})
