'use client'

import { useState } from 'react'
import { ArrowDownToLine, HandCoins, RotateCcw, ArrowUpFromLine, ExternalLink } from 'lucide-react'
import {
  COLLATERAL,
  DEBT,
  NETWORK,
  TX_HISTORY,
  collateralValue,
  getPosition,
  type Tx,
} from '@/lib/protocol'
import { usd, num, pct, healthLabel } from '@/lib/format'
import { AssetIcon } from '@/components/asset-icon'
import { StatCard } from '@/components/stat'
import { HealthBadge } from '@/components/dashboard/health-badge'
import { NetworkBar } from '@/components/dashboard/network-bar'
import { ConnectGate } from '@/components/dashboard/connect-gate'
import { ActionModal, type ActionType } from '@/components/dashboard/action-modal'
import { Button } from '@/components/ui/button'
import { useWallet } from '@/components/wallet-provider'
import { cn } from '@/lib/utils'

const ACTIONS: {
  key: Exclude<ActionType, null>
  label: string
  icon: typeof HandCoins
  variant: 'default' | 'secondary' | 'outline'
}[] = [
  { key: 'deposit', label: 'Deposit', icon: ArrowDownToLine, variant: 'default' },
  { key: 'borrow', label: 'Borrow', icon: HandCoins, variant: 'secondary' },
  { key: 'repay', label: 'Repay', icon: RotateCcw, variant: 'secondary' },
  { key: 'withdraw', label: 'Withdraw', icon: ArrowUpFromLine, variant: 'outline' },
]

