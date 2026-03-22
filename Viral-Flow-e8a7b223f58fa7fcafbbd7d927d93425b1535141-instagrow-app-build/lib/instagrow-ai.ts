// ─────────────────────────────────────────────────────────────────────────────
// ViralFlow AI Service Layer
// Smart mock data that adapts to user input.
// Structure is designed so you can swap generateWith() for a real API call
// (OpenAI, Anthropic, etc.) with minimal changes.
// ─────────────────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

// Simulate network latency
const AI_DELAY = () => delay(1400 + Math.random() * 800)

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuditResult {
  score: number
  strengths: string[]
  weaknesses: string[]
  contentGaps: string[]
  bioSuggestions: string[]
  positioningAdvice: string[]
  quickWins: string[]
}

// HookResult is defined below in the Hook Generator section with typed Hook[]

export interface CaptionResult {
  captions: {
    hook: string
    value: string
    cta: string
    full: string
  }[]
}

export interface ContentPlanDay {
  day: string
  date: string
  type: 'Reel' | 'Carousel' | 'Story' | 'Static'
  idea: string
  goal: string
  hook: string
  hashtags: string[]
}

export interface ContentPlanResult {
  week: ContentPlanDay[]
  month: ContentPlanDay[]
  strategy: string[]
}

export interface BioResult {
  bios: {
    bio: string
    positioning: string
    cta: string
  }[]
  tips: string[]
}

export interface EngagementResult {
  commentReplies: string[]
  storyQuestions: string[]
  engagementPrompts: string[]
  dmStarters: string[]
}

// ─── Niche-aware phrase banks ─────────────────────────────────────────────────

function nicheAdjective(niche: string): string {
  const map: Record<string, string> = {
    fitness: 'shredded',
    food: 'mouth-watering',
    fashion: 'iconic',
    travel: 'wanderlust-worthy',
    business: 'profitable',
    tech: 'cutting-edge',
    beauty: 'glow-up',
    finance: 'wealth-building',
    wellness: 'life-changing',
    education: 'mind-blowing',
    photography: 'frame-worthy',
    parenting: 'game-changing',
    cooking: 'restaurant-quality',
    music: 'chart-topping',
    art: 'museum-worthy',
  }
  const lower = niche.toLowerCase()
  for (const [key, val] of Object.entries(map)) {
    if (lower.includes(key)) return val
  }
  return 'jaw-dropping'
}

function nichePain(niche: string): string {
  const map: Record<string, string> = {
    fitness: 'struggling to see results no matter how hard you train',
    food: 'spending hours cooking meals that taste mediocre',
    fashion: 'wasting money on clothes that don\'t actually look good on you',
    travel: 'paying way too much for experiences you could get for free',
    business: 'working 60 hours a week and still not hitting your income goals',
    tech: 'wasting time on tools that promise the world but deliver nothing',
    beauty: 'spending a fortune on skincare that isn\'t working',
    finance: 'living paycheck to paycheck despite earning decent money',
    wellness: 'feeling exhausted and burnt out every single day',
    education: 'spending years in school without gaining real-world skills',
  }
  const lower = niche.toLowerCase()
  for (const [key, val] of Object.entries(map)) {
    if (lower.includes(key)) return val
  }
  return 'doing everything right but still not getting the results you want'
}

function nicheResult(niche: string): string {
  const map: Record<string, string> = {
    fitness: 'built a lean, muscular body you\'re proud to show off',
    food: 'cooked restaurant-quality meals at home every night',
    fashion: 'put together outfits that turn heads everywhere you go',
    travel: 'traveled to 10 countries on a budget most people spend on rent',
    business: 'scaled to $10k months without working themselves into the ground',
    tech: 'automated 80% of their workflow and gotten back 20+ hours per week',
    beauty: 'achieved genuinely glowing skin without the expensive products',
    finance: 'saved $20k in a year while still living their best life',
    wellness: 'gone from burnt out to genuinely thriving in 90 days',
    education: 'landed their dream job without a traditional degree',
  }
  const lower = niche.toLowerCase()
  for (const [key, val] of Object.entries(map)) {
    if (lower.includes(key)) return val
  }
  return 'achieved massive results in record time'
}

// ─── Account Audit ────────────────────────────────────────────────────────────

