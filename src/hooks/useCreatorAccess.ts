import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { LOCAL_STORAGE_KEYS } from '../lib/constants'

/**
 * Resolves the creator token for a dashboard route. Tokens arrive either via
 * ?token= (freshly published/shared) or are cached locally after first visit
 * so the creator doesn't have to keep the URL param around.
 */
export function useCreatorAccess(quizId: string | undefined) {
  const [searchParams] = useSearchParams()
  const [token, setToken] = useState<string | null>(null)
  const [isResolved, setIsResolved] = useState(false)

  useEffect(() => {
    if (!quizId) {
      setIsResolved(true)
      return
    }
    const key = `${LOCAL_STORAGE_KEYS.friendProgressPrefix}dashboard.${quizId}`
    const fromUrl = searchParams.get('token')
    if (fromUrl) {
      localStorage.setItem(key, fromUrl)
      setToken(fromUrl)
    } else {
      setToken(localStorage.getItem(key))
    }
    setIsResolved(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId])

  return { token, isResolved, hasAccess: Boolean(token) }
}
