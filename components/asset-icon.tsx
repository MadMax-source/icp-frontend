import { cn } from '@/lib/utils'
import type { AssetSymbol } from '@/lib/protocol'

type Sym = AssetSymbol | 'ICFT'

const STYLES: Record<Sym, { bg: string; fg: string; glyph: string }> = {
  ETH: { bg: 'bg-[oklch(0.4_0.09_265)]', fg: 'text-[oklch(0.92_0.03_265)]', glyph: 'Ξ' },
  wstETH: { bg: 'bg-[oklch(0.42_0.1_180)]', fg: 'text-[oklch(0.93_0.03_180)]', glyph: 'Ψ' },
  wBTC: { bg: 'bg-[oklch(0.5_0.13_55)]', fg: 'text-[oklch(0.95_0.03_55)]', glyph: '₿' },
  ICFT: { bg: 'bg-primary', fg: 'text-primary-foreground', glyph: 'I' },
}

export function AssetIcon({
  symbol,
  className,
}: {
  symbol: Sym
  className?: string
}) {
  const s = STYLES[symbol]
  return (
    <span
      className={cn(
        'grid size-8 shrink-0 place-items-center rounded-full font-mono text-sm font-bold leading-none',
        s.bg,
        s.fg,
        className,
      )}
      aria-hidden="true"
    >
      {s.glyph}
    </span>
  )
}
