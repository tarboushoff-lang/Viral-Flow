'use client'

import { useState } from 'react'
import { generateContentPlan, type ContentPlanResult, type ContentPlanDay } from '@/lib/instagrow-ai'
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
import { Calendar, Copy, Check } from 'lucide-react'

const FREQUENCIES = [
  { value: '1x/week', label: '1x per week' },
  { value: '3x/week', label: '3x per week (Recommended)' },
  { value: '5x/week', label: '5x per week' },
  { value: 'daily', label: 'Daily (7x per week)' },
]

const TYPE_COLORS: Record<string, string> = {
  Reel: 'bg-primary/15 text-primary border border-primary/25',
  Carousel: 'bg-accent/15 text-accent border border-accent/25',
  Story: 'bg-blue-500/15 text-blue-400 border border-blue-500/25',
  Static: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
}

function PlanCard({ day, view = 'week' }: { day: ContentPlanDay; view?: 'week' | 'month' }) {
  const [copied, setCopied] = useState(false)

  const copyText = `${day.day} — ${day.type}\nIdea: ${day.idea}\nGoal: ${day.goal}\nHook: ${day.hook}\nHashtags: ${day.hashtags.join(' ')}`

  return (
    <div className="glass-card rounded-2xl p-5 hover:border-primary/30 transition-all duration-300 group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-foreground bg-secondary px-2.5 py-1 rounded-lg">
            {view === 'week' ? day.day : day.date}
          </span>
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${TYPE_COLORS[day.type]}`}>
            {day.type}
          </span>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(copyText)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }}
          className="flex-shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary opacity-0 group-hover:opacity-100 transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">Idea</p>
          <p className="text-sm text-foreground/90 leading-relaxed">{day.idea}</p>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">Hook</p>
            <p className="text-xs text-muted-foreground italic leading-relaxed">"{day.hook}"</p>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">Goal</p>
            <span className="text-xs bg-secondary px-2 py-0.5 rounded text-foreground/80">{day.goal}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 pt-1">
          {day.hashtags.map((tag) => (
            <span key={tag} className="text-[10px] text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ContentPlanner() {
  const [form, setForm] = useState({
    niche: '',
    frequency: '3x/week',
  })
  const [result, setResult] = useState<ContentPlanResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeView, setActiveView] = useState<'week' | 'month'>('week')

  const handleGenerate = async () => {
    if (!form.niche.trim()) {
      setError('Please enter your niche to generate a content plan.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const data = await generateContentPlan(form)
      setResult(data)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const displayDays = result ? (activeView === 'week' ? result.week : result.month) : []

  return (
    <div>
      <ModuleHeader
        icon={<Calendar className="w-6 h-6 text-white" />}
        title="Content Planner"
        description="Get a ready-to-execute content calendar with post ideas, hooks, goals, and hashtags — no more staring at a blank screen."
      />

      {/* Input Form */}
      <div className="glass-card rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InputField
            label="Your Niche"
            placeholder="e.g. Fitness, Personal Finance, Travel..."
            value={form.niche}
            onChange={(e) => setForm({ ...form, niche: e.target.value })}
          />
          <SelectField
            label="Posting Frequency"
            options={FREQUENCIES}
            value={form.frequency}
            onChange={(e) => setForm({ ...form, frequency: e.target.value })}
          />
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <div className="mt-5">
          <GradientButton
            onClick={handleGenerate}
            loading={loading}
            icon={<Calendar className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Generate Content Plan
          </GradientButton>
        </div>
      </div>

      {loading && <Loader message="Building your content calendar..." />}

      {!loading && !result && (
        <EmptyState
          icon={<Calendar className="w-7 h-7 text-muted-foreground" />}
          title="Your content plan will appear here"
          description="Enter your niche and posting frequency to get a full 7-day and 30-day content calendar with ready-to-use ideas."
        />
      )}

      {!loading && result && (
        <div className="animate-fade-in">
          {/* Content mix overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {(['Reel', 'Carousel', 'Story', 'Static'] as const).map((type) => {
              const count = result.month.filter((d) => d.type === type).length
              return (
                <div key={type} className="glass-card rounded-xl p-4 text-center">
                  <p className={`text-xl font-bold ${TYPE_COLORS[type].split(' ')[1]}`}>{count}</p>
                  <p className="text-xs text-muted-foreground mt-1">{type}s</p>
                </div>
              )
            })}
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-2 mb-5">
            <div className="flex bg-secondary rounded-xl p-1 gap-1">
              {(['week', 'month'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeView === view
                      ? 'bg-gradient-to-r from-primary to-accent text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {view === 'week' ? '7-Day Plan' : '30-Day Plan'}
                </button>
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-2">{displayDays.length} posts planned</span>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-5 animate-stagger">
            {displayDays.map((day, i) => (
              <PlanCard key={`${activeView}-${i}`} day={day} view={activeView} />
            ))}
          </div>

          {/* Strategy tips */}
          <SectionCard
            title="Content Strategy Tips"
            items={result.strategy}
            badgeColor="purple"
            icon="★"
          />

          <RegenerateBar onRegenerate={handleGenerate} loading={loading} />
        </div>
      )}
    </div>
  )
}
