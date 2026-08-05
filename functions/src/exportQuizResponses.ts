import { onCall } from 'firebase-functions/v2/https'
import { verifyCreatorToken } from './helpers/auth'
import { assertString } from './validators/schemas'

interface ExportRequest {
  quizId: string
  creatorToken: string
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export const exportQuizResponses = onCall<ExportRequest>({ region: 'us-central1' }, async (request) => {
  const quizId = assertString(request.data.quizId, 'Quiz ID', 64)
  const creatorToken = assertString(request.data.creatorToken, 'Creator token', 128)

  const { privateRef } = await verifyCreatorToken(quizId, creatorToken)
  const responsesSnap = await privateRef.collection('responses').orderBy('createdAt', 'desc').get()

  const header = ['Player Name', 'Score', 'Total Questions', 'Percentage', 'Duration (seconds)', 'Device Type', 'Submitted At']
  const rows = responsesSnap.docs.map((doc) => {
    const d = doc.data()
    const createdAt = d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : String(d.createdAt ?? '')
    return [
      csvEscape(String(d.playerName ?? '')),
      String(d.score ?? 0),
      String(d.totalQuestions ?? 0),
      `${d.percentage ?? 0}%`,
      String(d.durationSeconds ?? 0),
      String(d.deviceType ?? ''),
      createdAt,
    ].join(',')
  })

  const csv = [header.join(','), ...rows].join('\n')

  return { csv }
})
