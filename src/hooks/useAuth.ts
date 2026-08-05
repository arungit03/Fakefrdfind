import { useEffect } from 'react'
import { subscribeToAuthChanges } from '../firebase/auth'
import { useUserStore } from '../store/userStore'
import { isFirebaseConfigured } from '../firebase/config'

export function useAuth() {
  const { firebaseUser, isLoading, setFirebaseUser, setLoading } = useUserStore()

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false)
      return
    }
    const unsubscribe = subscribeToAuthChanges((user) => {
      setFirebaseUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [setFirebaseUser, setLoading])

  return { user: firebaseUser, isLoading, isAnonymous: firebaseUser?.isAnonymous ?? true }
}
