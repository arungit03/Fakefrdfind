import * as admin from 'firebase-admin'
import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { verifyCreatorToken } from './helpers/auth'
import { generateId, hashToken } from './helpers/crypto'
import { assertString } from './validators/schemas'

interface RegenerateLinkRequest {
  quizId: string
  creatorToken: string
}

export const regenerateQuizLink = onCall<RegenerateLinkRequest>({ region: 'us-central1' }, async (request) => {
  const quizId = assertString(request.data.quizId, 'Quiz ID', 64)
  const creatorToken = assertString(request.data.creatorToken, 'Creator token', 128)

  const { privateRef, privateData } = await verifyCreatorToken(quizId, creatorToken)
  const db = admin.firestore()

  const publicRef = db.collection('publicQuizzes').doc(quizId)
  const publicSnap = await publicRef.get()
  if (!publicSnap.exists) {
    throw new HttpsError('not-found', 'Quiz not found.')
  }
  const publicData = publicSnap.data()!

  const newQuizId = generateId('quiz')
  const newToken = generateId('tok')
  const newTokenHash = hashToken(newToken)
  const now = admin.firestore.FieldValue.serverTimestamp()

  const batch = db.batch()

  // Clone public + private data under the new quiz ID.
  batch.set(db.collection('publicQuizzes').doc(newQuizId), { ...publicData, createdAt: now, updatedAt: now })
  batch.set(db.collection('privateQuizzes').doc(newQuizId), {
    ...privateData,
    creatorTokenHash: newTokenHash,
    createdAt: now,
    updatedAt: now,
  })
  batch.set(db.collection('quizStats').doc(newQuizId), {
    totalViews: 0,
    totalStarts: 0,
    totalCompletions: 0,
    totalResponses: 0,
    averageScore: 0,
    highestScore: 0,
    completionRate: 0,
    lastResponseAt: null,
  })

  if (privateData.ownerUid) {
    batch.set(db.collection('users').doc(privateData.ownerUid).collection('quizzes').doc(newQuizId), {
      quizId: newQuizId,
      creatorName: publicData.creatorName,
      title: publicData.quizTitle,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    })
    batch.delete(db.collection('users').doc(privateData.ownerUid).collection('quizzes').doc(quizId))
  }

  // Disable the old public link rather than deleting it outright, so any
  // in-flight friend sessions get a clear "quiz disabled" state instead of a
  // broken link.
  batch.update(publicRef, { isActive: false, updatedAt: now })
  batch.delete(privateRef)

  await batch.commit()

  return { newQuizId, newToken }
})
