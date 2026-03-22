'use client'

import { useState } from 'react'
import { generateEngagement, type EngagementResult } from '@/lib/instagrow-ai'
import {
  InputField,
  GradientButton,
  SectionCard,
  Loader,
  EmptyState,
  RegenerateBar,
  ModuleHeader,
} from './shared'
import { MessageCircle } from 'lucide-react'

const QUICK_NICHES = [
  'Fitness', 'Finance', 'Food', 'Travel', 'Fashion', 'Beauty', 'Business', 'Wellness', 'Tech', 'Photography',
]

export default function EngagementAssistant() {
  const [niche, setNiche] = useState('')
  const [audience, setAudience] = useState('')
  const [result, setResult] = useState<EngagementResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!niche.trim()) {
      setError('Please enter your niche to generate engagement content.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const data = await generateEngagement({ niche, audience: audience || 'your followers' })
      setResult(data)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <ModuleHeader
        icon={<MessageCircle className="w-6 h-6 text-white" />}
        title="Engagement Assistant"
        description="Build a genuine community with ready-to-use replies, story questions, prompts, and DM starters that feel human."
      />

      {/* Input Form */}
      <div className="glass-card rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-4">
          <InputField
            label="Your Niche"
            placeholder="e.g. Fitness, Finance, Travel..."
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
          />
          <InputField
            label="Target Audience (optional)"
            placeholder="e.g. Beginners, entrepreneurs, parents..."
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          />
        </div>

        {/* Quick niche chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="text-xs text-muted-foreground self-center">Quick select:</span>
          {QUICK_NICHES.map((n) => (
            <button
              key={n}
              onClick={() => setNiche(n)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-150 ${
                niche === n
                  ? 'bg-primary/20 border-primary/40 text-primary font-medium'
                  : 'bg-secondary border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <GradientButton
          onClick={handleGenerate}
          loading={loading}
          icon={<MessageCircle className="w-4 h-4" />}
          className="w-full sm:w-auto"
        >
          Generate Engagement Kit
        </GradientButton>
      </div>

      {/* Organic Engagement Banner */}
      <div className="gradient-border rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">100% Organic Engagement</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Every template here is designed to start genuine conversations — not to spam or automate.
              Real relationships build real audiences. Adapt these to your voice before using.
            </p>
          </div>
        </div>
      </div>

      {loading && <Loader message="Generating your engagement toolkit..." />}

      {!loading && !result && (
        <EmptyState
          icon={<MessageCircle className="w-7 h-7 text-muted-foreground" />}
          title="Your engagement kit will appear here"
          description="Enter your niche and generate ready-to-use comment replies, story questions, prompts, and DM starters."
        />
      )}

      {!loading && result && (
        <div className="animate-fade-in">
          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Comment Replies', count: result.commentReplies.length, color: 'text-primary' },
              { label: 'Story Questions', count: result.storyQuestions.length, color: 'text-accent' },
              { label: 'Engagement Prompts', count: result.engagementPrompts.length, color: 'text-blue-400' },
              { label: 'DM Starters', count: result.dmStarters.length, color: 'text-emerald-400' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card rounded-xl p-4 text-center">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-stagger">
            <SectionCard
              title="Comment Replies"
              items={result.commentReplies}
              badgeColor="pink"
              icon="💬"
            />
            <SectionCard
              title="Story Question Ideas"
              items={result.storyQuestions}
              badgeColor="purple"
              icon="❓"
            />
            <SectionCard
              title="Engagement Prompts"
              items={result.engagementPrompts}
              badgeColor="blue"
              icon="⚡"
            />
            <SectionCard
              title="DM Conversation Starters"
              items={result.dmStarters}
              badgeColor="green"
              icon="✉️"
            />
          </div>

          {/* Usage tips */}
          <div className="mt-4 glass-card rounded-xl p-5">
            <p className="text-sm font-semibold text-foreground mb-3">How to Use These Effectively</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Always personalize templates with the commenter\'s name or specific reference to their message',
                'Respond to comments within the first 60 minutes — this is when the algorithm gives you the biggest boost',
                'Use story questions 3-4x per week to keep your followers thinking and talking about your content',
                'Only use DM starters as genuine outreach, never as mass-messaging — Instagram detects spam patterns',
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                    {i + 1}
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <RegenerateBar onRegenerate={handleGenerate} loading={loading} />
        </div>
      )}
    </div>
  )
}
