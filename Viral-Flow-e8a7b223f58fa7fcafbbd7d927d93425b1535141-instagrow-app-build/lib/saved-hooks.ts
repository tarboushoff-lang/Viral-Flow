// ─────────────────────────────────────────────────────────────────────────────
// ViralFlow — Saved Hooks Store (localStorage)
// ─────────────────────────────────────────────────────────────────────────────

import type { Hook } from './instagrow-ai'

export interface SavedHook {
  id: string
  hook: Hook
  niche: string
  goal: string
  tone: string
  savedAt: string
  userId: string
}

const KEY = 'vf_saved_hooks'

function load(): SavedHook[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') } catch { return [] }
}

function persist(items: SavedHook[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(items))
}

export const savedHooksStore = {
  getAll(userId: string): SavedHook[] {
    return load().filter(s => s.userId === userId)
  },

  save(hook: Hook, meta: { niche: string; goal: string; tone: string; userId: string }): SavedHook {
    const items = load()
    // Dedupe by text + userId
    if (items.find(s => s.hook.text === hook.text && s.userId === meta.userId)) {
      return items.find(s => s.hook.text === hook.text && s.userId === meta.userId)!
    }
    const entry: SavedHook = {
      id:      `sh-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      hook,
      ...meta,
      savedAt: new Date().toISOString(),
    }
    items.push(entry)
    persist(items)
    return entry
  },

  remove(id: string) {
    persist(load().filter(s => s.id !== id))
  },

  isSaved(hookText: string, userId: string): boolean {
    return load().some(s => s.hook.text === hookText && s.userId === userId)
  },

  getSavedTexts(userId: string): Set<string> {
    return new Set(load().filter(s => s.userId === userId).map(s => s.hook.text))
  },

  clear(userId: string) {
    persist(load().filter(s => s.userId !== userId))
  },
}