export function PortfolioClient() {
  const { connected } = useWallet()
  const [action, setAction] = useState<ActionType>(null)

  if (!connected) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Header />
        <div className="mt-10">
          <ConnectGate />
        </div>
      </div>
    )
  }

  const position = getPosition()
  const totalCollateral = collateralValue()
  const totalDebt = DEBT.total
  const netPosition = totalCollateral - totalDebt

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Header />

      <div className="mt-6 space-y-6">
        <NetworkBar />

        {/* Total position summary */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          <StatCard label="Total Collateral" value={usd(totalCollateral)} sub="supplied value" />
          <StatCard label="Total Debt" value={usd(totalDebt)} sub={`${num(DEBT.total, 2)} ICFT`} />
          <StatCard label="Net Position" value={usd(netPosition)} sub="collateral − debt" accent />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Collateral */}
          <section className="rounded-xl border border-border bg-card lg:col-span-2">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-semibold">Collateral</h2>
              <span className="font-mono text-sm text-muted-foreground">
                Total <span className="font-semibold text-foreground">{usd(totalCollateral)}</span>
              </span>
            </div>
            <div className="divide-y divide-border">
              {COLLATERAL.map((a) => {
                const value = a.supplied * a.price
                const share = totalCollateral > 0 ? value / totalCollateral : 0
                return (
                  <div key={a.symbol} className="px-5 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AssetIcon symbol={a.symbol} className="size-9" />
                        <div>
                          <p className="font-medium">{a.symbol}</p>
                          <p className="font-mono text-xs tabular-nums text-muted-foreground">
                            {num(a.supplied)} {a.symbol} · {usd(a.price)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm font-semibold tabular-nums">{usd(value)}</p>
                        <p className="text-xs text-muted-foreground">{pct(share, 1)} of collateral</p>
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary/70"
                        style={{ width: `${Math.max(2, share * 100)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Debt + Risk */}
          <div className="space-y-6">
            <section className="rounded-xl border border-border bg-card p-5">
              <h2 className="font-semibold">Debt</h2>
              <div className="mt-4 flex items-center gap-3">
                <AssetIcon symbol="ICFT" className="size-9" />
                <div>
                  <p className="font-medium">ICFT Debt</p>
                  <p className="text-xs text-muted-foreground">Borrowed against collateral</p>
                </div>
              </div>
              <dl className="mt-4 space-y-2.5 text-sm">
                <Row label="Principal" value={`${num(DEBT.principal, 2)} ICFT`} />
                <Row label="Current interest" value={`${num(DEBT.interest, 2)} ICFT`} />
                <div className="border-t border-border pt-2.5">
                  <Row label="Total debt" value={`${num(DEBT.total, 2)} ICFT`} bold />
                </div>
              </dl>
            </section>

            <section className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Risk</h2>
                <HealthBadge status={position.status} />
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div
                  className={cn(
                    'flex size-16 shrink-0 flex-col items-center justify-center rounded-full border-2',
                    position.status === 'healthy'
                      ? 'border-success/40 text-success'
                      : position.status === 'at-risk'
                        ? 'border-warning/40 text-warning'
                        : 'border-destructive/40 text-destructive',
                  )}
                >
                  <span className="font-mono text-xl font-semibold tabular-nums">
                    {healthLabel(position.healthFactor)}
                  </span>
                </div>
                <div className="grid flex-1 grid-cols-1 gap-x-4 gap-y-2 text-sm">
                  <Row label="Health factor" value={healthLabel(position.healthFactor)} />
                  <Row label="LTV" value={pct(position.ltv)} />
                  <Row label="Liq. threshold" value={pct(position.liquidationThreshold, 0)} />
                </div>
              </div>
              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                  <span>LTV</span>
                  <span className="font-mono">
                    {pct(position.ltv)} / {pct(position.liquidationThreshold, 0)}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      position.status === 'healthy'
                        ? 'bg-success'
                        : position.status === 'at-risk'
                          ? 'bg-warning'
                          : 'bg-destructive',
                    )}
                    style={{
                      width: `${Math.min(100, (position.ltv / position.liquidationThreshold) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Position actions */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {ACTIONS.map((a) => (
            <Button
              key={a.key}
              size="lg"
              variant={a.variant}
              className="h-auto justify-start gap-2 py-3"
              onClick={() => setAction(a.key)}
            >
              <a.icon className="size-4" />
              {a.label}
            </Button>
          ))}
        </div>

        {/* Transaction history */}
        <section className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-semibold">Transaction history</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Asset</th>
                  <th className="px-5 py-3 text-right font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Time</th>
                  <th className="px-5 py-3 text-right font-medium">Tx</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {TX_HISTORY.map((tx) => (
                  <TxRow key={tx.id} tx={tx} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <ActionModal action={action} onClose={() => setAction(null)} />
    </div>
  )
}

function Header() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Portfolio</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        A detailed view of your collateral, debt, and position health.
      </p>
    </div>
  )
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn('font-mono tabular-nums', bold ? 'font-semibold text-foreground' : '')}>
        {value}
      </span>
    </div>
  )
}

const TYPE_STYLES: Record<Tx['type'], string> = {
  Deposit: 'border-success/30 bg-success/10 text-success',
  Borrow: 'border-primary/30 bg-primary/10 text-primary',
  Repay: 'border-warning/30 bg-warning/10 text-warning',
  Withdraw: 'border-border bg-secondary text-muted-foreground',
}

function TxRow({ tx }: { tx: Tx }) {
  return (
    <tr className="transition-colors hover:bg-secondary/30">
      <td className="px-5 py-3.5">
        <span
          className={cn(
            'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
            TYPE_STYLES[tx.type],
          )}
        >
          {tx.type}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <span className="flex items-center gap-2">
          <AssetIcon symbol={tx.asset} className="size-6 text-xs" />
          <span className="font-medium">{tx.asset}</span>
        </span>
      </td>
      <td className="px-5 py-3.5 text-right font-mono tabular-nums">{num(tx.amount)}</td>
      <td className="px-5 py-3.5">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <span
            className={cn(
              'size-1.5 rounded-full',
              tx.status === 'Confirmed' ? 'bg-success' : 'bg-warning',
            )}
          />
          {tx.status}
        </span>
      </td>
      <td className="px-5 py-3.5 text-right text-muted-foreground">{tx.time}</td>
      <td className="px-5 py-3.5 text-right">
        <a
          href={`${NETWORK.explorer}/tx/${tx.hash}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-end gap-1 text-primary hover:underline"
          aria-label={`View transaction ${tx.hash} on explorer`}
        >
          <span className="font-mono text-xs">{tx.hash}</span>
          <ExternalLink className="size-3.5" />
        </a>
      </td>
    </tr>
  )
}
