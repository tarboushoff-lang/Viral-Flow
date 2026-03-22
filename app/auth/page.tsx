'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Flame, Mail, Lock, User, Eye, EyeOff, ArrowRight, Shield, Zap, TrendingUp } from 'lucide-react'
import { signIn, signUp } from '@/lib/auth'
import { useAuth } from '@/lib/auth-context'

type Mode = 'login' | 'signup'

const FEATURES = [
  { Icon: Zap,        text: 'Generate 20+ viral hooks in seconds'         },
  { Icon: TrendingUp, text: 'Proven formulas used by top creators'        },
  { Icon: Flame,      text: 'Scroll-stopping openers that grow followers' },
]

export default function AuthPage() {
  const router      = useRouter()
  const { setUser } = useAuth()

  const [mode,     setMode]     = useState<Mode>('login')
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const switchMode = (m: Mode) => { setMode(m); setError('') }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 380))

    const result = mode === 'login'
      ? signIn(email, password)
      : signUp(email, password, name)

    setLoading(false)

    if (result.error) { setError(result.error); return }
    if (result.user) {
      setUser(result.user)
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row"
         style={{ backgroundColor: 'oklch(0.06 0.012 285)', color: 'oklch(0.96 0.004 280)' }}>

      {/* ── Left panel — brand side ── */}
      <div className="hidden md:flex md:w-5/12 lg:w-1/2 flex-col justify-between p-10 relative overflow-hidden"
           style={{ background: 'linear-gradient(145deg,oklch(0.08 0.02 290),oklch(0.06 0.012 285))' }}>

        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none"
             style={{ background: 'radial-gradient(circle,rgba(233,30,140,0.12),transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-0 w-60 h-60 rounded-full pointer-events-none"
             style={{ background: 'radial-gradient(circle,rgba(124,58,237,0.10),transparent 70%)' }} />

        {/* Logo */}
        <div className="flex items-center gap-3 relative">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center glow-pink"
               style={{ background: 'linear-gradient(135deg,#e91e8c,#7c3aed)' }}>
            <Flame className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text tracking-tight">ViralFlow</span>
        </div>

        {/* Hero copy */}
        <div className="relative">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4 text-balance">
            Generate viral hooks to{' '}
            <span className="gradient-text-strong">get more followers</span>
          </h1>
          <p className="text-base leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Turn your content into engagement with AI-powered hooks that stop the scroll and grow your account.
          </p>
          <div className="flex flex-col gap-3">
            {FEATURES.map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                     style={{ background: 'rgba(233,30,140,0.12)', border: '1px solid rgba(233,30,140,0.2)' }}>
                  <Icon className="w-4 h-4" style={{ color: '#f9a8d4' }} />
                </div>
                <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-xs relative" style={{ color: 'rgba(255,255,255,0.2)' }}>
          No bots. No fake followers. Real organic growth.
        </p>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex items-center justify-center p-5 sm:p-8">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2.5 mb-8 md:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg,#e91e8c,#7c3aed)', boxShadow: '0 0 24px rgba(233,30,140,0.3)' }}>
              <Flame className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text tracking-tight">ViralFlow</span>
          </div>

          {/* Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">
              {mode === 'login' ? 'Welcome back' : 'Start for free'}
            </h2>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.38)' }}>
              {mode === 'login'
                ? 'Sign in to generate viral hooks'
                : '3 free generations daily · No card needed'}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="flex p-1 rounded-xl mb-6"
               style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {(['login', 'signup'] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150"
                style={mode === m
                  ? { background: 'linear-gradient(135deg,rgba(233,30,140,0.22),rgba(124,58,237,0.18))', color: '#f9a8d4', border: '1px solid rgba(233,30,140,0.28)' }
                  : { color: 'rgba(255,255,255,0.35)' }}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="flex flex-col gap-4">

            {/* Name — signup only */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2"
                       style={{ color: 'rgba(255,255,255,0.4)' }}>Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.28)' }} />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    className="input-dark w-full pl-10 pr-4 py-3.5 text-sm"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2"
                     style={{ color: 'rgba(255,255,255,0.4)' }}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.28)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="input-dark w-full pl-10 pr-4 py-3.5 text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2"
                     style={{ color: 'rgba(255,255,255,0.4)' }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.28)' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Min. 6 characters' : 'Your password'}
                  required
                  className="input-dark w-full pl-10 pr-11 py-3.5 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'rgba(255,255,255,0.28)' }}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs px-3.5 py-2.5 rounded-xl"
                 style={{ background: 'rgba(251,113,133,0.08)', color: '#fb7185', border: '1px solid rgba(251,113,133,0.2)' }}>
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-sm flex items-center justify-center gap-2 mt-1"
            >
              {loading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-20" cx="12" cy="12" r="10" stroke="white" strokeWidth="3" />
                  <path className="opacity-70" fill="white" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                </svg>
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Free Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Admin hint */}
          <div className="mt-5 p-3.5 rounded-xl flex items-start gap-2.5"
               style={{ background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.16)' }}>
            <Shield className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'rgba(167,139,250,0.65)' }} />
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(167,139,250,0.65)' }}>
              <strong style={{ color: 'rgba(192,132,252,0.85)' }}>Demo admin:</strong>{' '}
              admin@viralflow.ai / admin123
            </p>
          </div>

          {/* Mobile features */}
          <div className="mt-6 flex flex-col gap-2.5 md:hidden">
            {FEATURES.map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 flex-shrink-0" style={{ color: '#f9a8d4' }} />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.42)' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
