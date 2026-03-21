import './globals.css'
import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'

import Navbar from './components/Navbar'
import { AuthProvider } from './components/AuthProvider'
import Footer from './components/Footer'
import MobileAnimationGuard from './components/MobileAnimationGuard'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'TIFO',
  description: 'TIFO hivatalos weboldala',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hu">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <title>TIFO</title>
      </head>
      <body className={`${inter.variable} ${jakarta.variable} ${inter.className} min-h-screen text-slate-900 flex flex-col`} style={{ background: 'linear-gradient(180deg, #d6f0ff 0%, #ffffff 100%)' }}>
        <div className="site-bg-layer" aria-hidden="true" />
        <AuthProvider>
          <MobileAnimationGuard>
            <div className="relative z-10 flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1 flex flex-col">{children}</main>
              <Footer />
            </div>
          </MobileAnimationGuard>
        </AuthProvider>
      </body>
    </html>
  )
}
