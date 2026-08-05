import { AppProviders } from './app/providers'
import { AppRouter } from './app/router'
import { initAppCheck } from './firebase/config'
import { isFirebaseConfigured } from './firebase/config'
import { useTheme } from './hooks/useTheme'

if (isFirebaseConfigured) {
  initAppCheck()
}

function App() {
  useTheme()

  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  )
}

export default App
