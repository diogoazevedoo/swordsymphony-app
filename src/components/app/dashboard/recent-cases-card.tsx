'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { useRecentCases } from '@/hooks/use-recent-case'

interface RecentCasesCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RecentCasesCard({ className, ...props }: RecentCasesCardProps) {
  const { data: cases, isLoading, error } = useRecentCases()

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Card className={cn('', className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Recent Cases</CardTitle>
        <Button variant="ghost" size="sm" className="h-8 gap-1" asChild>
          <Link href="/cases">
            View all
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="flex h-24 items-center justify-center rounded-md border border-dashed p-2">
            <p className="text-sm text-muted-foreground">
              Failed to load recent cases
            </p>
          </div>
        ) : !cases || cases.length === 0 ? (
          <div className="flex h-24 items-center justify-center rounded-md border border-dashed p-2">
            <p className="text-sm text-muted-foreground">No cases found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {cases.map((kase) => (
              <div
                key={kase.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">
                    {kase.name || 'Unknown Patient'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ID: {kase.id} · {formatDate(kase.created_at)}
                  </p>
                </div>
                <Link
                  href={`/cases/${kase.id}`}
                  className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