export async function generateAudit(input: {
  niche: string
  targetAudience: string
  followers: string
  contentType: string
}): Promise<AuditResult> {
  await AI_DELAY()
  const { niche, targetAudience, followers, contentType } = input
  const followersNum = parseInt(followers.replace(/,/g, '')) || 0
  const score = Math.min(85, Math.max(35, 40 + Math.floor(Math.random() * 35)))

  return {
    score,
    strengths: [
      `You've identified a clear niche (${niche}) which makes you easier to discover through hashtags and the Explore page`,
      `Targeting ${targetAudience} is smart — this audience actively engages with ${niche} content and has strong purchasing intent`,
      followersNum > 1000
        ? `With ${followers} followers you already have social proof — focus on nurturing this community rather than chasing vanity metrics`
        : `Starting under 1k is the perfect time to build habits and test content without the pressure of a large audience`,
      `Using ${contentType} aligns well with how the Instagram algorithm currently rewards content in the ${niche} space`,
    ],
    weaknesses: [
      `Most ${niche} accounts post content that looks the same — without a strong visual identity, you blend in instead of standing out`,
      `Your content likely lacks a consistent "signature format" that makes followers know a post is yours before seeing your name`,
      `You may be posting without a clear conversion strategy — every post should move followers toward a specific action`,
      `Engagement rate is probably below average because content doesn't ask questions or spark discussion in a meaningful way`,
    ],
    contentGaps: [
      `Behind-the-scenes content — ${targetAudience} wants to see the human behind the account, not just polished outputs`,
      `"Before & After" transformation content is massively underused in ${niche} and drives enormous saves`,
      `Controversial opinions / hot takes — take a clear stance on something in your niche to create discussion and shares`,
      `Collaboration content with other ${niche} creators to tap into their audiences organically`,
      `Educational mini-series that positions you as the definitive expert on one specific topic`,
    ],
    bioSuggestions: [
      `Lead with the outcome you deliver, not your job title — say what ${targetAudience} will get, not what you do`,
      `Add a specific number or credibility marker (e.g., "helped 500+ people", "featured in X") to build instant trust`,
      `Your CTA should offer immediate value — a free resource or quick win performs 3x better than "DM me for info"`,
      `Use line breaks strategically — the eye naturally stops at white space, so put your most important line on its own line`,
    ],
    positioningAdvice: [
      `Own a specific micro-niche within ${niche} — the more specific you go, the faster you grow because you become THE person for that topic`,
      `Create a signature framework or method (give it a unique name) that makes your approach sound proprietary`,
      `Position yourself as the "anti-${niche}-guru" — call out what others in your space get wrong to instantly differentiate`,
      `Your content should consistently answer one question for ${targetAudience}: "How do I ${nicheResult(niche)}?"`,
    ],
    quickWins: [
      `Post your next Reel using this structure: hook (problem) → twist (unexpected angle) → payoff (result) — this format gets shared`,
      `Add a question to your next 5 captions and watch your comments double — the algorithm rewards comment velocity`,
      `Update your bio today to lead with the #1 outcome you deliver for ${targetAudience}`,
      `Engage with 10 accounts in your niche every day for 7 days — genuine comments on others' posts drive profile visits`,
    ],
  }
}

// ─── Hook Generator ───────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pick<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n)
}

// Formula labels exposed on each hook
export type HookFormula =
  | 'curiosity-gap'
  | 'pain-point'
  | 'contrarian'
  | 'authority'
  | 'relatable'
  | 'cta'

// Style filter — maps to the 3 tab filters in the UI
export type HookStyle = 'aggressive' | 'story' | 'educational'

export interface Hook {
  text: string
  formula: HookFormula
  style: HookStyle
  score: number          // Virality score 0–100
  scoreBreakdown: {
    curiosity: number
    emotion: number
    clarity: number
    specificity: number
  }
  whyItWorks?: string    // Only set on the Best Performer hook
  isBest?: boolean
}

export interface HookResult {
  viralHooks: Hook[]
  emotionalHooks: Hook[]
  curiosityHooks: Hook[]
  ctaEndings: Hook[]
}

// ── Scoring helpers ────────────────────────────────────────────────────────────

// Base scores per formula (curiosity, emotion, clarity, specificity)
const FORMULA_SCORES: Record<HookFormula, [number, number, number, number]> = {
  'curiosity-gap': [88, 55, 72, 65],
  'pain-point':    [62, 85, 80, 78],
  'contrarian':    [75, 65, 70, 60],
  'authority':     [58, 55, 85, 90],
  'relatable':     [55, 90, 78, 65],
  'cta':           [40, 45, 90, 70],
}

// Style of each formula
const FORMULA_STYLE: Record<HookFormula, HookStyle> = {
  'curiosity-gap': 'educational',
  'pain-point':    'aggressive',
  'contrarian':    'aggressive',
  'authority':     'educational',
  'relatable':     'story',
  'cta':           'story',
}

function computeScore(formula: HookFormula, text: string): Hook['scoreBreakdown'] & { total: number } {
  const [c, e, cl, sp] = FORMULA_SCORES[formula]
  // Add small jitter so every hook feels unique (+/-8)
  const jitter = () => Math.floor(Math.random() * 16) - 8
  // Bonus if niche word appears in hook (more specific)
  const nicheBonus = text.split(' ').length <= 10 ? 4 : 0
  const curiosity    = Math.min(99, Math.max(40, c  + jitter()))
  const emotion      = Math.min(99, Math.max(40, e  + jitter()))
  const clarity      = Math.min(99, Math.max(40, cl + jitter()))
  const specificity  = Math.min(99, Math.max(40, sp + jitter() + nicheBonus))
  const total = Math.round((curiosity + emotion + clarity + specificity) / 4)
  return { curiosity, emotion, clarity, specificity, total }
}

