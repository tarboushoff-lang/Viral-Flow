'use client'

import { useState } from 'react'
import { generateCaptions, type CaptionResult } from '@/lib/instagrow-ai'
import {
  InputField,
  SelectField,
  TextareaField,
  GradientButton,
  Loader,
  EmptyState,
  RegenerateBar,
  ModuleHeader,
} from './shared'
import { Copy, Check, FileText } from 'lucide-react'

const TONES = [
  { value: 'authentic', label: 'Authentic & Personal' },
  { value: 'fun', label: 'Fun & Witty' },
  { value: 'educational', label: 'Educational & Expert' },
  { value: 'luxury', label: 'Luxury & Aspirational' },
  { value: 'bold', label: 'Bold & Direct' },
]

const GOALS = [
  { value: 'engagement', label: 'Maximize Comments & Saves' },
  { value: 'followers', label: 'Grow Followers' },
  { value: 'sales', label: 'Drive Sales / Leads' },
  { value: 'shares', label: 'Maximize Shares' },
  { value: 'awareness', label: 'Build Brand Awareness' },
]

function CaptionCard({
  caption,
  index,
}: {
  caption: CaptionResult['captions'][0]
  index: number
}) {
  const [copied, setCopied] = useState(false)
  const [copiedSection, setCopiedSection] = useState<string | null>(null)

  const handleCopyFull = () => {
    navigator.clipboard.writeText(caption.full)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopySection = (section: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedSection(section)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  const sections = [
    { key: 'hook', label: 'Hook', text: caption.hook, color: 'text-primary', bg: 'bg-primary/10 border border-primary/20' },
    { key: 'value', label: 'Value', text: caption.value, color: 'text-accent', bg: 'bg-accent/10 border border-accent/20' },
    { key: 'cta', label: 'CTA', text: caption.cta, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border border-emerald-500/20' },
  ]

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-xs font-bold text-white">{index}</span>
          </div>
          <span className="font-semibold text-foreground">Caption Variant {index}</span>
        </div>
        <button
          onClick={handleCopyFull}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
        >
          {copied ? (
            <><Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!</>
          ) : (
            <><Copy className="w-3.5 h-3.5" /> Copy Full</>
          )}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {sections.map((section) => (
          <div key={section.key} className={`rounded-xl p-4 ${section.bg}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${section.color}`}>
                {section.label}
              </span>
              <button
                onClick={() => handleCopySection(section.key, section.text)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                {copiedSection === section.key ? (
                  <><Check className="w-3 h-3 text-emerald-400" /> Done</>
                ) : (
                  <><Copy className="w-3 h-3" /> Copy</>
                )}
              </button>
            </div>
            <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-line">{section.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CaptionGenerator() {
  const [form, setForm] = useState({
    topic: '',
    tone: 'authentic',
    goal: 'engagement',
  })
  const [result, setResult] = useState<CaptionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!form.topic.trim()) {
      setError('Please enter your post topic to generate captions.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const data = await generateCaptions(form)
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
        icon={<FileText className="w-6 h-6 text-white" />}
        title="Caption Generator"
        description="Generate 3 high-converting captions per post, each structured with a hook, value section, and CTA."
      />

      {/* Input Form */}
      <div className="glass-card rounded-2xl p-6 mb-6">
        <div className="flex flex-col gap-5">
          <InputField
            label="Post Topic"
            placeholder="e.g. How to meal prep for the week, My morning routine, The truth about passive income..."
            value={form.topic}
            onChange={(e) => setForm({ ...form, topic: e.target.value })}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <SelectField
              label="Caption Tone"
              options={TONES}
              value={form.tone}
              onChange={(e) => setForm({ ...form, tone: e.target.value })}
            />
            <SelectField
              label="Primary Goal"
              options={GOALS}
              value={form.goal}
              onChange={(e) => setForm({ ...form, goal: e.target.value })}
            />
          </div>
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
            icon={<FileText className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Generate Captions
          </GradientButton>
        </div>
      </div>

      {/* Caption Anatomy */}
      <div className="glass-card rounded-xl p-4 mb-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Caption Anatomy</p>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { label: 'Hook', desc: 'Stop the scroll', color: 'bg-primary/15 text-primary border-primary/20' },
            { label: '+', desc: '', color: 'text-muted-foreground' },
            { label: 'Value', desc: 'Educate / entertain', color: 'bg-accent/15 text-accent border-accent/20' },
            { label: '+', desc: '', color: 'text-muted-foreground' },
            { label: 'CTA', desc: 'Drive action', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
          ].map((item, i) => (
            item.desc ? (
              <div key={i} className={`text-xs px-2.5 py-1 rounded-full border font-medium ${item.color}`}>
                {item.label} <span className="opacity-60 font-normal">— {item.desc}</span>
              </div>
            ) : (
              <span key={i} className={`text-lg font-bold ${item.color}`}>{item.label}</span>
            )
          ))}
        </div>
      </div>

      {loading && <Loader message="Writing your high-converting captions..." />}

      {!loading && !result && (
        <EmptyState
          icon={<FileText className="w-7 h-7 text-muted-foreground" />}
          title="Your captions will appear here"
          description="Enter a topic, choose your tone and goal, then generate 3 fully-structured captions ready to post."
        />
      )}

      {!loading && result && (
        <div className="flex flex-col gap-5 animate-stagger">
          {result.captions.map((caption, i) => (
            <CaptionCard key={i} caption={caption} index={i + 1} />
          ))}
          <RegenerateBar onRegenerate={handleGenerate} loading={loading} />
        </div>
      )}
    </div>
  )
}
