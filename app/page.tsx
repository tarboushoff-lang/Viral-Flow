'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Zap, Search, PenLine, CalendarDays, User, MessageCircle,
  Bookmark, Clock, LogOut, Shield, ChevronDown, Flame, Menu, X
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { savedHooksStore } from '@/lib/saved-hooks'
import HookGenerator       from '@/components/instagrow/HookGenerator'
import AuditModule         from '@/components/instagrow/AuditModule'
import CaptionGenerator    from '@/components/instagrow/CaptionGenerator'
import ContentPlanner      from '@/components/instagrow/ContentPlanner'
import BioOptimizer        from '@/components/instagrow/BioOptimizer'
import EngagementAssistant from '@/components/instagrow/EngagementAssistant'

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS = [
  { id: 'hooks',      label: 'Hooks',      Icon: Zap,           badge: 'Hot' },
  { id: 'audit',      label: 'Audit',      Icon: Search,        badge: null  },
  { id: 'captions',   label: 'Captions',   Icon: PenLine,       badge: null  },
  { id: 'planner',    label: 'Planner',    Icon: CalendarDays,  badge: null  },
  { id: 'bio',        label: 'Bio',        Icon: User,          badge: null  },
  { id: 'engagement', label: 'Engage',     Icon: MessageCircle, badge: null  },
] as const

type TabId = (typeof TABS)[number]['id']

// ─── User avatar / menu ───────────────────────────────────────────────────────

