// ─────────────────────────────────────────────────────────────────────────────
// ViralFlow — Generation History Store (localStorage)
// ─────────────────────────────────────────────────────────────────────────────

import type { HookResult } from './instagrow-ai'

export interface HistoryEntry {
  id: string
  userId: string
  niche: string
  goal: string
  tone: string
  result: HookResult
  createdAt: string
  hookCount: number
}

const KEY      = 'vf_history'
const MAX_ITEMS = 50 // cap per user to avoid localStorage bloat

function load(): HistoryEntry[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') } catch { return [] }
}

function persist(items: HistoryEntry[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(items))
}

export const historyStore = {
  getAll(userId: string): HistoryEntry[] {
    return load()
      .filter(h => h.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  add(entry: Omit<HistoryEntry, 'id' | 'createdAt' | 'hookCount'>): HistoryEntry {
    const all = load()
    const newEntry: HistoryEntry = {
      ...entry,
      id:         `hist-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt:  new Date().toISOString(),
      hookCount:  (
        entry.result.viralHooks.length +
        entry.result.emotionalHooks.length +
        entry.result.curiosityHooks.length +
        entry.result.ctaEndings.length
      ),
    }
    // Prepend and cap per user
    const userEntries = all.filter(h => h.userId === entry.userId)
    const others      = all.filter(h => h.userId !== entry.userId)
    const trimmed     = [newEntry, ...userEntries].slice(0, MAX_ITEMS)
    persist([...others, ...trimmed])
    return newEntry
  },

  remove(id: string) {
    persist(load().filter(h => h.id !== id))
  },

  clear(userId: string) {
    persist(load().filter(h => h.userId !== userId))
  },
}
