import * as admin from 'firebase-admin'
import { HttpsError } from 'firebase-functions/v2/https'
import { hashToken } from './crypto'

/**
 * Confirms the caller holds the creator's bearer token for a quiz (the token
 * generated at publish time and shown only once, on the share page). This is
 * the access-control mechanism for dashboard actions instead of Firebase Auth
 * identity, since quizzes are created anonymously by default and the "owner"
 * is really "whoever has the private link."
 */
export async function verifyCreatorToken(
  quizId: string,
  creatorToken: string,
): Promise<{ privateRef: FirebaseFirestore.DocumentReference; privateData: FirebaseFirestore.DocumentData }> {
  if (!creatorToken || typeof creatorToken !== 'string') {
    throw new HttpsError('unauthenticated', 'Missing dashboard access token.')
  }

  const db = admin.firestore()
  const privateRef = db.collection('privateQuizzes').doc(quizId)
  const snap = await privateRef.get()

  if (!snap.exists) {
    throw new HttpsError('not-found', 'Quiz not found.')
  }

  const privateData = snap.data()!
  const providedHash = hashToken(creatorToken)

  if (providedHash !== privateData.creatorTokenHash) {
    throw new HttpsError('permission-denied', 'Invalid dashboard access token.')
  }

  return { privateRef, privateData }
}
