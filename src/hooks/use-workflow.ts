import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type WorkflowStep = {
  id: string
  name: string
  type: string
  agent_type: string
  agent_config?: string
  position?: {
    x: number
    y: number
  }
}

export type WorkflowConnection = {
  from: string
  to: string
  on_event?: string
}

export type Workflow = {
  id: string
  name: string
  description: string
  version: string
  steps: WorkflowStep[]
  connections: WorkflowConnection[]
  author?: string
  tags?: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input_schema?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  output_schema?: any
}

export type SimpleWorkflow = {
  id: string
  name: string
  author?: string
  description: string
  tags?: string[]
  version: string
  step_count: number
}

export function useWorkflow(workflowId: string) {
  return useQuery({
    queryKey: ['workflow', workflowId],
    queryFn: async (): Promise<Workflow> => {
      if (!workflowId) {
        throw new Error('Workflow ID is required')
      }

      try {
        const response = await api.get(`/management/workflows/${workflowId}`)

        if (response.data && response.data.success && response.data.data) {
          const workflow = response.data.data

          if (workflow.steps) {
            workflow.steps = workflow.steps.map(
              (step: WorkflowStep, index: number) => {
                if (!step.position) {
                  step.position = {
                    x: 250,
                    y: 100 + index * 150,
                  }
                }
                return step
              },
            )
          }

          return workflow
        }

        throw new Error('Invalid workflow data format')
      } catch (error) {
        console.error(`Error fetching workflow ${workflowId}:`, error)
        throw error
      }
    },
    enabled: !!workflowId,
  })
}

export function useWorkflows() {
  return useQuery({
    queryKey: ['workflows'],
    queryFn: async (): Promise<SimpleWorkflow[]> => {
      try {
        const response = await api.get('/management/workflows')

        if (
          response.data &&
          response.data.success &&
          response.data.data &&
          response.data.data.workflows
        ) {
          return response.data.data.workflows
        }

        throw new Error('Invalid workflows data format')
      } catch (error) {
        console.error('Error fetching workflows:', error)
        throw error
      }
    },
  })
}
