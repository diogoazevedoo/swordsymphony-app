import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type Agent = {
  id: string
  name: string
  type: string
  description?: string
  author?: string
  version?: string
  status?: 'idle' | 'busy' | 'complete' | 'error'
}

export function useAgents() {
  return useQuery({
    queryKey: ['agents'],
    queryFn: async (): Promise<Agent[]> => {
      try {
        const response = await api.get('/management/agents')

        if (
          response.data &&
          response.data.success &&
          response.data.data &&
          response.data.data.configs
        ) {
          return response.data.data.configs.map((agent: Agent) => ({
            ...agent,
            status: 'idle',
          }))
        }

        throw new Error('Unexpected agents data format')
      } catch (error) {
        console.log('Error fetching agents:', error)
        throw error
      }
    },
  })
}
