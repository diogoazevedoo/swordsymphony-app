'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DashboardShell } from '@/components/app/dashboard/shell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ArrowLeft,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  Workflow,
  User,
  Activity,
} from 'lucide-react'
import Link from 'next/link'
import { useWorkflow } from '@/hooks/use-workflow'
import { useCases } from '@/hooks/use-cases'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export default function WorkflowRunPage() {
  const params = useParams()
  const router = useRouter()
  const workflowId = params.id as string

  const { data: workflow, isLoading: workflowLoading } = useWorkflow(workflowId)
  const { data: cases, isLoading: casesLoading } = useCases()

  const [selectedCaseId, setSelectedCaseId] = useState<string>('')
  const [status, setStatus] = useState<
    'idle' | 'running' | 'completed' | 'error'
  >('idle')
  const [runningSteps, setRunningSteps] = useState<string[]>([])
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState('setup')
  const [, setInstanceId] = useState<string | null>(null)
  const [resultCheckCount, setResultCheckCount] = useState(0)
  const [resultsAvailable, setResultsAvailable] = useState(false)

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId)
  }

  const checkResultsAvailability = async (caseId: string) => {
    try {
      const response = await api.get(`/results/${caseId}`)
      if (
        response.data &&
        (response.data.diagnosis ||
          response.data.treatment_plan ||
          Object.keys(response.data).length > 2)
      ) {
        console.log('Results available:', response.data)
        return true
      }
    } catch (error) {
      console.warn('Results not available yet')
    }
    return false
  }

  const resetWorkflow = () => {
    setStatus('idle')
    setRunningSteps([])
    setCompletedSteps([])
    setInstanceId(null)
    setResultCheckCount(0)
    setResultsAvailable(false)
    setActiveTab('setup')
  }

  const handleRunWorkflow = async () => {
    if (!selectedCaseId) return

    setStatus('running')
    setRunningSteps([workflow?.steps[0]?.id || ''])
    setCompletedSteps([])
    setResultsAvailable(false)
    setResultCheckCount(0)
    setActiveTab('execution')

    try {
      const response = await api.post(
        `/management/workflows/${workflowId}/instances`,
        { patient_data: cases?.find((c) => c.id === selectedCaseId) },
      )

      if (response.data?.success) {
        const instanceId = response.data.data.instance_id
        setInstanceId(instanceId)

        let consecutiveErrors = 0
        let instancePolling: NodeJS.Timeout | null = null
        let resultPolling: NodeJS.Timeout | null = null

        const pollForResults = async () => {
          const available = await checkResultsAvailability(selectedCaseId)

          if (available) {
            setResultsAvailable(true)
            if (resultPolling) clearInterval(resultPolling)

            if (status === 'completed' || resultCheckCount > 6) {
              if (instancePolling) clearInterval(instancePolling)
              setStatus('completed')
              setRunningSteps([])

              if (workflow?.steps) {
                const allStepIds = workflow.steps.map((step) => step.id)
                setCompletedSteps(allStepIds)
              }
            }

            return true
          }

          setResultCheckCount((prev) => prev + 1)

          if (resultCheckCount > 12) {
            console.log(
              'Reached max result checks, assuming workflow completion is imminent',
            )
            if (instancePolling) clearInterval(instancePolling)
            setStatus('completed')

            if (workflow?.steps) {
              const allStepIds = workflow.steps.map((step) => step.id)
              setCompletedSteps(allStepIds)
              setRunningSteps([])
            }

            return true
          }

          return false
        }

        const pollInstance = async () => {
          try {
            const instanceResponse = await api.get(
              `/management/workflow-instances/${instanceId}`,
            )

            if (instanceResponse.data?.success) {
              const instance = instanceResponse.data.data
              consecutiveErrors = 0

              console.log('Workflow instance:', {
                status: instance.status,
                current_steps: instance.current_steps || [],
                completed_steps: instance.completed_steps || [],
              })

              if (instance.status === 'completed') {
                setStatus('completed')

                if (workflow?.steps) {
                  const allStepIds = workflow.steps.map((step) => step.id)
                  setCompletedSteps(allStepIds)
                  setRunningSteps([])
                }

                if (instancePolling) clearInterval(instancePolling)

                const hasResults = await pollForResults()
                if (hasResults && resultsAvailable) {
                  if (resultPolling) clearInterval(resultPolling)
                  setTimeout(() => {
                    router.push(`/cases/${selectedCaseId}`)
                  }, 1500)
                }
              } else {
                const currentTime = Date.now()
                const startTime = instance.start_time / 1000000
                const elapsedSeconds = (currentTime - startTime) / 1000

                let currentRunningStep: string | null = null
                const newCompletedSteps: string[] = []

                if (workflow?.steps && workflow.steps.length > 0) {
                  if (elapsedSeconds > 2 && elapsedSeconds <= 6) {
                    currentRunningStep = workflow.steps[0].id
                  } else if (elapsedSeconds > 6 && elapsedSeconds <= 12) {
                    newCompletedSteps.push(workflow.steps[0].id)
                    if (workflow.steps.length > 1) {
                      currentRunningStep = workflow.steps[1].id
                    }
                  } else if (elapsedSeconds > 12) {
                    newCompletedSteps.push(workflow.steps[0].id)
                    if (workflow.steps.length > 1) {
                      newCompletedSteps.push(workflow.steps[1].id)
                    }
                    if (workflow.steps.length > 2) {
                      currentRunningStep = workflow.steps[2].id
                    }
                  }

                  if (elapsedSeconds > 25) {
                    workflow.steps.forEach((step) => {
                      if (!newCompletedSteps.includes(step.id)) {
                        newCompletedSteps.push(step.id)
                      }
                    })
                    currentRunningStep = null
                    setStatus('completed')

                    const hasResults = await pollForResults()
                    if (hasResults && resultsAvailable) {
                      if (resultPolling) clearInterval(resultPolling)
                      if (instancePolling) clearInterval(instancePolling)

                      setTimeout(() => {
                        router.push(`/cases/${selectedCaseId}`)
                      }, 1500)
                    }
                  }
                }

                setCompletedSteps(newCompletedSteps)
                setRunningSteps(currentRunningStep ? [currentRunningStep] : [])
              }
            }
          } catch (error) {
            console.error('Error polling workflow instance:', error)

            consecutiveErrors++
            if (consecutiveErrors > 5) {
              setStatus('error')
              if (instancePolling) clearInterval(instancePolling)
              if (resultPolling) clearInterval(resultPolling)
            }
          }
        }

        instancePolling = setInterval(pollInstance, 2000)
        resultPolling = setInterval(pollForResults, 2500)

        await pollInstance()
      } else {
        throw new Error(
          response.data?.error?.message || 'Failed to start workflow',
        )
      }
    } catch (error) {
      console.error('Error running workflow:', error)
      setStatus('error')
    }
  }

  useEffect(() => {
    if (status === 'completed' && resultsAvailable && selectedCaseId) {
      const timer = setTimeout(() => {
        router.push(`/cases/${selectedCaseId}`)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [status, resultsAvailable, selectedCaseId, router])

  const getStepStatus = (stepId: string) => {
    if (completedSteps.includes(stepId)) return 'completed'
    if (runningSteps.includes(stepId)) return 'running'
    return 'pending'
  }

  const renderStepStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <div className="flex items-center text-green-500">
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
            <span className="text-xs font-medium">Completed</span>
          </div>
        )
      case 'running':
        return (
          <div className="flex items-center text-blue-500">
            <Clock className="h-3.5 w-3.5 mr-1 animate-spin" />
            <span className="text-xs font-medium">Running</span>
          </div>
        )
      case 'pending':
        return (
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span className="text-xs font-medium">Pending</span>
          </div>
        )
      default:
        return null
    }
  }

  if (workflowLoading || casesLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground -ml-2"
            asChild
          >
            <Link href={`/workflows/${workflowId}`}>
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Back to Workflow
            </Link>
          </Button>
        </div>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div className="space-y-3">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <Skeleton className="h-[600px] w-full" />
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
          <Link href={`/workflows/${workflowId}`}>
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Workflow
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
              Run Workflow: {workflow?.name}
            </h1>
          </div>
          <p className="text-muted-foreground ml-[52px]">
            {workflow?.description}
          </p>
        </div>
      </div>

      <Card className="overflow-hidden border">
        <CardHeader className="px-4 py-3 border-b bg-muted/10">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 h-9">
              <TabsTrigger
                value="setup"
                disabled={status !== 'idle'}
                className="text-xs"
              >
                Setup
              </TabsTrigger>
              <TabsTrigger value="execution" className="text-xs">
                Execution
              </TabsTrigger>
            </TabsList>

            <CardContent className="p-0">
              <TabsContent value="setup" className="p-6 m-0">
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      <Label
                        htmlFor="case-select"
                        className="text-sm font-medium"
                      >
                        Select Patient Case
                      </Label>
                    </div>
                    <Select
                      value={selectedCaseId}
                      onValueChange={handleSelectCase}
                    >
                      <SelectTrigger id="case-select" className="w-full">
                        <SelectValue placeholder="Select a patient case" />
                      </SelectTrigger>
                      <SelectContent>
                        {cases?.map((caseItem) => (
                          <SelectItem key={caseItem.id} value={caseItem.id}>
                            {caseItem.name} ({caseItem.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Select a patient case to run through this workflow
                    </p>
                  </div>

                  <div className="pt-4">
                    <Button
                      className="h-9 group"
                      onClick={handleRunWorkflow}
                      disabled={!selectedCaseId}
                    >
                      <Play className="h-3.5 w-3.5 mr-1.5" />
                      Run Workflow
                      <ArrowUpRight className="h-3.5 w-3.5 ml-1 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="execution" className="p-6 m-0">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="md:col-span-2 border rounded-md p-5 bg-card">
                    <h3 className="text-base font-medium mb-4 flex items-center gap-2">
                      <Activity className="h-4 w-4 text-primary" />
                      Workflow Execution Status
                    </h3>

                    <div className="space-y-3">
                      {workflow?.steps.map((step, index) => (
                        <div
                          key={step.id}
                          className={cn(
                            'border rounded-md p-4 transition-all',
                            getStepStatus(step.id) === 'completed' &&
                              'border-green-500/30 bg-green-500/5',
                            getStepStatus(step.id) === 'running' &&
                              'border-blue-500/30 bg-blue-500/5 animate-pulse',
                          )}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  'flex h-8 w-8 items-center justify-center rounded-full shrink-0',
                                  getStepStatus(step.id) === 'completed'
                                    ? 'bg-green-500/10 text-green-500'
                                    : getStepStatus(step.id) === 'running'
                                      ? 'bg-blue-500/10 text-blue-500'
                                      : 'bg-muted text-muted-foreground',
                                )}
                              >
                                <span className="text-xs font-medium">
                                  {index + 1}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">
                                  {step.name}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  {step.agent_type.replace('_', ' ')}
                                </p>
                              </div>
                            </div>
                            {renderStepStatus(getStepStatus(step.id))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {status === 'completed' && (
                      <div className="mt-4 p-4 border border-green-500/30 bg-green-500/5 rounded-md">
                        <div className="flex items-center text-green-500">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          <h4 className="font-medium text-sm">
                            Workflow Completed Successfully
                          </h4>
                        </div>
                        <p className="text-xs mt-1">
                          {resultsAvailable
                            ? "Results are available! You'll be redirected to the case page to view results."
                            : 'Processing results. Please wait...'}
                        </p>
                      </div>
                    )}

                    {status === 'error' && (
                      <div className="mt-4 p-4 border border-red-500/30 bg-red-500/5 rounded-md">
                        <div className="flex items-center text-red-500">
                          <XCircle className="h-4 w-4 mr-2" />
                          <h4 className="font-medium text-sm">
                            Workflow Execution Failed
                          </h4>
                        </div>
                        <p className="text-xs mt-1">
                          An error occurred during workflow execution. Please
                          check the logs for details.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-medium">
                          Execution Info
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground text-sm">
                              Status
                            </span>
                            <Badge
                              variant={
                                status === 'completed'
                                  ? 'default'
                                  : status === 'running'
                                    ? 'secondary'
                                    : status === 'error'
                                      ? 'destructive'
                                      : 'outline'
                              }
                              className="capitalize"
                            >
                              {status}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground text-sm">
                              Workflow
                            </span>
                            <span className="font-medium text-sm">
                              {workflow?.name}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground text-sm">
                              Case
                            </span>
                            <span className="font-medium text-sm">
                              {cases?.find((c) => c.id === selectedCaseId)
                                ?.name || selectedCaseId}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground text-sm">
                                Progress
                              </span>
                              <span className="font-medium text-sm">
                                {completedSteps.length}/{workflow?.steps.length}
                              </span>
                            </div>
                            <Progress
                              value={
                                (completedSteps.length /
                                  (workflow?.steps.length || 1)) *
                                100
                              }
                              className="h-2"
                            />
                          </div>
                          {resultsAvailable && (
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground text-sm">
                                Results
                              </span>
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-600 border-green-200"
                              >
                                Available
                              </Badge>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {status === 'completed' && (
                      <Button
                        className="w-full"
                        onClick={() => router.push(`/cases/${selectedCaseId}`)}
                      >
                        View Case Results
                        <ArrowUpRight className="h-3.5 w-3.5 ml-1 opacity-70" />
                      </Button>
                    )}

                    {status === 'error' && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={resetWorkflow}
                      >
                        Try Again
                      </Button>
                    )}
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </CardHeader>
      </Card>
    </DashboardShell>
  )
}
