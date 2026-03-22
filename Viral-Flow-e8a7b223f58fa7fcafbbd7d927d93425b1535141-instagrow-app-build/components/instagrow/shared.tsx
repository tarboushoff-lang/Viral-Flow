'use client'

import { useState, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes, type InputHTMLAttributes } from 'react'
import { Copy, Check, RefreshCw, Sparkles, ChevronDown } from 'lucide-react'

// ─── InputField ──────────────────────────────────────────────────────────────

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
}

export function InputField({ label, hint, className = '', ...props }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground/80">{label}</label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <input
        {...props}
        className={`w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/60 transition-all duration-200 text-sm ${className}`}
      />
    </div>
  )
}

// ─── TextareaField ────────────────────────────────────────────────────────────

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  hint?: string
}

export function TextareaField({ label, hint, className = '', ...props }: TextareaFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground/80">{label}</label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <textarea
        {...props}
        className={`w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/60 transition-all duration-200 text-sm resize-none ${className}`}
      />
    </div>
  )
}

// ─── SelectField ─────────────────────────────────────────────────────────────

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  hint?: string
  options: { value: string; label: string }[]
}

export function SelectField({ label, hint, options, className = '', ...props }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground/80">{label}</label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <div className="relative">
        <select
          {...props}
          className={`w-full px-4 py-3 pr-10 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/60 transition-all duration-200 text-sm appearance-none cursor-pointer ${className}`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-card">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  )
}

// ─── GradientButton ──────────────────────────────────────────────────────────

interface GradientButtonProps {
  onClick?: () => void
  loading?: boolean
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  icon?: ReactNode
}

export function GradientButton({
  onClick,
  loading = false,
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
  icon,
}: GradientButtonProps) {
  const base =
    'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer select-none'

  const variants = {
    primary:
      'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
    secondary:
      'bg-secondary border border-border text-foreground hover:border-primary/50 hover:bg-secondary/80 active:scale-[0.99]',
    ghost:
      'text-muted-foreground hover:text-foreground hover:bg-secondary/60 active:scale-[0.99]',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Generating...
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </button>
  )
}

// ─── ResultCard ───────────────────────────────────────────────────────────────

interface ResultCardProps {
  title?: string
  content: string
  badge?: string
  badgeColor?: 'pink' | 'purple' | 'blue' | 'green' | 'orange'
  className?: string
}

const badgeColors = {
  pink: 'bg-primary/15 text-primary border border-primary/20',
  purple: 'bg-accent/15 text-accent border border-accent/20',
  blue: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  green: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
  orange: 'bg-orange-500/15 text-orange-400 border border-orange-500/20',
}

export function ResultCard({ title, content, badge, badgeColor = 'pink', className = '' }: ResultCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={`glass-card rounded-2xl p-5 group hover:border-primary/30 transition-all duration-300 ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {title && <span className="text-sm font-semibold text-foreground">{title}</span>}
          {badge && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeColors[badgeColor]}`}>
              {badge}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-150"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
      <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-line">{content}</p>
    </div>
  )
}

// ─── SectionCard ─────────────────────────────────────────────────────────────

interface SectionCardProps {
  title: string
  items: string[]
  badgeColor?: 'pink' | 'purple' | 'blue' | 'green' | 'orange'
  icon?: string
}

export function SectionCard({ title, items, badgeColor = 'pink', icon }: SectionCardProps) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        {icon && <span className="text-lg">{icon}</span>}
        <h3 className="font-semibold text-foreground">{title}</h3>
        <span
          className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${badgeColors[badgeColor]}`}
        >
          {items.length}
        </span>
      </div>
      <div className="flex flex-col gap-2 animate-stagger">
        {items.map((item, i) => (
          <SectionItem key={i} content={item} badgeColor={badgeColor} index={i + 1} />
        ))}
      </div>
    </div>
  )
}

function SectionItem({
  content,
  badgeColor,
  index,
}: {
  content: string
  badgeColor: string
  index: number
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors duration-150 group">
      <span className={`flex-shrink-0 w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${badgeColors[badgeColor as keyof typeof badgeColors]}`}>
        {index}
      </span>
      <p className="text-sm text-foreground/85 leading-relaxed flex-1">{content}</p>
      <button
        onClick={handleCopy}
        className="flex-shrink-0 p-1 rounded text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all"
        title="Copy"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  )
}

// ─── Loader ───────────────────────────────────────────────────────────────────

export function Loader({ message = 'Generating your results...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-2 border-border" />
        <div className="absolute inset-0 w-14 h-14 rounded-full border-2 border-transparent border-t-primary animate-spin" />
        <div className="absolute inset-2 w-10 h-10 rounded-full border-2 border-transparent border-t-accent animate-spin [animation-direction:reverse] [animation-duration:0.8s]" />
        <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-primary" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">{message}</p>
        <p className="text-xs text-muted-foreground mt-1">Powered by AI magic</p>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

export function EmptyState({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-secondary/80 border border-border flex items-center justify-center text-2xl">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">{description}</p>
      </div>
    </div>
  )
}

// ─── RegenerateBar ────────────────────────────────────────────────────────────

export function RegenerateBar({ onRegenerate, loading }: { onRegenerate: () => void; loading: boolean }) {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
      <p className="text-xs text-muted-foreground">Not happy with the results?</p>
      <GradientButton variant="secondary" onClick={onRegenerate} loading={loading} icon={<RefreshCw className="w-3.5 h-3.5" />}>
        Regenerate
      </GradientButton>
    </div>
  )
}

// ─── ModuleHeader ─────────────────────────────────────────────────────────────

export function ModuleHeader({ icon, title, description, badge }: { icon: ReactNode; title: string; description: string; badge?: string }) {
  return (
    <div className="mb-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 glow-pink"
             style={{ background: 'linear-gradient(135deg, oklch(0.62 0.28 330), oklch(0.55 0.25 300))' }}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl font-bold gradient-text">{title}</h2>
            {badge && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/20 font-medium">
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  )
}
