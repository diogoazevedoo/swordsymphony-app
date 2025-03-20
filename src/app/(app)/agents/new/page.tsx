'use client'

import { DashboardShell } from '@/components/app/dashboard/shell'
import { DashboardHeader } from '@/components/app/dashboard/header'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Plus, Minus, Info } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { CodeMirrorEditor } from '@/components/ui/code-editor'

export default function NewAgentPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

  // Define interfaces for type safety
  interface SchemaProperty {
    type: string
    items?: {
      type: string
    }
  }

  interface SchemaObject {
    type: string
    properties?: Record<string, SchemaProperty>
  }

  interface AgentInput {
    name: string
    required: boolean
    description: string
    schema: SchemaObject
  }

  interface AgentOutput {
    name: string
    required: boolean
    description: string
    schema: SchemaObject
  }

  interface FormDataType {
    id: string
    type: string
    name: string
    description: string
    version: string
    author: string
    ai: {
      provider: string
      model: string
      temperature: number
      max_tokens: number
      system_prompt: string
      knowledge_sources: string[]
    }
    inputs: AgentInput[]
    outputs: AgentOutput[]
    knowledgeSources: string
  }

  const [formData, setFormData] = useState<FormDataType>({
    id: '',
    type: '',
    name: '',
    description: '',
    version: '1.0.0',
    author: '',
    ai: {
      provider: 'openai',
      model: 'gpt-4',
      temperature: 0.3,
      max_tokens: 1024,
      system_prompt: '',
      knowledge_sources: [] as string[],
    },
    inputs: [
      {
        name: 'patient_data',
        required: true,
        description: 'Patient medical information',
        schema: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            age: { type: 'number' },
            gender: { type: 'string' },
            symptoms: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    ],
    outputs: [
      {
        name: 'result',
        required: true,
        description: 'Agent processing result',
        schema: {
          type: 'object',
        },
      },
    ],
    knowledgeSources: '',
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAISelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      ai: {
        ...prev.ai,
        [name]: value,
      },
    }))
  }

  const handleNumberChange = (name: string, value: string) => {
    const numValue =
      name === 'temperature' ? parseFloat(value) : parseInt(value)
    setFormData((prev) => ({
      ...prev,
      ai: {
        ...prev.ai,
        [name]: numValue,
      },
    }))
  }

  // Handle input schema changes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateInput = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const updatedInputs = [...prev.inputs]
      updatedInputs[index] = {
        ...updatedInputs[index],
        [field]: value,
      }
      return { ...prev, inputs: updatedInputs }
    })
  }

  const addInput = () => {
    setFormData((prev) => ({
      ...prev,
      inputs: [
        ...prev.inputs,
        {
          name: '',
          required: false,
          description: '',
          schema: {
            type: 'object',
            properties: {},
          },
        },
      ],
    }))
  }

  const removeInput = (index: number) => {
    setFormData((prev) => {
      const updatedInputs = [...prev.inputs]
      updatedInputs.splice(index, 1)
      return { ...prev, inputs: updatedInputs }
    })
  }

  // Handle output schema changes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateOutput = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const updatedOutputs = [...prev.outputs]
      updatedOutputs[index] = {
        ...updatedOutputs[index],
        [field]: value,
      }
      return { ...prev, outputs: updatedOutputs }
    })
  }

  const addOutput = () => {
    setFormData((prev) => ({
      ...prev,
      outputs: [
        ...prev.outputs,
        {
          name: '',
          required: false,
          description: '',
          schema: {
            type: 'object',
            properties: {},
          },
        },
      ],
    }))
  }

  const removeOutput = (index: number) => {
    setFormData((prev) => {
      const updatedOutputs = [...prev.outputs]
      updatedOutputs.splice(index, 1)
      return { ...prev, outputs: updatedOutputs }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Format the data to match the expected API format
      const agentConfig = {
        id: formData.id,
        type: formData.type,
        name: formData.name,
        description: formData.description,
        version: formData.version,
        author: formData.author,
        ai: formData.ai,
        inputs: formData.inputs,
        outputs: formData.outputs,
      }

      const response = await api.post('/admin/agents', agentConfig)

      if (response.data && response.data.success) {
        router.push(`/agents/${formData.id}`)
      } else {
        console.error('Failed to create agent:', response.data)
        // Show error message
      }
    } catch (error) {
      console.error('Error creating agent:', error)
      // Show error message
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardShell>
      <div className="-mb-2">
        <div className="flex flex-col gap-4">
          <Button variant="ghost" size="sm" className="w-fit" asChild>
            <Link href="/agents">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Agents
            </Link>
          </Button>
          <DashboardHeader
            heading="Create New Agent"
            subheading="Configure a new AI agent for the system"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs
          defaultValue="basic"
          className="space-y-4"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="w-full sm:w-auto flex justify-start">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="ai">AI Configuration</TabsTrigger>
            <TabsTrigger value="schema">Input/Output Schema</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the core details for your new agent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="id">Agent ID</Label>
                    <Input
                      id="id"
                      name="id"
                      placeholder="unique_agent_id"
                      value={formData.id}
                      onChange={handleInputChange}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      A unique identifier for this agent (no spaces)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Agent Type</Label>
                    <Select
                      onValueChange={(value) =>
                        handleSelectChange('type', value)
                      }
                      value={formData.type}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select agent type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="intake">Intake</SelectItem>
                        <SelectItem value="diagnostic">Diagnostic</SelectItem>
                        <SelectItem value="treatment">Treatment</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      The type of agent determines its role in the system
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Agent Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Medical Diagnostics Agent"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    A descriptive name for this agent
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="This agent analyzes patient symptoms and generates potential diagnoses..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="min-h-[80px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    A detailed description of what this agent does
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="version">Version</Label>
                    <Input
                      id="version"
                      name="version"
                      placeholder="1.0.0"
                      value={formData.version}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      name="author"
                      placeholder="Your Name"
                      value={formData.author}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={() => setActiveTab('ai')}>
                  Next: AI Configuration
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI Configuration</CardTitle>
                <CardDescription>
                  Configure the AI model and parameters for this agent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider">AI Provider</Label>
                    <Select
                      onValueChange={(value) =>
                        handleAISelectChange('provider', value)
                      }
                      value={formData.ai.provider}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="anthropic">Anthropic</SelectItem>
                        <SelectItem value="local">Local Model</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Select
                      onValueChange={(value) =>
                        handleAISelectChange('model', value)
                      }
                      value={formData.ai.model}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">
                          GPT-3.5 Turbo
                        </SelectItem>
                        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                        <SelectItem value="claude-3-opus">
                          Claude 3 Opus
                        </SelectItem>
                        <SelectItem value="claude-3-sonnet">
                          Claude 3 Sonnet
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="temperature">
                      Temperature
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 ml-1 text-muted-foreground inline-block" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Controls randomness: 0 is deterministic, 1 is very
                            creative
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      id="temperature"
                      name="temperature"
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.ai.temperature}
                      onChange={(e) =>
                        handleNumberChange('temperature', e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max_tokens">
                      Max Tokens
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 ml-1 text-muted-foreground inline-block" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Maximum output length (1 token ≈ 4 characters)
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      id="max_tokens"
                      name="max_tokens"
                      type="number"
                      min="1"
                      max="8192"
                      value={formData.ai.max_tokens}
                      onChange={(e) =>
                        handleNumberChange('max_tokens', e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="system_prompt">System Prompt</Label>
                  <CodeMirrorEditor
                    value={formData.ai.system_prompt}
                    onChange={(value) => {
                      setFormData((prev) => ({
                        ...prev,
                        ai: {
                          ...prev.ai,
                          system_prompt: value,
                        },
                      }))
                    }}
                    language="text"
                    minHeight="150px"
                  />
                  <p className="text-xs text-muted-foreground">
                    Instructions that define how the AI should behave and what
                    domain knowledge it should apply
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="knowledge_sources">Knowledge Sources</Label>
                  <CodeMirrorEditor
                    value={formData.knowledgeSources}
                    onChange={(value) => {
                      setFormData((prev) => ({
                        ...prev,
                        knowledgeSources: value,
                        ai: {
                          ...prev.ai,
                          knowledge_sources: value
                            .split('\n')
                            .filter(Boolean)
                            .map((item) => item.trim()),
                        },
                      }))
                    }}
                    language="text"
                    minHeight="100px"
                  />
                  <p className="text-xs text-muted-foreground">
                    Knowledge base sources to include (one per line)
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setActiveTab('basic')}
                >
                  Back
                </Button>
                <Button type="button" onClick={() => setActiveTab('schema')}>
                  Next: Input/Output Schema
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="schema" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Input Schema</CardTitle>
                <CardDescription>
                  Define what data this agent accepts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {formData.inputs.map((input, index) => (
                  <div key={index} className="border rounded-md p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Input #{index + 1}</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeInput(index)}
                        className="h-8 w-8 p-0"
                        disabled={formData.inputs.length === 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`input-${index}-name`}>Name</Label>
                      <Input
                        id={`input-${index}-name`}
                        value={input.name}
                        onChange={(e) =>
                          updateInput(index, 'name', e.target.value)
                        }
                        placeholder="patient_data"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`input-${index}-description`}>
                        Description
                      </Label>
                      <Input
                        id={`input-${index}-description`}
                        value={input.description}
                        onChange={(e) =>
                          updateInput(index, 'description', e.target.value)
                        }
                        placeholder="Patient medical information"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`input-${index}-required`}
                        checked={input.required}
                        onChange={(e) =>
                          updateInput(index, 'required', e.target.checked)
                        }
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor={`input-${index}-required`}>
                        Required
                      </Label>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`input-${index}-schema`}>
                        Schema (JSON)
                      </Label>
                      <CodeMirrorEditor
                        value={JSON.stringify(input.schema, null, 2)}
                        onChange={(value) => {
                          try {
                            const schema = JSON.parse(value)
                            // Ensure schema has the correct structure
                            if (typeof schema === 'object' && schema !== null) {
                              if (!schema.type) {
                                schema.type = 'object'
                              }
                              if (
                                schema.type === 'object' &&
                                !schema.properties
                              ) {
                                schema.properties = {}
                              }
                              updateInput(index, 'schema', schema)
                            }
                          } catch (err) {
                            // Invalid JSON, don't update
                            // We still update the raw text in the editor
                            // but don't update the schema object
                          }
                        }}
                        language="json"
                        minHeight="150px"
                      />
                      <p className="text-xs text-muted-foreground">
                        Define the JSON schema for input data structure
                      </p>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addInput}
                  className="flex items-center"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Input
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Output Schema</CardTitle>
                <CardDescription>
                  Define what data this agent produces
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {formData.outputs.map((output, index) => (
                  <div key={index} className="border rounded-md p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Output #{index + 1}</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOutput(index)}
                        className="h-8 w-8 p-0"
                        disabled={formData.outputs.length === 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`output-${index}-name`}>Name</Label>
                      <Input
                        id={`output-${index}-name`}
                        value={output.name}
                        onChange={(e) =>
                          updateOutput(index, 'name', e.target.value)
                        }
                        placeholder="diagnosis"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`output-${index}-description`}>
                        Description
                      </Label>
                      <Input
                        id={`output-${index}-description`}
                        value={output.description}
                        onChange={(e) =>
                          updateOutput(index, 'description', e.target.value)
                        }
                        placeholder="Diagnostic assessment result"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`output-${index}-required`}
                        checked={output.required}
                        onChange={(e) =>
                          updateOutput(index, 'required', e.target.checked)
                        }
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor={`output-${index}-required`}>
                        Required
                      </Label>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`output-${index}-schema`}>
                        Schema (JSON)
                      </Label>
                      <CodeMirrorEditor
                        value={JSON.stringify(output.schema, null, 2)}
                        onChange={(value) => {
                          try {
                            const schema = JSON.parse(value)
                            // Ensure schema has the correct structure
                            if (typeof schema === 'object' && schema !== null) {
                              if (!schema.type) {
                                schema.type = 'object'
                              }
                              if (
                                schema.type === 'object' &&
                                !schema.properties
                              ) {
                                schema.properties = {}
                              }
                              updateOutput(index, 'schema', schema)
                            }
                          } catch (err) {
                            // Invalid JSON, don't update
                            // We still update the raw text in the editor
                            // but don't update the schema object
                          }
                        }}
                        language="json"
                        minHeight="150px"
                      />
                      <p className="text-xs text-muted-foreground">
                        Define the JSON schema for output data structure
                      </p>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOutput}
                  className="flex items-center"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Output
                </Button>
              </CardContent>
              <CardFooter className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setActiveTab('ai')}
                >
                  Back
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Agent'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </DashboardShell>
  )
}