function UserMenu({ savedCount }: { savedCount: number }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  if (!user) return null

  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  const isAdmin  = user.role === 'admin'
  const genLeft  = user.generationsLimit === -1
    ? null
    : Math.max(0, user.generationsLimit - user.generationsToday)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all"
        style={{ background: open ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}
        aria-label="Account menu"
      >
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
             style={{ background: isAdmin ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : 'linear-gradient(135deg,#e91e8c,#7c3aed)', color: 'white' }}>
          {initials}
        </div>
        {isAdmin && <Shield className="w-3 h-3 flex-shrink-0" style={{ color: '#a78bfa' }} />}
        <ChevronDown className="w-3 h-3 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl z-50 overflow-hidden"
               style={{ background: 'oklch(0.08 0.014 282)', border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 24px 64px rgba(0,0,0,0.7)' }}>

            {/* User info */}
            <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                     style={{ background: isAdmin ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : 'linear-gradient(135deg,#e91e8c,#7c3aed)', color: 'white' }}>
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">{user.name}</p>
                  <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.38)' }}>{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={isAdmin
                        ? { background: 'rgba(124,58,237,0.18)', color: '#c4b5fd', border: '1px solid rgba(124,58,237,0.3)' }
                        : { background: 'rgba(233,30,140,0.10)', color: '#f9a8d4', border: '1px solid rgba(233,30,140,0.22)' }}>
                  {isAdmin ? 'Admin' : user.plan === 'pro' ? 'Pro' : 'Free'}
                </span>
                {genLeft === null
                  ? <span className="text-xs" style={{ color: 'rgba(167,139,250,0.7)' }}>Unlimited</span>
                  : <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{genLeft} left today</span>
                }
              </div>
            </div>

            {/* Nav */}
            <div className="p-2">
              {[
                { label: 'Saved Hooks', Icon: Bookmark, color: '#f9a8d4', badge: savedCount > 0 ? String(savedCount) : undefined, href: '/saved' },
                { label: 'History',     Icon: Clock,    color: '#a78bfa', badge: undefined,                                          href: '/history' },
              ].map(({ label, Icon, color, badge, href }) => (
                <button
                  key={href}
                  onClick={() => { router.push(href); setOpen(false) }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                  <span className="flex-1 text-left">{label}</span>
                  {badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ background: 'rgba(233,30,140,0.15)', color: '#f9a8d4' }}>
                      {badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Logout */}
            <div className="p-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button
                onClick={() => { logout(); setOpen(false); router.push('/auth') }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all"
                style={{ color: 'rgba(251,113,133,0.7)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(251,113,133,0.07)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Auth gate ────────────────────────────────────────────────────────────────

function AuthGate({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl"
         style={{ border: '1px dashed rgba(255,255,255,0.08)' }}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
           style={{ background: 'linear-gradient(135deg,rgba(233,30,140,0.12),rgba(124,58,237,0.10))', border: '1px solid rgba(233,30,140,0.2)' }}>
        <Zap className="w-8 h-8" style={{ color: '#e91e8c' }} />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">Sign in to generate hooks</h3>
      <p className="text-sm mb-8 max-w-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)' }}>
        Free account — 3 generations per day. No credit card needed.
      </p>
      <button
        onClick={onSignIn}
        className="btn-primary px-8 py-3.5 text-sm"
      >
        Get Started Free
      </button>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ViralFlowPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<TabId>('hooks')
  const [savedCount, setSavedCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!user) return
    setSavedCount(savedHooksStore.getAll(user.id).length)
  }, [user, activeTab])

  const isHooksTab = activeTab === 'hooks'

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'oklch(0.06 0.012 285)', color: 'oklch(0.96 0.004 280)' }}>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b backdrop-blur-xl"
              style={{ background: 'oklch(0.06 0.012 285 / 0.88)', borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-3">

          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center glow-pink"
                 style={{ background: 'linear-gradient(135deg,#e91e8c,#7c3aed)' }}>
              <Flame className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base gradient-text tracking-tight">ViralFlow</span>
          </div>

          {/* Desktop tabs */}
          <nav className="hidden md:flex items-center gap-0.5 rounded-xl p-1"
               style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {TABS.map(({ id, label, Icon, badge }) => {
              const active = activeTab === id
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                  style={active
                    ? { background: 'linear-gradient(135deg,#e91e8c,#7c3aed)', color: 'white' }
                    : { color: 'rgba(255,255,255,0.42)' }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                  {badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold leading-none"
                          style={active
                            ? { background: 'rgba(255,255,255,0.22)', color: 'white' }
                            : { background: 'rgba(233,30,140,0.18)', color: '#f9a8d4' }}>
                      {badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {user && savedCount > 0 && (
              <button
                onClick={() => router.push('/saved')}
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg"
                style={{ background: 'rgba(233,30,140,0.08)', color: '#f9a8d4', border: '1px solid rgba(233,30,140,0.18)' }}
              >
                <Bookmark className="w-3.5 h-3.5" />
                {savedCount}
              </button>
            )}

            {!authLoading && (
              user
                ? <UserMenu savedCount={savedCount} />
                : (
                  <button
                    onClick={() => router.push('/auth')}
                    className="btn-primary px-4 py-2 text-xs"
                  >
                    Sign In
                  </button>
                )
            )}

            {/* Mobile hamburger (only shown when needed for other tabs) */}
            <button
              className="md:hidden p-1.5 rounded-lg"
              style={{ color: 'rgba(255,255,255,0.5)' }}
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile tab overflow drawer */}
        {menuOpen && (
          <div className="md:hidden border-t animate-fade-in"
               style={{ background: 'oklch(0.07 0.012 285)', borderColor: 'rgba(255,255,255,0.07)' }}>
            <div className="max-w-4xl mx-auto px-4 py-3 grid grid-cols-3 gap-2">
              {TABS.map(({ id, label, Icon }) => {
                const active = activeTab === id
                return (
                  <button
                    key={id}
                    onClick={() => { setActiveTab(id); setMenuOpen(false) }}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-semibold transition-all"
                    style={active
                      ? { background: 'linear-gradient(135deg,#e91e8c,#7c3aed)', color: 'white' }
                      : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </header>

      {/* ── Hero (visible only on Hooks tab when NOT logged in, or always as value strip) ── */}
      {isHooksTab && (
        <div className="border-b" style={{ background: 'linear-gradient(180deg,rgba(233,30,140,0.06) 0%,transparent 100%)', borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="max-w-4xl mx-auto px-4 py-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4 text-xs font-semibold"
                 style={{ background: 'rgba(233,30,140,0.10)', color: '#f9a8d4', border: '1px solid rgba(233,30,140,0.22)' }}>
              <Flame className="w-3 h-3" />
              AI-Powered Hook Generator
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight text-balance">
              Generate viral hooks to{' '}
              <span className="gradient-text-strong">get more followers</span>
            </h1>
            <p className="text-base max-w-md mx-auto leading-relaxed text-pretty" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Turn your content into engagement with high-converting Instagram hooks that stop the scroll.
            </p>

            {/* Trust strip */}
            <div className="flex items-center justify-center gap-3 flex-wrap mt-5">
              {['No bots', 'Organic only', 'Real growth'].map(t => (
                <span key={t} className="flex items-center gap-1.5 text-xs font-medium"
                      style={{ color: 'rgba(52,211,153,0.75)' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#34d399' }} />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 pb-24 md:pb-6">

        {/* Mobile horizontal pill tabs */}
        <div className="md:hidden flex gap-2 overflow-x-auto pb-4 mb-5 scrollbar-none -mx-4 px-4">
          {TABS.map(({ id, label, Icon, badge }) => {
            const active = activeTab === id
            return (
              <button
                key={id}
                onClick={() => { setActiveTab(id); setMenuOpen(false) }}
                className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all"
                style={active
                  ? { background: 'linear-gradient(135deg,#e91e8c,#7c3aed)', color: 'white' }
                  : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
                {badge && active && (
                  <span className="text-[9px] px-1.5 rounded-full font-bold" style={{ background: 'rgba(255,255,255,0.2)' }}>
                    {badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        <div key={activeTab} className="animate-slide-up">
          {authLoading ? (
            <div className="flex justify-center py-20">
              <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="white" strokeWidth="3" />
                <path className="opacity-70" fill="white" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
              </svg>
            </div>
          ) : !user ? (
            <AuthGate onSignIn={() => router.push('/auth')} />
          ) : (
            <>
              {activeTab === 'hooks'      && <HookGenerator />}
              {activeTab === 'audit'      && <AuditModule />}
              {activeTab === 'captions'   && <CaptionGenerator />}
              {activeTab === 'planner'    && <ContentPlanner />}
              {activeTab === 'bio'        && <BioOptimizer />}
              {activeTab === 'engagement' && <EngagementAssistant />}
            </>
          )}
        </div>
      </main>

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t"
           style={{ background: 'oklch(0.07 0.012 285 / 0.96)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center justify-around px-2 py-2 max-w-4xl mx-auto">
          {TABS.map(({ id, label, Icon }) => {
            const active = activeTab === id
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all min-w-0"
                style={{ color: active ? '#e91e8c' : 'rgba(255,255,255,0.35)' }}
              >
                <div className="w-6 h-6 flex items-center justify-center rounded-lg transition-all"
                     style={active ? { background: 'rgba(233,30,140,0.15)' } : {}}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold leading-none truncate">{label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
