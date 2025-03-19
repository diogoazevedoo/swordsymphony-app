'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { Brain, FileSymlink, Network } from 'lucide-react'
import { useAgentActivities } from '@/hooks/use-agent-activities'

interface AgentActivityCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const agentIcons = {
  intake_agent: <FileSymlink className="h-4 w-4" />,
  diagnostic_agent: <Brain className="h-4 w-4" />,
  treatment_agent: <Network className="h-4 w-4" />,
}

export function AgentActivityCard({
  className,
  ...props
}: AgentActivityCardProps) {
  const { data, isLoading, error } = useAgentActivities()

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch (e) {
      return 'Unknown time'
    }
  }

  return (
    <Card className={cn('', className)} {...props}>
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Recent Agent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="flex h-24 items-center justify-center rounded-md border border-dashed p-2">
            <p className="text-sm text-muted-foreground">
              Failed to load agent activities
            </p>
          </div>
        ) : !data?.activities || data.activities.length === 0 ? (
          <div className="flex h-24 items-center justify-center rounded-md border border-dashed p-2">
            <p className="text-sm text-muted-foreground">
              No recent activities
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.activities.map((activity, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full',
                    activity.agent_id === 'intake_agent' &&
                      'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
                    activity.agent_id === 'diagnostic_agent' &&
                      'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
                    activity.agent_id === 'treatment_agent' &&
                      'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
                  )}
                >
                  {agentIcons[activity.agent_id as keyof typeof agentIcons] || (
                    <FileSymlink className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.agent_name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {activity.action} for case {activity.case_id}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatTime(activity.timestamp)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
