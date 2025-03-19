import { z } from 'zod'

export const AgentStatusSchema = z.enum(['idle', 'busy', 'complete', 'error'])

export const AgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: AgentStatusSchema,
})

export const PatientDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number(),
  gender: z.string(),
  conditions: z.array(z.string()),
  medications: z.array(z.string()),
  symptoms: z.array(z.string()),
  allergies: z.array(z.string()),
  vitals: z.record(z.string(), z.union([z.string(), z.number()])),
})

export const DiagnosisSchema = z.object({
  potential_diagnoses: z.array(z.string()),
  confidence: z.number(),
  reasoning: z.array(z.string()),
  recommended_tests: z.array(z.string()),
})

export const TreatmentPlanSchema = z.object({
  recommendations: z.array(z.string()),
  medications: z.array(z.string()),
  lifestyle_changes: z.array(z.string()),
  follow_up: z.array(z.string()),
  warnings: z.array(z.string()),
  contraindications: z.array(z.string()),
})

export const CaseSchema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number(),
  gender: z.string(),
  conditions: z.array(z.string()),
  medications: z.array(z.string()),
  symptoms: z.array(z.string()),
  allergies: z.array(z.string()),
  vitals: z.record(z.string(), z.union([z.string(), z.number()])),
  is_demo: z.boolean().optional(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const CaseResultSchema = z.object({
  diagnosis: DiagnosisSchema,
  treatment_plan: TreatmentPlanSchema,
})

export type AgentStatus = z.infer<typeof AgentStatusSchema>
export type Agent = z.infer<typeof AgentSchema>
export type PatientData = z.infer<typeof PatientDataSchema>
export type Diagnosis = z.infer<typeof DiagnosisSchema>
export type TreatmentPlan = z.infer<typeof TreatmentPlanSchema>
export type Case = z.infer<typeof CaseSchema>
export type CaseResult = z.infer<typeof CaseResultSchema>

export type SystemStatus = {
  status?: string
  agents: Agent[]
  activeThreads: number
}

export type DashboardStats = {
  totalCases: number
  completedCases: number
  diagnosisAccuracy: number
  activeWorkflows: number
}
