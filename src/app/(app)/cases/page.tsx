'use client'

import { DashboardShell } from '@/components/app/dashboard/shell'
import { useCases } from '@/hooks/use-cases'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  FileSymlink,
  Plus,
  AlertTriangle,
  Search,
  Filter,
  MoreHorizontal,
  Clock,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'

export default function CasesPage() {
  const { data: cases, isLoading, error } = useCases()
  const [searchQuery, setSearchQuery] = useState('')

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const filteredCases = cases?.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.symptoms?.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  )

  return (
    <DashboardShell>
      <div className="flex flex-col space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Cases</h1>
            <p className="text-muted-foreground mt-1">
              View and manage patient cases
            </p>
          </div>
          <Button asChild size="sm" className="w-full sm:w-auto">
            <Link href="/cases/new">
              <Plus className="mr-2 h-4 w-4" />
              New Case
            </Link>
          </Button>
        </div>

        {/* Search and filter bar */}
        {!isLoading && cases && cases.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, or symptoms..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSearchQuery('demo')}>
                  Demo Cases
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchQuery('patient')}>
                  Patient Cases
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchQuery('male')}>
                  Male Patients
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchQuery('female')}>
                  Female Patients
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="overflow-hidden border p-4">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="border-destructive/20 bg-destructive/5">
          <div className="p-6 flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-destructive/10 p-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-lg font-medium mb-2">Failed to load cases</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              An error occurred while loading the patient cases. Please check
              your connection and try again.
            </p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </Card>
      ) : !cases || cases.length === 0 ? (
        <Card className="border-dashed border-2">
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <FileSymlink className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No cases found</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              You don't have any patient cases yet. Create your first case to
              get started.
            </p>
            <Button asChild>
              <Link href="/cases/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Case
              </Link>
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {searchQuery && filteredCases?.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground/60 mb-4" />
              <h3 className="text-lg font-medium mb-2">No matching cases</h3>
              <p className="text-muted-foreground mb-4">
                No cases match your search for "{searchQuery}".
              </p>
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredCases?.map((caseData) => (
                <Link
                  key={caseData.id}
                  href={`/cases/${caseData.id}`}
                  className="block group"
                >
                  <Card className="overflow-hidden border p-4 hover:border-primary/50 hover:shadow-sm transition-all duration-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-sm leading-tight truncate">
                              {caseData.name}
                            </h3>
                            <Badge
                              variant="outline"
                              className={cn(
                                'text-[10px] px-1.5 py-0.5 h-5 capitalize',
                                caseData.is_demo
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                              )}
                            >
                              {caseData.is_demo ? 'Demo' : 'Patient'}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground mt-1">
                            <span className="truncate">ID: {caseData.id}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>
                              {caseData.age} years, {caseData.gender}
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{formatDate(caseData.created_at)}</span>
                            </div>
                          </div>

                          {caseData.symptoms &&
                            caseData.symptoms.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {caseData.symptoms
                                  .slice(0, 4)
                                  .map((symptom, i) => (
                                    <Badge
                                      key={i}
                                      variant="outline"
                                      className="text-[10px] px-1.5 py-0.5 h-5 bg-primary/10 text-primary"
                                    >
                                      {symptom}
                                    </Badge>
                                  ))}
                                {caseData.symptoms.length > 4 && (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] px-1.5 py-0.5 h-5 bg-muted"
                                  >
                                    +{caseData.symptoms.length - 4} more
                                  </Badge>
                                )}
                              </div>
                            )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-auto">
                        <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors hidden md:inline-block">
                          View details
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.preventDefault()}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/cases/${caseData.id}/edit`}>
                                Edit Case
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Share Case</DropdownMenuItem>
                            <DropdownMenuItem>Export Case</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Delete Case
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </DashboardShell>
  )
}
