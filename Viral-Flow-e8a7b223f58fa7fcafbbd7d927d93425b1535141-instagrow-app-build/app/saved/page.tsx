'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Bookmark, Trash2, Copy, Check, ChevronLeft, Filter, Search, Zap } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { savedHooksStore, type SavedHook } from '@/lib/saved-hooks'
import type { HookFormula } from '@/lib/instagrow-ai'

const FORMULA_COLORS: Record<HookFormula, string> = {
  'curiosity-gap': '#38bdf8',
  'pain-point':    '#fb7185',
  'contrarian':    '#fb923c',
  'authority':     '#fbbf24',
  'relatable':     '#c084fc',
  'cta':           '#34d399',
}

const FORMULA_LABELS: Record<HookFormula, string> = {
  'curiosity-gap': 'Curiosity',
  'pain-point':    'Pain Point',
  'contrarian':    'Contrarian',
  'authority':     'Authority',
  'relatable':     'Relatable',
  'cta':           'CTA',
}

function scoreColor(s: number) {
  if (s >= 80) return '#34d399'
  if (s >= 60) return '#fbbf24'
  return '#fb7185'
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
      style={{ background: copied ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.05)', color: copied ? '#34d399' : 'rgba(255,255,255,0.4)', border: `1px solid ${copied ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.08)'}` }}
      aria-label="Copy"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  )
}

export default function SavedHooksPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [hooks, setHooks]       = useState<SavedHook[]>([])
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState<string>('all')
  const [copyAll, setCopyAll]   = useState(false)

  const load = useCallback(() => {
    if (!user) return
    setHooks(savedHooksStore.getAll(user.id))
  }, [user])

  useEffect(() => {
    if (!authLoading && !user) { router.push('/auth'); return }
    load()
  }, [user, authLoading, router, load])

  const remove = (id: string) => {
    savedHooksStore.remove(id)
    load()
  }

  const clearAll = () => {
    if (!user) return
    savedHooksStore.clear(user.id)
    load()
  }

  const handleCopyAll = () => {
    const visible = filtered.map(s => s.hook.text).join('\n\n')
    navigator.clipboard.writeText(visible)
    setCopyAll(true)
    setTimeout(() => setCopyAll(false), 2200)
  }

  // Filter + search
  const filtered = hooks.filter(s => {
    const matchFilter = filter === 'all' || s.hook.formula === filter
    const matchSearch = !search || s.hook.text.toLowerCase().includes(search.toLowerCase()) || s.niche.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  // Unique niches for filter pills
  const niches = Array.from(new Set(hooks.map(s => s.niche))).slice(0, 6)
  const formulas = Array.from(new Set(hooks.map(s => s.hook.formula)))

  if (authLoading) return null

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'oklch(0.07 0.01 280)', color: 'white' }}>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b"
              style={{ backgroundColor: 'rgba(7,4,20,0.9)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => router.push('/')}
                  className="flex items-center gap-1.5 text-sm font-medium transition-colors"
                  style={{ color: 'rgba(255,255,255,0.45)' }}>
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <div className="w-px h-4 mx-1" style={{ background: 'rgba(255,255,255,0.1)' }} />
          <Bookmark className="w-4 h-4" style={{ color: '#e91e8c' }} />
          <h1 className="text-sm font-bold text-white">Saved Hooks</h1>
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ background: 'rgba(233,30,140,0.12)', color: '#f9a8d4', border: '1px solid rgba(233,30,140,0.2)' }}>
            {hooks.length}
          </span>
          <div className="ml-auto flex items-center gap-2">
            {hooks.length > 0 && (
              <>
                <button onClick={handleCopyAll}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                        style={{ background: copyAll ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.06)', color: copyAll ? '#34d399' : 'rgba(255,255,255,0.5)', border: `1px solid ${copyAll ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.08)'}` }}>
                  {copyAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copyAll ? 'Copied!' : 'Copy all'}
                </button>
                <button onClick={clearAll}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                        style={{ background: 'rgba(251,113,133,0.08)', color: 'rgba(251,113,133,0.6)', border: '1px solid rgba(251,113,133,0.15)' }}>
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear all
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {hooks.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                 style={{ background: 'rgba(233,30,140,0.08)', border: '1px solid rgba(233,30,140,0.15)' }}>
              <Bookmark className="w-8 h-8" style={{ color: 'rgba(233,30,140,0.5)' }} />
            </div>
            <p className="text-base font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>No saved hooks yet</p>
            <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Generate hooks and click the bookmark icon to save them here.
            </p>
            <button onClick={() => router.push('/')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                    style={{ background: 'linear-gradient(135deg, #e91e8c, #7c3aed)', color: 'white' }}>
              <Zap className="w-4 h-4" />
              Generate Hooks
            </button>
          </div>
        ) : (
          <>
            {/* Search + filters */}
            <div className="flex flex-col gap-3 mb-5">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search hooks or niches..."
                  className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'white' }}
                />
              </div>

              {/* Formula filter pills */}
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <button
                  onClick={() => setFilter('all')}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
                  style={filter === 'all'
                    ? { background: 'rgba(233,30,140,0.2)', color: '#f9a8d4', border: '1px solid rgba(233,30,140,0.3)' }
                    : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  All ({hooks.length})
                </button>
                {formulas.map(f => {
                  const c = FORMULA_COLORS[f]
                  const count = hooks.filter(s => s.hook.formula === f).length
                  return (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
                      style={filter === f
                        ? { background: `${c}22`, color: c, border: `1px solid ${c}55` }
                        : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      {FORMULA_LABELS[f]} ({count})
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Results count */}
            {filtered.length !== hooks.length && (
              <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Showing {filtered.length} of {hooks.length} hooks
              </p>
            )}

            {/* Grouped by niche */}
            {niches.length > 1 ? (
              niches.map(niche => {
                const group = filtered.filter(s => s.niche === niche)
                if (!group.length) return null
                return (
                  <div key={niche} className="mb-6">
                    <p className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5"
                       style={{ color: 'rgba(255,255,255,0.35)' }}>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#e91e8c' }} />
                      {niche}
                    </p>
                    <div className="space-y-2">
                      {group.map(s => <HookCard key={s.id} saved={s} onRemove={() => remove(s.id)} />)}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="space-y-2">
                {filtered.map(s => <HookCard key={s.id} saved={s} onRemove={() => remove(s.id)} />)}
              </div>
            )}

            {filtered.length === 0 && search && (
              <p className="text-center py-12 text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
                No hooks match "{search}"
              </p>
            )}
          </>
        )}
      </main>
    </div>
  )
}

function HookCard({ saved, onRemove }: { saved: SavedHook; onRemove: () => void }) {
  const color = FORMULA_COLORS[saved.hook.formula]
  const sc    = scoreColor(saved.hook.score ?? 75)

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl group"
         style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderLeft: `3px solid ${color}` }}>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-snug mb-2" style={{ color: 'rgba(255,255,255,0.9)' }}>
          {saved.hook.text}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: `${color}15`, color, border: `1px solid ${color}35` }}>
            {FORMULA_LABELS[saved.hook.formula]}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ color: sc, background: `${sc}15`, border: `1px solid ${sc}35` }}>
            {saved.hook.score ?? 75}/100
          </span>
          <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
            {saved.niche} · {saved.goal}
          </span>
          <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
            {new Date(saved.savedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
        <CopyBtn text={saved.hook.text} />
        <button
          onClick={onRemove}
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
          style={{ background: 'rgba(251,113,133,0.08)', color: 'rgba(251,113,133,0.5)' }}
          aria-label="Remove"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
