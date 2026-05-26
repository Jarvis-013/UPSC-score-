import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'UPSC Prelims Evaluator',
  description: 'Evaluate your UPSC Prelims performance with automated scoring',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="antialiased">
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
