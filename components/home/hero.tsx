import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { AssetIcon } from '@/components/asset-icon'
import { NETWORK } from '@/lib/protocol'
import { cn } from '@/lib/utils'

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
      <div className="absolute -top-40 left-1/2 -z-0 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-float mx-auto inline-flex animate-in items-center gap-2 rounded-full border border-primary/20 bg-secondary/50 px-3 py-1 text-xs fade-in slide-in-from-bottom-3 duration-700">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-success" />
            </span>
            <span className="font-mono text-muted-foreground">Live on {NETWORK.name} mainnet</span>
          </div>

          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:100ms] [animation-fill-mode:both] sm:text-6xl">
            Borrow{' '}
            <span className="text-primary">ICFT</span> against your crypto collateral
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:220ms] [animation-fill-mode:both] sm:text-lg">
            ICFT is a decentralized, non-custodial lending protocol. Supply supported assets as
            collateral and borrow ICFT against your position — all settled on-chain, with the smart
            contracts as the single source of truth.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:340ms] [animation-fill-mode:both] sm:flex-row">
            <Link href="/dashboard" className={cn(buttonVariants({ size: 'lg' }), 'w-full sm:w-auto')}>
              Launch App
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/docs"
              className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), 'w-full sm:w-auto')}
            >
              <BookOpen className="size-4" />
              View Documentation
            </Link>
          </div>

          <div className="mt-10 flex items-center justify-center gap-6 animate-in fade-in duration-1000 [animation-delay:480ms] [animation-fill-mode:both]">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <AssetIcon symbol="ETH" className="ring-2 ring-background" />
                <AssetIcon symbol="wstETH" className="ring-2 ring-background" />
                <AssetIcon symbol="wBTC" className="ring-2 ring-background" />
              </div>
              <span className="text-sm text-muted-foreground">3 collateral assets</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <AssetIcon symbol="ICFT" />
              <span className="text-sm text-muted-foreground">1 borrow asset</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
