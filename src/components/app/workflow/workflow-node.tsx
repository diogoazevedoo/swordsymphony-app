'use client'

import { Handle, Position, type NodeProps } from 'reactflow'
import { Brain, FileSymlink, Network, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

const getAgentIcon = (agentType: string) => {
  switch (agentType.toLowerCase()) {
    case 'intake_agent':
      return <FileSymlink className="h-3.5 w-3.5" />
    case 'diagnostic_agent':
      return <Brain className="h-3.5 w-3.5" />
    case 'treatment_agent':
      return <Network className="h-3.5 w-3.5" />
    case 'cardiologist_diagnostic':
    case 'neurologist_diagnostic':
    case 'pediatric_diagnostic':
    case 'emergency_diagnostic':
      return <Brain className="h-3.5 w-3.5" />
    default:
      return <Zap className="h-3.5 w-3.5" />
  }
}

const getAgentTypeColor = (agentType: string) => {
  switch (agentType.toLowerCase()) {
    case 'intake_agent':
      return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
    case 'diagnostic_agent':
      return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
    case 'treatment_agent':
      return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
    case 'cardiologist_diagnostic':
      return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
    case 'neurologist_diagnostic':
      return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
    case 'pediatric_diagnostic':
      return 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400'
    case 'emergency_diagnostic':
      return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
    default:
      return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400'
  }
}

const formatAgentType = (agentType: string) => {
  return agentType
    .replace('_agent', '')
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function WorkflowNode({ data, isConnectable, selected }: NodeProps) {
  return (
    <div
      className={cn(
        'min-w-[180px] bg-white dark:bg-gray-800 border rounded-md shadow-sm p-3',
        selected ? 'border-primary ring-2 ring-primary/30' : 'border-border',
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="h-3 w-3 bg-primary dark:bg-primary"
      />

      <div className="flex items-center gap-2 mb-2">
        <div
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded-full',
            getAgentTypeColor(data.agent_type),
          )}
        >
          {getAgentIcon(data.agent_type)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm leading-none truncate">
            {data.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {data.type || 'task'}
          </p>
        </div>
      </div>

      <Badge
        variant="outline"
        className={cn(
          'text-xs px-1 h-5 mt-1 w-full justify-center truncate font-normal',
          getAgentTypeColor(data.agent_type),
        )}
      >
        {formatAgentType(data.agent_type)}
      </Badge>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="h-3 w-3 bg-primary dark:bg-primary"
      />
    </div>
  )
}
