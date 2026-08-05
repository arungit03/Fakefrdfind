export type AccountType = 'anonymous' | 'permanent'

export interface AppUser {
  uid: string
  displayName: string | null
  email: string | null
  photoURL: string | null
  accountType: AccountType
  createdAt: string
  lastLoginAt: string
}

export interface OwnedQuizSummary {
  quizId: string
  creatorName: string
  title: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}
