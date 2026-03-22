'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, Trash2, Copy, Check, ChevronLeft, ChevronDown, ChevronUp, Zap, RotateCcw } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { historyStore, type HistoryEntry } from '@/lib/history'
import type { Hook, HookFormula } from '@/lib/instagrow-ai'

const FORMULA_COLORS: Record<HookFormula, string> = {
  'curiosity-gap': '#38bdf8',
  'pain-point':    '#fb7185',
  'contrarian':    '#fb923c',
  'authority':     '#fbbf24',
  'relatable':     '#c084fc',
  'cta':           '#34d399',
}

const GOAL_LABELS: Record<string, string> = {
  followers:  'Grow Followers',
  engagement: 'Boost Engagement',
  sales:      'Drive Sales',
  awareness:  'Brand Awareness',
}

const TONE_LABELS: Record<string, string> = {
  fun:         'Fun & Relatable',
  luxury:      'Luxury',
  educational: 'Educational',
  bold:        'Bold & Provocative',
  authentic:   'Authentic',
}

function scoreColor(s: number) {
  if (s >= 80) return '#34d399'
  if (s >= 60) return '#fbbf24'
  return '#fb7185'
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(diff / 86400000)
  if (m < 1)  return 'Just now'
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  if (d < 7)  return `${d}d ago`
  return new Date(dateStr).toLocaleDateString()
}

function CopyBtn({ text, small = true }: { text: string; small?: boolean }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="flex items-center justify-center rounded-lg transition-all flex-shrink-0"
      style={{
        width: small ? 28 : undefined,
        height: small ? 28 : undefined,
        padding: small ? undefined : '6px 12px',
        gap: 4,
        background: copied ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.05)',
        color: copied ? '#34d399' : 'rgba(255,255,255,0.4)',
        border: `1px solid ${copied ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.08)'}`,
        fontSize: small ? undefined : 12,
        fontWeight: 600,
      }}
      aria-label="Copy"
    >
      {copied ? <Check style={{ width: 13, height: 13 }} /> : <Copy style={{ width: 13, height: 13 }} />}
      {!small && (copied ? 'Copied' : 'Copy')}
    </button>
  )
}

function HookPill({ hook }: { hook: Hook }) {
  const c  = FORMULA_COLORS[hook.formula] ?? '#fff'
  const sc = scoreColor(hook.score ?? 75)
  return (
    <div className="flex items-center gap-2 p-2.5 rounded-lg group"
         style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)', borderLeft: `2px solid ${c}` }}>
      <p className="flex-1 text-xs leading-snug" style={{ color: 'rgba(255,255,255,0.8)' }}>{hook.text}</p>
      <span className="text-[10px] font-bold tabular-nums flex-shrink-0"
            style={{ color: sc }}>{hook.score ?? 75}</span>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyBtn text={hook.text} />
      </div>
    </div>
  )
}

