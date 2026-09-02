import type { Metadata } from 'next'
import { DocsClient } from '@/components/docs/docs-client'

export const metadata: Metadata = {
  title: 'Documentation · ICFT Protocol',
  description:
    'How the ICFT lending protocol works — collateral assets, interest rate model, risk and liquidation, and contract addresses.',
}

export default function DocsPage() {
  return <DocsClient />
}
