import type { Metadata } from 'next'
import { PortfolioClient } from '@/components/portfolio/portfolio-client'

export const metadata: Metadata = {
  title: 'Portfolio — ICFT Protocol',
  description:
    'A detailed view of your collateral, ICFT debt, interest, health factor, and transaction history.',
}

export default function PortfolioPage() {
  return (
    <main className="min-h-[calc(100svh-4rem)]">
      <PortfolioClient />
    </main>
  )
}
