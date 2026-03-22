'use client'

import { useState } from 'react'
import { generateAudit, type AuditResult } from '@/lib/instagrow-ai'
import {
  InputField,
  SelectField,
  GradientButton,
  SectionCard,
  Loader,
  EmptyState,
  RegenerateBar,
  ModuleHeader,
} from './shared'
import { Search, TrendingUp } from 'lucide-react'

const CONTENT_TYPES = [
  { value: 'reels', label: 'Reels (Short Video)' },
  { value: 'carousels', label: 'Carousels (Multi-image)' },
  { value: 'photos', label: 'Photos / Static Posts' },
  { value: 'stories', label: 'Stories' },
  { value: 'mixed', label: 'Mixed Content' },
]

export default function AuditModule() {
  const [form, setForm] = useState({
    niche: '',
    targetAudience: '',
    followers: '',
    contentType: 'reels',
  })
  const [result, setResult] = useState<AuditResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!form.niche.trim() || !form.targetAudience.trim()) {
      setError('Please fill in your niche and target audience.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const data = await generateAudit(form)
      setResult(data)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const scoreColor = (score: number) =>
    score >= 70 ? 'text-emerald-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400'

  const scoreLabel = (score: number) =>
    score >= 70 ? 'Great foundation' : score >= 50 ? 'Needs improvement' : 'Urgent attention needed'

  return (
    <div>
      <ModuleHeader
        icon={<Search className="w-6 h-6 text-white" />}
        title="Account Audit"
        description="Get a comprehensive analysis of your Instagram account with personalized growth recommendations."
        badge="AI-Powered"
      />

      {/* Input Form */}
      <div className="glass-card rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField
            label="Your Niche"
            placeholder="e.g. Fitness, Personal Finance, Travel..."
            value={form.niche}
            onChange={(e) => setForm({ ...form, niche: e.target.value })}
          />
          <InputField
            label="Target Audience"
            placeholder="e.g. Women 25-35 who want to lose weight..."
            value={form.targetAudience}
            onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
          />
          <InputField
            label="Current Followers"
            placeholder="e.g. 1,500"
            type="text"
            value={form.followers}
            onChange={(e) => setForm({ ...form, followers: e.target.value })}
          />
          <SelectField
            label="Primary Content Type"
            options={CONTENT_TYPES}
            value={form.contentType}
            onChange={(e) => setForm({ ...form, contentType: e.target.value })}
          />
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <div className="mt-5 flex items-center gap-3">
          <GradientButton
            onClick={handleGenerate}
            loading={loading}
            icon={<TrendingUp className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Run Account Audit
          </GradientButton>
          {result && !loading && (
            <span className="text-xs text-muted-foreground">Last generated just now</span>
          )}
        </div>
      </div>

      {/* Results */}
      {loading && <Loader message="Auditing your Instagram account..." />}

      {!loading && !result && (
        <EmptyState
          icon={<Search className="w-7 h-7 text-muted-foreground" />}
          title="Your audit will appear here"
          description="Fill in your account details above and click Run Account Audit to get your personalized analysis."
        />
      )}

      {!loading && result && (
        <div className="animate-fade-in">
          {/* Score Card */}
          <div className="glass-card rounded-2xl p-6 mb-5 flex flex-col sm:flex-row items-center gap-5">
            <div className="relative flex-shrink-0">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-secondary" />
                <circle
                  cx="50" cy="50" r="42" fill="none" strokeWidth="8"
                  stroke="url(#scoreGrad)"
                  strokeLinecap="round"
                  strokeDasharray={`${(result.score / 100) * 264} 264`}
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="oklch(0.62 0.28 330)" />
                    <stop offset="100%" stopColor="oklch(0.55 0.25 300)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-2xl font-bold ${scoreColor(result.score)}`}>{result.score}</span>
                <span className="text-xs text-muted-foreground">/100</span>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl font-bold text-foreground">Account Health Score</h3>
              <p className={`text-sm font-medium mt-0.5 ${scoreColor(result.score)}`}>{scoreLabel(result.score)}</p>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Based on your niche, audience alignment, content type, and growth potential.
                Focus on the quick wins below to improve your score fast.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-stagger">
            <SectionCard title="Strengths" items={result.strengths} badgeColor="green" icon="✓" />
            <SectionCard title="Weaknesses" items={result.weaknesses} badgeColor="orange" icon="!" />
            <SectionCard title="Content Gaps" items={result.contentGaps} badgeColor="blue" icon="→" />
            <SectionCard title="Bio Suggestions" items={result.bioSuggestions} badgeColor="purple" icon="@" />
            <SectionCard title="Positioning Advice" items={result.positioningAdvice} badgeColor="pink" icon="★" />
            <SectionCard title="Quick Wins (Do This Week)" items={result.quickWins} badgeColor="green" icon="⚡" />
          </div>

          <RegenerateBar onRegenerate={handleGenerate} loading={loading} />
        </div>
      )}
    </div>
  )
}
