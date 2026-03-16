import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import Navbar from './components/Navbar'
import { AuthProvider } from './components/AuthProvider'
import Footer from './components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Törökbálinti Ifjúsági Önkormányzat',
  description: 'TIFO hivatalos weboldala',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hu">
      <body className={inter.className + ' min-h-screen bg-site text-slate-900 flex flex-col'}>
        <div className="site-bg-layer" aria-hidden="true" />
        <AuthProvider>
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
