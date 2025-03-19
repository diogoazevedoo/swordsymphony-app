'use client'

import { useParams } from 'next/navigation'
import { DashboardShell } from '@/components/app/dashboard/shell'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ArrowLeft,
  Brain,
  FileSymlink,
  Network,
  Server,
  Code,
  Zap,
  AlertTriangle,
  Database,
  Settings,
  Info,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useAgentDetail } from '@/hooks/use-agent-details'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function AgentDetailPage() {
  const params = useParams()
  const agentId = params.id as string

  const { data: agent, isLoading, error } = useAgentDetail(agentId)

  const getAgentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'intake':
        return <FileSymlink className="h-5 w-5" />
      case 'diagnostic':
        return <Brain className="h-5 w-5" />
      case 'treatment':
        return <Network className="h-5 w-5" />
      default:
        return <Zap className="h-5 w-5" />
    }
  }

  const getAgentTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'intake':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
      case 'diagnostic':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
      case 'treatment':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
      default:
        return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
    }
  }

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="sm" className="mr-4" asChild>
            <Link href="/agents">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Agents
            </Link>
          </Button>
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid gap-6">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </DashboardShell>
    )
  }

  if (error || !agent) {
    return (
      <DashboardShell>
        <Button variant="ghost" size="sm" className="mb-8" asChild>
          <Link href="/agents">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Agents
          </Link>
        </Button>
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-medium mb-2">Agent Not Found</h3>
            <p className="text-muted-foreground mb-4">
              The requested agent could not be found or you don't have access to
              it.
            </p>
            <Button asChild>
              <Link href="/agents">Return to Agents</Link>
            </Button>
          </div>
        </Card>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="pt-2 pb-4 mb-6">
        <div className="flex flex-col gap-4">
          <Button variant="ghost" size="sm" className="w-fit" asChild>
            <Link href="/agents">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Agents
            </Link>
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-full mr-4',
                  getAgentTypeColor(agent.type),
                )}
              >
                {getAgentIcon(agent.type)}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{agent.name}</h1>
                <p className="text-muted-foreground">
                  {agent.description ||
                    `A ${agent.type} agent for the SwordSymphony system`}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-2 sm:mt-0">
              <Button variant="outline" asChild>
                <Link href={`/agents/${agentId}/edit`}>Edit Agent</Link>
              </Button>
              <Button>Deploy Agent</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Agent Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Agent ID
                </span>
                <code className="font-mono text-xs bg-muted p-1 rounded">
                  {agent.id}
                </code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Type
                </span>
                <Badge
                  variant="outline"
                  className={cn('capitalize', getAgentTypeColor(agent.type))}
                >
                  {agent.type}
                </Badge>
              </div>
              {agent.version && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Version
                  </span>
                  <span>{agent.version}</span>
                </div>
              )}
              {agent.author && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Author
                  </span>
                  <span>{agent.author}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Server className="h-5 w-5 mr-2" />
                AI Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              {agent.ai ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Provider
                    </span>
                    <span className="capitalize">{agent.ai.provider}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Model
                    </span>
                    <Badge variant="secondary">{agent.ai.model}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Temperature
                    </span>
                    <span>{agent.ai.temperature}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Max Tokens
                    </span>
                    <span>{agent.ai.max_tokens}</span>
                  </div>

                  {agent.ai.knowledge_sources &&
                    agent.ai.knowledge_sources.length > 0 && (
                      <div className="pt-2">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">
                          Knowledge Sources
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {agent.ai.knowledge_sources.map((source, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-primary/5"
                            >
                              {source}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No AI configuration defined
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Code className="h-5 w-5 mr-2" />
                Agent Configuration
              </CardTitle>
              <CardDescription>
                Detailed configuration for this agent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-md font-semibold flex items-center mb-3">
                  <Database className="h-4 w-4 mr-2" />
                  Input Schema
                </h3>
                {agent.inputs && agent.inputs.length > 0 ? (
                  <div className="space-y-3">
                    {agent.inputs.map((input, index) => (
                      <div key={index} className="border rounded-md p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{input.name}</h3>
                          <Badge
                            variant={input.required ? 'default' : 'outline'}
                          >
                            {input.required ? 'Required' : 'Optional'}
                          </Badge>
                        </div>
                        {input.schema && (
                          <pre className="bg-muted p-2 rounded text-xs w-full overflow-visible break-words whitespace-pre-wrap border">
                            {JSON.stringify(input.schema, null, 2)}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No input schema defined
                  </p>
                )}
              </div>

              <Separator />

              <div>
                <h3 className="text-md font-semibold flex items-center mb-3">
                  <Database className="h-4 w-4 mr-2" />
                  Output Schema
                </h3>
                {agent.outputs && agent.outputs.length > 0 ? (
                  <div className="space-y-3">
                    {agent.outputs.map((output, index) => (
                      <div key={index} className="border rounded-md p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{output.name}</h3>
                          <Badge
                            variant={output.required ? 'default' : 'outline'}
                          >
                            {output.required ? 'Required' : 'Optional'}
                          </Badge>
                        </div>
                        {output.schema && (
                          <pre className="bg-muted p-2 rounded text-xs w-full overflow-visible break-words whitespace-pre-wrap border">
                            {JSON.stringify(output.schema, null, 2)}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No output schema defined
                  </p>
                )}
              </div>

              {agent.ai?.system_prompt && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-md font-semibold flex items-center mb-3">
                      <Settings className="h-4 w-4 mr-2" />
                      System Prompt
                    </h3>
                    <div className="bg-muted p-4 rounded-md whitespace-pre-wrap text-sm border">
                      {agent.ai.system_prompt}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
