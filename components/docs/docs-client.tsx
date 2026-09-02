'use client'

import { useEffect, useState } from 'react'
import { Check, Copy, ExternalLink } from 'lucide-react'
import {
  COLLATERAL,
  CONTRACTS,
  ICFT,
  NETWORK,
  getPosition,
} from '@/lib/protocol'
import { usd, num, pct } from '@/lib/format'
import { AssetIcon } from '@/components/asset-icon'
import { cn } from '@/lib/utils'

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'how-it-works', label: 'How ICFT works' },
  { id: 'collateral', label: 'Collateral assets' },
  { id: 'interest', label: 'Interest rate model' },
  { id: 'risk', label: 'Risk & liquidation' },
  { id: 'lifecycle', label: 'Borrow lifecycle' },
  { id: 'contracts', label: 'Contract addresses' },
  { id: 'faq', label: 'FAQ' },
]

export function DocsClient() {
  const [active, setActive] = useState('overview')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 },
    )
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 font-mono text-xs text-muted-foreground">
          Protocol documentation
        </span>
        <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Understanding the ICFT lending protocol
        </h1>
        <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
          ICFT is an overcollateralized lending protocol. Supply blue-chip crypto
          assets as collateral and mint ICFT, a USD-pegged stable asset, against them.
          This guide covers the mechanics, risk model, and on-chain contracts on{' '}
          {NETWORK.name}.
        </p>
      </header>

      <div className="mt-10 lg:grid lg:grid-cols-[220px_1fr] lg:gap-12">
        {/* Table of contents */}
        <aside className="hidden lg:block">
          <nav
            aria-label="Documentation sections"
            className="sticky top-24 space-y-1 border-l border-border"
          >
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={cn(
                  '-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors',
                  active === s.id
                    ? 'border-primary font-medium text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground',
                )}
              >
                {s.label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 space-y-14">
          <Overview />
          <HowItWorks />
          <Collateral />
          <Interest />
          <Risk />
          <Lifecycle />
          <Contracts />
          <Faq />
        </div>
      </div>
    </div>
  )
}

function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-4 space-y-4 leading-relaxed text-muted-foreground">{children}</div>
    </section>
  )
}

function Overview() {
  return (
    <Section id="overview" title="Overview">
      <p>
        The protocol lets users deposit supported collateral and borrow ICFT up to a
        per-asset loan-to-value limit. Every loan is overcollateralized: the value of
        deposited collateral always exceeds the outstanding debt, which keeps ICFT
        fully backed.
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        <HighlightCard label="Stable asset" value="ICFT" sub={`Pegged to ${usd(ICFT.price)}`} />
        <HighlightCard label="Network" value={NETWORK.name} sub={`Chain ID ${NETWORK.chainId}`} />
        <HighlightCard label="Collateral types" value={`${COLLATERAL.length}`} sub="ETH · wstETH · wBTC" />
      </div>
    </Section>
  )
}

