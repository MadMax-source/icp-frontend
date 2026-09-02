import { Hero } from '@/components/home/hero'
import { SupportedAssets } from '@/components/home/supported-assets'
import { ProtocolOverview } from '@/components/home/protocol-overview'
import { HowItWorks } from '@/components/home/how-it-works'
import { RiskCta } from '@/components/home/risk-cta'
import { SiteFooter } from '@/components/site-footer'
import { Reveal } from '@/components/reveal'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Reveal direction="up">
        <SupportedAssets />
      </Reveal>
      <Reveal direction="left">
        <ProtocolOverview />
      </Reveal>
      <HowItWorks />
      <Reveal direction="up">
        <RiskCta />
      </Reveal>
      <SiteFooter />
    </main>
  )
}
