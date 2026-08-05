import {
  signInAnonymously,
  onAuthStateChanged,
  GoogleAuthProvider,
  linkWithPopup,
  linkWithCredential,
  EmailAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth'
import { getFirebaseAuth } from './config'

export function subscribeToAuthChanges(callback: (user: User | null) => void) {
  return onAuthStateChanged(getFirebaseAuth(), callback)
}

export async function ensureAnonymousSession(): Promise<User> {
  const auth = getFirebaseAuth()
  if (auth.currentUser) return auth.currentUser
  const credential = await signInAnonymously(auth)
  return credential.user
}

export async function upgradeWithGoogle(): Promise<User> {
  const auth = getFirebaseAuth()
  const provider = new GoogleAuthProvider()
  if (auth.currentUser?.isAnonymous) {
    const result = await linkWithPopup(auth.currentUser, provider)
    return result.user
  }
  const result = await signInWithPopup(auth, provider)
  return result.user
}

export async function upgradeWithEmail(email: string, password: string): Promise<User> {
  const auth = getFirebaseAuth()
  const credential = EmailAuthProvider.credential(email, password)
  if (auth.currentUser?.isAnonymous) {
    const result = await linkWithCredential(auth.currentUser, credential)
    return result.user
  }
  throw new Error('No active session to upgrade.')
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(getFirebaseAuth())
}
