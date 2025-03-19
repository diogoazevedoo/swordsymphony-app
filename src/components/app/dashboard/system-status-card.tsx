'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/icons'
import { cn } from '@/lib/utils'
import { useSystemStatus } from '@/hooks/use-system-status'
import { Skeleton } from '@/components/ui/skeleton'

interface SystemStatusCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SystemStatusCard({
  className,
  ...props
}: SystemStatusCardProps) {
  const { data: systemStatus, isLoading, error } = useSystemStatus()

  return (
    <Card className={cn('', className)} {...props}>
      <CardHeader>
        <CardTitle className="text-lg font-medium">System Status</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex h-24 items-center justify-center rounded-md border border-dashed p-2">
            <p className="text-sm text-muted-foreground">
              Failed to load system status
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {systemStatus?.agents.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icons.agent className="h-5 w-5 text-muted-foreground" />
                  <span>{agent.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'h-2.5 w-2.5 rounded-full',
                      agent.status === 'complete' && 'bg-green-500',
                      agent.status === 'idle' && 'bg-amber-500',
                      agent.status === 'busy' && 'bg-blue-500',
                      agent.status === 'error' && 'bg-red-500',
                    )}
                  />
                  <span className="text-sm capitalize">{agent.status}</span>
                </div>
              </div>
            ))}
            <div className="mt-6 pt-4 border-t border-border/40">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Active Threads
                </span>
                <span className="text-sm">
                  {systemStatus?.activeThreads || 0}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
