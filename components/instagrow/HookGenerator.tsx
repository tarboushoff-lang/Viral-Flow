'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Copy, Check, RefreshCw, Flame, Heart, Zap,
  HelpCircle, ArrowRight, Star, Bookmark, BookmarkCheck,
  AlertTriangle, Shield, ChevronDown, ChevronUp
} from 'lucide-react'
import { generateHooks, type Hook, type HookFormula, type HookResult } from '@/lib/instagrow-ai'
import { useAuth } from '@/lib/auth-context'
import { savedHooksStore } from '@/lib/saved-hooks'
import { historyStore } from '@/lib/history'

// ─── Config ───────────────────────────────────────────────────────────────────

const GOALS = [
  { value: 'followers',  label: 'More Followers'   },
  { value: 'engagement', label: 'More Engagement'  },
  { value: 'sales',      label: 'Drive Sales'      },
  { value: 'awareness',  label: 'Brand Awareness'  },
]

const TONES = [
  { value: 'educational', label: 'Educational'   },
  { value: 'bold',        label: 'Bold'          },
  { value: 'authentic',   label: 'Authentic'     },
  { value: 'fun',         label: 'Fun'           },
  { value: 'luxury',      label: 'Luxury'        },
]

const NICHE_CHIPS = ['Fitness', 'Finance', 'Food', 'Fashion', 'Travel', 'Business', 'Beauty', 'Coaching']

type Tab = 'viral' | 'emotional' | 'curiosity' | 'cta'

const RESULT_TABS: { key: Tab; label: string; Icon: typeof Flame; count: (r: HookResult) => number }[] = [
  { key: 'viral',     label: 'Viral',     Icon: Flame,       count: r => r.viralHooks.length     },
  { key: 'emotional', label: 'Emotional', Icon: Heart,       count: r => r.emotionalHooks.length },
  { key: 'curiosity', label: 'Curiosity', Icon: HelpCircle,  count: r => r.curiosityHooks.length },
  { key: 'cta',       label: 'CTAs',      Icon: ArrowRight,  count: r => r.ctaEndings.length     },
]

const FORMULA_COLORS: Record<HookFormula, string> = {
  'curiosity-gap': '#38bdf8',
  'pain-point':    '#fb7185',
  'contrarian':    '#fb923c',
  'authority':     '#fbbf24',
  'relatable':     '#c084fc',
  'cta':           '#34d399',
}

const FORMULA_LABELS: Record<HookFormula, string> = {
  'curiosity-gap': 'Curiosity Gap',
  'pain-point':    'Pain Point',
  'contrarian':    'Contrarian',
  'authority':     'Authority',
  'relatable':     'Relatable',
  'cta':           'CTA',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreColor(s: number) {
  if (s >= 80) return '#34d399'
  if (s >= 60) return '#fbbf24'
  return '#fb7185'
}

function scoreLabel(s: number) {
  if (s >= 80) return 'High'
  if (s >= 60) return 'Med'
  return 'Low'
}

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyBtn({ text, variant = 'icon' }: { text: string; variant?: 'icon' | 'pill' | 'full' }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={copy}
        aria-label="Copy hook"
        className="w-10 h-10 flex items-center justify-center rounded-xl transition-all flex-shrink-0"
        style={{
          background: copied ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.07)',
          color: copied ? '#34d399' : 'rgba(255,255,255,0.55)',
          border: `1px solid ${copied ? 'rgba(52,211,153,0.35)' : 'rgba(255,255,255,0.09)'}`,
        }}
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
    )
  }

  if (variant === 'pill') {
    return (
      <button
        onClick={copy}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
        style={{
          background: copied ? 'rgba(52,211,153,0.12)' : 'rgba(244,114,182,0.12)',
          color: copied ? '#34d399' : '#f9a8d4',
          border: `1px solid ${copied ? 'rgba(52,211,153,0.3)' : 'rgba(244,114,182,0.25)'}`,
        }}
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copied ? 'Copied!' : 'Copy'}
      </button>
    )
  }

  // full
  return (
    <button
      onClick={copy}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all"
      style={{
        background: copied ? 'rgba(52,211,153,0.12)' : 'rgba(233,30,140,0.12)',
        color: copied ? '#34d399' : '#f9a8d4',
        border: `1px solid ${copied ? 'rgba(52,211,153,0.3)' : 'rgba(233,30,140,0.25)'}`,
      }}
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {copied ? 'All hooks copied!' : 'Copy All Hooks'}
    </button>
  )
}

// ─── Save button ──────────────────────────────────────────────────────────────