function EntryCard({ entry, onRemove }: { entry: HistoryEntry; onRemove: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const router = useRouter()

  const allHooks: Hook[] = [
    ...entry.result.viralHooks,
    ...entry.result.emotionalHooks,
    ...entry.result.curiosityHooks,
    ...entry.result.ctaEndings,
  ]

  const topHook = entry.result.viralHooks[0]

  return (
    <div className="rounded-2xl overflow-hidden"
         style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>

      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        {/* Niche badge */}
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm uppercase"
             style={{ background: 'linear-gradient(135deg, rgba(233,30,140,0.2), rgba(124,58,237,0.15))', color: '#f9a8d4', border: '1px solid rgba(233,30,140,0.2)' }}>
          {entry.niche.slice(0, 2)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="text-sm font-bold text-white truncate">{entry.niche}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                  style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.45)' }}>
              {GOAL_LABELS[entry.goal] ?? entry.goal}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                  style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.45)' }}>
              {TONE_LABELS[entry.tone] ?? entry.tone}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <Clock style={{ width: 11, height: 11 }} />
            {timeAgo(entry.createdAt)}
            <span className="w-px h-2.5" style={{ background: 'rgba(255,255,255,0.12)' }} />
            <Zap style={{ width: 11, height: 11, color: '#e91e8c' }} />
            {entry.hookCount} hooks generated
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Reuse — navigate to hook generator with these params */}
          <button
            onClick={() => router.push(`/?niche=${encodeURIComponent(entry.niche)}&goal=${entry.goal}&tone=${entry.tone}`)}
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all"
            style={{ background: 'rgba(124,58,237,0.12)', color: 'rgba(167,139,250,0.8)', border: '1px solid rgba(124,58,237,0.2)' }}
            aria-label="Reuse settings"
          >
            <RotateCcw style={{ width: 11, height: 11 }} />
            <span className="hidden sm:inline">Reuse</span>
          </button>

          <button
            onClick={onRemove}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
            style={{ background: 'rgba(251,113,133,0.07)', color: 'rgba(251,113,133,0.5)' }}
            aria-label="Delete entry"
          >
            <Trash2 style={{ width: 13, height: 13 }} />
          </button>

          <button
            onClick={() => setExpanded(v => !v)}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <ChevronUp style={{ width: 14, height: 14 }} /> : <ChevronDown style={{ width: 14, height: 14 }} />}
          </button>
        </div>
      </div>

      {/* Best hook preview (always visible) */}
      {topHook && (
        <div className="mx-4 mb-3 p-3 rounded-xl"
             style={{ background: 'rgba(233,30,140,0.06)', border: '1px solid rgba(233,30,140,0.15)' }}>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(233,30,140,0.6)' }}>
            Top Hook
          </p>
          <div className="flex items-start gap-2">
            <p className="flex-1 text-sm font-semibold leading-snug" style={{ color: 'rgba(255,255,255,0.9)' }}>
              {topHook.text}
            </p>
            <CopyBtn text={topHook.text} />
          </div>
        </div>
      )}

      {/* Expanded hook list */}
      {expanded && (
        <div className="px-4 pb-4 space-y-1.5 animate-fade-in">
          <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.25)' }}>
            All {allHooks.length} hooks
          </p>
          {allHooks.map((h, i) => (
            <HookPill key={i} hook={h} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [entries, setEntries] = useState<HistoryEntry[]>([])

  const load = useCallback(() => {
    if (!user) return
    setEntries(historyStore.getAll(user.id))
  }, [user])

  useEffect(() => {
    if (!authLoading && !user) { router.push('/auth'); return }
    load()
  }, [user, authLoading, router, load])

  const remove = (id: string) => {
    historyStore.remove(id)
    load()
  }

  const clearAll = () => {
    if (!user) return
    historyStore.clear(user.id)
    load()
  }

  if (authLoading) return null

  const totalHooks = entries.reduce((sum, e) => sum + e.hookCount, 0)

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'oklch(0.07 0.01 280)', color: 'white' }}>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b"
              style={{ backgroundColor: 'rgba(7,4,20,0.9)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => router.push('/')}
                  className="flex items-center gap-1.5 text-sm font-medium"
                  style={{ color: 'rgba(255,255,255,0.45)' }}>
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <div className="w-px h-4 mx-1" style={{ background: 'rgba(255,255,255,0.1)' }} />
          <Clock className="w-4 h-4" style={{ color: '#7c3aed' }} />
          <h1 className="text-sm font-bold text-white">Generation History</h1>
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ background: 'rgba(124,58,237,0.15)', color: 'rgba(167,139,250,0.8)', border: '1px solid rgba(124,58,237,0.25)' }}>
            {entries.length}
          </span>

          {entries.length > 0 && (
            <button onClick={clearAll}
                    className="ml-auto flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
                    style={{ background: 'rgba(251,113,133,0.08)', color: 'rgba(251,113,133,0.6)', border: '1px solid rgba(251,113,133,0.15)' }}>
              <Trash2 className="w-3.5 h-3.5" />
              Clear all
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                 style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)' }}>
              <Clock className="w-8 h-8" style={{ color: 'rgba(124,58,237,0.5)' }} />
            </div>
            <p className="text-base font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>No history yet</p>
            <p className="text-sm mb-5 text-center max-w-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Generate hooks to start building your history. Each session is saved automatically.
            </p>
            <button onClick={() => router.push('/')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold"
                    style={{ background: 'linear-gradient(135deg, #e91e8c, #7c3aed)', color: 'white' }}>
              <Zap className="w-4 h-4" />
              Generate Hooks
            </button>
          </div>
        ) : (
          <>
            {/* Stats strip */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Sessions',      value: entries.length },
                { label: 'Hooks Made',    value: totalHooks },
                { label: 'Unique Niches', value: new Set(entries.map(e => e.niche)).size },
              ].map(stat => (
                <div key={stat.label} className="rounded-xl p-3 text-center"
                     style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Entry list */}
            <div className="space-y-3">
              {entries.map(entry => (
                <EntryCard key={entry.id} entry={entry} onRemove={() => remove(entry.id)} />
              ))}
            </div>
          </>
        )}
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.25s ease both; }
      `}</style>
    </div>
  )
}
