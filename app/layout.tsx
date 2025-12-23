import type { Metadata } from 'next'
import { Lato } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import WhatsAppButton from './components/WhatsAppButton'
import './globals.css'

const lato = Lato({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lato',
})

export const metadata: Metadata = {
  title: 's1mple',
  description: 'Portfolio personal de s1mple',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={lato.variable}>
      <body>
        {children}
        <WhatsAppButton />
        <Analytics />
      </body>
    </html>
  )
}

