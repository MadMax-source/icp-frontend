import { Hero } from '@/components/home/hero'
import { SupportedAssets } from '@/components/home/supported-assets'
import { ProtocolOverview } from '@/components/home/protocol-overview'
import { HowItWorks } from '@/components/home/how-it-works'
import { RiskCta } from '@/components/home/risk-cta'
import { SiteFooter } from '@/components/site-footer'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <SupportedAssets />
      <ProtocolOverview />
      <HowItWorks />
      <RiskCta />
      <SiteFooter />
    </main>
  )
}
