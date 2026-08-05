import * as admin from 'firebase-admin'
import { onCall } from 'firebase-functions/v2/https'
import { verifyCreatorToken } from './helpers/auth'
import { assertString } from './validators/schemas'

interface DeleteQuizRequest {
  quizId: string
  creatorToken: string
}

async function deleteCollection(ref: FirebaseFirestore.CollectionReference, batchSize = 200) {
  const snapshot = await ref.limit(batchSize).get()
  if (snapshot.empty) return
  const batch = ref.firestore.batch()
  snapshot.docs.forEach((doc) => batch.delete(doc.ref))
  await batch.commit()
  if (snapshot.size === batchSize) {
    await deleteCollection(ref, batchSize)
  }
}

export const deleteQuiz = onCall<DeleteQuizRequest>({ region: 'us-central1' }, async (request) => {
  const quizId = assertString(request.data.quizId, 'Quiz ID', 64)
  const creatorToken = assertString(request.data.creatorToken, 'Creator token', 128)

  const { privateRef, privateData } = await verifyCreatorToken(quizId, creatorToken)
  const db = admin.firestore()

  await deleteCollection(privateRef.collection('responses'))

  const batch = db.batch()
  batch.delete(privateRef)
  batch.delete(db.collection('publicQuizzes').doc(quizId))
  batch.delete(db.collection('quizStats').doc(quizId))

  if (privateData.ownerUid) {
    batch.delete(db.collection('users').doc(privateData.ownerUid).collection('quizzes').doc(quizId))
  }

  await batch.commit()

  return { success: true }
})
