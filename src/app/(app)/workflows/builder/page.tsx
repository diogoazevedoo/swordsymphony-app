'use client'

import { DashboardShell } from '@/components/app/dashboard/shell'
import { DashboardHeader } from '@/components/app/dashboard/header'
import { WorkflowBuilder } from '@/components/app/workflow/workflow-builder'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useWorkflow } from '@/hooks/use-workflow'

export default function WorkflowBuilderPage() {
  const searchParams = useSearchParams()
  const workflowId = searchParams.get('id')
  const isEditing = !!workflowId

  const { data: workflow, isLoading } = useWorkflow(workflowId || '')

  const initialData =
    isEditing && workflow
      ? workflow
      : {
          id: '',
          name: 'New Workflow',
          description: 'A custom workflow',
          version: '1.0.0',
          steps: [],
          connections: [],
        }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-fit -ml-2 text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link href="/workflows">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Back to Workflows
            </Link>
          </Button>
          <DashboardHeader
            heading={
              isEditing
                ? `Edit Workflow: ${workflow?.name}`
                : 'Create New Workflow'
            }
            subheading={
              isEditing
                ? "Modify your existing workflow's steps and connections"
                : 'Design a new custom workflow with drag and drop'
            }
          />
        </div>

        <div className="mt-2">
          <WorkflowBuilder initialData={initialData} isLoading={isLoading} />
        </div>
      </div>
    </DashboardShell>
  )
}
