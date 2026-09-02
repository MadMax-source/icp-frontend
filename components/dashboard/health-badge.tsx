import { cn } from '@/lib/utils'
import type { Position } from '@/lib/protocol'

const MAP: Record<Position['status'], { label: string; dot: string; text: string; ring: string }> = {
  healthy: {
    label: 'Healthy',
    dot: 'bg-success',
    text: 'text-success',
    ring: 'border-success/30 bg-success/10',
  },
  'at-risk': {
    label: 'At Risk',
    dot: 'bg-warning',
    text: 'text-warning',
    ring: 'border-warning/30 bg-warning/10',
  },
  liquidatable: {
    label: 'Liquidatable',
    dot: 'bg-destructive',
    text: 'text-destructive',
    ring: 'border-destructive/30 bg-destructive/10',
  },
}

export function HealthBadge({ status, className }: { status: Position['status']; className?: string }) {
  const s = MAP[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        s.ring,
        s.text,
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', s.dot)} />
      {s.label}
    </span>
  )
}