function SaveBtn({ hook, niche, goal, tone, userId, variant = 'icon' }: {
  hook: Hook; niche: string; goal: string; tone: string; userId: string
  variant?: 'icon' | 'pill'
}) {
  const [saved, setSaved] = useState(() => savedHooksStore.isSaved(hook.text, userId))

  const toggle = () => {
    if (saved) {
      const all   = savedHooksStore.getAll(userId)
      const found = all.find(s => s.hook.text === hook.text)
      if (found) savedHooksStore.remove(found.id)
      setSaved(false)
    } else {
      savedHooksStore.save(hook, { niche, goal, tone, userId })
      setSaved(true)
    }
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={toggle}
        aria-label={saved ? 'Unsave' : 'Save hook'}
        className="w-10 h-10 flex items-center justify-center rounded-xl transition-all flex-shrink-0"
        style={saved
          ? { background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }
          : { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.09)' }}
      >
        {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
      </button>
    )
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
      style={saved
        ? { background: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.25)' }
        : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.09)' }}
    >
      {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
      {saved ? 'Saved' : 'Save'}
    </button>
  )
}

// ─── Best Performer Card ──────────────────────────────────────────────────────

function BestCard({ hook, niche, goal, tone, userId }: {
  hook: Hook; niche: string; goal: string; tone: string; userId: string
}) {
  const [expanded, setExpanded] = useState(true)
  const sc = scoreColor(hook.score)
  const fc = FORMULA_COLORS[hook.formula]

  return (
    <div className="rounded-2xl overflow-hidden mb-4 pulse-glow"
         style={{ background: 'linear-gradient(145deg,rgba(20,8,40,0.98),rgba(12,4,24,0.99))', border: '1.5px solid rgba(233,30,140,0.35)' }}>

      {/* Header strip */}
      <div className="px-4 py-3 flex items-center gap-2" style={{ background: 'rgba(233,30,140,0.08)', borderBottom: '1px solid rgba(233,30,140,0.15)' }}>
        <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'rgba(251,191,36,0.2)' }}>
          <Star className="w-3 h-3 fill-current" style={{ color: '#fde68a' }} />
        </div>
        <span className="text-xs font-bold tracking-wide" style={{ color: '#fde68a' }}>BEST PERFORMER</span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full ml-1"
              style={{ background: `${fc}18`, color: fc, border: `1px solid ${fc}35` }}>
          {FORMULA_LABELS[hook.formula]}
        </span>
        {/* Score */}
        <div className="ml-auto flex items-center gap-1.5">
          <div className="h-1.5 w-16 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="h-full rounded-full" style={{ width: `${hook.score}%`, background: `linear-gradient(90deg,${sc}80,${sc})` }} />
          </div>
          <span className="text-xs font-bold tabular-nums" style={{ color: sc }}>{hook.score}</span>
          <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full" style={{ background: `${sc}18`, color: sc }}>
            {scoreLabel(hook.score)}
          </span>
        </div>
      </div>

      {/* Hook text */}
      <div className="px-4 pt-4 pb-3">
        <p className="text-xl sm:text-2xl font-bold leading-snug text-balance" style={{ color: '#ffffff' }}>
          {hook.text}
        </p>
      </div>

      {/* Why it works — collapsible */}
      {hook.whyItWorks && (
        <div className="mx-4 mb-3">
          <button
            onClick={() => setExpanded(v => !v)}
            className="flex items-center gap-1.5 text-xs font-semibold mb-2"
            style={{ color: '#c084fc' }}
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            Why this works
          </button>
          {expanded && (
            <p className="text-sm leading-relaxed rounded-xl px-3.5 py-3 animate-fade-in"
               style={{ background: 'rgba(192,132,252,0.07)', color: 'rgba(216,180,254,0.85)', border: '1px solid rgba(192,132,252,0.18)' }}>
              {hook.whyItWorks}
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="px-4 pb-4 flex gap-2">
        <CopyBtn text={hook.text} variant="pill" />
        <SaveBtn hook={hook} niche={niche} goal={goal} tone={tone} userId={userId} variant="pill" />
      </div>
    </div>
  )
}

// ─── Hook card (list item) ────────────────────────────────────────────────────

function HookCard({ hook, index, niche, goal, tone, userId }: {
  hook: Hook; index: number; niche: string; goal: string; tone: string; userId: string
}) {
  const fc = FORMULA_COLORS[hook.formula]
  const sc = scoreColor(hook.score)

  return (
    <div className="rounded-xl p-4 transition-all card-surface-hover"
         style={{ borderLeft: `3px solid ${fc}` }}>
      <div className="flex items-start gap-3">
        {/* Number */}
        <span className="w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: `${fc}18`, color: fc }}>
          {index}
        </span>

        {/* Text */}
        <p className="flex-1 text-sm sm:text-base font-semibold leading-snug" style={{ color: 'rgba(255,255,255,0.90)' }}>
          {hook.text}
        </p>

        {/* Right controls */}
        <div className="flex items-center gap-1 flex-shrink-0 ml-1">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full tabular-nums"
                style={{ color: sc, background: `${sc}15`, border: `1px solid ${sc}30` }}>
            {hook.score}
          </span>
          <SaveBtn hook={hook} niche={niche} goal={goal} tone={tone} userId={userId} variant="icon" />
          <CopyBtn text={hook.text} variant="icon" />
        </div>
      </div>
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonLoader() {
  return (
    <div className="space-y-3 animate-fade-in">
      {/* Best card skeleton */}
      <div className="rounded-2xl p-5 mb-4" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex gap-2 mb-3">
          <div className="h-5 w-24 rounded-full shimmer" />
          <div className="h-5 w-20 rounded-full shimmer" style={{ animationDelay: '0.1s' }} />
        </div>
        <div className="h-7 w-full rounded-xl mb-2 shimmer" style={{ animationDelay: '0.15s' }} />
        <div className="h-7 w-2/3 rounded-xl mb-4 shimmer" style={{ animationDelay: '0.2s' }} />
        <div className="h-16 w-full rounded-xl shimmer" style={{ animationDelay: '0.25s' }} />
        <div className="flex gap-2 mt-4">
          <div className="h-10 w-24 rounded-xl shimmer" style={{ animationDelay: '0.3s' }} />
          <div className="h-10 w-20 rounded-xl shimmer" style={{ animationDelay: '0.35s' }} />
        </div>
      </div>
      {/* List skeletons */}
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-4 rounded-xl"
             style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderLeft: '3px solid rgba(255,255,255,0.06)' }}>
          <div className="w-7 h-7 rounded-lg flex-shrink-0 shimmer" />
          <div className="flex-1 h-5 rounded-lg shimmer" style={{ animationDelay: `${i * 50}ms` }} />
          <div className="w-10 h-6 rounded-full flex-shrink-0 shimmer" />
          <div className="w-10 h-10 rounded-xl flex-shrink-0 shimmer" />
          <div className="w-10 h-10 rounded-xl flex-shrink-0 shimmer" />
        </div>
      ))}
    </div>
  )
}

// ─── Limit banner ─────────────────────────────────────────────────────────────

function LimitBanner({ remaining }: { remaining: number }) {
  if (remaining > 3) return null

  if (remaining === 0) {
    return (
      <div className="rounded-xl p-4 mb-4 flex items-start gap-3"
           style={{ background: 'rgba(251,113,133,0.07)', border: '1px solid rgba(251,113,133,0.2)' }}>
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#fb7185' }} />
        <div>
          <p className="text-sm font-bold mb-0.5" style={{ color: '#fb7185' }}>Daily limit reached</p>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(251,113,133,0.7)' }}>
            Upgrade to ViralFlow Pro for unlimited access.
          </p>
        </div>
        <button
          className="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg ml-auto"
          style={{ background: 'linear-gradient(135deg,#e91e8c,#7c3aed)', color: 'white' }}
        >
          Upgrade to Pro
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-xl px-4 py-3 mb-4 flex items-center gap-3"
         style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.18)' }}>
      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#fbbf24' }} />
      <p className="text-xs font-medium" style={{ color: 'rgba(251,191,36,0.85)' }}>
        {remaining} free generation{remaining !== 1 ? 's' : ''} remaining today.
      </p>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HookGenerator() {
  const { user, trackGeneration } = useAuth()
  const router = useRouter()

  const [niche,   setNiche]   = useState('')
  const [goal,    setGoal]    = useState('followers')
  const [tone,    setTone]    = useState('educational')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [result,  setResult]  = useState<HookResult | null>(null)
  const [tab,     setTab]     = useState<Tab>('viral')
  const [runKey,  setRunKey]  = useState(0)

  const isAdmin   = user?.role === 'admin'
  const remaining = user
    ? user.generationsLimit === -1 ? Infinity : Math.max(0, user.generationsLimit - user.generationsToday)
    : 3

  // Restore from URL (History "Reuse")
  useEffect(() => {
    if (typeof window === 'undefined') return
    const p = new URLSearchParams(window.location.search)
    if (p.get('niche')) setNiche(decodeURIComponent(p.get('niche')!))
    if (p.get('goal'))  setGoal(decodeURIComponent(p.get('goal')!))
    if (p.get('tone'))  setTone(decodeURIComponent(p.get('tone')!))
  }, [])

  const generate = async () => {
    if (!niche.trim()) { setError('Enter your niche to continue'); return }
    if (!user) { router.push('/auth'); return }

    if (!trackGeneration()) {
      setError('Daily limit reached. Upgrade to Pro for unlimited generations.')
      return
    }

    setError('')
    setLoading(true)
    try {
      const data = await generateHooks({ niche: niche.trim(), goal, tone })
      setResult(data)
      setTab('viral')
      setRunKey(k => k + 1)
      historyStore.add({ userId: user.id, niche: niche.trim(), goal, tone, result: data })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Hooks for active tab
  const activeHooks: Hook[] = !result ? [] :
    tab === 'viral'     ? result.viralHooks     :
    tab === 'emotional' ? result.emotionalHooks :
    tab === 'curiosity' ? result.curiosityHooks :
    result.ctaEndings

  const bestHook  = result?.viralHooks[0] ?? null
  const listHooks = tab === 'viral' && result ? result.viralHooks.slice(1) : activeHooks

  const allCurrentHooks = activeHooks.map(h => h.text).join('\n\n')

  return (
    <div className="max-w-2xl mx-auto">

      {/* ── Admin badge ── */}
      {isAdmin && (
        <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit mb-4"
             style={{ background: 'rgba(124,58,237,0.12)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.22)' }}>
          <Shield className="w-3 h-3" />
          Admin · Unlimited generations
        </div>
      )}

      {/* ── Limit banner ── */}
      {user && !isAdmin && <LimitBanner remaining={remaining === Infinity ? 999 : remaining} />}

      {/* ── Form card ── */}
      <div className="rounded-2xl p-4 sm:p-5 mb-5"
           style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>

        {/* Niche */}
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Your Niche
          </label>
          <input
            type="text"
            value={niche}
            onChange={e => setNiche(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && generate()}
            placeholder="e.g. fitness, finance, food coaching..."
            className="input-dark w-full px-4 py-3.5 text-sm font-medium"
          />
          {/* Quick chips */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {NICHE_CHIPS.map(n => (
              <button
                key={n}
                onClick={() => setNiche(n.toLowerCase())}
                className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
                style={niche.toLowerCase() === n.toLowerCase()
                  ? { background: 'rgba(233,30,140,0.15)', color: '#f9a8d4', border: '1px solid rgba(233,30,140,0.3)' }
                  : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.38)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Goal + Tone row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Goal
            </label>
            <select
              value={goal}
              onChange={e => setGoal(e.target.value)}
              className="input-dark w-full px-3.5 py-3 text-sm font-medium"
            >
              {GOALS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Tone
            </label>
            <select
              value={tone}
              onChange={e => setTone(e.target.value)}
              className="input-dark w-full px-3.5 py-3 text-sm font-medium"
            >
              {TONES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-xs px-3.5 py-2.5 rounded-xl mb-4"
             style={{ background: 'rgba(251,113,133,0.08)', color: '#fb7185', border: '1px solid rgba(251,113,133,0.2)' }}>
            {error}
          </p>
        )}

        {/* Generate button */}
        <button
          onClick={generate}
          disabled={loading || (remaining === 0 && !isAdmin)}
          className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2.5"
        >
          {loading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="white" strokeWidth="3" />
                <path className="opacity-70" fill="white" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
              </svg>
              Generating your hooks...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Generate Hooks
            </>
          )}
        </button>
      </div>

      {/* ── Results ── */}
      {loading && <SkeletonLoader />}

      {!loading && result && (
        <div key={runKey} className="animate-slide-up">

          {/* Top action bar */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {result.viralHooks.length + result.emotionalHooks.length + result.curiosityHooks.length + result.ctaEndings.length} hooks generated
            </p>
            <button
              onClick={generate}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-all"
              style={{ background: 'rgba(124,58,237,0.12)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.22)' }}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Regenerate
            </button>
          </div>

          {/* Best Performer */}
          {bestHook && (
            <BestCard
              hook={bestHook}
              niche={niche}
              goal={goal}
              tone={tone}
              userId={user!.id}
            />
          )}

          {/* Category tabs */}
          <div className="flex gap-1.5 mb-4 overflow-x-auto scrollbar-none">
            {RESULT_TABS.map(({ key, label, Icon, count }) => {
              const active = tab === key
              const c = count(result)
              return (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
                  style={active
                    ? { background: 'linear-gradient(135deg,#e91e8c,#7c3aed)', color: 'white' }
                    : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                        style={active
                          ? { background: 'rgba(255,255,255,0.2)', color: 'white' }
                          : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
                    {c}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Hook list */}
          <div className="space-y-2.5 stagger mb-4">
            {listHooks.map((hook, i) => (
              <HookCard
                key={hook.text}
                hook={hook}
                index={i + (tab === 'viral' ? 2 : 1)}
                niche={niche}
                goal={goal}
                tone={tone}
                userId={user!.id}
              />
            ))}
          </div>

          {/* Copy all */}
          <CopyBtn text={allCurrentHooks} variant="full" />
        </div>
      )}
    </div>
  )
}