// Why-it-works explanations per formula
const WHY_IT_WORKS: Record<HookFormula, string[]> = {
  'curiosity-gap': [
    'Opens an information gap the brain physically needs to close — viewers can\'t scroll past an unanswered question.',
    'Creates instant pattern interruption. The brain treats missing information as a threat and demands resolution.',
    'Exploits the Zeigarnik effect — unfinished loops stay in working memory, forcing viewers to finish the video.',
  ],
  'pain-point': [
    'Speaks directly to an active frustration. When someone recognizes their own pain in 3 words, they stop scrolling.',
    'Triggers the threat-detection system. Pain-based hooks create urgency because the brain prioritizes problems over opportunities.',
    'Calls out behavior, not the person — the reader feels seen without feeling attacked, creating safe engagement.',
  ],
  'contrarian': [
    'Violates a prediction. The brain expects consensus; a disagreement creates cognitive dissonance that demands resolution.',
    'Signals unique insight. If everyone says X and you say Y, viewers assume you know something they don\'t.',
    'Drives shares: people love showing others "you\'re doing this wrong" — it makes the sharer look smart.',
  ],
  'authority': [
    'Numbers activate the analytical brain. Specific data points ("100 posts", "1,000 hours") signal credibility instantly.',
    'Social proof baked into the hook — the viewer borrows your authority and trusts the content before watching.',
    'Sets a high bar for the payoff, making viewers feel the content is worth their time before they invest it.',
  ],
  'relatable': [
    'Mirror neurons fire when we see ourselves in a story. Viewers feel the creator is talking specifically to them.',
    'Vulnerability disarms defenses — when a creator admits struggle, the audience lowers their skepticism completely.',
    'POV format puts the viewer in the protagonist role, which creates the strongest emotional investment of any hook type.',
  ],
  'cta': [
    'Action-first framing removes decision fatigue. Telling someone exactly what to do next drives 3x more conversions.',
    'Creates urgency and loss aversion ("before the algorithm buries it") — scarcity triggers immediate action.',
    'Benefit-led CTAs outperform generic ones because the viewer can picture the value before they take the action.',
  ],
}

function pickWhyItWorks(formula: HookFormula): string {
  const pool = WHY_IT_WORKS[formula]
  return pool[Math.floor(Math.random() * pool.length)]
}

