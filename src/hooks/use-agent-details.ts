import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type AgentInput = {
  name: string
  required: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: any
}

export type AgentOutput = {
  name: string
  required: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: any
}

export type AgentAI = {
  provider: string
  model: string
  temperature: number
  max_tokens: number
  system_prompt?: string
  knowledge_sources?: string[]
}

export type AgentDetail = {
  id: string
  type: string
  name: string
  description?: string
  inputs?: AgentInput[]
  outputs?: AgentOutput[]
  ai?: AgentAI
  version?: string
  author?: string
}

export function useAgentDetail(agentId: string) {
  return useQuery({
    queryKey: ['agent', agentId],
    queryFn: async (): Promise<AgentDetail> => {
      try {
        const response = await api.get(`/admin/agents/${agentId}`)

        if (response.data && response.data.success && response.data.data) {
          return response.data.data
        }

        throw new Error('Unexpected agent data format')
      } catch (error) {
        console.error(`Error fetching agent ${agentId}:`, error)
        throw error
      }
    },
  })
}
