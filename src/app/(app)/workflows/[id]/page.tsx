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
import { Skeleton } from '@/components/ui/skeleton'
import {
  ArrowLeft,
  Pencil,
  Play,
  Calendar,
  User,
  FileJson,
  AlertTriangle,
  ArrowUpRight,
  Share2,
  Download,
  MoreHorizontal,
  Workflow,
} from 'lucide-react'
import Link from 'next/link'
import { useWorkflow } from '@/hooks/use-workflow'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { WorkflowDiagram } from '@/components/app/workflow/workflow-diagram'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function WorkflowDetailPage() {
  const params = useParams()
  const workflowId = params.id as string

  const { data: workflow, isLoading, error } = useWorkflow(workflowId)

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground -ml-2"
            asChild
          >
            <Link href="/workflows">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Back to Workflows
            </Link>
          </Button>
        </div>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div className="space-y-3">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
            <div className="flex gap-2 pt-1">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-[600px] md:col-span-2" />
          <Skeleton className="h-[400px]" />
        </div>
      </DashboardShell>
    )
  }

  if (error || !workflow) {
    return (
      <DashboardShell>
        <Button
          variant="ghost"
          size="sm"
          className="mb-8 text-muted-foreground hover:text-foreground -ml-2"
          asChild
        >
          <Link href="/workflows">
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to Workflows
          </Link>
        </Button>
        <Card className="border-destructive/20 bg-destructive/5">
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-destructive/10 p-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-lg font-medium mb-2">Workflow Not Found</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              The requested workflow could not be found or you don't have access
              to it.
            </p>
            <Button asChild>
              <Link href="/workflows">Return to Workflows</Link>
            </Button>
          </div>
        </Card>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground -ml-2 group"
          asChild
        >
          <Link href="/workflows">
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Workflows
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Workflow className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              {workflow.name}
            </h1>
          </div>
          <p className="text-muted-foreground ml-[52px]">
            {workflow.description}
          </p>

          {workflow.tags && workflow.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 ml-[52px]">
              {workflow.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs px-2 py-0.5 font-normal"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-[52px] md:ml-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex items-center">
                <Share2 className="mr-2 h-4 w-4" />
                <span>Share Workflow</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center">
                <Download className="mr-2 h-4 w-4" />
                <span>Export Workflow</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center text-destructive focus:text-destructive">
                <AlertTriangle className="mr-2 h-4 w-4" />
                <span>Delete Workflow</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" className="h-9" asChild>
            <Link href={`/workflows/builder?id=${workflow.id}`}>
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Edit
            </Link>
          </Button>
          <Button size="sm" className="h-9 group" asChild>
            <Link href={`/workflows/${workflow.id}/run`}>
              <Play className="h-3.5 w-3.5 mr-1.5" />
              Run Workflow
              <ArrowUpRight className="h-3.5 w-3.5 ml-1 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 md:min-h-[600px]">
        <Card className="md:col-span-2 flex flex-col h-full">
          <CardHeader className="pb-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-medium">
                  Workflow Diagram
                </CardTitle>
                <CardDescription>
                  Visual representation of the workflow
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow p-0 pb-0">
            <div className="w-full h-full border-t bg-muted/10 shadow-inner">
              <WorkflowDiagram workflow={workflow} />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">
                Workflow Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs uppercase text-muted-foreground font-medium tracking-wider">
                  ID
                </p>
                <p className="text-sm font-mono bg-muted/30 px-2 py-1 rounded text-muted-foreground break-all">
                  {workflow.id}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs uppercase text-muted-foreground font-medium tracking-wider">
                  Version
                </p>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p className="text-sm">v{workflow.version}</p>
                </div>
              </div>

              {workflow.author && (
                <div className="space-y-1">
                  <p className="text-xs uppercase text-muted-foreground font-medium tracking-wider">
                    Author
                  </p>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-sm">{workflow.author}</p>
                  </div>
                </div>
              )}

              <Separator className="my-2" />

              <div className="space-y-2">
                <p className="text-xs uppercase text-muted-foreground font-medium tracking-wider">
                  Steps
                </p>
                <div className="space-y-2">
                  {workflow.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className="bg-muted/20 border rounded-md p-3 hover:border-primary/50 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0 mt-0.5">
                          <span className="text-xs font-medium">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{step.name}</p>
                          <p className="text-xs text-muted-foreground mt-1 capitalize">
                            {step.type} using{' '}
                            {step.agent_type.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {(workflow.input_schema || workflow.output_schema) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">
                  Schema Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="input">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="input" className="text-xs">
                      Input Schema
                    </TabsTrigger>
                    <TabsTrigger value="output" className="text-xs">
                      Output Schema
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="input">
                    {workflow.input_schema ? (
                      <div className="bg-muted/20 p-3 rounded-md text-xs font-mono overflow-auto max-h-[300px] text-muted-foreground">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(workflow.input_schema, null, 2)}
                        </pre>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <FileJson className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No input schema defined</p>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="output">
                    {workflow.output_schema ? (
                      <div className="bg-muted/20 p-3 rounded-md text-xs font-mono overflow-auto max-h-[300px] text-muted-foreground">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(workflow.output_schema, null, 2)}
                        </pre>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <FileJson className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No output schema defined</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
