import { AgentActivityCard } from '@/components/app/dashboard/agent-activity-card'
import { DiagnosticMetricsCard } from '@/components/app/dashboard/diagnostic-metrics-card'
import { DashboardHeader } from '@/components/app/dashboard/header'
import { QuickActionsCard } from '@/components/app/dashboard/quick-actions-card'
import { RecentCasesCard } from '@/components/app/dashboard/recent-cases-card'
import { DashboardShell } from '@/components/app/dashboard/shell'
import { SystemStatusCard } from '@/components/app/dashboard/system-status-card'

export default function Dashboard() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        subheading="Overview of your SwordSymphony system"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SystemStatusCard className="md:col-span-2 lg:col-span-1" />
        <QuickActionsCard className="md:col-span-2 lg:col-span-1" />
        <RecentCasesCard className="md:col-span-2 lg:col-span-1" />
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <DiagnosticMetricsCard />
        <AgentActivityCard />
      </div>
    </DashboardShell>
  )
}
