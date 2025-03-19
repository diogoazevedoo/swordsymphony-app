import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Case } from '@/types'

export function useRecentCases() {
  return useQuery({
    queryKey: ['recent-cases'],
    queryFn: async (): Promise<Case[]> => {
      try {
        const response = await api.get('/demo-cases')
        const casesData = response.data

        const casesArray = Object.entries(casesData).map(([id, caseData]) => {
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

        return casesArray
          .sort((a, b) => {
            const dateA = new Date(a.updated_at || a.created_at).getTime()
            const dateB = new Date(b.updated_at || b.created_at).getTime()
            return dateB - dateA
          })
          .slice(0, 5)
      } catch (error) {
        console.log('Error fetching recent cases:', error)
        throw error
      }
    },
  })
}
