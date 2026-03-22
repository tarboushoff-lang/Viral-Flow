import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'ViralFlow — Generate Viral Hooks & Get More Followers',
  description:
    'AI-powered Instagram hook generator. Create scroll-stopping, high-converting hooks that grow your followers organically. No bots. Real engagement.',
  keywords: ['instagram hooks', 'viral content', 'instagram growth', 'content creator', 'social media'],
}

export const viewport: Viewport = {
  themeColor: '#0a0610',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
