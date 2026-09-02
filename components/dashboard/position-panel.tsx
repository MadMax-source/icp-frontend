import { getPosition } from '@/lib/protocol'
import { usd, num, pct, healthLabel } from '@/lib/format'
import { HealthBadge } from '@/components/dashboard/health-badge'
import { cn } from '@/lib/utils'

export function PositionPanel() {
  const p = getPosition()

  // Health factor gauge: clamp 1 → 3 to a 0–100 arc
  const hf = Number.isFinite(p.healthFactor) ? p.healthFactor : 3
  const gauge = Math.max(0, Math.min(100, ((hf - 1) / 2) * 100))
  const hfColor =
    p.status === 'healthy' ? 'text-success' : p.status === 'at-risk' ? 'text-warning' : 'text-destructive'
  const hfStroke =
    p.status === 'healthy'
      ? 'oklch(0.76 0.13 172)'
      : p.status === 'at-risk'
        ? 'oklch(0.8 0.14 70)'
        : 'oklch(0.64 0.2 22)'

  const R = 52
  const C = 2 * Math.PI * R

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Your position</h2>
        <HealthBadge status={p.status} />
      </div>

      <div className="mt-5 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
        {/* Health factor gauge */}
        <div className="mx-auto flex flex-col items-center sm:mx-0">
          <div className="relative size-36">
            <svg viewBox="0 0 120 120" className="size-full -rotate-90">
              <circle cx="60" cy="60" r={R} fill="none" stroke="oklch(1 0 0 / 8%)" strokeWidth="8" />
              <circle
                cx="60"
                cy="60"
                r={R}
                fill="none"
                stroke={hfStroke}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C - (gauge / 100) * C}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-muted-foreground">Health</span>
              <span className={cn('font-mono text-3xl font-semibold tabular-nums', hfColor)}>
                {healthLabel(p.healthFactor)}
              </span>
            </div>
          </div>
        </div>

        {/* Position metrics */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <Metric label="Collateral value" value={usd(p.collateralValue)} />
          <Metric label="Debt" value={`${num(p.debt, 2)} ICFT`} />
          <Metric label="Current interest" value={`${num(p.interest, 2)} ICFT`} />
          <Metric label="LTV" value={pct(p.ltv)} />
          <Metric label="Available to borrow" value={usd(p.availableBorrow)} accent />
          <Metric label="Liq. threshold" value={pct(p.liquidationThreshold, 0)} />
        </div>
      </div>

      {/* LTV bar */}
      <div className="mt-6">
        <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
          <span>LTV</span>
          <span className="font-mono">
            {pct(p.ltv)} / {pct(p.liquidationThreshold, 0)} liquidation
          </span>
        </div>
        <div className="relative h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className={cn(
              'h-full rounded-full',
              p.status === 'healthy' ? 'bg-success' : p.status === 'at-risk' ? 'bg-warning' : 'bg-destructive',
            )}
            style={{ width: `${Math.min(100, (p.ltv / p.liquidationThreshold) * 100)}%` }}
          />
          <div
            className="absolute inset-y-0 w-px bg-foreground/40"
            style={{ left: '100%' }}
            aria-hidden
          />
        </div>
      </div>
    </div>
  )
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn('mt-0.5 font-mono text-lg font-semibold tabular-nums', accent && 'text-primary')}>
        {value}
      </p>
    </div>
  )
}
