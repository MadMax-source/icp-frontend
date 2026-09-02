import Link from 'next/link'
import { Logo } from '@/components/logo'
import { NETWORK } from '@/lib/protocol'

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <Logo className="size-6" />
          <span className="text-sm font-medium">ICFT Protocol</span>
          <span className="ml-2 rounded-full border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground">
            {NETWORK.name}
          </span>
        </div>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link href="/dashboard" className="hover:text-foreground">
            Dashboard
          </Link>
          <Link href="/markets" className="hover:text-foreground">
            Markets
          </Link>
          <Link href="/portfolio" className="hover:text-foreground">
            Portfolio
          </Link>
          <Link href="/docs" className="hover:text-foreground">
            Docs
          </Link>
        </nav>
        <p className="font-mono text-xs text-muted-foreground">
          Non-custodial · Testnet · Not audited
        </p>
      </div>
    </footer>
  )
}
