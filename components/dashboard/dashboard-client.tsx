'use client'

import { useState } from 'react'
import { ArrowDownToLine, HandCoins, RotateCcw, ArrowUpFromLine } from 'lucide-react'
import { useWallet } from '@/components/wallet-provider'
import { ConnectGate } from '@/components/dashboard/connect-gate'
import { NetworkBar } from '@/components/dashboard/network-bar'
import { ProtocolStats } from '@/components/dashboard/protocol-stats'
import { PositionPanel } from '@/components/dashboard/position-panel'
import { CollateralBreakdown } from '@/components/dashboard/collateral-breakdown'
import { ActionModal, type ActionType } from '@/components/dashboard/action-modal'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/reveal'

const ACTIONS: { key: Exclude<ActionType, null>; label: string; icon: typeof HandCoins; variant: 'default' | 'secondary' | 'outline' }[] = [
  { key: 'deposit', label: 'Deposit Collateral', icon: ArrowDownToLine, variant: 'default' },
  { key: 'borrow', label: 'Borrow ICFT', icon: HandCoins, variant: 'secondary' },
  { key: 'repay', label: 'Repay ICFT', icon: RotateCcw, variant: 'secondary' },
  { key: 'withdraw', label: 'Withdraw Collateral', icon: ArrowUpFromLine, variant: 'outline' },
]

export function DashboardClient() {
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Header />

      <div className="mt-6 space-y-6">
        <Reveal direction="down">
          <NetworkBar />
        </Reveal>

        {/* Quick actions */}
        <Reveal direction="up">
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
        </Reveal>

        <Reveal direction="up" delay={80}>
          <section>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Protocol statistics
            </h2>
            <ProtocolStats />
          </section>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal direction="left">
            <PositionPanel />
          </Reveal>
          <Reveal direction="right">
            <CollateralBreakdown onAction={setAction} />
          </Reveal>
        </div>
      </div>

      <ActionModal action={action} onClose={() => setAction(null)} />
    </div>
  )
}

function Header() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Monitor the protocol and manage your position.
      </p>
    </div>
  )
}
