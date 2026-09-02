'use client'

import { useMemo, useState } from 'react'
import { Loader2, CheckCircle2, ExternalLink, AlertTriangle } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { AssetIcon } from '@/components/asset-icon'
import { cn } from '@/lib/utils'
import { usd, num, pct } from '@/lib/format'
import {
  COLLATERAL,
  ICFT,
  NETWORK,
  getPosition,
  type AssetSymbol,
} from '@/lib/protocol'

export type ActionType = 'deposit' | 'borrow' | 'repay' | 'withdraw' | null

type TxState = 'idle' | 'approving' | 'approved' | 'confirm' | 'submitted' | 'confirmed'

const TITLES: Record<Exclude<ActionType, null>, string> = {
  deposit: 'Deposit Collateral',
  borrow: 'Borrow ICFT',
  repay: 'Repay ICFT',
  withdraw: 'Withdraw Collateral',
}

export function ActionModal({ action, onClose }: { action: ActionType; onClose: () => void }) {
  const open = action !== null
  const isAssetAction = action === 'deposit' || action === 'withdraw'

  const [asset, setAsset] = useState<AssetSymbol>('ETH')
  const [amount, setAmount] = useState('')
  const [tx, setTx] = useState<TxState>('idle')

  const position = getPosition()
  const selected = COLLATERAL.find((a) => a.symbol === asset)!
  const amt = Number.parseFloat(amount) || 0

  // Which balance / cap applies for the current action
  const context = useMemo(() => {
    switch (action) {
      case 'deposit':
        return { balanceLabel: 'Wallet balance', balance: selected.walletBalance, unit: asset, usd: amt * selected.price }
      case 'withdraw':
        return { balanceLabel: 'Deposited', balance: selected.supplied, unit: asset, usd: amt * selected.price }
      case 'borrow':
        return { balanceLabel: 'Available to borrow', balance: position.availableBorrow, unit: 'USD', usd: amt }
      case 'repay':
        return { balanceLabel: 'ICFT wallet balance', balance: ICFT.walletBalance, unit: 'ICFT', usd: amt }
      default:
        return { balanceLabel: '', balance: 0, unit: '', usd: 0 }
    }
  }, [action, asset, amt, selected, position.availableBorrow])

  // Estimated LTV after the action
  const estLtv = useMemo(() => {
    const cv = position.collateralValue
    const debt = position.debt
    switch (action) {
      case 'deposit':
        return debt / (cv + amt * selected.price || 1)
      case 'withdraw':
        return debt / Math.max(1, cv - amt * selected.price)
      case 'borrow':
        return (debt + amt) / (cv || 1)
      case 'repay':
        return Math.max(0, (debt - amt) / (cv || 1))
      default:
        return position.ltv
    }
  }, [action, amt, selected, position])

  const needsApproval =
    (action === 'deposit' && selected.isErc20) || action === 'repay'

  const overBalance = amt > context.balance + 1e-9
  const unsafe = (action === 'borrow' || action === 'withdraw') && estLtv > position.liquidationThreshold
  const disabled = amt <= 0 || overBalance || tx === 'approving' || tx === 'submitted'

  function reset() {
    setAmount('')
    setTx('idle')
    setAsset('ETH')
  }

  function handleClose() {
    reset()
    onClose()
  }

  function handleApprove() {
    setTx('approving')
    setTimeout(() => setTx('approved'), 1400)
  }

  function handleSubmit() {
    setTx('submitted')
    setTimeout(() => setTx('confirmed'), 1800)
  }

  function setMax() {
    setAmount(String(context.balance))
  }

  if (!action) return null

  return (
    <Modal open={open} onClose={handleClose} title={TITLES[action]}>
      {tx === 'confirmed' ? (
        <div className="flex flex-col items-center py-4 text-center">
          <CheckCircle2 className="size-12 text-success" />
          <p className="mt-4 text-lg font-semibold">Transaction confirmed</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {TITLES[action]} of {num(amt)} {isAssetAction ? asset : 'ICFT'} was successful.
          </p>
          <a
            href={`${NETWORK.explorer}/tx/0x0`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            View on explorer <ExternalLink className="size-3.5" />
          </a>
          <Button size="lg" className="mt-6 w-full" onClick={handleClose}>
            Done
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Asset selector */}
          {isAssetAction && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Select asset
              </p>
              <div className="grid grid-cols-3 gap-2">
                {COLLATERAL.map((a) => (
                  <button
                    key={a.symbol}
                    onClick={() => {
                      setAsset(a.symbol)
                      setTx('idle')
                    }}
                    className={cn(
                      'flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2.5 text-sm font-medium transition-colors',
                      asset === a.symbol
                        ? 'border-primary/50 bg-primary/10 text-foreground'
                        : 'border-border text-muted-foreground hover:bg-secondary',
                    )}
                  >
                    <AssetIcon symbol={a.symbol} className="size-5 text-xs" />
                    {a.symbol}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Balance row */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{context.balanceLabel}</span>
            <span className="font-mono tabular-nums">
              {num(context.balance)} {context.unit === 'USD' ? '' : context.unit}
              {context.unit === 'USD' ? usd(context.balance) : ''}
            </span>
          </div>

          {/* Amount input */}
          <div className="rounded-xl border border-border bg-background p-3">
            <div className="flex items-center gap-2">
              <input
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                className="w-full bg-transparent font-mono text-2xl tabular-nums outline-none placeholder:text-muted-foreground/50"
              />
              <button
                onClick={setMax}
                className="rounded-md border border-border px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                MAX
              </button>
              <div className="flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5">
                <AssetIcon symbol={isAssetAction ? asset : 'ICFT'} className="size-5 text-xs" />
                <span className="text-sm font-medium">{isAssetAction ? asset : 'ICFT'}</span>
              </div>
            </div>
            <p className="mt-1.5 font-mono text-xs text-muted-foreground">
              ≈ {usd(context.usd)}
            </p>
          </div>

          {/* Preview rows */}
          <div className="space-y-2 rounded-xl border border-border bg-secondary/30 p-3 text-sm">
            {(action === 'borrow' || action === 'repay') && (
              <Row label="Borrow APR" value={pct(ICFT.borrowApr)} />
            )}
            <Row label="Current LTV" value={pct(position.ltv)} />
            <Row
              label="Estimated LTV after"
              value={pct(estLtv)}
              valueClass={unsafe ? 'text-destructive' : estLtv > position.ltv ? 'text-warning' : 'text-success'}
            />
          </div>

          {/* Warnings */}
          {overBalance && (
            <Notice tone="error">Amount exceeds your {context.balanceLabel.toLowerCase()}.</Notice>
          )}
          {unsafe && !overBalance && (
            <Notice tone="error">
              This action would push your position past the liquidation threshold.
            </Notice>
          )}

          {/* Transaction status line */}
          {(tx === 'approving' || tx === 'submitted') && (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-2.5 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin text-primary" />
              {tx === 'approving' ? 'Waiting for wallet confirmation…' : 'Transaction submitted, awaiting confirmation…'}
            </div>
          )}

          {/* Action buttons — ERC-20 two-step where required */}
          {needsApproval && tx !== 'approved' ? (
            <div className="space-y-2">
              <Button
                size="lg"
                className="w-full"
                disabled={disabled}
                onClick={handleApprove}
              >
                {tx === 'approving' ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Approving {isAssetAction ? asset : 'ICFT'}…
                  </>
                ) : (
                  <>Step 1 · Approve {isAssetAction ? asset : 'ICFT'}</>
                )}
              </Button>
              <Button size="lg" variant="secondary" className="w-full" disabled>
                Step 2 · {TITLES[action].split(' ')[0]}
              </Button>
            </div>
          ) : (
            <Button
              size="lg"
              className="w-full"
              disabled={disabled || unsafe}
              onClick={handleSubmit}
            >
              {tx === 'submitted' ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Confirming…
                </>
              ) : (
                TITLES[action]
              )}
            </Button>
          )}
        </div>
      )}
    </Modal>
  )
}

function Row({
  label,
  value,
  valueClass,
}: {
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn('font-mono tabular-nums', valueClass)}>{value}</span>
    </div>
  )
}

function Notice({ children, tone }: { children: React.ReactNode; tone: 'error' | 'warn' }) {
  return (
    <div
      className={cn(
        'flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm',
        tone === 'error'
          ? 'border-destructive/30 bg-destructive/10 text-destructive'
          : 'border-warning/30 bg-warning/10 text-warning',
      )}
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </div>
  )
}
