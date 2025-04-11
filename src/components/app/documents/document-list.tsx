'use client'

import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import {
  FileText,
  FileImage,
  File,
  Clock,
  ExternalLink,
  Trash2,
  AlertCircle,
  CheckCircle,
  Download,
  FileIcon,
  BarChart3,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useDocuments, Document } from '@/hooks/use-documents'

interface DocumentListProps {
  caseId: string
  refreshTrigger?: number
}

// Helper to get appropriate icon for document type
function getDocumentIcon(contentType: string) {
  if (contentType.includes('pdf')) {
    return <FileText className="h-6 w-6" />
  } else if (contentType.includes('image')) {
    return <FileImage className="h-6 w-6" />
  } else {
    return <File className="h-6 w-6" />
  }
}

// Helper to format file size
function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  else return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export function DocumentList({
  caseId,
  refreshTrigger = 0,
}: DocumentListProps) {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null,
  )
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null)

  const { documents, isLoading, error, refetch, deleteDocument } =
    useDocuments(caseId)

  // Refetch when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger > 0) {
      refetch()
    }
  }, [refreshTrigger, refetch])

  // Handle document deletion
  const handleDeleteDocument = async () => {
    if (!documentToDelete) return

    try {
      await deleteDocument.mutateAsync(documentToDelete)
      setDeleteDialogOpen(false)
      setDocumentToDelete(null)
    } catch (error) {
      console.error('Error deleting document:', error)
    }
  }

  // Handle document preview
  const handlePreviewDocument = (document: Document) => {
    setSelectedDocument(document)
  }

  // Open document in new tab
  const openDocument = (document: Document) => {
    window.open(document.file_url, '_blank')
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="ml-3 space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-3 w-1/2 mb-3" />
              <div className="flex justify-end">
                <Skeleton className="h-9 w-20 mr-2" />
                <Skeleton className="h-9 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <AlertCircle className="mr-2 h-5 w-5" />
            Error Loading Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            There was a problem loading the documents. Please try again later.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="mt-4"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!documents || documents.length === 0) {
    return (
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-center text-muted-foreground">
            No Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center pb-6">
          <p className="text-sm text-muted-foreground">
            No documents have been uploaded for this case yet.
          </p>
          <p className="text-sm text-muted-foreground">
            Use the upload section to add documents.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {documents.map((document) => (
          <Card key={document.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  {getDocumentIcon(document.content_type)}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-medium line-clamp-1">{document.name}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <Badge
                      variant="outline"
                      className="bg-primary/5 text-primary text-xs"
                    >
                      {document.type.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <span className="flex items-center text-xs">
                      <Clock className="mr-1 h-3 w-3" />
                      {formatDistanceToNow(new Date(document.uploaded_at), {
                        addSuffix: true,
                      })}
                    </span>
                    <span className="text-xs">
                      {formatFileSize(document.size)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {document.status === 'analyzed' ? (
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-700"
                    >
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Analyzed
                    </Badge>
                  ) : document.status === 'failed' ? (
                    <Badge
                      variant="outline"
                      className="bg-red-100 text-red-700"
                    >
                      <AlertCircle className="mr-1 h-3 w-3" />
                      Failed
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-amber-100 text-amber-700"
                    >
                      <Clock className="mr-1 h-3 w-3" />
                      Processing
                    </Badge>
                  )}
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePreviewDocument(document)}
                    >
                      <FileIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <a
                        href={document.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                    {document.status === 'analyzed' && (
                      <Button variant="ghost" size="icon" asChild>
                        <a
                          href={`/api/documents/${document.id}/analysis`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <BarChart3 className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setDocumentToDelete(document.id)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>

              {document.status === 'analyzed' && document.analysis && (
                <>
                  <Separator />
                  <div className="p-4 bg-muted/30">
                    <h4 className="text-sm font-medium mb-2">
                      Analysis Results:
                    </h4>
                    {document.analysis.findings &&
                      Array.isArray(document.analysis.findings) && (
                        <div className="mb-2">
                          <span className="text-xs font-medium text-muted-foreground">
                            Findings:
                          </span>
                          <ul className="text-xs mt-1 pl-4 list-disc">
                            {document.analysis.findings.map((finding, idx) => (
                              <li key={idx}>{finding}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {document.analysis.abnormalities &&
                      Array.isArray(document.analysis.abnormalities) && (
                        <div className="mb-2">
                          <span className="text-xs font-medium text-muted-foreground">
                            Abnormalities:
                          </span>
                          <ul className="text-xs mt-1 pl-4 list-disc">
                            {document.analysis.abnormalities.map(
                              (item, idx) => (
                                <li key={idx}>{item}</li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}

                    {document.analysis.abnormal_values &&
                      Array.isArray(document.analysis.abnormal_values) && (
                        <div className="mb-2">
                          <span className="text-xs font-medium text-muted-foreground">
                            Abnormal Values:
                          </span>
                          <ul className="text-xs mt-1 pl-4 list-disc">
                            {document.analysis.abnormal_values.map(
                              (item, idx) => (
                                <li key={idx}>{item}</li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}

                    {document.analysis.key_values &&
                      typeof document.analysis.key_values === 'object' && (
                        <div className="mb-2">
                          <span className="text-xs font-medium text-muted-foreground">
                            Key Values:
                          </span>
                          <div className="text-xs mt-1 grid grid-cols-2 gap-1">
                            {Object.entries(document.analysis.key_values).map(
                              ([key, value]) => (
                                <div key={key} className="flex">
                                  <span className="font-medium mr-1">
                                    {key}:
                                  </span>
                                  <span>{String(value)}</span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                    {document.analysis.interpretation && (
                      <div className="mb-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          Interpretation:
                        </span>
                        <p className="text-xs mt-1">
                          {document.analysis.interpretation}
                        </p>
                      </div>
                    )}

                    {document.analysis.potential_diagnoses &&
                      Array.isArray(document.analysis.potential_diagnoses) && (
                        <div className="mb-2">
                          <span className="text-xs font-medium text-muted-foreground">
                            Potential Diagnoses:
                          </span>
                          <ul className="text-xs mt-1 pl-4 list-disc">
                            {document.analysis.potential_diagnoses.map(
                              (item, idx) => (
                                <li key={idx}>{item}</li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}

                    {document.analysis.confidence && (
                      <div className="text-xs font-medium">
                        Confidence:{' '}
                        {typeof document.analysis.confidence === 'number'
                          ? `${Math.round(document.analysis.confidence * 100)}%`
                          : document.analysis.confidence}
                      </div>
                    )}

                    {/* Fallback for any other fields */}
                    {Object.entries(document.analysis)
                      .filter(
                        ([key]) =>
                          ![
                            'findings',
                            'abnormalities',
                            'abnormal_values',
                            'key_values',
                            'interpretation',
                            'potential_diagnoses',
                            'confidence',
                            'analyzed_at',
                          ].includes(key),
                      )
                      .map(([key, value]) => {
                        if (typeof value === 'object' && value !== null)
                          return null
                        return (
                          <div key={key} className="mb-2">
                            <span className="text-xs font-medium text-muted-foreground capitalize">
                              {key.replace(/_/g, ' ')}:
                            </span>
                            <span className="text-xs ml-1">
                              {String(value)}
                            </span>
                          </div>
                        )
                      })}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Document preview dialog */}
      <Dialog
        open={selectedDocument !== null}
        onOpenChange={(open) => !open && setSelectedDocument(null)}
      >
        {selectedDocument && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedDocument.name}</DialogTitle>
              <DialogDescription>
                {selectedDocument.type.replace('_', ' ')} uploaded{' '}
                {formatDistanceToNow(new Date(selectedDocument.uploaded_at), {
                  addSuffix: true,
                })}
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-center my-4">
              {selectedDocument.content_type.includes('image') ? (
                <img
                  src={selectedDocument.file_url}
                  alt={selectedDocument.name}
                  className="max-h-[60vh] max-w-full object-contain rounded border"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <FileText className="h-20 w-20 text-primary/70" />
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => openDocument(selectedDocument)}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open Document
                  </Button>
                </div>
              )}
            </div>

            {selectedDocument.status === 'analyzed' &&
              selectedDocument.analysis && (
                <div className="mt-4 border rounded-md p-4 bg-muted/30">
                  <h3 className="font-medium mb-2">Analysis Results</h3>
                  <div className="space-y-2">
                    {Object.entries(selectedDocument.analysis).map(
                      ([key, value]) => {
                        if (key === 'confidence') {
                          return (
                            <div
                              key={key}
                              className="flex items-center justify-between"
                            >
                              <span className="text-sm font-medium capitalize">
                                {key}:
                              </span>
                              <Badge
                                variant="outline"
                                className="bg-primary/10"
                              >
                                {((value as number) * 100).toFixed(0)}%
                              </Badge>
                            </div>
                          )
                        }

                        if (Array.isArray(value)) {
                          return (
                            <div key={key}>
                              <span className="text-sm font-medium capitalize">
                                {key.replace('_', ' ')}:
                              </span>
                              <ul className="mt-1 ml-5 text-sm space-y-1">
                                {value.map((item, i) => (
                                  <li key={i} className="list-disc">
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )
                        }

                        if (typeof value === 'object' && value !== null) {
                          return (
                            <div key={key}>
                              <span className="text-sm font-medium capitalize">
                                {key.replace('_', ' ')}:
                              </span>
                              <div className="ml-5 mt-1">
                                {Object.entries(value).map(
                                  ([subKey, subValue]) => (
                                    <div key={subKey} className="text-sm">
                                      <span className="font-medium">
                                        {subKey}:
                                      </span>{' '}
                                      {String(subValue)}
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          )
                        }

                        return (
                          <div key={key} className="text-sm">
                            <span className="font-medium capitalize">
                              {key.replace('_', ' ')}:
                            </span>{' '}
                            {String(value)}
                          </div>
                        )
                      },
                    )}
                  </div>
                </div>
              )}
          </DialogContent>
        )}
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this document? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteDocument}
              disabled={deleteDocument.isPending}
            >
              {deleteDocument.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
