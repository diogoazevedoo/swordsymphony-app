'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import ReactFlow, {
  ReactFlowProvider,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  type NodeChange,
  type EdgeChange,
  type NodeMouseHandler,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
  Panel,
  BackgroundVariant,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Card } from '@/components/ui/card'
import type { Workflow, WorkflowStep } from '@/hooks/use-workflow'
import { Button } from '@/components/ui/button'
import { Save, Trash2, ZoomIn, ZoomOut, Maximize } from 'lucide-react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { WorkflowNode } from './workflow-node'
import { WorkflowSidebar } from './workflow-sidebar'

const nodeTypes = {
  workflowNode: WorkflowNode,
}

const workflowToReactFlow = (workflow: Workflow) => {
  const nodes = workflow.steps.map((step) => ({
    id: step.id,
    type: 'workflowNode',
    position: step.position || { x: 250, y: 100 + Math.random() * 100 },
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

const reactFlowToWorkflow = (
  workflow: Workflow,
  nodes: Node[],
  edges: Edge[],
) => {
  const updatedSteps = workflow.steps.map((step) => {
    const node = nodes.find((n) => n.id === step.id)
    if (node) {
      return {
        ...step,
        position: node.position,
      }
    }
    return step
  })

  const updatedConnections = edges.map((edge) => ({
    from: edge.source,
    to: edge.target,
  }))

  return {
    ...workflow,
    steps: updatedSteps,
    connections: updatedConnections,
  }
}

interface WorkflowBuilderProps {
  initialData: Workflow
  isLoading?: boolean
}

export function WorkflowBuilder({
  initialData,
  isLoading = false,
}: WorkflowBuilderProps) {
  const router = useRouter()
  const [workflow, setWorkflow] = useState<Workflow>(initialData)
  const [nodes, setNodes] = useNodesState([])
  const [edges, setEdges] = useEdgesState([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)

  useEffect(() => {
    if (!isLoading && initialData) {
      const { nodes: flowNodes, edges: flowEdges } =
        workflowToReactFlow(initialData)
      setNodes(flowNodes)
      setEdges(flowEdges)
      setWorkflow(initialData)
    }
  }, [initialData, isLoading, setNodes, setEdges])

  useEffect(() => {
    if (workflow && workflow.steps && workflow.steps.length > 0) {
      const { nodes: flowNodes } = workflowToReactFlow(workflow)
      setNodes(flowNodes)
    }
  }, [workflow, setNodes])

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'smoothstep',
            animated: true,
            style: { stroke: 'var(--primary)' },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: 'var(--primary)',
            },
          },
          eds,
        ),
      )

      setWorkflow((wf) => ({
        ...wf,
        connections: [
          ...wf.connections,
          { from: params.source!, to: params.target! },
        ],
      }))
    },
    [setEdges],
  )

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const updatedNodes = applyNodeChanges(changes, nodes)
      setNodes(updatedNodes)

      changes.forEach((change) => {
        if (change.type === 'position' && change.position) {
          setWorkflow((wf) => {
            const updatedSteps = wf.steps.map((step) => {
              if (step.id === change.id) {
                return {
                  ...step,
                  position: change.position,
                }
              }
              return step
            })
            return {
              ...wf,
              steps: updatedSteps,
            }
          })
        }
      })
    },
    [nodes, setNodes],
  )

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const updatedEdges = applyEdgeChanges(changes, edges)
      setEdges(updatedEdges)

      changes.forEach((change) => {
        if (change.type === 'remove') {
          setWorkflow((wf) => {
            const edge = edges.find((e) => e.id === change.id)
            if (edge) {
              const filteredConnections = wf.connections.filter(
                (conn) =>
                  !(conn.from === edge.source && conn.to === edge.target),
              )
              return {
                ...wf,
                connections: filteredConnections,
              }
            }
            return wf
          })
        }
      })
    },
    [edges, setEdges],
  )

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    setSelectedElement(node.id)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedElement(null)
  }, [])

  const handleAddStep = (stepData: Partial<WorkflowStep>) => {
    const newId = `step-${Date.now()}`

    const newStep: WorkflowStep = {
      id: newId,
      name: stepData.name || 'New Step',
      type: stepData.type || 'task',
      agent_type: stepData.agent_type || 'intake_agent',
      position: {
        x: 250,
        y: workflow.steps.length * 150 + 100,
      },
    }

    setWorkflow((wf) => ({
      ...wf,
      steps: [...wf.steps, newStep],
    }))
  }

  const handleSaveWorkflow = async () => {
    if (!workflow.id || !workflow.name) {
      return
    }

    setIsSaving(true)

    try {
      const updatedWorkflow = reactFlowToWorkflow(workflow, nodes, edges)

      const isNew = !initialData.id

      const endpoint = isNew
        ? '/management/workflows'
        : `/management/workflows/${workflow.id}`

      const method = isNew ? 'post' : 'put'

      const response = await api[method](endpoint, updatedWorkflow)

      if (response.data && response.data.success) {
        if (isNew) {
          router.push(`/workflows/${workflow.id}`)
        }
      } else {
        throw new Error(
          response.data?.error?.message || 'Failed to save workflow',
        )
      }
    } catch (error) {
      console.error('Error saving workflow:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateWorkflowData = (data: Partial<Workflow>) => {
    setWorkflow((prev) => ({
      ...prev,
      ...data,
    }))
  }

  const handleUpdateStep = (stepId: string, data: Partial<WorkflowStep>) => {
    setWorkflow((wf) => {
      const updatedSteps = wf.steps.map((step) => {
        if (step.id === stepId) {
          return {
            ...step,
            ...data,
          }
        }
        return step
      })

      return {
        ...wf,
        steps: updatedSteps,
      }
    })
  }

  const handleDeleteElement = () => {
    if (!selectedElement) return

    const nodeIndex = nodes.findIndex((n) => n.id === selectedElement)
    if (nodeIndex !== -1) {
      setNodes(nodes.filter((n) => n.id !== selectedElement))

      setEdges(
        edges.filter(
          (e) => e.source !== selectedElement && e.target !== selectedElement,
        ),
      )

      setWorkflow((wf) => ({
        ...wf,
        steps: wf.steps.filter((s) => s.id !== selectedElement),
        connections: wf.connections.filter(
          (c) => c.from !== selectedElement && c.to !== selectedElement,
        ),
      }))
    }

    setSelectedElement(null)
  }

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

  const selectedStep = selectedElement
    ? workflow.steps.find((s) => s.id === selectedElement)
    : null

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[600px] w-full" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">
            {workflow.name || 'New Workflow'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {workflow.description}
          </p>
        </div>
        <div className="flex gap-2">
          {selectedElement && (
            <Button
              variant="destructive"
              size="sm"
              className="h-9"
              onClick={handleDeleteElement}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Delete
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={() => router.push('/workflows')}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            className="h-9"
            onClick={handleSaveWorkflow}
            disabled={isSaving}
          >
            <Save className="h-3.5 w-3.5 mr-1.5" />
            {isSaving ? 'Saving...' : 'Save Workflow'}
          </Button>
        </div>
      </div>

      <div className="flex gap-4 h-[600px]">
        <Card className="flex-1 overflow-hidden border">
          <div ref={reactFlowWrapper} className="h-full w-full">
            <ReactFlowProvider>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={handleNodesChange}
                onEdgesChange={handleEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                nodeTypes={nodeTypes}
                fitView
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
                <Background
                  variant={BackgroundVariant.Dots}
                  color="#ddd"
                  gap={12}
                  size={1}
                />
              </ReactFlow>
            </ReactFlowProvider>
          </div>
        </Card>

        <WorkflowSidebar
          workflow={workflow}
          selectedStep={selectedStep ?? null}
          onAddStep={handleAddStep}
          onUpdateStep={handleUpdateStep}
          onUpdateWorkflow={handleUpdateWorkflowData}
        />
      </div>
    </div>
  )
}
