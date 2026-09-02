import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export function StatCard({
  label,
  value,
  sub,
  accent,
  className,
}: {
  label: string
  value: ReactNode
  sub?: ReactNode
  accent?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card p-4 sm:p-5',
        accent && 'border-primary/25 bg-primary/[0.03]',
        className,
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn('mt-2 font-mono text-2xl font-semibold tabular-nums', accent && 'text-primary')}>
        {value}
      </p>
      {sub ? <p className="mt-1 text-xs text-muted-foreground">{sub}</p> : null}
    </div>
  )
}
