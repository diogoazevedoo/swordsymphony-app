// src/hooks/use-system-status.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { SystemStatus, AgentStatus } from '@/types'

export function useSystemStatus() {
  return useQuery({
    queryKey: ['system-status'],
    queryFn: async (): Promise<SystemStatus> => {
      try {
        const response = await api.get('/case-status')
        const data = response.data

        if (data.status === 'idle') {
          return {
            status: 'idle',
            agents: [],
            activeThreads: 0,
          }
        }

        const agents = Object.entries(data.agent_status || {}).map(
          ([id, status]) => {
            const name = id
              .split('_')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')

            let typedStatus: AgentStatus = 'idle'
            switch (status) {
              case 'idle':
                typedStatus = 'idle'
                break
              case 'busy':
                typedStatus = 'busy'
                break
              case 'complete':
                typedStatus = 'complete'
                break
              case 'error':
                typedStatus = 'error'
                break
              default:
                console.log(
                  `Unknown agent status: ${status}, defaulting to 'idle'`,
                )
                typedStatus = 'idle'
            }

            return {
              id,
              name,
              status: typedStatus,
            }
          },
        )

        return {
          status: data.status,
          agents,
          activeThreads: data.status === 'processing' ? 1 : 0,
        }
      } catch (error) {
        console.log('Error fetching system status:', error)
        throw error
      }
    },
    refetchInterval: 30000,
  })
}