function HowItWorks() {
  const steps = [
    {
      title: 'Deposit collateral',
      body: 'Supply ETH, wstETH, or wBTC to the LendingPool. Deposits are priced by the PriceOracle and immediately increase your borrowing power.',
    },
    {
      title: 'Borrow ICFT',
      body: 'Mint ICFT against your collateral up to its maximum LTV. Borrowed ICFT is a USD-pegged asset you can use freely.',
    },
    {
      title: 'Accrue interest',
      body: 'Debt grows over time at the borrow APR set by the InterestRateModel, which responds to market utilization.',
    },
    {
      title: 'Repay & withdraw',
      body: 'Repay ICFT to reduce your debt and interest, then withdraw collateral once your position stays within safe limits.',
    },
  ]
  return (
    <Section id="how-it-works" title="How ICFT works">
      <ol className="grid gap-3 sm:grid-cols-2">
        {steps.map((s, i) => (
          <li
            key={s.title}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 font-mono text-sm font-semibold text-primary">
                {i + 1}
              </span>
              <h3 className="font-semibold text-foreground">{s.title}</h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed">{s.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}

function Collateral() {
  return (
    <Section id="collateral" title="Collateral assets">
      <p>
        Each collateral type has its own risk parameters. Maximum LTV caps how much
        you can borrow against it; the liquidation threshold is the point at which the
        position becomes eligible for liquidation.
      </p>
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3 font-medium">Asset</th>
              <th className="px-4 py-3 text-right font-medium">Max LTV</th>
              <th className="px-4 py-3 text-right font-medium">Liq. threshold</th>
              <th className="hidden px-4 py-3 text-right font-medium sm:table-cell">Oracle price</th>
              <th className="hidden px-4 py-3 text-right font-medium sm:table-cell">Approval</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {COLLATERAL.map((a) => (
              <tr key={a.symbol} className="bg-card">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <AssetIcon symbol={a.symbol} className="size-7" />
                    <div>
                      <p className="font-semibold text-foreground">{a.symbol}</p>
                      <p className="text-xs text-muted-foreground">{a.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-foreground">
                  {pct(a.maxLtv, 0)}
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-foreground">
                  {pct(a.liquidationThreshold, 0)}
                </td>
                <td className="hidden px-4 py-3 text-right font-mono tabular-nums text-foreground sm:table-cell">
                  {usd(a.price)}
                </td>
                <td className="hidden px-4 py-3 text-right text-muted-foreground sm:table-cell">
                  {a.isErc20 ? 'ERC-20' : 'Native'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}

function Interest() {
  return (
    <Section id="interest" title="Interest rate model">
      <p>
        Borrow interest is variable and driven by utilization — the share of available
        ICFT liquidity currently borrowed. As utilization rises, the borrow APR
        increases to incentivize repayment and new supply.
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        <HighlightCard label="Current borrow APR" value={pct(ICFT.borrowApr)} accent />
        <HighlightCard label="Utilization" value={pct(ICFT.utilization)} />
        <HighlightCard
          label="Available liquidity"
          value={`${num(ICFT.availableLiquidity, 0)}`}
          sub="ICFT"
        />
      </div>
      <p className="rounded-xl border border-border bg-card p-4 font-mono text-sm text-foreground">
        interest_owed = principal × borrowAPR × (time_elapsed / 1 year)
      </p>
      <p className="text-sm">
        Interest accrues continuously against your principal and is settled whenever
        you repay. Repayments are applied to outstanding interest first, then to
        principal.
      </p>
    </Section>
  )
}

function Risk() {
  const pos = getPosition()
  return (
    <Section id="risk" title="Risk & liquidation">
      <p>
        A position&apos;s safety is measured by its <strong className="text-foreground">health
        factor</strong> — the ratio of liquidation-adjusted collateral to debt. Above 1.0 the
        position is safe; at or below 1.0 it can be liquidated.
      </p>
      <p className="rounded-xl border border-border bg-card p-4 font-mono text-sm text-foreground">
        health_factor = (collateral_value × liquidation_threshold) / total_debt
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        <HighlightCard
          label="Healthy"
          value="≥ 1.5"
          sub="Comfortable buffer"
          tone="success"
        />
        <HighlightCard
          label="At risk"
          value="1.05 – 1.5"
          sub="Monitor closely"
          tone="warning"
        />
        <HighlightCard
          label="Liquidatable"
          value="≤ 1.05"
          sub="Collateral can be seized"
          tone="danger"
        />
      </div>
      <p className="text-sm">
        Worked example: with the sample position of {usd(pos.collateralValue)} collateral, a
        weighted liquidation threshold of {pct(pos.liquidationThreshold)} and {usd(pos.debt)} of
        debt, the health factor is{' '}
        <span className="font-mono text-foreground">{pos.healthFactor.toFixed(2)}</span> — a{' '}
        <span className="text-success">{pos.status}</span> position.
      </p>
    </Section>
  )
}

function Lifecycle() {
  const flows = [
    { action: 'Deposit', desc: 'Add collateral, increasing borrow capacity.', contract: 'LendingPool' },
    { action: 'Borrow', desc: 'Mint ICFT up to your max LTV.', contract: 'LendingPool · ICFT' },
    { action: 'Repay', desc: 'Return ICFT to reduce debt and interest.', contract: 'LendingPool' },
    { action: 'Withdraw', desc: 'Reclaim collateral within safe limits.', contract: 'LendingPool' },
    { action: 'Liquidate', desc: 'Third parties repay unhealthy debt for a collateral bonus.', contract: 'LiquidationEngine' },
  ]
  return (
    <Section id="lifecycle" title="Borrow lifecycle">
      <p>
        Every action routes through a dedicated contract. ERC-20 collateral (wstETH,
        wBTC) requires a one-time token approval before its first deposit or repay.
      </p>
      <div className="space-y-2.5">
        {flows.map((f) => (
          <div
            key={f.action}
            className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold text-foreground">{f.action}</p>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
            <span className="w-fit rounded-md bg-secondary/60 px-2.5 py-1 font-mono text-xs text-muted-foreground">
              {f.contract}
            </span>
          </div>
        ))}
      </div>
    </Section>
  )
}

function Contracts() {
  return (
    <Section id="contracts" title="Contract addresses">
      <p>
        All contracts are deployed on {NETWORK.name} (chain ID {NETWORK.chainId}). Always
        verify addresses against official sources before interacting.
      </p>
      <div className="space-y-2.5">
        {CONTRACTS.map((c) => (
          <ContractRow key={c.label} label={c.label} address={c.address} />
        ))}
      </div>
    </Section>
  )
}

function ContractRow({ label, address }: { label: string; address: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard?.writeText(address).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
      <div className="min-w-0">
        <p className="font-semibold text-foreground">{label}</p>
        <p className="truncate font-mono text-xs text-muted-foreground">{address}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={copy}
          className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          aria-label={`Copy ${label} address`}
        >
          {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
        </button>
        <a
          href={`${NETWORK.explorer}/address/${address}`}
          target="_blank"
          rel="noreferrer"
          className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          aria-label={`View ${label} on explorer`}
        >
          <ExternalLink className="size-4" />
        </a>
      </div>
    </div>
  )
}

function Faq() {
  const items = [
    {
      q: 'What is ICFT?',
      a: 'ICFT is a USD-pegged stable asset minted against overcollateralized deposits. Every ICFT in circulation is backed by collateral worth more than its face value.',
    },
    {
      q: 'What happens if my health factor drops?',
      a: 'If your health factor falls to 1.0 or below, your position becomes eligible for liquidation. Liquidators repay part of your debt in exchange for your collateral at a discount. Keep a buffer by repaying debt or adding collateral.',
    },
    {
      q: 'Do I earn interest on collateral?',
      a: 'This frontend focuses on borrowing. Collateral secures your loan and determines borrowing power; borrow interest accrues on your outstanding ICFT debt.',
    },
    {
      q: 'Why do some assets need approval?',
      a: 'ERC-20 tokens like wstETH and wBTC require a one-time approval transaction so the protocol can move them on deposit or repay. Native ETH does not.',
    },
  ]
  return (
    <Section id="faq" title="FAQ">
      <div className="space-y-2.5">
        {items.map((item) => (
          <details
            key={item.q}
            className="group rounded-xl border border-border bg-card p-4 [&_summary]:list-none"
          >
            <summary className="flex cursor-pointer items-center justify-between font-medium text-foreground">
              {item.q}
              <span className="ml-4 font-mono text-muted-foreground transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </Section>
  )
}

function HighlightCard({
  label,
  value,
  sub,
  accent,
  tone,
}: {
  label: string
  value: string
  sub?: string
  accent?: boolean
  tone?: 'success' | 'warning' | 'danger'
}) {
  const toneClass =
    tone === 'success'
      ? 'text-success'
      : tone === 'warning'
        ? 'text-warning'
        : tone === 'danger'
          ? 'text-destructive'
          : accent
            ? 'text-primary'
            : 'text-foreground'
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn('mt-1.5 font-mono text-lg font-semibold tabular-nums', toneClass)}>
        {value}
      </p>
      {sub ? <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p> : null}
    </div>
  )
}
