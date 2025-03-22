'use client'

import { useState } from 'react'
import type { Workflow, WorkflowStep } from '@/hooks/use-workflow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Plus,
  Brain,
  FileSymlink,
  Network,
  Info,
  Settings,
  WorkflowIcon,
  PlusCircle,
  Trash2,
  Pencil,
  Tag,
  User,
  FileText,
  Hash,
  Clock,
  AlertCircle,
  ChevronRight,
  Layers,
  Sparkles,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAgents } from '@/hooks/use-agents'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface WorkflowSidebarProps {
  workflow: Workflow
  selectedStep: WorkflowStep | null
  onAddStep: (step: Partial<WorkflowStep>) => void
  onUpdateStep: (stepId: string, data: Partial<WorkflowStep>) => void
  onUpdateWorkflow: (data: Partial<Workflow>) => void
  onDeleteStep?: (stepId: string) => void
}

export function WorkflowSidebar({
  workflow,
  selectedStep,
  onAddStep,
  onUpdateStep,
  onUpdateWorkflow,
  onDeleteStep,
}: WorkflowSidebarProps) {
  const { data: agents = [] } = useAgents()
  const [activeTab, setActiveTab] = useState<string>(
    selectedStep ? 'step' : 'workflow',
  )

  if (selectedStep && activeTab !== 'step') {
    setActiveTab('step')
  }

  const handleAddStandardAgent = (agentType: string) => {
    const stepName = agentType
      .replace('_agent', '')
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    onAddStep({
      name: `${stepName} Step`,
      type: 'task',
      agent_type: agentType,
    })

    setActiveTab('step')
  }

  const agentTypes = [
    {
      type: 'intake_agent',
      name: 'Intake',
      description: 'Collects and processes patient information',
      icon: <FileSymlink className="h-3.5 w-3.5" />,
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      type: 'diagnostic_agent',
      name: 'Diagnostic',
      description: 'Analyzes symptoms and suggests diagnoses',
      icon: <Brain className="h-3.5 w-3.5" />,
      color: 'bg-amber-500/10 text-amber-500',
    },
    {
      type: 'treatment_agent',
      name: 'Treatment',
      description: 'Recommends treatments based on diagnosis',
      icon: <Network className="h-3.5 w-3.5" />,
      color: 'bg-green-500/10 text-green-500',
    },
  ]

  const specialistAgents = agents
    .filter(
      (agent) =>
        !['intake_agent', 'diagnostic_agent', 'treatment_agent'].includes(
          agent.type,
        ),
    )
    .map((agent) => ({
      type: agent.id,
      name: agent.name.split(' ').slice(0, 2).join(' '),
      description: agent.description,
      icon: <Sparkles className="h-3.5 w-3.5" />,
      color: 'bg-purple-500/10 text-purple-500',
    }))

  const getAgentIcon = (agentType: string) => {
    const standardAgent = agentTypes.find((agent) => agent.type === agentType)
    if (standardAgent) return standardAgent.icon

    const specialistAgent = specialistAgents.find(
      (agent) => agent.type === agentType,
    )
    if (specialistAgent) return specialistAgent.icon

    return <Brain className="h-3.5 w-3.5" />
  }

  const getAgentColor = (agentType: string) => {
    const standardAgent = agentTypes.find((agent) => agent.type === agentType)
    if (standardAgent) return standardAgent.color

    const specialistAgent = specialistAgents.find(
      (agent) => agent.type === agentType,
    )
    if (specialistAgent) return specialistAgent.color

    return 'bg-primary/10 text-primary'
  }

  return (
    <Card className="w-[360px] flex flex-col border shadow-sm overflow-hidden">
      <CardHeader className="px-4 py-2 border-b bg-muted/10 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
              <WorkflowIcon className="h-3 w-3" />
            </div>
            <CardTitle className="font-medium">Workflow Builder</CardTitle>
          </div>
          {selectedStep && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 h-5">
              {workflow.steps.length} steps
            </Badge>
          )}
        </div>
      </CardHeader>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col min-h-0"
      >
        <div className="px-4 flex-shrink-0">
          <TabsList className="w-full grid grid-cols-3 h-8">
            <TabsTrigger value="workflow" className="text-xs">
              <span className="flex items-center gap-1.5">
                <Settings className="h-3 w-3" />
                Workflow
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="step"
              className="text-xs"
              disabled={!selectedStep}
            >
              <span className="flex items-center gap-1.5">
                <Layers className="h-3 w-3" />
                Step
              </span>
            </TabsTrigger>
            <TabsTrigger value="add-step" className="text-xs">
              <span className="flex items-center gap-1.5">
                <PlusCircle className="h-3 w-3" />
                Add Step
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="p-0 flex-1 flex flex-col min-h-0 overflow-hidden">
          <TabsContent
            value="workflow"
            className="m-0 flex-1 flex flex-col min-h-0"
          >
            <ScrollArea className="flex-1">
              <div className="space-y-3 px-4 py-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                    <Label htmlFor="id" className="text-xs font-medium">
                      Workflow ID
                    </Label>
                  </div>
                  <Input
                    id="id"
                    value={workflow.id}
                    onChange={(e) => onUpdateWorkflow({ id: e.target.value })}
                    placeholder="unique_workflow_id"
                    className="h-8 text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    A unique identifier for this workflow
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    <Label htmlFor="name" className="text-xs font-medium">
                      Name
                    </Label>
                  </div>
                  <Input
                    id="name"
                    value={workflow.name}
                    onChange={(e) => onUpdateWorkflow({ name: e.target.value })}
                    placeholder="Workflow Name"
                    className="h-8 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    <Label
                      htmlFor="description"
                      className="text-xs font-medium"
                    >
                      Description
                    </Label>
                  </div>
                  <Textarea
                    id="description"
                    value={workflow.description}
                    onChange={(e) =>
                      onUpdateWorkflow({ description: e.target.value })
                    }
                    placeholder="Describe the workflow"
                    className="resize-none h-16 text-sm min-h-[64px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                      <Label htmlFor="version" className="text-xs font-medium">
                        Version
                      </Label>
                    </div>
                    <Input
                      id="version"
                      value={workflow.version}
                      onChange={(e) =>
                        onUpdateWorkflow({ version: e.target.value })
                      }
                      placeholder="1.0.0"
                      className="h-8 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <Label htmlFor="author" className="text-xs font-medium">
                        Author
                      </Label>
                    </div>
                    <Input
                      id="author"
                      value={workflow.author || ''}
                      onChange={(e) =>
                        onUpdateWorkflow({ author: e.target.value })
                      }
                      placeholder="Your Name"
                      className="h-8 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                    <Label htmlFor="tags" className="text-xs font-medium">
                      Tags
                    </Label>
                  </div>
                  <Input
                    id="tags"
                    value={workflow.tags?.join(', ') || ''}
                    onChange={(e) => {
                      const tagsArray = e.target.value
                        .split(',')
                        .map((tag) => tag.trim())
                        .filter(Boolean)
                      onUpdateWorkflow({ tags: tagsArray })
                    }}
                    placeholder="cardiology, emergency, pediatric"
                    className="h-8 text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Comma separated list of tags
                  </p>
                </div>

                {workflow.tags && workflow.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {workflow.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs px-2 py-0.5 font-normal"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {selectedStep && (
            <TabsContent
              value="step"
              className="m-0 flex-1 flex flex-col min-h-0"
            >
              <ScrollArea className="flex-1">
                <div className="space-y-3 px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'flex h-7 w-7 items-center justify-center rounded-full',
                          getAgentColor(selectedStep.agent_type),
                        )}
                      >
                        {getAgentIcon(selectedStep.agent_type)}
                      </div>
                      <h3 className="text-sm font-medium">
                        {selectedStep.name}
                      </h3>
                    </div>

                    {onDeleteStep && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          onDeleteStep(selectedStep.id)
                          setActiveTab('workflow')
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete step</span>
                      </Button>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                      <Label htmlFor="step-id" className="text-xs font-medium">
                        Step ID
                      </Label>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Input
                        id="step-id"
                        value={selectedStep.id}
                        readOnly
                        disabled
                        className="h-8 text-sm bg-muted/20 text-muted-foreground flex-1"
                      />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground"
                            >
                              <Info className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            <p className="text-xs">
                              Step ID is auto-generated and cannot be changed
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                      <Label
                        htmlFor="step-name"
                        className="text-xs font-medium"
                      >
                        Name
                      </Label>
                    </div>
                    <Input
                      id="step-name"
                      value={selectedStep.name}
                      onChange={(e) =>
                        onUpdateStep(selectedStep.id, { name: e.target.value })
                      }
                      placeholder="Step Name"
                      className="h-8 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                      <Label
                        htmlFor="step-type"
                        className="text-xs font-medium"
                      >
                        Type
                      </Label>
                    </div>
                    <Select
                      value={selectedStep.type}
                      onValueChange={(value) =>
                        onUpdateStep(selectedStep.id, { type: value })
                      }
                    >
                      <SelectTrigger id="step-type" className="h-8 text-sm">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="task">
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded-full bg-blue-500/10 flex items-center justify-center">
                              <Brain className="h-3 w-3 text-blue-500" />
                            </div>
                            <span>Task</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="condition">
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded-full bg-amber-500/10 flex items-center justify-center">
                              <AlertCircle className="h-3 w-3 text-amber-500" />
                            </div>
                            <span>Condition</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="transformation">
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center">
                              <Sparkles className="h-3 w-3 text-green-500" />
                            </div>
                            <span>Transformation</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {selectedStep.type === 'task' &&
                        'Executes an agent to perform a specific task'}
                      {selectedStep.type === 'condition' &&
                        'Evaluates a condition to determine workflow path'}
                      {selectedStep.type === 'transformation' &&
                        'Transforms data between workflow steps'}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Brain className="h-3.5 w-3.5 text-muted-foreground" />
                      <Label
                        htmlFor="step-agent-type"
                        className="text-xs font-medium"
                      >
                        Agent Type
                      </Label>
                    </div>
                    <Select
                      value={selectedStep.agent_type}
                      onValueChange={(value) =>
                        onUpdateStep(selectedStep.id, { agent_type: value })
                      }
                    >
                      <SelectTrigger
                        id="step-agent-type"
                        className="h-8 text-sm"
                      >
                        <SelectValue placeholder="Select agent" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="intake_agent">
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded-full bg-blue-500/10 flex items-center justify-center">
                              <FileSymlink className="h-3 w-3 text-blue-500" />
                            </div>
                            <span>Intake Agent</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="diagnostic_agent">
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded-full bg-amber-500/10 flex items-center justify-center">
                              <Brain className="h-3 w-3 text-amber-500" />
                            </div>
                            <span>Diagnostic Agent</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="treatment_agent">
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center">
                              <Network className="h-3 w-3 text-green-500" />
                            </div>
                            <span>Treatment Agent</span>
                          </div>
                        </SelectItem>

                        {specialistAgents.length > 0 && (
                          <>
                            <Separator className="my-1" />
                            {specialistAgents.map((agent) => (
                              <SelectItem key={agent.type} value={agent.type}>
                                <div className="flex items-center gap-2">
                                  <div className="h-5 w-5 rounded-full bg-purple-500/10 flex items-center justify-center">
                                    <Sparkles className="h-3 w-3 text-purple-500" />
                                  </div>
                                  <span>{agent.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedStep.type === 'task' && (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <Label
                          htmlFor="step-timeout"
                          className="text-xs font-medium"
                        >
                          Timeout (seconds)
                        </Label>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Input
                          id="step-timeout"
                          type="number"
                          defaultValue="60"
                          className="h-8 text-sm w-24"
                        />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground"
                              >
                                <Info className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              <p className="text-xs">
                                Maximum execution time for this step
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  )}

                  <Separator className="my-2" />

                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setActiveTab('add-step')}
                    >
                      <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                      Add Another Step
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          )}

          <TabsContent
            value="add-step"
            className="m-0 flex-1 flex flex-col min-h-0 h-full"
          >
            <ScrollArea className="flex-1 h-full">
              <div className="space-y-4 px-4 py-4">
                <div>
                  <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 flex items-center">
                    <Brain className="h-3 w-3 mr-1" />
                    Standard Agents
                  </h3>
                  <div className="grid gap-2">
                    {agentTypes.map((agent) => (
                      <div
                        key={agent.type}
                        className="border rounded-md overflow-hidden hover:border-primary/50 transition-colors"
                      >
                        <Button
                          variant="ghost"
                          className="justify-between w-full h-auto py-2 px-2.5 text-left"
                          onClick={() => handleAddStandardAgent(agent.type)}
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0 mr-2">
                            <div
                              className={cn(
                                'flex h-6 w-6 items-center justify-center rounded-full shrink-0',
                                agent.color,
                              )}
                            >
                              {agent.icon}
                            </div>
                            <div className="text-left min-w-0 flex-1">
                              <h4 className="text-xs font-medium">
                                {agent.name} Agent
                              </h4>
                              <p className="text-[10px] text-muted-foreground truncate">
                                {agent.description}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-1" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {specialistAgents.length > 0 && (
                  <>
                    <Separator className="my-3" />
                    <div>
                      <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 flex items-center">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Specialist Agents
                      </h3>
                      <div className="grid gap-2">
                        {specialistAgents.map((agent) => (
                          <div
                            key={agent.type}
                            className="border rounded-md overflow-hidden hover:border-primary/50 transition-colors"
                          >
                            <Button
                              variant="ghost"
                              className="justify-between w-full h-auto py-2 px-2.5 text-left"
                              onClick={() => handleAddStandardAgent(agent.type)}
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0 mr-2">
                                <div
                                  className={cn(
                                    'flex h-6 w-6 items-center justify-center rounded-full shrink-0',
                                    agent.color,
                                  )}
                                >
                                  {agent.icon}
                                </div>
                                <div className="text-left min-w-0 flex-1">
                                  <h4 className="text-xs font-medium">
                                    {agent.name}
                                  </h4>
                                  <p className="text-[10px] text-muted-foreground truncate">
                                    {agent.description}
                                  </p>
                                </div>
                              </div>
                              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-1" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Separator className="my-3" />

                <div>
                  <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 flex items-center">
                    <Plus className="h-3 w-3 mr-1" />
                    Custom Step
                  </h3>
                  <Button
                    variant="outline"
                    className="w-full h-8 text-xs"
                    onClick={() => {
                      onAddStep({})
                      setActiveTab('step')
                    }}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Add Custom Step
                  </Button>
                </div>

                <div className="pt-4"></div>
              </div>
            </ScrollArea>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
}
