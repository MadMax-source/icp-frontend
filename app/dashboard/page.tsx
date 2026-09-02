import type { Metadata } from 'next'
import { DashboardClient } from '@/components/dashboard/dashboard-client'

export const metadata: Metadata = {
  title: 'Dashboard — ICFT Protocol',
  description: 'Monitor protocol statistics and manage your ICFT lending position.',
}

export default function DashboardPage() {
  return (
    <main className="min-h-[calc(100svh-4rem)]">
      <DashboardClient />
    </main>
  )
}
