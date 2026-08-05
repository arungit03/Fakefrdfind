import { format, formatDistanceToNow } from 'date-fns'
import { SECONDS_PER_QUESTION_ESTIMATE } from './constants'

export function formatDate(dateInput: string | number | Date): string {
  return format(new Date(dateInput), 'MMM d, yyyy')
}

export function formatDateTime(dateInput: string | number | Date): string {
  return format(new Date(dateInput), 'MMM d, yyyy · h:mm a')
}

export function formatRelativeTime(dateInput: string | number | Date): string {
  return formatDistanceToNow(new Date(dateInput), { addSuffix: true })
}

export function estimateCompletionMinutes(questionCount: number): string {
  const totalSeconds = questionCount * SECONDS_PER_QUESTION_ESTIMATE
  const minutes = Math.max(1, Math.round(totalSeconds / 60))
  return `${minutes} min`
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`
  const mins = Math.floor(seconds / 60)
  const secs = Math.round(seconds % 60)
  return `${mins}m ${secs}s`
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 1)}…`
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? `${singular}s`)
}
