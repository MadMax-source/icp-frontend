'use client'

import { COLLATERAL, collateralValue } from '@/lib/protocol'
import { usd, num } from '@/lib/format'
import { AssetIcon } from '@/components/asset-icon'
import { Button } from '@/components/ui/button'
import type { ActionType } from '@/components/dashboard/action-modal'

export function CollateralBreakdown({ onAction }: { onAction: (a: ActionType) => void }) {
  const total = collateralValue()

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="font-semibold">Your collateral</h2>
        <span className="font-mono text-sm text-muted-foreground">
          Total <span className="font-semibold text-foreground">{usd(total)}</span>
        </span>
      </div>

      <div className="divide-y divide-border">
        {COLLATERAL.map((a) => {
          const value = a.supplied * a.price
          return (
            <div
              key={a.symbol}
              className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <AssetIcon symbol={a.symbol} className="size-9" />
                <div>
                  <p className="font-medium">{a.symbol}</p>
                  <p className="font-mono text-xs tabular-nums text-muted-foreground">
                    {num(a.supplied)} {a.symbol} · {usd(a.price)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <div className="text-right">
                  <p className="font-mono text-sm font-semibold tabular-nums">{usd(value)}</p>
                  <p className="text-xs text-muted-foreground">supplied value</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => onAction('deposit')}>
                    Deposit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onAction('withdraw')}>
                    Withdraw
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
