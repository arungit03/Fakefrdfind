import { useCallback, useState } from 'react'
import en from '../locales/en.json'
import ta from '../locales/ta.json'
import { LOCAL_STORAGE_KEYS } from '../lib/constants'

const dictionaries = { en, ta } as const
export type AppLanguage = keyof typeof dictionaries

type NestedRecord = { [key: string]: string | NestedRecord }

function resolveKey(dict: NestedRecord, key: string): string {
  const parts = key.split('.')
  let current: string | NestedRecord = dict
  for (const part of parts) {
    if (typeof current === 'string') return key
    current = current[part]
    if (current === undefined) return key
  }
  return typeof current === 'string' ? current : key
}

let currentLanguage: AppLanguage = (localStorage.getItem(LOCAL_STORAGE_KEYS.language) as AppLanguage) || 'en'
const listeners = new Set<() => void>()

function setLanguage(lang: AppLanguage) {
  currentLanguage = lang
  localStorage.setItem(LOCAL_STORAGE_KEYS.language, lang)
  listeners.forEach((listener) => listener())
}

export function useTranslation() {
  const [, forceRender] = useState(0)

  useState(() => {
    const listener = () => forceRender((n) => n + 1)
    listeners.add(listener)
    return () => listeners.delete(listener)
  })

  const t = useCallback((key: string) => resolveKey(dictionaries[currentLanguage] as unknown as NestedRecord, key), [])

  return { t, language: currentLanguage, setLanguage }
}
