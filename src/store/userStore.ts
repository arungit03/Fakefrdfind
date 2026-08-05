import { create } from 'zustand'
import type { User } from 'firebase/auth'

interface UserState {
  firebaseUser: User | null
  isLoading: boolean
  setFirebaseUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
}

export const useUserStore = create<UserState>((set) => ({
  firebaseUser: null,
  isLoading: true,
  setFirebaseUser: (user) => set({ firebaseUser: user }),
  setLoading: (loading) => set({ isLoading: loading }),
}))
