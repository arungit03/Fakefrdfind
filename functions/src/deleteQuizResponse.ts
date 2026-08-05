import * as admin from 'firebase-admin'
import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { verifyCreatorToken } from './helpers/auth'
import { assertString } from './validators/schemas'

interface DeleteResponseRequest {
  quizId: string
  responseId: string
  creatorToken: string
}

export const deleteQuizResponse = onCall<DeleteResponseRequest>({ region: 'us-central1' }, async (request) => {
  const quizId = assertString(request.data.quizId, 'Quiz ID', 64)
  const responseId = assertString(request.data.responseId, 'Response ID', 64)
  const creatorToken = assertString(request.data.creatorToken, 'Creator token', 128)

  const { privateRef } = await verifyCreatorToken(quizId, creatorToken)
  const db = admin.firestore()
  const responseRef = privateRef.collection('responses').doc(responseId)

  const responseSnap = await responseRef.get()
  if (!responseSnap.exists) {
    throw new HttpsError('not-found', 'Response not found.')
  }

  await responseRef.delete()

  // Recalculate aggregate stats from the remaining responses.
  const remaining = await privateRef.collection('responses').get()
  const percentages = remaining.docs.map((d) => d.data().percentage as number)
  const totalResponses = percentages.length
  const averageScore = totalResponses ? Math.round(percentages.reduce((a, b) => a + b, 0) / totalResponses) : 0
  const highestScore = totalResponses ? Math.max(...percentages) : 0
  const lowestScore = totalResponses ? Math.min(...percentages) : 0

  await privateRef.update({
    totalResponses,
    averageScore,
    highestScore,
    lowestScore,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  })

  await db.collection('quizStats').doc(quizId).set(
    {
      totalResponses,
      averageScore,
      highestScore,
    },
    { merge: true },
  )

  return { success: true }
})
