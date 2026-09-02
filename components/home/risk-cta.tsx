import Link from 'next/link'
import { ShieldAlert, ArrowRight } from 'lucide-react'

export function RiskCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl border border-warning/25 bg-warning/[0.04] p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid size-10 shrink-0 place-items-center rounded-lg border border-warning/30 bg-warning/10 text-warning">
              <ShieldAlert className="size-5" />
            </div>
            <div className="max-w-2xl">
              <h2 className="text-lg font-semibold">Understand the risk model</h2>
              <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted-foreground">
                Borrowing capacity depends on the value of your collateral and the protocol&apos;s
                risk parameters. Positions that exceed the liquidation threshold may become eligible
                for liquidation. Monitor your health factor and keep sufficient collateral.
              </p>
            </div>
          </div>
          <Link
            href="/docs#risk"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
          >
            Read risk docs
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
