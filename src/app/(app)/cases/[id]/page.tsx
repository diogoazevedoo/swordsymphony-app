'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { DashboardShell } from '@/components/app/dashboard/shell'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { api } from '@/lib/api'
import Link from 'next/link'
import {
  ArrowLeft,
  Download,
  FileEdit,
  MoreHorizontal,
  Play,
  Share2,
  Trash2,
  User,
  Pill,
  AlertTriangle,
  Activity,
  Shield,
  CalendarClock,
  Clipboard,
  Info,
  CheckCircle,
  AlertCircle,
  HeartPulse,
  Stethoscope,
  Lightbulb,
  Beaker,
  Dumbbell,
  ArrowUpRight,
  BarChart3,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

interface Vitals {
  blood_pressure?: string
  heart_rate?: string
  temperature?: string
  oxygen_saturation?: string
}

interface CaseData {
  id: string
  name: string
  age: number
  gender: string
  birth_date?: string
  is_demo?: boolean
  vitals?: Vitals
  symptoms?: string[]
  conditions?: string[]
  medications?: string[]
  allergies?: string[]
  notes?: string
}

interface Diagnosis {
  potential_diagnoses: string[]
  confidence: number
  reasoning: string[]
  risk_factors?: string[]
  recommended_tests?: string[]
}

interface TreatmentPlan {
  recommendations: string[]
  medications?: string[]
  lifestyle_changes?: string[]
  follow_up?: string[]
  warnings?: string[]
  contraindications?: string[]
}

interface CaseResults {
  diagnosis?: Diagnosis
  treatment_plan?: TreatmentPlan
}

interface WorkflowType {
  id: string
  name: string
}

function useCase(caseId: string) {
  return useQuery({
    queryKey: ['case', caseId],
    queryFn: async () => {
      const response = await api.get(`/cases/${caseId}`)
      if (response.data && response.data.success) {
        return response.data.data as CaseData
      }
      return response.data as CaseData
    },
    enabled: !!caseId,
  })
}

function useCaseResults(caseId: string) {
  return useQuery({
    queryKey: ['case-results', caseId],
    queryFn: async () => {
      const response = await api.get(`/results/${caseId}`)
      if (response.data && response.data.success) {
        return response.data.data as CaseResults
      }
      return response.data as CaseResults
    },
    enabled: !!caseId,
  })
}

function useWorkflows() {
  return useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      const response = await api.get('/workflows')
      if (response.data && response.data.success) {
        return response.data.data.workflows as WorkflowType[]
      }
      return [] as WorkflowType[]
    },
  })
}