export async function generateHooks(input: {
  niche: string
  goal: string
  tone: string
}): Promise<HookResult> {
  await AI_DELAY()
  const { niche, goal, tone } = input
  const n = niche.trim() || 'your niche'
  const pain = nichePain(niche)
  const adj = nicheAdjective(niche)

  // Short pain word for ≤12-word hooks
  const painShort: Record<string, string> = {
    fitness:   'stuck with zero results',
    food:      'cooking mediocre meals',
    fashion:   'wasting money on clothes',
    travel:    'overpaying for every trip',
    business:  'overworked and underpaid',
    tech:      'wasting time on bad tools',
    beauty:    'spending on skincare that fails',
    finance:   'living paycheck to paycheck',
    wellness:  'burnt out every single day',
    education: 'drowning in theory, zero skills',
    photography:'taking photos nobody looks at',
    parenting: 'exhausted and second-guessing everything',
    cooking:   'cooking the same 5 meals on repeat',
    music:     'making music nobody hears',
    art:       'creating art that never sells',
  }
  const painWord = (() => {
    const lower = n.toLowerCase()
    for (const [key, val] of Object.entries(painShort)) {
      if (lower.includes(key)) return val
    }
    return 'struggling and not seeing results'
  })()

  // Authority openers vary by tone
  const authorityOpener: Record<string, string> = {
    fun:         `After testing 50+ ${n} posts:`,
    luxury:      `After studying the top 1% in ${n}:`,
    educational: `After analyzing 100+ ${n} accounts:`,
    bold:        `I've tested every ${n} strategy. Here's the truth:`,
    authentic:   `3 years in ${n} taught me this:`,
  }
  const authOpen = authorityOpener[tone] ?? authorityOpener.educational

  // Contrarian openers
  const contraryOpener: Record<string, string> = {
    fun:         `Okay but hear me out —`,
    luxury:      `Stop. You're approaching ${n} wrong.`,
    educational: `The conventional ${n} advice is broken.`,
    bold:        `Everything you know about ${n} is wrong.`,
    authentic:   `Honest opinion:`,
  }
  const contrOpen = contraryOpener[tone] ?? contraryOpener.educational

  // ── VIRAL HOOKS — 10 picked from 42 ────────────────────────────────────
  // Rules: loss/pain, conflict, failure framing, "this should be illegal" tension
  // Max 9 words. No safe language. Every line must stop a scroll.
  const viralRaw: [string, HookFormula][] = shuffle([
    // Loss & pain — wallet/time/results bleeding out right now
    [`You're losing ${n} growth every day you do this.`,              'pain-point'],
    [`This ${n} mistake is costing you daily. Stop it.`,              'pain-point'],
    [`Every day you ignore this, your ${n} falls behind.`,            'pain-point'],
    [`You're bleeding ${n} results and don't even know it.`,          'pain-point'],
    [`This ${n} habit is quietly destroying your growth.`,            'pain-point'],
    [`Your ${n} is leaking money. Here's exactly where.`,             'pain-point'],
    // Conflict — direct confrontation, no softening
    [`Everything you're doing in ${n} is wrong. Proof:`,              'contrarian'],
    [`Stop doing this in ${n}. Right now. I mean it.`,                'contrarian'],
    [`Your entire ${n} strategy needs to be thrown out.`,             'contrarian'],
    [`The ${n} playbook everyone follows is broken.`,                 'contrarian'],
    [`Most ${n} advice will keep you stuck. Here's why.`,             'contrarian'],
    [`Unpopular: the "right way" to do ${n} doesn't work.`,           'contrarian'],
    // Failure framing — credibility through honest failure
    [`I failed at ${n} for 18 months before I saw this.`,             'authority'],
    [`Most people never figure this out in ${n}. I did.`,             'authority'],
    [`I tried every ${n} strategy. Only one wasn't a waste.`,         'authority'],
    [`${n} broke me. Then I found the one thing that didn't.`,        'relatable'],
    [`I wasted $3k on ${n} before learning this for free.`,           'authority'],
    [`Every ${n} "guru" failed to mention this one thing.`,           'contrarian'],
    // "This should be illegal" — forbidden knowledge tension
    [`This ${n} trick should be illegal. It's that effective.`,       'curiosity-gap'],
    [`Nobody explains ${n} clearly. I'm about to.`,                   'curiosity-gap'],
    [`The ${n} secret top creators refuse to share publicly.`,        'curiosity-gap'],
    [`What the ${n} industry does not want you to understand.`,       'curiosity-gap'],
    [`This ${n} method is controversial. It works anyway.`,           'curiosity-gap'],
    [`The forbidden ${n} strategy that actually delivers.`,           'curiosity-gap'],
    // Urgency + stakes
    [`If your ${n} isn't growing, this is exactly why.`,              'pain-point'],
    [`Stop wasting time on ${n}. Do this instead.`,                   'contrarian'],
    [`You are one ${n} shift away from completely different results.`, 'relatable'],
    [`The window for easy ${n} growth is closing. Do this now.`,      'pain-point'],
    // Transformation — before/after tension
    [`This single ${n} change made everything else irrelevant.`,      'relatable'],
    [`One decision in ${n} erased 2 years of struggle.`,              'relatable'],
    [`I went from ${painWord} to results in 21 days. Here's how.`,    'relatable'],
    [`Before and after I learned this ${n} truth. Unreal.`,           'relatable'],
    // Authority — hard numbers + pattern recognition
    [`I studied 300 ${n} accounts. The same pattern every time.`,     'authority'],
    [`After 1,000 hours in ${n}: the only thing that matters.`,       'authority'],
    [`I tested 50 ${n} strategies. One dominated everything else.`,   'authority'],
    [`The data on ${n} is brutal. Most people won't like this.`,      'authority'],
    // Short punchers — pure pattern interrupt
    [`${n} is rigged. Unless you know this.`,                         'curiosity-gap'],
    [`The ${adj} ${n} truth nobody posts about.`,                     'curiosity-gap'],
    [`Your ${n} isn't broken. Your strategy is.`,                     'pain-point'],
    [`Do not post another ${n} piece without watching this.`,         'contrarian'],
    [`The ${n} mistake everyone makes and nobody admits.`,            'contrarian'],
    [`I almost quit ${n}. Then I found what was actually wrong.`,     'relatable'],
  ])

  const viralPicked = pick(viralRaw, 10)
  // Score all, sort descending so best is index 0
  const scoredViral = viralPicked
    .map(([text, formula]) => {
      const { total, ...breakdown } = computeScore(formula, text)
      return { text, formula, score: total, scoreBreakdown: breakdown }
    })
    .sort((a, b) => b.score - a.score)

  const viralHooks: Hook[] = scoredViral.map((v, i) => ({
    ...v,
    style: FORMULA_STYLE[v.formula],
    isBest: i === 0,
    whyItWorks: i === 0 ? pickWhyItWorks(v.formula) : undefined,
  }))

  // ── EMOTIONAL HOOKS — 5 picked from 24 ──────────────────────────────────
  // Raw frustration + public failure + deep "you are seen" triggers
  const emotionalRaw: [string, HookFormula][] = shuffle([
    [`${n} made me feel like a fraud for 2 years straight.`,          'pain-point'],
    [`I was ${painWord}. I was also doing everything "right."`,        'pain-point'],
    [`Posting ${n} content nobody sees is a specific kind of hell.`,  'pain-point'],
    [`The ${n} failure I was too ashamed to post about. Here it is.`, 'relatable'],
    [`I deleted my entire ${n} account once. Best decision I made.`,  'relatable'],
    [`${n} was destroying my confidence before I found this.`,        'pain-point'],
    [`Nobody told me how embarrassing early ${n} would feel.`,        'pain-point'],
    [`I cried over ${n} metrics. I am not joking. Then I fixed it.`,  'relatable'],
    [`The ${n} rock bottom I never talk about — until right now.`,     'relatable'],
    [`If you're ${painWord} in ${n}, you're not weak. You're stuck.`, 'pain-point'],
    [`${n} is not supposed to feel this painful. Here's what's wrong.`, 'pain-point'],
    [`To the ${n} creator working in silence: I see you. Keep going.`, 'relatable'],
    [`I was one week from quitting ${n} entirely. This stopped me.`,  'relatable'],
    [`The ${n} moment that broke me was also the one that built me.`,  'relatable'],
    [`${n} humiliated me publicly. Here's what I learned from it.`,   'relatable'],
    [`I wasted 2 years on the wrong ${n} strategy. Here's the cost.`, 'pain-point'],
    [`Struggling with ${n}? It is not a talent problem. Watch this.`, 'pain-point'],
    [`Nobody claps when you start ${n}. They clap after. Stay.`,       'relatable'],
    [`The ${n} truth I wish someone had screamed at me earlier.`,     'pain-point'],
    [`You do not need more ${n} motivation. You need this one shift.`, 'contrarian'],
    [`${n} broke my confidence before it built my results.`,          'relatable'],
    [`I stopped pretending ${n} was easy. Everything changed that day.`, 'relatable'],
    [`Real ${n} growth is ugly before it's impressive. Here's proof.`, 'relatable'],
    [`If ${n} feels impossible right now — you are one step away.`,    'relatable'],
  ])

  const emotionalHooks: Hook[] = pick(emotionalRaw, 5).map(([text, formula]) => {
    const { total, ...breakdown } = computeScore(formula, text)
    return { text, formula, score: total, scoreBreakdown: breakdown, style: FORMULA_STYLE[formula] }
  })

  // ── CURIOSITY HOOKS — 5 picked from 24 ──────────────────────────────────
  // Forbidden knowledge + open loops + pattern-breaking — brain demands resolution
  const curiosityRaw: [string, HookFormula][] = shuffle([
    [`This ${n} method is technically not allowed. It works.`,        'curiosity-gap'],
    [`I found a ${n} shortcut by accident. It should not work. It does.`, 'curiosity-gap'],
    [`The ${n} trick top creators quietly use and never teach.`,      'curiosity-gap'],
    [`Nobody explains this ${n} clearly. That is intentional.`,       'curiosity-gap'],
    [`What really happens inside a viral ${n} account. Unsettling.`,  'curiosity-gap'],
    [`The ${n} thing I removed that doubled everything overnight.`,    'curiosity-gap'],
    [`Your ${n} competitors know something you don't. I'll show you.`, 'curiosity-gap'],
    [`This ${n} post got suppressed. Which told me it was working.`,  'curiosity-gap'],
    [`The ${n} phase nobody warns you is coming. You are in it now.`, 'curiosity-gap'],
    [`What happens when you completely ignore ${n} best practices?`,   'curiosity-gap'],
    [`The ${n} pattern inside every account that blows up fast.`,     'authority'],
    [`I asked 50 top ${n} creators their secret. Same answer every time.`, 'authority'],
    [`There is a ${n} detail separating 1k from 500k. Most miss it.`, 'authority'],
    [`The ${n} question nobody dares to ask in public. I will.`,      'curiosity-gap'],
    [`What the ${n} algorithm actually rewards. Not what you think.`, 'curiosity-gap'],
    [`I broke every ${n} rule for 30 days. Here is what happened.`,   'contrarian'],
    [`The ${n} loophole that is hiding in plain sight. Seriously.`,   'curiosity-gap'],
    [`Why accounts with bad ${n} content still go viral. I know why.`, 'curiosity-gap'],
    [`This ${n} data point will make you rethink everything. Instantly.`, 'authority'],
    [`Something strange happens when you post ${n} content at this time.`, 'curiosity-gap'],
    [`The ${adj} ${n} variable nobody tracks but everyone needs.`,    'authority'],
    [`Your ${n} growth stopped for a specific reason. I found it.`,   'pain-point'],
    [`The invisible ${n} ceiling most creators never break through.`, 'curiosity-gap'],
    [`What the top ${n} creators delete before they post. Fascinating.`, 'curiosity-gap'],
  ])

  const curiosityHooks: Hook[] = pick(curiosityRaw, 5).map(([text, formula]) => {
    const { total, ...breakdown } = computeScore(formula, text)
    return { text, formula, score: total, scoreBreakdown: breakdown, style: FORMULA_STYLE[formula] }
  })

  // ── CTA ENDINGS — 3 picked from goal-specific pool ───────────────────────
  const ctaByGoal: Record<string, string[]> = {
    followers: [
      `Follow. I post ${n} content nobody else will.`,
      `Follow now. Tomorrow's post is better than this one.`,
      `If this helped — follow. More like this every week.`,
      `Don't lose this account. Follow before you scroll away.`,
      `Hit follow. One post here could change your entire ${n} approach.`,
    ],
    engagement: [
      `Save this. You will need it — I promise.`,
      `Comment your #1 ${n} struggle. I read every single one.`,
      `Drop "yes" if this hit. I'll make a part 2.`,
      `Share this to someone who's ${painWord}. They need it today.`,
      `Save this post. Screenshot it. Come back when you're stuck.`,
    ],
    sales: [
      `DM me "${n.toUpperCase()}" right now. I'll send you the full system.`,
      `Comment "IN" if you're ready to actually fix your ${n}.`,
      `Link in bio. Your ${n} results start there. Not tomorrow. Now.`,
      `DM me "DONE" if you're tired of guessing at ${n}.`,
      `The next step is in my bio. It changes ${n} results fast.`,
    ],
    awareness: [
      `Send this to one person who's stuck with ${n}. Do it now.`,
      `Save before the algorithm buries it. This took years to learn.`,
      `Tag someone who needs to stop making this ${n} mistake.`,
      `Share this. You'll look like the smartest person they follow.`,
      `Forward this to your ${n} group chat. They'll thank you.`,
    ],
  }

  const ctaPool = ctaByGoal[goal] ?? ctaByGoal.engagement
  const ctaEndings: Hook[] = pick(ctaPool, 3).map((text) => {
    const formula: HookFormula = 'cta'
    const { total, ...breakdown } = computeScore(formula, text)
    return { text, formula, score: total, scoreBreakdown: breakdown, style: FORMULA_STYLE[formula] }
  })

  return { viralHooks, emotionalHooks, curiosityHooks, ctaEndings }
}

