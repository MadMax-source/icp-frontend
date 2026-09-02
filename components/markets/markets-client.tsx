'use client'

import { useState } from 'react'
import { ChevronDown, ExternalLink } from 'lucide-react'
import {
  COLLATERAL,
  ICFT,
  NETWORK,
  type CollateralAsset,
} from '@/lib/protocol'
import { usd, num, pct } from '@/lib/format'
import { AssetIcon } from '@/components/asset-icon'
import { useWallet } from '@/components/wallet-provider'
import { cn } from '@/lib/utils'

export function MarketsClient() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Markets</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Supported collateral assets and the ICFT borrow market on {NETWORK.name}.
        </p>
      </header>

      {/* Borrow market — ICFT */}
      <section className="mt-8">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Borrow market
        </h2>
        <div className="rounded-xl border border-primary/25 bg-primary/[0.03] p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <AssetIcon symbol="ICFT" className="size-11" />
              <div>
                <p className="text-lg font-semibold">ICFT</p>
                <p className="text-sm text-muted-foreground">{ICFT.name} · borrowable asset</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
              <MiniStat label="Price" value={usd(ICFT.price)} />
              <MiniStat label="Borrow APR" value={pct(ICFT.borrowApr)} accent />
              <MiniStat label="Available" value={`${num(ICFT.availableLiquidity, 0)}`} sub="ICFT" />
              <MiniStat label="Utilization" value={pct(ICFT.utilization)} />
            </div>
          </div>
        </div>
      </section>

      {/* Collateral markets */}
      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Collateral assets
          </h2>
          <span className="hidden text-xs text-muted-foreground sm:block">
            Tap a market for details
          </span>
        </div>

        {/* Column headers (desktop) */}
        <div className="hidden grid-cols-[1.6fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 pb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground lg:grid">
          <span>Asset</span>
          <span className="text-right">Oracle price</span>
          <span className="text-right">Max LTV</span>
          <span className="text-right">Liq. threshold</span>
          <span className="text-right">Total supplied</span>
          <span className="w-6" />
        </div>

        <div className="space-y-2.5">
          {COLLATERAL.map((asset) => (
            <MarketRow key={asset.symbol} asset={asset} />
          ))}
        </div>
      </section>
    </div>
  )
}

function MarketRow({ asset }: { asset: CollateralAsset }) {
  const { connected } = useWallet()
  const [open, setOpen] = useState(false)

  const suppliedValue = asset.supplied * asset.price
  const borrowCapacity = suppliedValue * asset.maxLtv

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-border bg-card transition-colors',
        open && 'border-primary/30',
      )}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="grid w-full grid-cols-2 items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-secondary/40 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr_auto]"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <AssetIcon symbol={asset.symbol} className="size-10" />
          <div>
            <p className="font-semibold">{asset.symbol}</p>
            <p className="text-xs text-muted-foreground">{asset.name}</p>
          </div>
        </div>

        {/* Mobile: price + chevron. Desktop: full columns */}
        <div className="text-right lg:hidden">
          <p className="font-mono text-sm font-semibold tabular-nums">{usd(asset.price)}</p>
          <p className="text-xs text-muted-foreground">Max LTV {pct(asset.maxLtv, 0)}</p>
        </div>

        <span className="hidden text-right font-mono text-sm tabular-nums lg:block">
          {usd(asset.price)}
        </span>
        <span className="hidden text-right font-mono text-sm tabular-nums lg:block">
          {pct(asset.maxLtv, 0)}
        </span>
        <span className="hidden text-right font-mono text-sm tabular-nums lg:block">
          {pct(asset.liquidationThreshold, 0)}
        </span>
        <span className="hidden text-right font-mono text-sm tabular-nums lg:block">
          {usd(asset.tvl, { compact: true })}
        </span>

        <ChevronDown
          className={cn(
            'ml-auto hidden size-4 shrink-0 text-muted-foreground transition-transform lg:block',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div className="border-t border-border bg-background/40 px-5 py-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <DetailStat label="Oracle price" value={usd(asset.price)} />
            <DetailStat label="Maximum LTV" value={pct(asset.maxLtv, 0)} />
            <DetailStat label="Liquidation threshold" value={pct(asset.liquidationThreshold, 0)} />
            <DetailStat
              label="Total value locked"
              value={usd(asset.tvl, { compact: true })}
            />
            <DetailStat
              label="Collateral status"
              value="Enabled"
              valueClass="text-success"
            />
            <DetailStat
              label="Approval required"
              value={asset.isErc20 ? 'Yes (ERC-20)' : 'No (native)'}
            />
          </div>

          {connected ? (
            <div className="mt-4 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-3">
              <DetailStat
                label="Your wallet balance"
                value={`${num(asset.walletBalance)} ${asset.symbol}`}
              />
              <DetailStat
                label="Your supplied amount"
                value={`${num(asset.supplied)} ${asset.symbol}`}
                sub={usd(suppliedValue)}
              />
              <DetailStat
                label="Your borrow capacity"
                value={usd(borrowCapacity)}
                valueClass="text-primary"
              />
            </div>
          ) : (
            <p className="mt-4 rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
              Connect your wallet to see your balance, supplied amount, and borrow capacity for{' '}
              {asset.symbol}.
            </p>
          )}

          <a
            href={NETWORK.explorer}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            View {asset.symbol} on explorer <ExternalLink className="size-3.5" />
          </a>
        </div>
      )}
    </div>
  )
}

function MiniStat({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string
  sub?: string
  accent?: boolean
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn('mt-1 font-mono text-lg font-semibold tabular-nums', accent && 'text-primary')}>
        {value}
        {sub ? <span className="ml-1 text-xs font-normal text-muted-foreground">{sub}</span> : null}
      </p>
    </div>
  )
}

function DetailStat({
  label,
  value,
  sub,
  valueClass,
}: {
  label: string
  value: string
  sub?: string
  valueClass?: string
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn('mt-1 font-mono text-sm font-semibold tabular-nums', valueClass)}>{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p> : null}
    </div>
  )
}