export default function CaseDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const caseId = params.id as string
  const [activeTab, setActiveTab] = useState('overview')

  const { data: caseData, isLoading: caseLoading } = useCase(caseId)
  const { data: results, isLoading: resultsLoading } = useCaseResults(caseId)
  const { data: workflows } = useWorkflows()

  const hasResults = results && (results.diagnosis || results.treatment_plan)
  const diagnosis = results?.diagnosis || null
  const treatmentPlan = results?.treatment_plan || null

  const handleRunWorkflow = async (workflowId: string) => {
    try {
      await api.post(`/workflows/${workflowId}/start/${caseId}`)
      router.push(`/workflows/${workflowId}/run?caseId=${caseId}`)
    } catch (error) {
      console.error('Error starting workflow:', error)
    }
  }

  if (caseLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground -ml-2"
            asChild
          >
            <Link href="/cases">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Back to Cases
            </Link>
          </Button>
        </div>
        <div className="flex flex-col md:flex-row md:items-start gap-4 mb-8">
          <Skeleton className="h-16 w-full md:w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-[400px] md:col-span-2" />
          <Skeleton className="h-[400px]" />
        </div>
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
          <Link href="/cases">
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Cases
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {caseData?.name}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <span>{caseData?.age} years,</span>
                <span className="capitalize">{caseData?.gender}</span>
                <span>•</span>
                <span>ID: {caseData?.id}</span>
                {caseData?.is_demo && (
                  <>
                    <span>•</span>
                    <Badge
                      variant="outline"
                      className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    >
                      Demo
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-0 md:ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  href={`/cases/${caseId}/edit`}
                  className="flex items-center"
                >
                  <FileEdit className="h-4 w-4 mr-2" />
                  Edit Case
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center">
                <Share2 className="h-4 w-4 mr-2" />
                Share Case
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export Case
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center text-destructive focus:text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Case
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-9 group">
                <Play className="h-3.5 w-3.5 mr-1.5" />
                Run Workflow
                <ArrowUpRight className="h-3.5 w-3.5 ml-1 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {workflows && workflows.length > 0 ? (
                workflows.map((workflow) => (
                  <DropdownMenuItem
                    key={workflow.id}
                    onClick={() => handleRunWorkflow(workflow.id)}
                    className="flex items-center"
                  >
                    <Info className="h-4 w-4 mr-2" />
                    {workflow.name}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>No workflows found</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-3 w-full sm:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="diagnosis" disabled={!hasResults}>
            Diagnosis
          </TabsTrigger>
          <TabsTrigger value="treatment" disabled={!hasResults}>
            Treatment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Info className="h-5 w-5 mr-2 text-primary" />
                  Patient Information
                </CardTitle>
                <CardDescription>
                  Basic information and current status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Date of Birth
                    </h3>
                    <p>
                      {caseData?.birth_date ||
                        `${new Date().getFullYear() - (caseData?.age || 0)}`}{' '}
                      (Age {caseData?.age})
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Gender
                    </h3>
                    <p className="capitalize">{caseData?.gender}</p>
                  </div>
                </div>
                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-primary" />
                    Vital Signs
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                    <div className="border rounded-md p-3 bg-muted/10">
                      <div className="text-xs text-muted-foreground mb-1">
                        Blood Pressure
                      </div>
                      <div className="text-lg font-medium">
                        {caseData?.vitals?.blood_pressure || 'N/A'}
                      </div>
                    </div>
                    <div className="border rounded-md p-3 bg-muted/10">
                      <div className="text-xs text-muted-foreground mb-1">
                        Heart Rate
                      </div>
                      <div className="text-lg font-medium">
                        {caseData?.vitals?.heart_rate || 'N/A'}{' '}
                        <span className="text-xs text-muted-foreground">
                          bpm
                        </span>
                      </div>
                    </div>
                    <div className="border rounded-md p-3 bg-muted/10">
                      <div className="text-xs text-muted-foreground mb-1">
                        Temperature
                      </div>
                      <div className="text-lg font-medium">
                        {caseData?.vitals?.temperature || 'N/A'}{' '}
                        <span className="text-xs text-muted-foreground">
                          °F
                        </span>
                      </div>
                    </div>
                    <div className="border rounded-md p-3 bg-muted/10">
                      <div className="text-xs text-muted-foreground mb-1">
                        O₂ Saturation
                      </div>
                      <div className="text-lg font-medium">
                        {caseData?.vitals?.oxygen_saturation || 'N/A'}{' '}
                        <span className="text-xs text-muted-foreground">%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center">
                    <HeartPulse className="h-4 w-4 mr-2 text-primary" />
                    Presenting Symptoms
                  </h3>
                  {caseData?.symptoms && caseData.symptoms.length > 0 ? (
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {caseData.symptoms.map((symptom, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">
                      No symptoms recorded
                    </p>
                  )}
                </div>

                <Separator />

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium flex items-center">
                      <Clipboard className="h-4 w-4 mr-2 text-primary" />
                      Medical Conditions
                    </h3>
                    {caseData?.conditions && caseData.conditions.length > 0 ? (
                      <ul className="space-y-1">
                        {caseData.conditions.map((condition, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {condition}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">
                        No known medical conditions
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium flex items-center">
                      <Pill className="h-4 w-4 mr-2 text-primary" />
                      Current Medications
                    </h3>
                    {caseData?.medications &&
                    caseData.medications.length > 0 ? (
                      <ul className="space-y-1">
                        {caseData.medications.map((medication, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {medication}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">
                        No current medications
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                    Allergies
                  </h3>
                  {caseData?.allergies && caseData.allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {caseData.allergies.map((allergy, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                        >
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No known allergies</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                    Status & Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Diagnostic Status</h3>
                    {hasResults ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Diagnosis Complete</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-amber-600">
                        <AlertCircle className="h-4 w-4" />
                        <span>Pending Diagnosis</span>
                      </div>
                    )}
                  </div>

                  {hasResults && diagnosis && (
                    <>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">
                          Primary Diagnosis
                        </h3>
                        <div className="p-3 bg-primary/5 border border-primary/20 rounded-md">
                          {diagnosis.potential_diagnoses?.[0] ||
                            'Not specified'}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">
                          Diagnostic Confidence
                        </h3>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={(diagnosis.confidence || 0) * 100}
                            className="h-2 flex-1"
                          />
                          <span>
                            {Math.round((diagnosis.confidence || 0) * 100)}%
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setActiveTab('diagnosis')}
                      >
                        <Stethoscope className="h-4 w-4 mr-2" />
                        View Full Diagnosis
                      </Button>

                      <Button
                        className="w-full"
                        onClick={() => setActiveTab('treatment')}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        View Treatment Plan
                      </Button>
                    </>
                  )}

                  {!hasResults && (
                    <div className="p-4 border border-dashed rounded-md text-center space-y-3">
                      <p className="text-muted-foreground text-sm">
                        No diagnosis has been run for this patient yet.
                      </p>
                      <Button
                        className="w-full group"
                        onClick={() => {
                          if (workflows && workflows.length > 0) {
                            handleRunWorkflow(workflows[0].id)
                          }
                        }}
                      >
                        <Play className="h-3.5 w-3.5 mr-1.5" />
                        Run Diagnosis
                        <ArrowUpRight className="h-3.5 w-3.5 ml-1 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {hasResults && treatmentPlan && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <CalendarClock className="h-5 w-5 mr-2 text-primary" />
                      Follow-up
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {treatmentPlan.follow_up &&
                    treatmentPlan.follow_up.length > 0 ? (
                      <ul className="space-y-2">
                        {treatmentPlan.follow_up
                          .slice(0, 3)
                          .map((followUp, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Clipboard className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                              <span className="text-sm">{followUp}</span>
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        No follow-up instructions
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {caseData?.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{caseData.notes}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="diagnosis" className="space-y-6">
          {resultsLoading ? (
            <Card>
              <CardContent className="py-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-6 w-36" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>
          ) : !diagnosis ? (
            <Card>
              <CardContent className="py-10 text-center">
                <div className="space-y-3">
                  <Stethoscope className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="text-lg font-medium">
                    No Diagnosis Available
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    This patient doesn't have a diagnosis yet. Run a diagnostic
                    workflow to generate a diagnosis.
                  </p>
                  <Button
                    className="mt-2 group"
                    onClick={() => {
                      if (workflows && workflows.length > 0) {
                        handleRunWorkflow(workflows[0].id)
                      }
                    }}
                  >
                    <Play className="h-3.5 w-3.5 mr-1.5" />
                    Run Diagnostic Workflow
                    <ArrowUpRight className="h-3.5 w-3.5 ml-1 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-primary" />
                    <CardTitle>Diagnostic Assessment</CardTitle>
                  </div>
                  <CardDescription>
                    AI-generated diagnostic information based on patient data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2 text-primary" />
                      Potential Diagnoses
                    </h3>
                    <div className="space-y-3">
                      {diagnosis.potential_diagnoses.map((diag, index) => (
                        <div
                          key={index}
                          className={cn(
                            'p-3 rounded-md border',
                            index === 0
                              ? 'bg-primary/10 border-primary/30'
                              : 'bg-muted/20',
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {index === 0 && (
                              <Badge className="bg-primary text-primary-foreground">
                                Primary
                              </Badge>
                            )}
                            <h4 className="font-medium">{diag}</h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">
                      Diagnostic Confidence
                    </h3>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">
                          Confidence Level
                        </span>
                        <span className="font-medium">
                          {Math.round((diagnosis.confidence || 0) * 100)}%
                        </span>
                      </div>
                      <Progress
                        value={(diagnosis.confidence || 0) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">
                      Diagnostic Reasoning
                    </h3>
                    <Card className="bg-muted/10">
                      <CardContent className="p-4">
                        <ul className="space-y-2">
                          {diagnosis.reasoning.map((reason, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="h-5 w-5 flex items-center justify-center bg-primary/10 text-primary rounded-full shrink-0 mt-0.5">
                                <span className="text-xs">{index + 1}</span>
                              </span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  {diagnosis.risk_factors &&
                    diagnosis.risk_factors.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium">Risk Factors</h3>
                        <div className="flex flex-wrap gap-2">
                          {diagnosis.risk_factors.map((factor, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-muted/50"
                            >
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                  {diagnosis.recommended_tests &&
                    diagnosis.recommended_tests.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium">
                          Recommended Tests
                        </h3>
                        <ul className="grid gap-2 md:grid-cols-2">
                          {diagnosis.recommended_tests.map((test, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Beaker className="h-4 w-4 text-primary" />
                              {test}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between border-t p-4">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('overview')}
                  >
                    Back to Overview
                  </Button>
                  <Button onClick={() => setActiveTab('treatment')}>
                    View Treatment Plan
                    <ArrowUpRight className="h-3.5 w-3.5 ml-1.5" />
                  </Button>
                </CardFooter>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="treatment" className="space-y-6">
          {resultsLoading ? (
            <Card>
              <CardContent className="py-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-6 w-36" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>
          ) : !treatmentPlan ? (
            <Card>
              <CardContent className="py-10 text-center">
                <div className="space-y-3">
                  <Shield className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="text-lg font-medium">
                    No Treatment Plan Available
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    This patient doesn't have a treatment plan yet. Run a
                    diagnostic workflow to generate a treatment plan.
                  </p>
                  <Button
                    className="mt-2 group"
                    onClick={() => {
                      if (workflows && workflows.length > 0) {
                        handleRunWorkflow(workflows[0].id)
                      }
                    }}
                  >
                    <Play className="h-3.5 w-3.5 mr-1.5" />
                    Run Diagnostic Workflow
                    <ArrowUpRight className="h-3.5 w-3.5 ml-1 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <CardTitle>Treatment Plan</CardTitle>
                  </div>
                  <CardDescription>
                    Recommended treatment approach based on diagnosis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2 text-primary" />
                      Treatment Recommendations
                    </h3>
                    <ul className="space-y-2">
                      {treatmentPlan.recommendations.map((rec, index) => (
                        <li
                          key={index}
                          className="p-3 bg-primary/5 border border-primary/20 rounded-md"
                        >
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium flex items-center">
                      <Pill className="h-4 w-4 mr-2 text-primary" />
                      Prescribed Medications
                    </h3>
                    {treatmentPlan.medications &&
                    treatmentPlan.medications.length > 0 ? (
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="medications">
                          <AccordionTrigger className="text-sm font-medium hover:no-underline">
                            <span className="flex items-center gap-2">
                              <span>
                                {treatmentPlan.medications.length} Medications
                              </span>
                            </span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-2 mt-2">
                              {treatmentPlan.medications.map((med, index) => (
                                <li
                                  key={index}
                                  className="p-3 bg-muted/20 rounded-md"
                                >
                                  {med}
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ) : (
                      <p className="text-muted-foreground">
                        No medications prescribed
                      </p>
                    )}
                  </div>

                  {treatmentPlan.lifestyle_changes &&
                    treatmentPlan.lifestyle_changes.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium flex items-center">
                          <Dumbbell className="h-4 w-4 mr-2 text-primary" />
                          Lifestyle Modifications
                        </h3>
                        <ul className="space-y-2">
                          {treatmentPlan.lifestyle_changes.map(
                            (change, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <div className="h-5 w-5 flex items-center justify-center bg-primary/10 text-primary rounded-full shrink-0 mt-0.5">
                                  <span className="text-xs">{index + 1}</span>
                                </div>
                                <span>{change}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}

                  {treatmentPlan.follow_up &&
                    treatmentPlan.follow_up.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium flex items-center">
                          <CalendarClock className="h-4 w-4 mr-2 text-primary" />
                          Follow-up Instructions
                        </h3>
                        <Card className="bg-muted/10">
                          <CardContent className="p-4">
                            <ul className="space-y-2">
                              {treatmentPlan.follow_up.map((item, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2"
                                >
                                  <Clipboard className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                  {treatmentPlan.warnings &&
                    treatmentPlan.warnings.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2 text-destructive" />
                          Warnings
                        </h3>
                        <div className="p-3 border border-destructive/20 bg-destructive/5 rounded-md">
                          <ul className="space-y-2">
                            {treatmentPlan.warnings.map((warning, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                                <span>{warning}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                  {treatmentPlan.contraindications &&
                    treatmentPlan.contraindications.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium flex items-center">
                          <Shield className="h-4 w-4 mr-2 text-amber-500" />
                          Contraindications
                        </h3>
                        <ul className="space-y-2">
                          {treatmentPlan.contraindications.map(
                            (item, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between border-t p-4">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('overview')}
                  >
                    Back to Overview
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('diagnosis')}
                  >
                    View Diagnosis
                  </Button>
                </CardFooter>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
