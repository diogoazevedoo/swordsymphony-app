'use client'

import { DashboardShell } from '@/components/app/dashboard/shell'
import { useAgents } from '@/hooks/use-agents'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Brain,
  FileSymlink,
  Network,
  Zap,
  Plus,
  AlertTriangle,
  Search,
  Filter,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'

export default function AgentsPage() {
  const { data: agents, isLoading, error } = useAgents()
  const [searchQuery, setSearchQuery] = useState('')

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

  const getStatusIcon = (status = 'idle') => {
    switch (status.toLowerCase()) {
      case 'idle':
        return <Clock className="h-3 w-3" />
      case 'busy':
        return <Loader2 className="h-3 w-3 animate-spin" />
      case 'complete':
        return <CheckCircle2 className="h-3 w-3" />
      case 'error':
        return <AlertCircle className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const getStatusColor = (status = 'idle') => {
    switch (status.toLowerCase()) {
      case 'idle':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'busy':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'complete':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'error':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const filteredAgents = agents?.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <DashboardShell>
      <div className="flex flex-col space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Agents</h1>
            <p className="text-muted-foreground mt-1">
              View and manage the AI agents in your system
            </p>
          </div>
          <Button asChild size="sm" className="w-full sm:w-auto">
            <Link href="/agents/new">
              <Plus className="mr-2 h-4 w-4" />
              New Agent
            </Link>
          </Button>
        </div>

        {/* Search and filter bar */}
        {!isLoading && agents && agents.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSearchQuery('intake')}>
                  <FileSymlink className="mr-2 h-4 w-4 text-blue-500" />
                  Intake Agents
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchQuery('diagnostic')}>
                  <Brain className="mr-2 h-4 w-4 text-purple-500" />
                  Diagnostic Agents
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchQuery('treatment')}>
                  <Network className="mr-2 h-4 w-4 text-green-500" />
                  Treatment Agents
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchQuery('custom')}>
                  <Zap className="mr-2 h-4 w-4 text-amber-500" />
                  Custom Agents
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden border p-3">
              <div className="flex items-center gap-3 mb-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-16 ml-auto" />
              </div>
              <Skeleton className="h-4 w-full mb-1.5" />
              <Skeleton className="h-4 w-3/4 mb-3" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-3.5 w-16" />
                <Skeleton className="h-8 w-20" />
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="border-destructive/20 bg-destructive/5">
          <div className="p-6 flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-destructive/10 p-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-lg font-medium mb-2">Failed to load agents</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              An error occurred while loading the AI agents. Please check your
              connection and try again.
            </p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </Card>
      ) : !agents || agents.length === 0 ? (
        <Card className="border-dashed border-2">
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No agents found</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              You don't have any AI agents configured yet. Create your first
              agent to get started.
            </p>
            <Button asChild>
              <Link href="/agents/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Agent
              </Link>
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {searchQuery && filteredAgents?.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground/60 mb-4" />
              <h3 className="text-lg font-medium mb-2">No matching agents</h3>
              <p className="text-muted-foreground mb-4">
                No agents match your search for "{searchQuery}".
              </p>
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredAgents?.map((agent) => (
                <Link
                  key={agent.id}
                  href={`/agents/${agent.id}`}
                  className="block group"
                >
                  <Card className="overflow-hidden border p-3 h-full hover:border-primary/50 hover:shadow-sm transition-all duration-200">
                    <div className="flex items-start justify-between mb-2.5">
                      <div className="flex items-start gap-2.5">
                        <div
                          className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-full shrink-0 mt-0.5',
                            getAgentTypeColor(agent.type),
                          )}
                        >
                          {getAgentIcon(agent.type)}
                        </div>
                        <div>
                          <h3 className="font-medium text-sm leading-tight">
                            {agent.name}
                          </h3>
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-[10px] px-1.5 py-0.5 h-5 mt-1 capitalize',
                              getAgentTypeColor(agent.type),
                            )}
                          >
                            {agent.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-start gap-1.5 ml-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            'flex items-center gap-1 px-1.5 py-0.5 h-5 text-[10px] capitalize shrink-0',
                            getStatusColor(agent.status),
                          )}
                        >
                          {getStatusIcon(agent.status)}
                          <span>{agent.status || 'idle'}</span>
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.preventDefault()}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 shrink-0"
                            >
                              <MoreHorizontal className="h-3.5 w-3.5" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/agents/${agent.id}/edit`}>
                                Edit Agent
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Deploy Agent</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate Agent</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Delete Agent
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3 min-h-[2.5rem]">
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

                    <div className="flex justify-between items-center">
                      {agent.version && (
                        <span className="text-[10px] text-muted-foreground">
                          v{agent.version}
                        </span>
                      )}
                      <div className="text-xs text-muted-foreground group-hover:text-primary transition-colors ml-auto">
                        View details
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </DashboardShell>
  )
}
