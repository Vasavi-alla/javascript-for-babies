import { useState } from 'react'

/**
 * Who this notebook belongs to — the learner types their own name into the
 * home-page greeting (persisted in localStorage); 'friend' until they do.
 */
const STORAGE_KEY = 'jfb-learner-name' // matches the 'jfb-progress' key convention
export const DEFAULT_NAME = 'friend'
const MAX_LENGTH = 30

function readStoredName(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_NAME
  } catch {
    return DEFAULT_NAME // storage unavailable (private mode, blocked) — greet generically
  }
}

/** "Mary Jane" → "mary-jane"; '' when nothing url-safe remains. */
export function nameSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * The learner's name + a setter. The setter normalizes (trim → cap at 30 →
 * fall back to DEFAULT_NAME when empty) and RETURNS the value it saved, so
 * callers can react to the real outcome without re-running the rules.
 */
export function useLearnerName(): [string, (name: string) => string] {
  const [name, setNameState] = useState(readStoredName)
  const setName = (next: string): string => {
    const value = next.trim().slice(0, MAX_LENGTH).trim() || DEFAULT_NAME
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      /* storage unavailable — keep the in-memory value for this session */
    }
    setNameState(value)
    return value
  }
  return [name, setName]
}