// ─── Caption Generator ────────────────────────────────────────────────────────

export async function generateCaptions(input: {
  topic: string
  tone: string
  goal: string
}): Promise<CaptionResult> {
  await AI_DELAY()
  const { topic, tone, goal } = input

  const toneAdverb = tone === 'fun' ? 'honestly' : tone === 'luxury' ? 'truthfully' : 'frankly'

  const captions = [
    {
      hook: `${tone === 'fun' ? 'Nobody talks about this but' : tone === 'luxury' ? 'The truth is' : 'Here\'s the thing'} — ${topic} is the one thing that separates people who get results from people who don't.`,
      value: `Most people approach ${topic} completely backwards. They focus on the wrong metrics, consume the wrong information, and wonder why they're stuck.\n\nHere's what actually works:\n→ Start with your end goal and work backwards\n→ Focus on consistency over intensity\n→ Track progress, not perfection\n→ Find a method that fits your life, not someone else's highlight reel\n\nThe people who ${toneAdverb} win with ${topic} aren't the ones with the best resources. They're the ones who show up when it's inconvenient.`,
      cta: `${goal === 'followers' ? 'Follow if this hit different. More coming.' : goal === 'sales' ? 'DM me "READY" if you want the full breakdown.' : 'Save this and come back to it when you need a reminder.'}\n\n${topic.split(' ').slice(0, 3).map(w => `#${w.replace(/[^a-z0-9]/gi, '')}`).filter(Boolean).join(' ')} #growthmindset #realtalk`,
      full: '',
    },
    {
      hook: `I'm going to be real with you about ${topic}.`,
      value: `Last year I was doing everything "right" and still getting nowhere.\n\nThen I made one shift and everything changed.\n\nI stopped trying to be everything to everyone and started going deep on what actually worked for ME.\n\nWith ${topic}, there's no one-size-fits-all. The sooner you accept that, the faster you progress.\n\nHere's my non-negotiable framework:\n1. Define what success looks like for you specifically\n2. Find 1-3 proven methods (not 10 mediocre ones)\n3. Execute for 90 days before judging results\n4. Iterate based on data, not emotion\n\nSimple. Not easy. But it works.`,
      cta: `${goal === 'engagement' ? 'Drop a "1" in the comments if this is your approach too.' : goal === 'sales' ? 'Link in bio if you want me to help you build this system.' : 'Share this with someone who needs to hear it.'}\n\n#${topic.split(' ')[0]?.replace(/[^a-z0-9]/gi, '') || 'growth'} #strategy #mindset`,
      full: '',
    },
    {
      hook: `Hot take: most ${topic} content is making you worse, not better.`,
      value: `Controversial, I know. But hear me out.\n\nWhen you consume content about ${topic} all day without implementing anything, you get:\n✗ Analysis paralysis\n✗ Constant comparison\n✗ Zero real progress\n✗ The feeling of learning without the results of doing\n\nThe fix is almost embarrassingly simple:\n\nPick one thing. Do it for 30 days. Only THEN look for the next thing.\n\nThis is how every person I know who has genuinely succeeded with ${topic} operates. Not by knowing more. By doing more with less.`,
      cta: `${goal === 'followers' ? 'Follow for more takes that challenge the mainstream. I post daily.' : goal === 'engagement' ? 'Agree or disagree? Let me know below — I read every comment.' : 'Save this and share it with someone stuck in the same loop.'}\n\n#${topic.split(' ')[0]?.replace(/[^a-z0-9]/gi, '') || 'success'} #hottake #realgrowth`,
      full: '',
    },
  ]

  return {
    captions: captions.map((c) => ({
      ...c,
      full: `${c.hook}\n\n${c.value}\n\n${c.cta}`,
    })),
  }
}

