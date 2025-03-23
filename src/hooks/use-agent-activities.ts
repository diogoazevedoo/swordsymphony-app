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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractAgentActivities = (message: any): AgentActivity[] => {
  const activities: AgentActivity[] = []

  if (message.message_type === 'task_assignment') {
    activities.push({
      agent_id: message.recipient,
      agent_name: message.recipient.replace('_agent', '').replace('_', ' '),
      action: 'Received task assignment',
      timestamp: message.timestamp,
      case_id: message.content?.task_id || 'Unknown',
      message_type: message.message_type,
    })
  }

  if (message.content?.data) {
    const data = message.content.data
    Object.keys(data).forEach((key) => {
      if (
        key.startsWith('step.') &&
        data[key]?.agent_type &&
        data[key]?.status
      ) {
        activities.push({
          agent_id: data[key].agent_type,
          agent_name: data[key].agent_type
            .replace('_agent', '')
            .replace('_', ' '),
          action: `${data[key].status === 'completed' ? 'Completed' : 'Processing'} ${key.replace('step.', '')}`,
          timestamp: message.timestamp,
          case_id: data[key].task_id || message.content?.task_id || 'Unknown',
          message_type: data[key].status || 'status_update',
        })
      }
    })
  }

  return activities
}

export function useAgentActivities() {
  return useQuery({
    queryKey: ['agent-activities'],
    queryFn: async (): Promise<{ activities: AgentActivity[] }> => {
      try {
        const response = await api.get('/messages')
        const messages = response.data || []

        let allActivities: AgentActivity[] = []
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        messages.forEach((msg: any) => {
          const msgActivities = extractAgentActivities(msg)
          allActivities = [...allActivities, ...msgActivities]
        })

        allActivities.sort((a, b) => {
          return (
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
        })

        const activities = allActivities.slice(0, 5)

        return { activities }
      } catch (error) {
        console.log('Error fetching agent activities:', error)
        throw error
      }
    },
    refetchInterval: 30000,
  })
}
