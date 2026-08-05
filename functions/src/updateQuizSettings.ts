import * as admin from 'firebase-admin'
import { onCall } from 'firebase-functions/v2/https'
import { verifyCreatorToken } from './helpers/auth'
import { assertString, assertOptionalString, MAX_MESSAGE_LENGTH, MAX_TITLE_LENGTH } from './validators/schemas'

interface UpdateQuizSettingsRequest {
  quizId: string
  creatorToken: string
  quizTitle?: string
  friendMessage?: string
  isActive?: boolean
  allowLeaderboard?: boolean
  allowAnswerReview?: boolean
}

/** Owner-only quiz settings updates. Firestore rules deny direct client writes to publicQuizzes. */
export const updateQuizSettings = onCall<UpdateQuizSettingsRequest>({ region: 'us-central1' }, async (request) => {
  const quizId = assertString(request.data.quizId, 'Quiz ID', 64)
  const creatorToken = assertString(request.data.creatorToken, 'Creator token', 128)

  await verifyCreatorToken(quizId, creatorToken)

  const update: Record<string, unknown> = { updatedAt: admin.firestore.FieldValue.serverTimestamp() }

  if (request.data.quizTitle !== undefined) {
    update.quizTitle = assertString(request.data.quizTitle, 'Quiz title', MAX_TITLE_LENGTH)
  }
  if (request.data.friendMessage !== undefined) {
    update.friendMessage = assertOptionalString(request.data.friendMessage, 'Friend message', MAX_MESSAGE_LENGTH)
  }
  if (typeof request.data.isActive === 'boolean') {
    update.isActive = request.data.isActive
  }
  if (typeof request.data.allowLeaderboard === 'boolean') {
    update.allowLeaderboard = request.data.allowLeaderboard
  }
  if (typeof request.data.allowAnswerReview === 'boolean') {
    update.allowAnswerReview = request.data.allowAnswerReview
  }

  await admin.firestore().collection('publicQuizzes').doc(quizId).update(update)

  return { success: true }
})
