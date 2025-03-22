'use client'

import { useState, useEffect } from 'react'
import ReactFlow, {
  ReactFlowProvider,
  Controls,
  Background,
  MarkerType,
  Panel,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { WorkflowNode } from './workflow-node'
import type { Workflow } from '@/hooks/use-workflow'
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react'
import { Button } from '@/components/ui/button'

const nodeTypes = {
  workflowNode: WorkflowNode,
}

const workflowToReactFlow = (workflow: Workflow) => {
  const nodes = workflow.steps.map((step, index) => ({
    id: step.id,
    type: 'workflowNode',
    position: step.position || {
      x: 250,
      y: 100 + index * 150,
    },
    data: {
      ...step,
    },
  }))

  const edges = workflow.connections.map((connection) => ({
    id: `e-${connection.from}-${connection.to}`,
    source: connection.from,
    target: connection.to,
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'var(--primary)' },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: 'var(--primary)',
    },
  }))

  return { nodes, edges }
}

interface WorkflowDiagramProps {
  workflow: Workflow
}

export function WorkflowDiagram({ workflow }: WorkflowDiagramProps) {
  const [nodes, setNodes] = useState<
    {
      id: string
      type: string
      position: { x: number; y: number }
      data: {
        id: string
        name: string
        type: string
        agent_type: string
        agent_config?: string
        position?: { x: number; y: number }
      }
    }[]
  >([])
  const [edges, setEdges] = useState<
    {
      id: string
      source: string
      target: string
      type: string
      animated: boolean
      style: { stroke: string }
      markerEnd: {
        type: MarkerType
        width: number
        height: number
        color: string
      }
    }[]
  >([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)

  useEffect(() => {
    if (workflow) {
      const { nodes: flowNodes, edges: flowEdges } =
        workflowToReactFlow(workflow)
      setNodes(flowNodes)
      setEdges(flowEdges)
    }
  }, [workflow])

  const handleZoomIn = () => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomIn()
    }
  }

  const handleZoomOut = () => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomOut()
    }
  }

  const handleFitView = () => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView({ padding: 0.2 })
    }
  }

  return (
    <ReactFlowProvider>
      <div style={{ width: '100%', height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.2}
          maxZoom={1.5}
          zoomOnScroll={false}
          panOnScroll
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: true }}
          onInit={setReactFlowInstance}
        >
          <Panel position="top-right" className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 bg-background border"
              onClick={handleZoomIn}
            >
              <ZoomIn className="h-3.5 w-3.5" />
              <span className="sr-only">Zoom In</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 bg-background border"
              onClick={handleZoomOut}
            >
              <ZoomOut className="h-3.5 w-3.5" />
              <span className="sr-only">Zoom Out</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 bg-background border"
              onClick={handleFitView}
            >
              <Maximize className="h-3.5 w-3.5" />
              <span className="sr-only">Fit View</span>
            </Button>
          </Panel>
          <Controls
            showInteractive={false}
            className="bg-background border shadow-sm"
          />
          <Background color="#f0f0f0" gap={16} size={1} />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  )
}
