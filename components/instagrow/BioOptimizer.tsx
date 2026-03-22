'use client'

import { useState } from 'react'
import { generateBios, type BioResult } from '@/lib/instagrow-ai'
import {
  InputField,
  TextareaField,
  GradientButton,
  SectionCard,
  Loader,
  EmptyState,
  RegenerateBar,
  ModuleHeader,
} from './shared'
import { User, Copy, Check } from 'lucide-react'

function BioCard({ bio, index }: { bio: BioResult['bios'][0]; index: number }) {
  const [copied, setCopied] = useState(false)

  return (
    <div className="glass-card rounded-2xl p-6 hover:border-primary/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-xs font-bold text-white">{index}</span>
          </div>
          <div>
            <span className="font-semibold text-foreground text-sm">Bio Option {index}</span>
            <p className="text-xs text-muted-foreground mt-0.5">{bio.positioning}</p>
          </div>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(`${bio.bio}\n\n${bio.cta}`)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
        >
          {copied ? (
            <><Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!</>
          ) : (
            <><Copy className="w-3.5 h-3.5" /> Copy</>
          )}
        </button>
      </div>

      {/* Bio preview — looks like Instagram */}
      <div className="bg-secondary/60 rounded-xl p-4 mb-4 border border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">your_handle</p>
            <p className="text-xs text-muted-foreground">Personal Brand</p>
          </div>
        </div>
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line font-[system-ui]">
          {bio.bio}
        </p>
        <p className="text-xs text-blue-400 mt-2">{bio.cta}</p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">CTA:</span>
        <span className="text-xs text-foreground/80 italic">"{bio.cta}"</span>
      </div>
    </div>
  )
}

export default function BioOptimizer() {
  const [form, setForm] = useState({
    whatYouDo: '',
    targetAudience: '',
    offer: '',
  })
  const [result, setResult] = useState<BioResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!form.whatYouDo.trim() || !form.targetAudience.trim()) {
      setError('Please fill in what you do and your target audience.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const data = await generateBios(form)
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
        icon={<User className="w-6 h-6 text-white" />}
        title="Bio Optimizer"
        description="Your Instagram bio is your 3-second pitch. Get 3 high-converting bio options that clearly communicate your value."
      />

      {/* Input Form */}
      <div className="glass-card rounded-2xl p-6 mb-6">
        <div className="flex flex-col gap-5">
          <TextareaField
            label="What you do"
            placeholder="e.g. help entrepreneurs build online businesses, teach people how to invest in index funds, share home workouts for busy moms..."
            value={form.whatYouDo}
            onChange={(e) => setForm({ ...form, whatYouDo: e.target.value })}
            rows={2}
          />
          <InputField
            label="Target Audience"
            placeholder="e.g. Beginner investors aged 25-40, busy working moms, aspiring entrepreneurs..."
            value={form.targetAudience}
            onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
          />
          <InputField
            label="Your Offer or CTA (optional)"
            placeholder="e.g. Free investing guide, Free workout plan, Free 30-min strategy call..."
            value={form.offer}
            onChange={(e) => setForm({ ...form, offer: e.target.value })}
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
            icon={<User className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Optimize My Bio
          </GradientButton>
        </div>
      </div>

      {/* Formula reminder */}
      <div className="gradient-border rounded-xl p-4 mb-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">The Perfect Bio Formula</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { step: '1', label: 'Who you help', color: 'text-primary' },
            { step: '2', label: 'What result you deliver', color: 'text-accent' },
            { step: '3', label: 'Your proof / differentiator', color: 'text-blue-400' },
            { step: '4', label: 'Clear CTA', color: 'text-emerald-400' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <p className={`text-lg font-bold ${item.color}`}>{item.step}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {loading && <Loader message="Crafting your optimized bios..." />}

      {!loading && !result && (
        <EmptyState
          icon={<User className="w-7 h-7 text-muted-foreground" />}
          title="Your bio options will appear here"
          description="Fill in the fields above and generate 3 high-converting Instagram bios instantly."
        />
      )}

      {!loading && result && (
        <div className="animate-fade-in">
          <div className="flex flex-col gap-5 animate-stagger">
            {result.bios.map((bio, i) => (
              <BioCard key={i} bio={bio} index={i + 1} />
            ))}
          </div>

          <div className="mt-5">
            <SectionCard
              title="Bio Optimization Tips"
              items={result.tips}
              badgeColor="purple"
              icon="→"
            />
          </div>

          <RegenerateBar onRegenerate={handleGenerate} loading={loading} />
        </div>
      )}
    </div>
  )
}
