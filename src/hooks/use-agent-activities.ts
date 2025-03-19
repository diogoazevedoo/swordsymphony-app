import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export interface AgentActivity {
  agent_id: string
  agent_name: string
  action: string
  timestamp: string
  case_id: string
  message_type: string
}

const getActionFromMessageType = (messageType: string): string => {
  switch (messageType) {
    case 'task_assignment':
      return 'Started processing patient data'
    case 'processed_data':
      return 'Completed data processing'
    case 'diagnosis_results':
      return 'Generated diagnostic assessment'
    case 'treatment_plan':
      return 'Created treatment plan'
    case 'status_update':
      return 'Updated status'
    case 'task_complete':
      return 'Completed task'
    default:
      return 'Performed action'
  }
}

export function useAgentActivities() {
  return useQuery({
    queryKey: ['agent-activities'],
    queryFn: async (): Promise<{ activities: AgentActivity[] }> => {
      try {
        const response = await api.get('/messages')
        const messages = response.data || []

        const activities: AgentActivity[] = messages
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((msg: any) => msg.sender !== 'orchestrator')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((msg: any) => ({
            agent_id: msg.sender,
            agent_name: msg.sender_name,
            action: getActionFromMessageType(msg.message_type),
            timestamp: msg.timestamp,
            case_id: msg.content?.task_id || 'Unknown',
            message_type: msg.message_type,
          }))
          .slice(0, 5)

        return { activities }
      } catch (error) {
        console.log('Error fetching agent activities:', error)
        throw error
      }
    },
    refetchInterval: 30000,
  })
}
