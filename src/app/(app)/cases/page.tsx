'use client'

import { DashboardHeader } from '@/components/app/dashboard/header'
import { DashboardShell } from '@/components/app/dashboard/shell'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useCases } from '@/hooks/use-cases'
import { Plus, FileSymlink, Clock, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function CasesPage() {
  const { data: cases, isLoading, error } = useCases()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCases = cases?.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.symptoms?.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  )

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Cases"
        subheading="View and manage patient cases"
      />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, ID, or symptoms..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button asChild className="flex items-center gap-1">
          <Link href="/cases/new">
            <Plus className="h-4 w-4" />
            New Case
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : error ? (
        <Card className="p-6 flex justify-center items-center">
          <p className="text-muted-foreground">Failed to load cases</p>
        </Card>
      ) : !filteredCases || filteredCases.length === 0 ? (
        <Card className="p-8 flex flex-col items-center justify-center text-center">
          <FileSymlink className="h-12 w-12 text-muted-foreground/60 mb-4" />
          <h3 className="text-lg font-medium mb-2">No cases found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? 'No cases match your search criteria'
              : "You don't have any patient cases yet"}
          </p>
          {searchQuery ? (
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          ) : (
            <Button asChild>
              <Link href="/cases/new">Create a New Case</Link>
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredCases.map((caseData) => (
            <div
              key={caseData.id}
              className="border rounded-lg p-4 hover:border-primary/50 hover:shadow-sm transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-lg">{caseData.name}</h3>
                    <span className="text-xs rounded-full bg-muted px-2 py-0.5">
                      {caseData.is_demo ? 'Demo' : 'Patient'}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <span>ID: {caseData.id}</span>
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
                </div>
                <Button asChild>
                  <Link href={`/cases/${caseData.id}`}>View Details</Link>
                </Button>
              </div>

              {caseData.symptoms && caseData.symptoms.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-1">
                    Symptoms:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {caseData.symptoms.slice(0, 4).map((symptom, i) => (
                      <span
                        key={i}
                        className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                      >
                        {symptom}
                      </span>
                    ))}
                    {caseData.symptoms.length > 4 && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                        +{caseData.symptoms.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}
