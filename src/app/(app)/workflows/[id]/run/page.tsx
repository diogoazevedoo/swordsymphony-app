'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { DashboardShell } from '@/components/app/dashboard/shell'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ArrowLeft,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Workflow,
  User,
  Pill,
  CalendarClock,
  HeartPulse,
  Stethoscope,
  ShieldAlert,
  Clipboard,
  Activity,
  Lightbulb,
  Dumbbell,
  Beaker,
  BadgeAlert,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import { useWorkflow } from '@/hooks/use-workflow'
import { useCases } from '@/hooks/use-cases'
import { api } from '@/lib/api'
import { cn, safeGet } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Progress } from '@/components/ui/progress'

export default function WorkflowRunPage() {
  const params = useParams()
  const workflowId = params.id as string

  const { data: workflow, isLoading: workflowLoading } = useWorkflow(workflowId)
  const { data: cases, isLoading: casesLoading } = useCases()

  const [selectedCaseId, setSelectedCaseId] = useState<string>('')
  const [status, setStatus] = useState<
    'idle' | 'running' | 'completed' | 'error'
  >('idle')
  const [runningSteps, setRunningSteps] = useState<string[]>([])
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('setup')
  const [, setInstanceId] = useState<string | null>(null)

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const processResults = (rawResults: any) => {
    if (!rawResults) return null

    const processedResults = { ...rawResults }

    // Normalize diagnosis data
    if (!safeGet(processedResults, 'step.diagnosis')) {
      // Check if diagnosis exists at root level
      const diagnosis = safeGet(processedResults, 'diagnosis')
      if (diagnosis) {
        processedResults['step.diagnosis'] = { diagnosis }
      } else {
        // Search for diagnosis data within any object property
        Object.keys(processedResults).forEach((key) => {
          const value = processedResults[key]
          if (typeof value === 'object' && value && value.potential_diagnoses) {
            processedResults['step.diagnosis'] = { diagnosis: value }
          }
        })
      }
    }

    // Normalize treatment data
    if (!safeGet(processedResults, 'step.treatment')) {
      const treatment = safeGet(processedResults, 'treatment_plan')
      if (treatment) {
        processedResults['step.treatment'] = { treatment_plan: treatment }
      } else {
        // Search for treatment data
        Object.keys(processedResults).forEach((key) => {
          const value = processedResults[key]
          if (typeof value === 'object' && value && value.recommendations) {
            processedResults['step.treatment'] = { treatment_plan: value }
          }
        })
      }
    }

    return processedResults
  }

  const handleRunWorkflow = async () => {
    if (!selectedCaseId) return

    setStatus('running')
    setRunningSteps([workflow?.steps[0]?.id || ''])
    setCompletedSteps([])
    setResults(null)
    setActiveTab('execution')

    try {
      const response = await api.post(
        `/management/workflows/${workflowId}/instances`,
        { patient_data: cases?.find((c) => c.id === selectedCaseId) },
      )

      if (response.data?.success) {
        const instanceId = response.data.data.instance_id
        setInstanceId(instanceId)

        // Set up adaptive polling
        let pollInterval = 2000 // Start with 2 seconds
        const maxPollInterval = 10000 // Max 10 seconds
        const backoffFactor = 1.2
        let consecutiveErrors = 0

        const pollInstance = async () => {
          try {
            const instanceResponse = await api.get(
              `/management/workflow-instances/${instanceId}`,
            )

            if (instanceResponse.data?.success) {
              const instance = instanceResponse.data.data
              consecutiveErrors = 0

              // Check for changes in completed steps
              const newCompletedSteps = instance.completed_steps || []
              if (
                JSON.stringify(newCompletedSteps) ===
                JSON.stringify(completedSteps)
              ) {
                // No progress, increase polling interval
                pollInterval = Math.min(
                  pollInterval * backoffFactor,
                  maxPollInterval,
                )
              } else {
                // Progress being made, reset to more frequent polling
                pollInterval = 2000
              }

              setCompletedSteps(newCompletedSteps)

              // Determine which steps are currently running
              const firstIncompleteStepIndex = workflow?.steps.findIndex(
                (step) => !newCompletedSteps.includes(step.id),
              )

              if (
                firstIncompleteStepIndex !== -1 &&
                firstIncompleteStepIndex !== undefined
              ) {
                const firstIncompleteStep =
                  workflow?.steps[firstIncompleteStepIndex]
                if (
                  firstIncompleteStep &&
                  instance.current_steps?.includes(firstIncompleteStep.id)
                ) {
                  setRunningSteps([firstIncompleteStep.id])
                } else {
                  setRunningSteps([])
                }
              } else {
                setRunningSteps([])
              }

              // Check workflow completion
              if (instance.status === 'completed') {
                setStatus('completed')

                // Try fetching detailed results
                try {
                  const resultsResponse = await api.get(
                    `/results/${selectedCaseId}`,
                  )
                  if (resultsResponse.data) {
                    setResults(processResults(resultsResponse.data))
                  } else {
                    setResults(processResults(instance.output))
                  }
                } catch (resultError) {
                  console.error('Error fetching results:', resultError)
                  setResults(processResults(instance.output))
                }

                return // Stop polling
              } else if (instance.status === 'failed') {
                setStatus('error')
                return // Stop polling
              }

              // Continue polling
              setTimeout(pollInstance, pollInterval)
            }
          } catch (error) {
            console.error('Error polling workflow instance:', error)

            // Backoff on errors
            consecutiveErrors++
            pollInterval = Math.min(
              pollInterval * (1 + consecutiveErrors * 0.5),
              maxPollInterval,
            )

            // Stop polling after too many errors
            if (consecutiveErrors > 5) {
              setStatus('error')
              return
            }

            setTimeout(pollInstance, pollInterval)
          }
        }

        // Start polling after initial delay
        setTimeout(pollInstance, 1000)
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
            <TabsList className="grid w-full grid-cols-3 h-9">
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
              <TabsTrigger
                value="results"
                disabled={status !== 'completed'}
                className="text-xs"
              >
                Results
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
                          All steps have been executed successfully. View the
                          results tab for details.
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
                        </div>
                      </CardContent>
                    </Card>

                    {status === 'completed' && (
                      <Button
                        className="w-full"
                        onClick={() => setActiveTab('results')}
                      >
                        View Results
                      </Button>
                    )}

                    {status === 'error' && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setStatus('idle')
                          setActiveTab('setup')
                        }}
                      >
                        Try Again
                      </Button>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="results" className="p-0 m-0">
                {results ? (
                  <div>
                    <div className="border-b bg-muted/5 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                          <h3 className="font-medium">Workflow Results</h3>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => {
                              setStatus('idle')
                              setActiveTab('setup')
                            }}
                          >
                            Run Again
                          </Button>
                          <Button size="sm" className="h-8 group" asChild>
                            <Link href={`/cases/${selectedCaseId}`}>
                              View Patient Case
                              <ArrowUpRight className="h-3.5 w-3.5 ml-1 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                              <Stethoscope className="h-4 w-4 text-primary" />
                              <CardTitle className="text-base font-medium">
                                Diagnosis
                              </CardTitle>
                            </div>
                            <CardDescription>
                              Potential diagnoses and reasoning
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Potential Diagnoses */}
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">
                                Potential Diagnoses
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {safeGet(
                                  results,
                                  'step.diagnosis.diagnosis.potential_diagnoses',
                                  [],
                                ).length > 0 ? (
                                  safeGet(
                                    results,
                                    'step.diagnosis.diagnosis.potential_diagnoses',
                                    [],
                                  ).map((diagnosis: string, index: number) => (
                                    <Badge
                                      key={index}
                                      className="bg-primary/10 text-primary hover:bg-primary/20 border-0"
                                    >
                                      {diagnosis}
                                    </Badge>
                                  ))
                                ) : (
                                  <p className="text-sm text-muted-foreground">
                                    No diagnoses available
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Confidence */}
                            <div className="space-y-1">
                              <h4 className="text-sm font-medium">
                                Confidence
                              </h4>
                              <div className="flex items-center gap-2">
                                <Progress
                                  value={
                                    safeGet(
                                      results,
                                      'step.diagnosis.diagnosis.confidence',
                                      0,
                                    ) * 100
                                  }
                                  className="h-2 flex-1"
                                />
                                <span className="text-sm font-medium">
                                  {Math.round(
                                    safeGet(
                                      results,
                                      'step.diagnosis.diagnosis.confidence',
                                      0,
                                    ) * 100,
                                  )}
                                  %
                                </span>
                              </div>
                            </div>

                            {/* Reasoning */}
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full"
                            >
                              <AccordionItem value="reasoning">
                                <AccordionTrigger className="text-sm font-medium py-2">
                                  Reasoning
                                </AccordionTrigger>
                                <AccordionContent>
                                  <ul className="space-y-2 text-sm">
                                    {safeGet(
                                      results,
                                      'step.diagnosis.diagnosis.reasoning',
                                      [],
                                    ).map((reason: string, index: number) => (
                                      <li
                                        key={index}
                                        className="pl-4 border-l-2 border-primary/20"
                                      >
                                        {reason}
                                      </li>
                                    ))}
                                    {safeGet(
                                      results,
                                      'step.diagnosis.diagnosis.reasoning',
                                      [],
                                    ).length === 0 && (
                                      <li className="text-muted-foreground">
                                        No reasoning data available
                                      </li>
                                    )}
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>

                            {/* Risk Factors */}
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">
                                Risk Factors
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {safeGet(
                                  results,
                                  'step.diagnosis.diagnosis.risk_factors',
                                  [],
                                ).length > 0 ? (
                                  safeGet(
                                    results,
                                    'step.diagnosis.diagnosis.risk_factors',
                                    [],
                                  ).map((factor: string, index: number) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="bg-muted/50"
                                    >
                                      {factor}
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-sm text-muted-foreground">
                                    No risk factors identified
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Recommended Tests */}
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">
                                Recommended Tests
                              </h4>
                              <ul className="space-y-1 text-sm">
                                {safeGet(
                                  results,
                                  'step.diagnosis.diagnosis.recommended_tests',
                                  [],
                                ).length > 0 ? (
                                  safeGet(
                                    results,
                                    'step.diagnosis.diagnosis.recommended_tests',
                                    [],
                                  ).map((test: string, index: number) => (
                                    <li
                                      key={index}
                                      className="flex items-center gap-2"
                                    >
                                      <Beaker className="h-3.5 w-3.5 text-muted-foreground" />
                                      {test}
                                    </li>
                                  ))
                                ) : (
                                  <li className="text-muted-foreground">
                                    No tests recommended
                                  </li>
                                )}
                              </ul>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                              <HeartPulse className="h-4 w-4 text-primary" />
                              <CardTitle className="text-base font-medium">
                                Treatment Plan
                              </CardTitle>
                            </div>
                            <CardDescription>
                              Recommended treatment and follow-up
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Recommendations */}
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium flex items-center gap-2">
                                <Lightbulb className="h-4 w-4 text-primary" />
                                Recommendations
                              </h4>
                              <ul className="space-y-1 text-sm">
                                {safeGet(
                                  results,
                                  'step.treatment.treatment_plan.recommendations',
                                  [],
                                ).length > 0 ? (
                                  safeGet(
                                    results,
                                    'step.treatment.treatment_plan.recommendations',
                                    [],
                                  ).map((rec: string, index: number) => (
                                    <li
                                      key={index}
                                      className="pl-4 border-l-2 border-primary/20"
                                    >
                                      {rec}
                                    </li>
                                  ))
                                ) : (
                                  <li className="text-muted-foreground">
                                    No treatment recommendations available
                                  </li>
                                )}
                              </ul>
                            </div>

                            {/* Medications */}
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full"
                            >
                              <AccordionItem value="medications">
                                <AccordionTrigger className="text-sm font-medium py-2">
                                  <div className="flex items-center gap-2">
                                    <Pill className="h-4 w-4 text-primary" />
                                    Medications
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <ul className="space-y-2 text-sm">
                                    {safeGet(
                                      results,
                                      'step.treatment.treatment_plan.medications',
                                      [],
                                    ).length > 0 ? (
                                      safeGet(
                                        results,
                                        'step.treatment.treatment_plan.medications',
                                        [],
                                      ).map((med: string, index: number) => (
                                        <li
                                          key={index}
                                          className="p-2 bg-muted/20 rounded-md"
                                        >
                                          {med}
                                        </li>
                                      ))
                                    ) : (
                                      <li className="text-muted-foreground">
                                        No medications prescribed
                                      </li>
                                    )}
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>

                            {/* Lifestyle Changes */}
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full"
                            >
                              <AccordionItem value="lifestyle">
                                <AccordionTrigger className="text-sm font-medium py-2">
                                  <div className="flex items-center gap-2">
                                    <Dumbbell className="h-4 w-4 text-primary" />
                                    Lifestyle Changes
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <ul className="space-y-1 text-sm">
                                    {safeGet(
                                      results,
                                      'step.treatment.treatment_plan.lifestyle_changes',
                                      [],
                                    ).length > 0 ? (
                                      safeGet(
                                        results,
                                        'step.treatment.treatment_plan.lifestyle_changes',
                                        [],
                                      ).map((change: string, index: number) => (
                                        <li
                                          key={index}
                                          className="flex items-start gap-2"
                                        >
                                          <div className="h-5 w-5 flex items-center justify-center bg-primary/10 text-primary rounded-full shrink-0 mt-0.5">
                                            <span className="text-xs">
                                              {index + 1}
                                            </span>
                                          </div>
                                          {change}
                                        </li>
                                      ))
                                    ) : (
                                      <li className="text-muted-foreground">
                                        No lifestyle changes recommended
                                      </li>
                                    )}
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>

                            {/* Follow-up */}
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full"
                            >
                              <AccordionItem value="followup">
                                <AccordionTrigger className="text-sm font-medium py-2">
                                  <div className="flex items-center gap-2">
                                    <CalendarClock className="h-4 w-4 text-primary" />
                                    Follow-up
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <ul className="space-y-1 text-sm">
                                    {safeGet(
                                      results,
                                      'step.treatment.treatment_plan.follow_up',
                                      [],
                                    ).length > 0 ? (
                                      safeGet(
                                        results,
                                        'step.treatment.treatment_plan.follow_up',
                                        [],
                                      ).map(
                                        (followup: string, index: number) => (
                                          <li
                                            key={index}
                                            className="flex items-start gap-2"
                                          >
                                            <Clipboard className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                                            {followup}
                                          </li>
                                        ),
                                      )
                                    ) : (
                                      <li className="text-muted-foreground">
                                        No follow-up information available
                                      </li>
                                    )}
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>

                            {/* Warnings */}
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium flex items-center gap-2">
                                <ShieldAlert className="h-4 w-4 text-destructive" />
                                Warnings
                              </h4>
                              <div className="p-3 border border-destructive/20 bg-destructive/5 rounded-md">
                                <ul className="space-y-1 text-sm">
                                  {safeGet(
                                    results,
                                    'step.treatment.treatment_plan.warnings',
                                    [],
                                  ).length > 0 ? (
                                    safeGet(
                                      results,
                                      'step.treatment.treatment_plan.warnings',
                                      [],
                                    ).map((warning: string, index: number) => (
                                      <li
                                        key={index}
                                        className="flex items-start gap-2"
                                      >
                                        <BadgeAlert className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
                                        {warning}
                                      </li>
                                    ))
                                  ) : (
                                    <li className="text-muted-foreground">
                                      No specific warnings
                                    </li>
                                  )}
                                </ul>
                              </div>
                            </div>

                            {/* Contraindications */}
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full"
                            >
                              <AccordionItem value="contraindications">
                                <AccordionTrigger className="text-sm font-medium py-2">
                                  <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                                    Contraindications
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <ul className="space-y-1 text-sm">
                                    {safeGet(
                                      results,
                                      'step.treatment.treatment_plan.contraindications',
                                      [],
                                    ).length > 0 ? (
                                      safeGet(
                                        results,
                                        'step.treatment.treatment_plan.contraindications',
                                        [],
                                      ).map(
                                        (
                                          contraindication: string,
                                          index: number,
                                        ) => (
                                          <li
                                            key={index}
                                            className="flex items-start gap-2"
                                          >
                                            <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                                            {contraindication}
                                          </li>
                                        ),
                                      )
                                    ) : (
                                      <li className="text-muted-foreground">
                                        No contraindications listed
                                      </li>
                                    )}
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No Results Available
                    </h3>
                    <p className="text-muted-foreground text-center max-w-md mb-4">
                      No workflow results are available yet. Complete the
                      workflow execution to view results.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab('execution')}
                    >
                      Back to Execution
                    </Button>
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </CardHeader>
      </Card>
    </DashboardShell>
  )
}
