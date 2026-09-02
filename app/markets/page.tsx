import type { Metadata } from 'next'
import { MarketsClient } from '@/components/markets/markets-client'

export const metadata: Metadata = {
  title: 'Markets — ICFT Protocol',
  description:
    'Supported collateral assets (ETH, wstETH, wBTC) and the ICFT borrow market, with oracle prices, max LTV, and liquidation parameters.',
}

export default function MarketsPage() {
  return (
    <main className="min-h-[calc(100svh-4rem)]">
      <MarketsClient />
    </main>
  )
}
