import { logEvent } from 'firebase/analytics'
import { initAnalytics } from './config'

export async function trackEvent(eventName: string, params?: Record<string, unknown>): Promise<void> {
  const analytics = await initAnalytics()
  if (!analytics) return
  logEvent(analytics, eventName, params)
}

export const AnalyticsEvents = {
  quizCreated: 'quiz_created',
  quizPublished: 'quiz_published',
  quizShared: 'quiz_shared',
  quizStarted: 'quiz_started',
  quizCompleted: 'quiz_completed',
  dashboardViewed: 'dashboard_viewed',
} as const
