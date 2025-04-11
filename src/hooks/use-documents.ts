import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export interface Document {
  id: string
  case_id: string
  name: string
  type: string
  content_type: string
  file_path: string
  file_url: string
  size: number
  uploaded_at: string
  status: 'uploaded' | 'processing' | 'analyzed' | 'failed'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  analysis?: Record<string, any>
}

export function useDocuments(caseId: string) {
  const queryClient = useQueryClient()

  const documentsQuery = useQuery({
    queryKey: ['documents', caseId],
    queryFn: async () => {
      try {
        const response = await api.get(`/documents/case/${caseId}`)
        return response.data.documents as Document[]
      } catch (error) {
        console.error('Error fetching documents:', error)
        throw error
      }
    },
    enabled: !!caseId,
    refetchInterval: 3000, // Poll every 3 seconds to check for document status updates
  })

  const uploadDocument = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post(`/documents/upload/${caseId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data as Document
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', caseId] })
    },
  })

  const deleteDocument = useMutation({
    mutationFn: async (documentId: string) => {
      await api.delete(`/documents/${documentId}`)
      return documentId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', caseId] })
    },
  })

  const getDocumentUrl = (documentId: string) => {
    return `${api.defaults.baseURL}/documents/${documentId}/file`
  }

  const getDocumentAnalysis = async (documentId: string) => {
    try {
      const response = await api.get(`/documents/${documentId}/analysis`)
      // Make sure we're getting the analysis data correctly
      if (response.data && response.data.analysis) {
        console.log('API returned analysis:', response.data.analysis)
        return response.data.analysis
      } else {
        console.error('Invalid analysis data format:', response.data)
        throw new Error('Invalid analysis data format')
      }
    } catch (error) {
      console.error('Error fetching document analysis:', error)
      throw error
    }
  }

  // Add a function to manually refresh a specific document
  const refreshDocument = async (documentId: string) => {
    try {
      const response = await api.get(`/documents/${documentId}`)
      // Update the document in the cache
      queryClient.setQueryData(
        ['documents', caseId],
        (oldData: Document[] | undefined) => {
          if (!oldData) return undefined
          return oldData.map((doc) =>
            doc.id === documentId ? response.data : doc,
          )
        },
      )
      return response.data as Document
    } catch (error) {
      console.error('Error refreshing document:', error)
      throw error
    }
  }

  return {
    documents: documentsQuery.data || [],
    isLoading: documentsQuery.isLoading,
    isError: documentsQuery.isError,
    error: documentsQuery.error,
    refetch: documentsQuery.refetch,
    uploadDocument,
    deleteDocument,
    getDocumentUrl,
    getDocumentAnalysis,
    refreshDocument,
  }
}