// ─── Content Planner ──────────────────────────────────────────────────────────

const POST_TYPES: ContentPlanDay['type'][] = ['Reel', 'Carousel', 'Story', 'Static']

function dayName(i: number): string {
  return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][i % 7]
}

function generateContentDay(niche: string, dayIndex: number, freq: number): ContentPlanDay {
  const typeRotation: ContentPlanDay['type'][] = ['Reel', 'Carousel', 'Story', 'Reel', 'Static', 'Carousel', 'Reel']
  const type = typeRotation[dayIndex % typeRotation.length]
  const goals = ['Build Trust', 'Drive Engagement', 'Grow Reach', 'Generate Saves', 'Convert Followers', 'Build Community', 'Educate & Inspire']
  const ideas = [
    `"The biggest mistake most people make with ${niche}" — call out the #1 mistake with a clear solution`,
    `Day-in-the-life showing your real ${niche} routine — authentic, unfiltered, relatable`,
    `"${nicheAdjective(niche)} ${niche} results in 30 days" — before/after or transformation story`,
    `Step-by-step tutorial: your proven method for the most common ${niche} challenge`,
    `Hot take carousel: "Unpopular opinions about ${niche} that actually build better results"`,
    `Tools/resources I use daily for ${niche} — listicle Reel with genuine recommendations`,
    `Q&A Story: answer the top 5 questions your audience asks about ${niche}`,
    `Myth-busting carousel: "5 ${niche} myths that are holding you back"`,
    `Story poll: What's your biggest ${niche} challenge right now? (Use for content research)`,
    `"What I know now that I wish I knew when I started ${niche}"`,
    `Behind-the-scenes: show how you prepare, create, or deliver in the ${niche} space`,
    `Collab concept: react to a trending ${niche} topic in your own unique angle`,
    `Social proof reel: results or testimonials from people who used your approach`,
    `"The uncomfortable truth about ${niche} that nobody talks about"`,
    `Trending audio + ${niche} content: use a trending sound to show your niche transformation`,
  ]
  const hooks = [
    `Nobody warned me that ${niche} would require this first...`,
    `POV: You finally cracked the ${niche} code`,
    `This ${niche} mistake is costing you more than you think`,
    `The ${niche} strategy that changed everything for me`,
    `Stop doing this if you're serious about ${niche}`,
    `What ${nicheAdjective(niche)} ${niche} actually looks like`,
    `I tested this ${niche} method for 30 days and...`,
  ]
  const hashtags = [
    `#${niche.replace(/\s+/g, '')}`,
    `#${niche.replace(/\s+/g, '')}tips`,
    '#growthmindset',
    '#reelsviral',
    '#contentcreator',
    `#${niche.replace(/\s+/g, '')}community`,
    '#instagramgrowth',
  ]

  return {
    day: dayName(dayIndex),
    date: `Day ${dayIndex + 1}`,
    type,
    idea: ideas[dayIndex % ideas.length],
    goal: goals[dayIndex % goals.length],
    hook: hooks[dayIndex % hooks.length],
    hashtags: hashtags.slice(0, 5),
  }
}

