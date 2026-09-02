import { ArrowRight } from 'lucide-react'
import { AssetIcon } from '@/components/asset-icon'
import { COLLATERAL, ICFT } from '@/lib/protocol'
import { pct } from '@/lib/format'

export function SupportedAssets() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="grid items-start gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
        {/* Collateral */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Supply as collateral
          </p>
          <div className="mt-4 space-y-3">
            {COLLATERAL.map((a) => (
              <div
                key={a.symbol}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-center gap-3">
                  <AssetIcon symbol={a.symbol} className="size-10" />
                  <div>
                    <p className="font-medium">{a.symbol}</p>
                    <p className="text-sm text-muted-foreground">{a.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm tabular-nums text-muted-foreground">Max LTV</p>
                  <p className="font-mono text-sm font-semibold tabular-nums">{pct(a.maxLtv, 0)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Arrow */}
        <div className="hidden items-center justify-center self-center lg:flex">
          <div className="grid size-12 place-items-center rounded-full border border-border bg-secondary/50 text-muted-foreground">
            <ArrowRight className="size-5" />
          </div>
        </div>

        {/* Borrow */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Borrow the protocol asset
          </p>
          <div className="mt-4 flex h-[calc(100%-1.75rem)] flex-col justify-center rounded-xl border border-primary/25 bg-primary/[0.04] p-6">
            <div className="flex items-center gap-3">
              <AssetIcon symbol="ICFT" className="size-12 text-base" />
              <div>
                <p className="text-lg font-semibold">{ICFT.symbol}</p>
                <p className="text-sm text-muted-foreground">{ICFT.name}</p>
              </div>
            </div>
            <p className="mt-4 text-pretty text-sm leading-relaxed text-muted-foreground">
              ICFT is minted against your collateral. Repay ICFT at any time to unlock and withdraw
              your supplied assets.
            </p>
            <div className="mt-4 flex items-center gap-6 border-t border-border pt-4">
              <div>
                <p className="text-xs text-muted-foreground">Borrow APR</p>
                <p className="font-mono text-lg font-semibold tabular-nums text-primary">
                  {pct(ICFT.borrowApr)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Peg</p>
                <p className="font-mono text-lg font-semibold tabular-nums">$1.00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
