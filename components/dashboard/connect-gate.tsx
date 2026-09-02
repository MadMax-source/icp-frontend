'use client'

import { Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWallet } from '@/components/wallet-provider'
import { NETWORK } from '@/lib/protocol'

export function ConnectGate() {
  const { connect } = useWallet()
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-border bg-card px-6 py-14 text-center">
      <div className="grid size-14 place-items-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
        <Wallet className="size-6" />
      </div>
      <h2 className="mt-5 text-xl font-semibold">Connect your wallet</h2>
      <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
        Connect a {NETWORK.name} wallet to view your position, protocol statistics, and manage your
        collateral and ICFT debt.
      </p>
      <Button size="lg" className="mt-6 w-full" onClick={connect}>
        <Wallet className="size-4" />
        Connect Wallet
      </Button>
    </div>
  )
}
