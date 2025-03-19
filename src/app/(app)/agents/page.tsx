'use client'

import { DashboardHeader } from '@/components/app/dashboard/header'
import { DashboardShell } from '@/components/app/dashboard/shell'
import { useAgents } from '@/hooks/use-agents'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Brain,
  FileSymlink,
  Network,
  Zap,
  Plus,
  AlertTriangle,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function AgentsPage() {
  const { data: agents, isLoading, error } = useAgents()

  const getAgentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'intake':
        return <FileSymlink className="h-4 w-4" />
      case 'diagnostic':
        return <Brain className="h-4 w-4" />
      case 'treatment':
        return <Network className="h-4 w-4" />
      default:
        return <Zap className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string = 'idle') => {
    switch (status) {
      case 'idle':
        return 'bg-yellow-500'
      case 'busy':
        return 'bg-blue-500'
      case 'complete':
        return 'bg-green-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <DashboardShell>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <DashboardHeader
          heading="AI Agents"
          subheading="View and manage the AI agents in your system"
        />
        <Button asChild className="w-full sm:w-auto">
          <Link href="/agents/new">
            <Plus className="mr-2 h-4 w-4" />
            New Agent
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[200px] w-full" />
          ))}
        </div>
      ) : error ? (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Failed to load agents</h3>
            <p className="text-muted-foreground mb-4">
              An error occurred while loading the AI agents. Please try again.
            </p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </Card>
      ) : !agents || agents.length === 0 ? (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <Zap className="h-12 w-12 text-muted-foreground/60 mb-4" />
            <h3 className="text-lg font-medium mb-2">No agents found</h3>
            <p className="text-muted-foreground mb-4">
              You don't have any AI agents configured yet.
            </p>
            <Button asChild>
              <Link href="/agents/new">Create Your First Agent</Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <Card key={agent.id} className="overflow-hidden border">
              <CardHeader className="bg-muted/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full mr-2',
                        agent.type.toLowerCase() === 'intake' &&
                          'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
                        agent.type.toLowerCase() === 'diagnostic' &&
                          'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
                        agent.type.toLowerCase() === 'treatment' &&
                          'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
                        agent.type.toLowerCase() === 'custom' &&
                          'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
                      )}
                    >
                      {getAgentIcon(agent.type)}
                    </div>
                    <CardTitle className="text-base font-medium">
                      {agent.name}
                    </CardTitle>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${getStatusColor(agent.status)}`}
                    />
                    <span className="ml-2 text-xs capitalize">
                      {agent.status || 'idle'}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-4">
                  {agent.description ||
                    `A${/^[aeiou]/i.test(agent.type) ? 'n' : ''} ${agent.type} agent responsible for processing ${
                      agent.type.toLowerCase() === 'intake'
                        ? 'and normalizing patient data'
                        : agent.type.toLowerCase() === 'diagnostic'
                          ? 'symptoms to generate diagnoses'
                          : agent.type.toLowerCase() === 'treatment'
                            ? 'diagnoses to create treatment plans'
                            : 'medical data'
                    }.`}
                </p>
                {agent.author && (
                  <p className="text-xs text-muted-foreground mb-2">
                    <span className="font-medium">Author:</span> {agent.author}
                  </p>
                )}
                {agent.version && (
                  <p className="text-xs text-muted-foreground mb-2">
                    <span className="font-medium">Version:</span>{' '}
                    {agent.version}
                  </p>
                )}
                <div className="flex justify-end mt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/agents/${agent.id}`}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}
