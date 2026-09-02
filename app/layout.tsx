import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { WalletProvider } from '@/components/wallet-provider'
import { SiteHeader } from '@/components/site-header'
import { AnimatedBackground } from '@/components/animated-background'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'ICFT Protocol — Decentralized Lending',
  description:
    'Supply ETH, wstETH, and wBTC as collateral and borrow ICFT against your position. A decentralized, non-custodial lending protocol on Ethereum.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#1a1a1e',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} bg-background`}>
      <body className="min-h-svh font-sans antialiased">
        <WalletProvider>
          <AnimatedBackground />
          <div className="relative z-10">
            <SiteHeader />
            {children}
          </div>
        </WalletProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
