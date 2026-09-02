import { StatCard } from '@/components/stat'
import { ICFT, weightedMaxLtv, weightedLiquidationThreshold } from '@/lib/protocol'
import { usd, pct, num } from '@/lib/format'

export function ProtocolStats() {
  const stats = [
    { label: 'ICFT Price', value: usd(ICFT.price) },
    { label: 'Available Liquidity', value: num(ICFT.availableLiquidity, 0), sub: 'ICFT' },
    { label: 'Utilization', value: pct(ICFT.utilization) },
    { label: 'Borrow APR', value: pct(ICFT.borrowApr) },
    { label: 'Max LTV', value: pct(weightedMaxLtv(), 0) },
    { label: 'Liquidation Threshold', value: pct(weightedLiquidationThreshold(), 0) },
  ]
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
      {stats.map((s) => (
        <StatCard key={s.label} label={s.label} value={s.value} sub={s.sub} />
      ))}
    </div>
  )
}
