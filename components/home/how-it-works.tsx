import { Wallet, Coins, HandCoins, RotateCcw } from 'lucide-react'

const STEPS = [
  {
    icon: Wallet,
    title: 'Connect wallet',
    body: 'Connect a Sepolia-compatible wallet to interact with the protocol.',
  },
  {
    icon: Coins,
    title: 'Deposit collateral',
    body: 'Supply ETH, wstETH, or wBTC. ERC-20 assets require a one-time approval.',
  },
  {
    icon: HandCoins,
    title: 'Borrow ICFT',
    body: 'Mint ICFT against your collateral, up to your available borrowing capacity.',
  },
  {
    icon: RotateCcw,
    title: 'Repay & withdraw',
    body: 'Repay ICFT to reduce debt, then withdraw your collateral when your position is safe.',
  },
]

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
      <p className="mt-1 text-sm text-muted-foreground">Four steps from wallet to open position.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <div key={s.title} className="relative rounded-xl border border-border bg-card p-5">
            <span className="font-mono text-xs text-muted-foreground">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="mt-3 grid size-10 place-items-center rounded-lg border border-border bg-secondary/50 text-primary">
              <s.icon className="size-5" />
            </div>
            <h3 className="mt-4 font-medium">{s.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
