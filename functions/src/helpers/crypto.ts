import { createHash, randomBytes } from 'crypto'

export function generateId(prefix = ''): string {
  const hex = randomBytes(12).toString('hex')
  return prefix ? `${prefix}_${hex}` : hex
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}
