import Link from 'next/link'
import { Construction, ArrowLeft } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <main className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
      <div className="grid size-14 place-items-center rounded-2xl border border-border bg-card text-primary">
        <Construction className="size-6" />
      </div>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
      <p className="mt-2 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      <Link href="/dashboard" className={cn(buttonVariants({ size: 'lg' }), 'mt-6')}>
        <ArrowLeft className="size-4" />
        Back to Dashboard
      </Link>
    </main>
  )
}
