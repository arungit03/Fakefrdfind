import type { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      {children}
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          className: 'font-sans',
        }}
      />
    </BrowserRouter>
  )
}
