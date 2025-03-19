import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Case } from '@/types'

export function useCases() {
  return useQuery({
    queryKey: ['all-cases'],
    queryFn: async (): Promise<Case[]> => {
      try {
        const response = await api.get('/cases')
        return formatCasesResponse(response.data.cases)
      } catch (error) {
        console.log('Error fetching cases:', error)
        throw error
      }
    },
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatCasesResponse(data: any): Case[] {
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    return Object.entries(data).map(([id, caseData]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const typedCaseData = caseData as any

      if (!typedCaseData.id) {
        typedCaseData.id = id
      }

      if (!typedCaseData.created_at) {
        typedCaseData.created_at = new Date().toISOString()
      }

      if (!typedCaseData.updated_at) {
        typedCaseData.updated_at = new Date().toISOString()
      }

      return typedCaseData as Case
    })
  }

  if (Array.isArray(data)) {
    return data.map((caseData) => {
      if (!caseData.created_at) {
        caseData.created_at = new Date().toISOString()
      }

      if (!caseData.updated_at) {
        caseData.updated_at = new Date().toISOString()
      }

      return caseData as Case
    })
  }

  return []
}
