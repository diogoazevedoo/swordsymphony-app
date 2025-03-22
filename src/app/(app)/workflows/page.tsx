'use client'

import { DashboardShell } from '@/components/app/dashboard/shell'
import { useWorkflows } from '@/hooks/use-workflow'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Workflow,
  FileSymlink,
  Database,
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
  ArrowUpRight,
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
import { useRouter } from 'next/navigation'

export default function WorkflowsPage() {
  const router = useRouter()
  const { data: workflows, isLoading, error } = useWorkflows()
  const [searchQuery, setSearchQuery] = useState('')

  const getWorkflowIcon = (type = 'default') => {
    switch (type.toLowerCase()) {
      case 'diagnostic':
        return <Database className="h-4 w-4" />
      case 'treatment':
        return <FileSymlink className="h-4 w-4" />
      default:
        return <Workflow className="h-4 w-4" />
    }
  }

  const getWorkflowTypeColor = (type = 'default') => {
    switch (type.toLowerCase()) {
      case 'diagnostic':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
      case 'treatment':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
      default:
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
    }
  }

  const getStatusIcon = (status = 'draft') => {
    switch (status.toLowerCase()) {
      case 'draft':
        return <Clock className="h-3 w-3" />
      case 'running':
        return <Loader2 className="h-3 w-3 animate-spin" />
      case 'active':
        return <CheckCircle2 className="h-3 w-3" />
      case 'error':
        return <AlertCircle className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const getStatusColor = (status = 'draft') => {
    switch (status.toLowerCase()) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'running':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'error':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getWorkflowType = (workflow: any) => {
    if (workflow.tags?.includes('diagnostic')) return 'diagnostic'
    if (workflow.tags?.includes('treatment')) return 'treatment'
    return 'default'
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getWorkflowStatus = (workflow: any) => {
    return workflow.status || 'active'
  }

  const filteredWorkflows = workflows?.filter(
    (workflow) =>
      workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  )

  return (
    <DashboardShell>
      <div className="flex flex-col space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Workflows</h1>
            <p className="text-muted-foreground mt-1">
              Design and manage custom diagnostic and treatment workflows
            </p>
          </div>
          <Button asChild size="sm" className="w-full sm:w-auto">
            <Link href="/workflows/builder">
              <Plus className="mr-2 h-4 w-4" />
              New Workflow
            </Link>
          </Button>
        </div>

        {/* Search and filter bar */}
        {!isLoading && workflows && workflows.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search workflows..."
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
                <DropdownMenuItem onClick={() => setSearchQuery('diagnostic')}>
                  <Database className="mr-2 h-4 w-4 text-purple-500" />
                  Diagnostic Workflows
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchQuery('treatment')}>
                  <FileSymlink className="mr-2 h-4 w-4 text-green-500" />
                  Treatment Workflows
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchQuery('emergency')}>
                  <Zap className="mr-2 h-4 w-4 text-amber-500" />
                  Emergency Workflows
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
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
            <h3 className="text-lg font-medium mb-2">
              Failed to load workflows
            </h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              An error occurred while loading the workflows. Please try again
              later.
            </p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </Card>
      ) : !workflows || workflows.length === 0 ? (
        <Card className="border-dashed border-2">
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <Workflow className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No workflows found</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Get started by creating your first custom workflow for diagnosis
              and treatment.
            </p>
            <Button asChild>
              <Link href="/workflows/builder">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Workflow
              </Link>
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {searchQuery && filteredWorkflows?.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground/60 mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No matching workflows
              </h3>
              <p className="text-muted-foreground mb-4">
                No workflows match your search for "{searchQuery}".
              </p>
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {filteredWorkflows?.map((workflow) => (
                <Link
                  key={workflow.id}
                  href={`/workflows/${workflow.id}`}
                  className="block group"
                >
                  <Card className="overflow-hidden border p-3 h-full hover:border-primary/50 hover:shadow-sm transition-all duration-200">
                    <div className="flex items-start justify-between mb-2.5">
                      <div className="flex items-start gap-2.5">
                        <div
                          className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-full shrink-0 mt-0.5',
                            getWorkflowTypeColor(getWorkflowType(workflow)),
                          )}
                        >
                          {getWorkflowIcon(getWorkflowType(workflow))}
                        </div>
                        <div>
                          <h3 className="font-medium text-sm leading-tight">
                            {workflow.name}
                          </h3>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {workflow.tags &&
                              workflow.tags.length > 0 &&
                              workflow.tags.slice(0, 2).map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0.5 h-5 capitalize"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            {workflow.tags && workflow.tags.length > 2 && (
                              <Badge
                                variant="outline"
                                className="text-[10px] px-1.5 py-0.5 h-5"
                              >
                                +{workflow.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-1.5 ml-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            'flex items-center gap-1 px-1.5 py-0.5 h-5 text-[10px] capitalize shrink-0',
                            getStatusColor(getWorkflowStatus(workflow)),
                          )}
                        >
                          {getStatusIcon(getWorkflowStatus(workflow))}
                          <span>{getWorkflowStatus(workflow)}</span>
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
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.preventDefault()
                                router.push(
                                  `/workflows/builder?id=${workflow.id}`,
                                )
                              }}
                            >
                              Edit Workflow
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.preventDefault()
                                router.push(`/workflows/${workflow.id}/run`)
                              }}
                            >
                              Run Workflow
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => e.preventDefault()}
                            >
                              Duplicate Workflow
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={(e) => e.preventDefault()}
                            >
                              Delete Workflow
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3 min-h-[2.5rem]">
                      {workflow.description ||
                        'A custom workflow for medical diagnosis and treatment.'}
                    </p>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground flex items-center">
                          <Database className="h-3 w-3 mr-1" />
                          {workflow.step_count || 0} steps
                        </span>
                        {workflow.version && (
                          <span className="text-[10px] text-muted-foreground">
                            v{workflow.version}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground group-hover:text-primary transition-colors flex items-center">
                        View details
                        <ArrowUpRight className="h-3 w-3 ml-0.5 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
