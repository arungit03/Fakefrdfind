import * as admin from 'firebase-admin'
import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { generateId } from './helpers/crypto'
import { enforceRateLimit } from './helpers/rateLimit'
import { assertString, assertOptionalString } from './validators/schemas'

const VALID_REASONS = ['Bullying', 'Harassment', 'Inappropriate content', 'Personal information', 'Spam', 'Other']

interface ReportQuizRequest {
  quizId: string
  reason: string
  details?: string
}

export const reportQuiz = onCall<ReportQuizRequest>({ region: 'us-central1' }, async (request) => {
  const quizId = assertString(request.data.quizId, 'Quiz ID', 64)
  const reason = request.data.reason
  const details = assertOptionalString(request.data.details, 'Details', 500)

  if (!VALID_REASONS.includes(reason)) {
    throw new HttpsError('invalid-argument', 'Invalid report reason.')
  }

  const identifier = request.auth?.uid ?? request.rawRequest?.ip ?? 'anonymous'
  await enforceRateLimit(identifier, 'reportQuiz')

  const db = admin.firestore()
  const reportId = generateId('report')

  await db.collection('quizReports').doc(reportId).set({
    quizId,
    reason,
    details,
    reportedAt: admin.firestore.FieldValue.serverTimestamp(),
    reviewedAt: null,
  })

  await db
    .collection('privateQuizzes')
    .doc(quizId)
    .set({ moderationStatus: 'reported' }, { merge: true })
    .catch(() => {
      // Quiz may not exist — the report is still recorded above.
    })

  return { success: true }
})
