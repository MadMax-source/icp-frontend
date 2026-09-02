import { StatCard } from '@/components/stat'
import { ICFT, weightedMaxLtv, weightedLiquidationThreshold } from '@/lib/protocol'
import { usd, pct } from '@/lib/format'

export function ProtocolOverview() {
  const stats = [
    { label: 'ICFT Price', value: usd(ICFT.price) },
    { label: 'Available Liquidity', value: `${usd(ICFT.availableLiquidity, { compact: true })}`, sub: 'ICFT' },
    { label: 'Utilization', value: pct(ICFT.utilization) },
    { label: 'Borrow APR', value: pct(ICFT.borrowApr) },
    { label: 'Max LTV', value: pct(weightedMaxLtv(), 0), sub: 'weighted average' },
    { label: 'Liquidation Threshold', value: pct(weightedLiquidationThreshold(), 0), sub: 'weighted average' },
  ]

  return (
    <section className="border-y border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Protocol overview</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Live parameters read from the protocol contracts.
            </p>
          </div>
          <span className="hidden font-mono text-xs text-muted-foreground sm:block">
            source: on-chain
          </span>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {stats.map((s) => (
            <StatCard key={s.label} label={s.label} value={s.value} sub={s.sub} />
          ))}
        </div>
      </div>
    </section>
  )
}