export async function generateContentPlan(input: {
  niche: string
  frequency: string
}): Promise<ContentPlanResult> {
  await AI_DELAY()
  const { niche, frequency } = input

  const freqMap: Record<string, number> = {
    '1x/week': 1,
    '3x/week': 3,
    '5x/week': 5,
    daily: 7,
    '2x/day': 7,
  }
  const postsPerWeek = freqMap[frequency] || 3

  const week: ContentPlanDay[] = []
  let dayCounter = 0
  for (let i = 0; i < 7; i++) {
    const postOnDay = i < postsPerWeek || (postsPerWeek === 7)
    if (postOnDay || Math.random() > 0.4) {
      week.push(generateContentDay(niche, dayCounter, postsPerWeek))
      dayCounter++
    }
    if (week.length >= Math.min(postsPerWeek + 2, 7)) break
  }

  const month: ContentPlanDay[] = []
  for (let i = 0; i < Math.min(postsPerWeek * 4, 30); i++) {
    month.push(generateContentDay(niche, i, postsPerWeek))
  }

  return {
    week: week.slice(0, 7),
    month,
    strategy: [
      `Lead with Reels (60-90s) for maximum organic reach — post at least 3 per week`,
      `Carousels drive 3x more saves than single images — use them for tutorials and listicles`,
      `Stories daily keep your name at the top of followers' feeds even on non-post days`,
      `Batch-create content weekly so you're never scrambling — plan on Sunday, shoot on Monday`,
      `Repurpose each piece of content: Reel → Story highlight → Carousel → Caption quote`,
    ],
  }
}

// ─── Bio Optimizer ────────────────────────────────────────────────────────────

