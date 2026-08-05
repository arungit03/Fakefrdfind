import { initializeApp, type FirebaseApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaV3Provider, type AppCheck } from 'firebase/app-check'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getFunctions, type Functions } from 'firebase/functions'
import { getStorage, type FirebaseStorage } from 'firebase/storage'
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

let app: FirebaseApp | null = null
let authInstance: Auth | null = null
let dbInstance: Firestore | null = null
let functionsInstance: Functions | null = null
let storageInstance: FirebaseStorage | null = null
let appCheckInstance: AppCheck | null = null
let analyticsInstance: Analytics | null = null

export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Set VITE_FIREBASE_* env vars — see .env.example.')
  }
  if (!app) {
    app = initializeApp(firebaseConfig)
  }
  return app
}

export function getFirebaseAuth(): Auth {
  if (!authInstance) authInstance = getAuth(getFirebaseApp())
  return authInstance
}

export function getFirebaseDb(): Firestore {
  if (!dbInstance) dbInstance = getFirestore(getFirebaseApp())
  return dbInstance
}

export function getFirebaseFunctions(): Functions {
  if (!functionsInstance) {
    const region = import.meta.env.VITE_FUNCTIONS_REGION || 'us-central1'
    functionsInstance = getFunctions(getFirebaseApp(), region)
  }
  return functionsInstance
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!storageInstance) storageInstance = getStorage(getFirebaseApp())
  return storageInstance
}

export function initAppCheck(): AppCheck | null {
  const siteKey = import.meta.env.VITE_FIREBASE_APPCHECK_SITE_KEY
  if (!siteKey || appCheckInstance || !isFirebaseConfigured) return appCheckInstance
  appCheckInstance = initializeAppCheck(getFirebaseApp(), {
    provider: new ReCaptchaV3Provider(siteKey),
    isTokenAutoRefreshEnabled: true,
  })
  return appCheckInstance
}

export async function initAnalytics(): Promise<Analytics | null> {
  if (!isFirebaseConfigured) return null
  if (analyticsInstance) return analyticsInstance
  const supported = await isSupported().catch(() => false)
  if (!supported) return null
  analyticsInstance = getAnalytics(getFirebaseApp())
  return analyticsInstance
}
