import * as admin from 'firebase-admin'
import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { verifyCreatorToken } from './helpers/auth'
import { assertString } from './validators/schemas'

interface GetDashboardDataRequest {
  quizId: string
  creatorToken: string
}

/**
 * Returns everything the dashboard needs (public quiz, aggregate stats, and
 * full response list) in one call, after verifying the caller holds the
 * creator token. Firestore rules deny direct client reads of
 * privateQuizzes/{quizId}/responses entirely, so this callable is the only
 * way the dashboard can see response data.
 */
export const getDashboardData = onCall<GetDashboardDataRequest>({ region: 'us-central1' }, async (request) => {
  const quizId = assertString(request.data.quizId, 'Quiz ID', 64)
  const creatorToken = assertString(request.data.creatorToken, 'Creator token', 128)

  await verifyCreatorToken(quizId, creatorToken)

  const db = admin.firestore()
  const [publicSnap, statsSnap, responsesSnap] = await Promise.all([
    db.collection('publicQuizzes').doc(quizId).get(),
    db.collection('quizStats').doc(quizId).get(),
    db.collection('privateQuizzes').doc(quizId).collection('responses').orderBy('createdAt', 'desc').limit(500).get(),
  ])

  if (!publicSnap.exists) {
    throw new HttpsError('not-found', 'Quiz not found.')
  }

  const toIso = (value: unknown) =>
    value && typeof value === 'object' && 'toDate' in (value as Record<string, unknown>)
      ? (value as admin.firestore.Timestamp).toDate().toISOString()
      : value

  const quiz = { ...publicSnap.data(), createdAt: toIso(publicSnap.data()?.createdAt), updatedAt: toIso(publicSnap.data()?.updatedAt) }
  const stats = statsSnap.exists ? statsSnap.data() : null
  const responses = responsesSnap.docs.map((doc) => {
    const data = doc.data()
    return { responseId: doc.id, ...data, createdAt: toIso(data.createdAt) }
  })

  return { quiz, stats, responses }
})