export async function generateBios(input: {
  whatYouDo: string
  targetAudience: string
  offer: string
}): Promise<BioResult> {
  await AI_DELAY()
  const { whatYouDo, targetAudience, offer } = input

  return {
    bios: [
      {
        bio: `I help ${targetAudience} ${whatYouDo}\nWithout the overwhelm or wasted time\n${offer ? `→ ${offer}` : '→ Free guide below'}`,
        positioning: 'Outcome-first, benefit-driven',
        cta: `Click the link for your free ${offer || 'starter guide'}`,
      },
      {
        bio: `${whatYouDo.charAt(0).toUpperCase() + whatYouDo.slice(1)} for ${targetAudience}\nProven strategies. Real results.\n${offer ? `Get started: ${offer}` : 'DM me "START" to begin'}`,
        positioning: 'Authority-driven with social proof angle',
        cta: offer || 'DM "START" to get your personalized plan',
      },
      {
        bio: `Helping ${targetAudience} finally ${whatYouDo}\nNo fluff. Just what works.\n${offer || 'Link below to get started'}`,
        positioning: 'Anti-guru, direct, no-BS positioning',
        cta: offer || 'Free resource — tap the link below',
      },
    ],
    tips: [
      `Instagram bios are indexed for search — include your niche keyword naturally in the first line`,
      `Use line breaks (return key in the app) instead of punctuation — it reads faster on mobile`,
      `Your CTA must offer immediate value — "free guide", "free audit", or "free training" convert 5x better than "DM me"`,
      `Avoid adjectives about yourself ("passionate", "dedicated") — describe results and outcomes instead`,
      `Test your bio by reading it aloud — if it sounds robotic or vague, rewrite it from your audience's perspective`,
    ],
  }
}

// ─── Engagement Assistant ─────────────────────────────────────────────────────

export async function generateEngagement(input: {
  niche: string
  audience: string
}): Promise<EngagementResult> {
  await AI_DELAY()
  const { niche, audience } = input

  return {
    commentReplies: [
      `Love that you're thinking about this! The key is to start with [specific first step] — most people skip it and wonder why nothing works.`,
      `This is such a great question. The short answer: yes. The longer answer is in my next post because it deserves a full breakdown!`,
      `Thank you for sharing this! You're definitely not alone in feeling that way. The biggest shift for me was [relevant insight]. Give that a try!`,
      `I was exactly where you are 12 months ago. What changed for me was focusing on [specific strategy] instead of [common mistake]. Happy to help!`,
      `Genuinely love seeing people take ${niche} seriously. Keep showing up — consistency is where the magic happens. You've got this!`,
      `Great point! I'd also add that [complementary insight] — when you combine both, the results compound. Let me know if you try it!`,
      `This comment made my day. People like you are exactly why I keep sharing. Tag me when you try it so I can cheer you on!`,
    ],
    storyQuestions: [
      `What's your #1 challenge with ${niche} right now? I'm building content specifically around your answers.`,
      `On a scale of 1-10, how confident do you feel about ${niche}? (1 = totally lost, 10 = crushing it)`,
      `What's one ${niche} myth you believed for too long? I'll share mine in the next story.`,
      `This or that: [Option A] vs [Option B] — which approach to ${niche} do you prefer?`,
      `Quick poll: What type of ${niche} content do you want more of? Tutorial / Motivation / Strategy / Behind the scenes`,
      `What would you Google right now if you wanted to solve your biggest ${niche} problem?`,
      `If you could ask me ONE question about ${niche}, what would it be? Best question gets a full post!`,
    ],
    engagementPrompts: [
      `End every caption with a question that requires a one-word answer — low effort for your audience = more responses`,
      `Use "Save this for later" strategically — when you say it, include a reason WHY they'll want to come back`,
      `Create a weekly series (e.g., "Monday Myth Bust") so followers know what to expect and keep coming back`,
      `Reply to every comment in the first hour — the algorithm interprets this as high engagement velocity and boosts reach`,
      `Create a "conversation starter" Story 2x per week — simple polls and questions show in followers' feeds and drive engagement`,
      `Go live once a week for 15 minutes with a Q&A — live sessions push your regular posts higher in the feed for 24 hours`,
      `Use carousel last slides to ask for the save — "Save this so you don't forget Step 3" works extremely well`,
    ],
    dmStarters: [
      `Hey [name]! Saw your comment on my post about ${niche} and wanted to personally say — your question was spot on. I'm actually creating a piece of content just for that. Worth checking back on [day]?`,
      `Hi! Thanks for following — I noticed you're into ${niche} too. What's the one thing you're working on right now? Happy to point you to my best content on that.`,
      `Hey! Your question in the comments deserved more than a quick reply. Short version: [insight]. Long version: let me know if you'd find value in a full post on this!`,
      `Hi [name], just wanted to personally welcome you! If you have any questions about ${niche} while you're getting started, my DMs are always open.`,
      `Saw you've been following for a while — just wanted to check in and say thank you. Is there anything about ${niche} you wish I covered more? Your input literally shapes what I create next.`,
    ],
  }
}
