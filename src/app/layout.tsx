import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import Navbar from '../../app/components/Navbar'
import { AuthProvider } from '../../app/components/AuthProvider'
import Footer from '../../app/components/Footer'

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
      <body className={inter.className + ' min-h-screen bg-site text-slate-900'}>
        <div className="site-bg-layer" aria-hidden="true" />
        <AuthProvider>
          <div className="relative z-10">
            <Navbar />
            {children}
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
