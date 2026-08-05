import { useCallback, useEffect, useState } from 'react'
import { LOCAL_STORAGE_KEYS } from '../lib/constants'

export type ColorScheme = 'light' | 'dark'

function getSystemPreference(): ColorScheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyScheme(scheme: ColorScheme) {
  document.documentElement.classList.toggle('dark', scheme === 'dark')
}

export function useTheme() {
  const [scheme, setScheme] = useState<ColorScheme>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.theme) as ColorScheme | null
    return saved ?? getSystemPreference()
  })

  useEffect(() => {
    applyScheme(scheme)
  }, [scheme])

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.theme)
    if (saved) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setScheme(e.matches ? 'dark' : 'light')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const setColorScheme = useCallback((next: ColorScheme) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.theme, next)
    setScheme(next)
  }, [])

  const toggle = useCallback(() => {
    setColorScheme(scheme === 'dark' ? 'light' : 'dark')
  }, [scheme, setColorScheme])

  return { scheme, setColorScheme, toggle }
}
