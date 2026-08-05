/**
 * Client-side helpers only. The authoritative security boundary is the
 * Cloud Functions layer + Firestore rules — nothing here should be trusted
 * as the source of truth for scoring or access control.
 */

/** Strips tags/entities so free-text fields can't carry markup into Firestore or the DOM. */
export function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .trim()
}

export function generateId(prefix = ''): string {
  const random = crypto.getRandomValues(new Uint8Array(12))
  const hex = Array.from(random, (b) => b.toString(16).padStart(2, '0')).join('')
  return prefix ? `${prefix}_${hex}` : hex
}

/** Browser-local identifier used for casual duplicate-submission prevention (not a security boundary). */
export function getOrCreateBrowserSubmissionId(quizId: string): string {
  const key = `vibecheck.submission.${quizId}`
  const existing = localStorage.getItem(key)
  if (existing) return existing
  const id = generateId('sub')
  localStorage.setItem(key, id)
  return id
}

export async function sha256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function generateCreatorToken(): string {
  return generateId('tok')
}
