import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, FileSymlink, History, CirclePlay } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuickActionsCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function QuickActionsCard({
  className,
  ...props
}: QuickActionsCardProps) {
  const actions = [
    {
      label: 'New Case',
      icon: Plus,
      variant: 'default' as const,
      href: '/cases/new',
    },
    {
      label: 'Upload Data',
      icon: FileSymlink,
      variant: 'outline' as const,
      href: '/upload',
    },
    {
      label: 'Demo Cases',
      icon: CirclePlay,
      variant: 'outline' as const,
      href: '/demo-cases',
    },
    {
      label: 'Case History',
      icon: History,
      variant: 'outline' as const,
      href: '/cases',
    },
  ]

  return (
    <Card className={cn('', className)} {...props}>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant}
              size="sm"
              className="h-20 w-full flex-col gap-1 justify-center"
              asChild
            >
              <a href={action.href}>
                <action.icon className="h-5 w-5" />
                <span>{action.label}</span>
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
