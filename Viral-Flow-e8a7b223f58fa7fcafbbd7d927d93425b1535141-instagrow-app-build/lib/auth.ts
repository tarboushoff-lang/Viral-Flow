// ─────────────────────────────────────────────────────────────────────────────
// ViralFlow Auth — localStorage-backed session
// Swap the USERS array / signIn logic for a real backend call later.
// ─────────────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  plan: 'free' | 'pro' | 'admin'
  createdAt: string
  generationsToday: number
  generationsLimit: number // -1 = unlimited
}

const SESSION_KEY = 'vf_session'
const USERS_KEY   = 'vf_users'

// Seed admin account on first load
const ADMIN_SEED: User = {
  id:               'admin-001',
  email:            'admin@viralflow.ai',
  name:             'Admin',
  role:             'admin',
  plan:             'admin',
  createdAt:        new Date().toISOString(),
  generationsToday: 0,
  generationsLimit: -1,
}

function loadUsers(): User[] {
  if (typeof window === 'undefined') return [ADMIN_SEED]
  try {
    const raw = localStorage.getItem(USERS_KEY)
    const users: User[] = raw ? JSON.parse(raw) : []
    if (!users.find(u => u.id === ADMIN_SEED.id)) {
      users.unshift(ADMIN_SEED)
      localStorage.setItem(USERS_KEY, JSON.stringify(users))
    }
    return users
  } catch { return [ADMIN_SEED] }
}

function saveUsers(users: User[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function signUp(email: string, password: string, name: string): { user: User | null; error: string | null } {
  if (!email || !password || !name) return { user: null, error: 'All fields are required.' }
  if (password.length < 6) return { user: null, error: 'Password must be at least 6 characters.' }

  const users = loadUsers()
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { user: null, error: 'An account with this email already exists.' }
  }

  const newUser: User = {
    id:               `user-${Date.now()}`,
    email:            email.toLowerCase().trim(),
    name:             name.trim(),
    role:             'user',
    plan:             'free',
    createdAt:        new Date().toISOString(),
    generationsToday: 0,
    generationsLimit: 10,
  }
  users.push(newUser)
  saveUsers(users)
  persistSession(newUser)
  return { user: newUser, error: null }
}

export function signIn(email: string, password: string): { user: User | null; error: string | null } {
  if (!email || !password) return { user: null, error: 'Email and password are required.' }

  // Admin shortcut — password is always "admin123" for demo
  const users = loadUsers()
  const found = users.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (!found) return { user: null, error: 'No account found with that email.' }

  // For demo: any password works (real app would hash/compare)
  // Admin account requires "admin123"
  if (found.role === 'admin' && password !== 'admin123') {
    return { user: null, error: 'Invalid password.' }
  }

  persistSession(found)
  return { user: found, error: null }
}

export function signOut() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(SESSION_KEY)
}

export function getSession(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function persistSession(user: User) {
  if (typeof window === 'undefined') return
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

export function incrementGenerations(user: User): User {
  const users = loadUsers()
  const idx = users.findIndex(u => u.id === user.id)
  if (idx === -1) return user
  users[idx].generationsToday = (users[idx].generationsToday ?? 0) + 1
  saveUsers(users)
  const updated = { ...user, generationsToday: users[idx].generationsToday }
  persistSession(updated)
  return updated
}

export function canGenerate(user: User): boolean {
  if (user.generationsLimit === -1) return true
  return user.generationsToday < user.generationsLimit
}

export function remainingGenerations(user: User): number {
  if (user.generationsLimit === -1) return Infinity
  return Math.max(0, user.generationsLimit - user.generationsToday)
}
