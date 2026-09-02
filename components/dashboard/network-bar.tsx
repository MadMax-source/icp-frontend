'use client'

import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NETWORK } from '@/lib/protocol'
import { shortAddress } from '@/lib/format'
import { useWallet } from '@/components/wallet-provider'

export function NetworkBar() {
  const { address, wrongNetwork, switchNetwork } = useWallet()

  if (wrongNetwork) {
    return (
      <div className="flex flex-col gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-destructive">
          <AlertTriangle className="size-5" />
          <div>
            <p className="text-sm font-semibold">Wrong network</p>
            <p className="text-sm">Please switch to {NETWORK.name} to continue.</p>
          </div>
        </div>
        <Button size="lg" variant="destructive" onClick={switchNetwork}>
          Switch Network
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-border bg-card px-4 py-3">
      <Field label="Network">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-success" />
          {NETWORK.name}
        </span>
      </Field>
      <Divider />
      <Field label="Chain ID">{NETWORK.chainId}</Field>
      <Divider />
      <Field label="Wallet">{address ? shortAddress(address) : '—'}</Field>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-mono text-sm tabular-nums">{children}</p>
    </div>
  )
}

function Divider() {
  return <div className="hidden h-8 w-px bg-border sm:block" />
}
