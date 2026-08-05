import * as admin from 'firebase-admin'
import { HttpsError } from 'firebase-functions/v2/https'

const WINDOW_MS = 60_000
const MAX_REQUESTS_PER_WINDOW = 8

/**
 * Lightweight per-identifier rate limit backed by Firestore. Not a substitute
 * for a real rate-limiting service (e.g. Cloud Armor) in a high-traffic
 * production deployment, but enough to blunt casual abuse of callable
 * functions like quiz submission.
 */
export async function enforceRateLimit(identifier: string, bucket: string): Promise<void> {
  const db = admin.firestore()
  const ref = db.collection('rateLimits').doc(`${bucket}_${identifier}`)

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref)
    const now = Date.now()

    if (!snap.exists) {
      tx.set(ref, { count: 1, windowStart: now })
      return
    }

    const data = snap.data() as { count: number; windowStart: number }
    if (now - data.windowStart > WINDOW_MS) {
      tx.set(ref, { count: 1, windowStart: now })
      return
    }

    if (data.count >= MAX_REQUESTS_PER_WINDOW) {
      throw new HttpsError('resource-exhausted', 'Too many requests. Please slow down and try again shortly.')
    }

    tx.update(ref, { count: data.count + 1 })
  })
}
