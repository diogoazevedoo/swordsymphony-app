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
  Eye,
  Maximize2,
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
import { useDocuments, type Document } from '@/hooks/use-documents'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface DocumentListProps {
  caseId: string
  refreshTrigger?: number
}

function getDocumentIcon(contentType: string) {
  if (contentType.includes('pdf')) {
    return <FileText className="h-6 w-6" />
  } else if (contentType.includes('image')) {
    return <FileImage className="h-6 w-6" />
  } else {
    return <File className="h-6 w-6" />
  }
}

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

  const {
    documents,
    isLoading,
    error,
    refetch,
    deleteDocument,
    getDocumentAnalysis,
  } = useDocuments(caseId)

  useEffect(() => {
    if (refreshTrigger > 0) {
      refetch()
    }
  }, [refreshTrigger, refetch])

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

  const handlePreviewDocument = async (document: Document) => {
    console.log('Initial document analysis:', document.analysis)

    if (document.status === 'analyzed') {
      try {
        const freshAnalysis = await getDocumentAnalysis(document.id)
        console.log('Fresh analysis data:', freshAnalysis)

        const documentWithFreshAnalysis = {
          ...document,
          analysis: freshAnalysis,
        }

        setSelectedDocument(documentWithFreshAnalysis)
      } catch (error) {
        console.error('Error fetching fresh analysis:', error)
        setSelectedDocument(document)
      }
    } else {
      setSelectedDocument(document)
    }
  }

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
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Analysis Results</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => handlePreviewDocument(document)}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        <span className="text-xs">View Details</span>
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 mt-2 mb-3">
                      {document.analysis.confidence && (
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-xs"
                        >
                          Confidence:{' '}
                          {typeof document.analysis.confidence === 'number'
                            ? `${Math.round(document.analysis.confidence * 100)}%`
                            : document.analysis.confidence}
                        </Badge>
                      )}
                      {document.analysis.method && (
                        <Badge variant="outline" className="bg-muted text-xs">
                          {String(document.analysis.method)}
                        </Badge>
                      )}
                      {document.analysis.pages &&
                        Array.isArray(document.analysis.pages) && (
                          <Badge variant="outline" className="bg-muted text-xs">
                            {document.analysis.pages.length} pages
                          </Badge>
                        )}
                    </div>

                    {document.analysis.pages &&
                      Array.isArray(document.analysis.pages) &&
                      document.analysis.pages.length > 0 && (
                        <Accordion
                          type="single"
                          collapsible
                          className="mt-2 w-full border rounded-md overflow-hidden"
                        >
                          {document.analysis.pages.map((page, index) => (
                            <AccordionItem
                              key={index}
                              value={`card-page-${index}`}
                              className="border-b"
                            >
                              <AccordionTrigger className="py-2 px-3 text-xs hover:no-underline bg-muted/30">
                                <div className="flex items-center gap-2">
                                  <span>Page {page.page_number}</span>
                                  {page.abnormal_values &&
                                    page.abnormal_values.length > 0 && (
                                      <Badge
                                        variant="outline"
                                        className="bg-amber-50 text-amber-700 text-[10px] px-1 py-0 h-4"
                                      >
                                        {page.abnormal_values.length} abnormal
                                      </Badge>
                                    )}
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="text-xs px-3 py-2 bg-white">
                                <div className="space-y-2">
                                  {page.findings &&
                                    Array.isArray(page.findings) && (
                                      <div>
                                        <span className="font-medium text-primary/90">
                                          Key Findings:
                                        </span>
                                        <ul className="mt-1 ml-4 list-disc space-y-0.5">
                                          {page.findings.map(
                                            (item: string, i: number) => (
                                              <li key={i}>{item}</li>
                                            ),
                                          )}
                                        </ul>
                                      </div>
                                    )}

                                  {page.abnormal_values &&
                                    Array.isArray(page.abnormal_values) &&
                                    page.abnormal_values.length > 0 && (
                                      <div>
                                        <span className="font-medium text-amber-700">
                                          Abnormal Values:
                                        </span>
                                        <div className="mt-1 flex flex-wrap gap-1 ml-1">
                                          {page.abnormal_values.map(
                                            (item: string, i: number) => (
                                              <Badge
                                                key={i}
                                                variant="outline"
                                                className="bg-amber-50 text-amber-700 text-[10px] whitespace-nowrap"
                                              >
                                                {item}
                                              </Badge>
                                            ),
                                          )}
                                        </div>
                                      </div>
                                    )}

                                  {page.interpretation && (
                                    <div className="text-gray-600 italic text-xs mt-1">
                                      "{page.interpretation}"
                                    </div>
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      )}

                    {(!document.analysis.pages ||
                      !Array.isArray(document.analysis.pages)) && (
                      <div className="mt-2 space-y-2">
                        {document.analysis.findings &&
                          Array.isArray(document.analysis.findings) && (
                            <div className="mb-2">
                              <span className="text-xs font-medium text-muted-foreground">
                                Findings:
                              </span>
                              <ul className="text-xs mt-1 pl-4 list-disc">
                                {document.analysis.findings.map(
                                  (finding, idx) => (
                                    <li key={idx}>{finding}</li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={selectedDocument !== null}
        onOpenChange={(open) => !open && setSelectedDocument(null)}
      >
        {selectedDocument && (
          <DialogContent
            className="!max-w-[98vw] !w-[98vw] sm:!max-w-[98vw] md:!max-w-[98vw] lg:!max-w-[98vw] xl:!max-w-[98vw] max-h-[95vh] overflow-hidden flex flex-col p-0"
            style={{ width: '98vw', maxWidth: '98vw' }}
          >
            <div className="sticky top-0 z-10 bg-background border-b">
              <DialogHeader className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                      {getDocumentIcon(selectedDocument.content_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <DialogTitle className="text-base font-medium truncate">
                        {selectedDocument.name}
                      </DialogTitle>
                      <DialogDescription className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className="bg-primary/5 text-primary text-xs px-1.5 py-0"
                        >
                          {selectedDocument.type
                            .replace('_', ' ')
                            .toUpperCase()}
                        </Badge>
                        <span className="flex items-center text-xs">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatDistanceToNow(
                            new Date(selectedDocument.uploaded_at),
                            {
                              addSuffix: true,
                            },
                          )}
                        </span>
                        <span className="text-xs">
                          {formatFileSize(selectedDocument.size)}
                        </span>
                      </DialogDescription>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 h-8 text-xs"
                    onClick={() => openDocument(selectedDocument)}
                  >
                    <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                    Open Document
                  </Button>
                </div>
              </DialogHeader>
            </div>

            <div className="overflow-y-auto flex-1 px-12 py-6">
              {selectedDocument.content_type.includes('image') ? (
                <div className="mb-6 flex justify-center">
                  <div className="relative rounded-lg border overflow-hidden max-h-[40vh] flex items-center justify-center bg-muted/30 shadow-sm">
                    <img
                      src={selectedDocument.file_url || '/placeholder.svg'}
                      alt={selectedDocument.name}
                      className="max-h-[40vh] max-w-full object-contain"
                    />
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute bottom-2 right-2 opacity-80 hover:opacity-100 h-7 w-7"
                      onClick={() =>
                        window.open(selectedDocument.file_url, '_blank')
                      }
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mb-6 flex flex-col items-center">
                  <div className="bg-muted/30 p-6 rounded-full">
                    <FileText className="h-16 w-16 text-primary/70" />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 text-xs h-8"
                    onClick={() =>
                      window.open(selectedDocument.file_url, '_blank')
                    }
                  >
                    <Download className="mr-1.5 h-3.5 w-3.5" />
                    Download Document
                  </Button>
                </div>
              )}

              {selectedDocument.status === 'analyzed' &&
                selectedDocument.analysis && (
                  <div className="rounded-lg overflow-hidden shadow-sm border">
                    <div className="p-4 bg-muted/50 border-b">
                      <div className="flex flex-col sm:flex-row justify-between gap-2 items-start sm:items-center">
                        <h3 className="font-medium flex items-center text-sm">
                          <BarChart3 className="mr-2 h-4 w-4 text-primary" />
                          Document Analysis
                        </h3>
                        <div className="flex flex-wrap items-center gap-2">
                          {selectedDocument.analysis.confidence && (
                            <Badge
                              variant="outline"
                              className="bg-primary/10 text-xs px-2 py-0 h-5"
                            >
                              Confidence:{' '}
                              {(
                                (selectedDocument.analysis
                                  .confidence as number) * 100
                              ).toFixed(0)}
                              %
                            </Badge>
                          )}

                          {selectedDocument.analysis.method && (
                            <Badge
                              variant="outline"
                              className="bg-secondary/10 text-xs px-2 py-0 h-5"
                            >
                              Method: {String(selectedDocument.analysis.method)}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {selectedDocument.analysis.analyzed_at && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Analyzed on{' '}
                          {new Date(
                            selectedDocument.analysis.analyzed_at,
                          ).toLocaleString()}
                        </p>
                      )}
                    </div>

                    {selectedDocument.analysis.pages &&
                      Array.isArray(selectedDocument.analysis.pages) &&
                      selectedDocument.analysis.pages.length > 0 && (
                        <Accordion
                          type="multiple"
                          className="bg-white divide-y"
                          defaultValue={selectedDocument.analysis.pages
                            .map((_, i) => `dialog-page-${i}`)
                            .slice(0, 1)}
                        >
                          {selectedDocument.analysis.pages.map(
                            (page, index) => (
                              <AccordionItem
                                key={index}
                                value={`dialog-page-${index}`}
                                className="border-0"
                              >
                                <AccordionTrigger className="px-4 py-3 hover:no-underline transition-colors bg-muted/10 hover:bg-muted/20 group">
                                  <div className="flex items-center gap-2 w-full">
                                    <div className="bg-primary/10 rounded-full h-6 w-6 flex items-center justify-center text-primary font-medium text-xs">
                                      {page.page_number}
                                    </div>
                                    <span className="font-medium text-xs">
                                      Page {page.page_number} Analysis
                                    </span>
                                    <div className="flex items-center ml-auto gap-2">
                                      {page.abnormal_values &&
                                        page.abnormal_values.length > 0 && (
                                          <Badge
                                            variant="outline"
                                            className="bg-amber-50 text-amber-700 group-hover:bg-amber-100/80 text-xs px-1.5 py-0 h-5"
                                          >
                                            {page.abnormal_values.length}{' '}
                                            Abnormal
                                          </Badge>
                                        )}
                                      {page.confidence && (
                                        <Badge
                                          variant="outline"
                                          className="bg-primary/10 group-hover:bg-primary/20 text-xs px-1.5 py-0 h-5"
                                        >
                                          {(
                                            (page.confidence as number) * 100
                                          ).toFixed(0)}
                                          %
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </AccordionTrigger>

                                <AccordionContent className="px-0 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-8">
                                    <div className="space-y-6">
                                      {page.findings &&
                                        Array.isArray(page.findings) && (
                                          <div className="bg-muted/5 p-6 rounded-md border border-muted/50">
                                            <h4 className="text-xs font-medium mb-3 text-primary flex items-center">
                                              <span className="bg-primary/10 rounded-full w-5 h-5 inline-flex items-center justify-center mr-1.5 text-xs text-primary">
                                                1
                                              </span>
                                              Key Findings
                                            </h4>
                                            <ul className="ml-5 text-xs space-y-2">
                                              {page.findings.map(
                                                (item: string, i: number) => (
                                                  <li
                                                    key={i}
                                                    className="list-disc"
                                                  >
                                                    {item}
                                                  </li>
                                                ),
                                              )}
                                            </ul>
                                          </div>
                                        )}

                                      {page.interpretation && (
                                        <div className="bg-muted/5 p-6 rounded-md border border-muted/50">
                                          <h4 className="text-xs font-medium mb-3 text-primary flex items-center">
                                            <span className="bg-primary/10 rounded-full w-5 h-5 inline-flex items-center justify-center mr-1.5 text-xs text-primary">
                                              2
                                            </span>
                                            Interpretation
                                          </h4>
                                          <p className="text-xs leading-relaxed">
                                            {page.interpretation}
                                          </p>

                                          {page.abnormal_values &&
                                            Array.isArray(
                                              page.abnormal_values,
                                            ) &&
                                            page.abnormal_values.length > 0 && (
                                              <div className="mt-4 pt-4 border-t border-muted/30">
                                                <h5 className="text-xs font-medium mb-2 text-amber-700 flex items-center">
                                                  <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
                                                  Abnormal Values
                                                </h5>
                                                <div className="flex flex-wrap gap-2">
                                                  {page.abnormal_values.map(
                                                    (
                                                      item: string,
                                                      i: number,
                                                    ) => {
                                                      const value =
                                                        page.key_values &&
                                                        page.key_values[item]
                                                          ? `: ${page.key_values[item]}`
                                                          : ''

                                                      return (
                                                        <Badge
                                                          key={i}
                                                          variant="outline"
                                                          className="bg-amber-50 text-amber-700 border-amber-200 px-2 py-0.5 text-xs hover:bg-amber-100 transition-colors"
                                                        >
                                                          {item}
                                                          {value}
                                                        </Badge>
                                                      )
                                                    },
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                        </div>
                                      )}
                                    </div>

                                    {page.key_values &&
                                      typeof page.key_values === 'object' &&
                                      Object.keys(page.key_values).length >
                                        0 && (
                                        <div className="bg-muted/5 p-6 rounded-md border border-muted/50">
                                          <h4 className="text-xs font-medium mb-3 border-b pb-2 flex items-center">
                                            <span className="bg-primary/10 rounded-full w-5 h-5 inline-flex items-center justify-center mr-1.5 text-xs text-primary">
                                              3
                                            </span>
                                            Laboratory Values
                                          </h4>
                                          <div className="grid grid-cols-1 gap-y-3 max-h-[60vh] overflow-y-auto pr-4">
                                            {Object.entries(
                                              page.key_values,
                                            ).map(([key, value]) => {
                                              const isAbnormal =
                                                page.abnormal_values &&
                                                Array.isArray(
                                                  page.abnormal_values,
                                                ) &&
                                                page.abnormal_values.includes(
                                                  key,
                                                )

                                              return (
                                                <div
                                                  key={key}
                                                  className={`text-xs flex justify-between items-center px-5 py-2.5 rounded-sm ${
                                                    isAbnormal
                                                      ? 'bg-amber-50 border border-amber-100'
                                                      : 'hover:bg-muted/20 transition-colors'
                                                  }`}
                                                >
                                                  <span
                                                    className={`font-medium ${isAbnormal ? 'text-amber-700' : ''}`}
                                                  >
                                                    {key}
                                                  </span>
                                                  <span
                                                    className={`${isAbnormal ? 'text-amber-700 font-medium' : ''}`}
                                                  >
                                                    {String(value)}
                                                  </span>
                                                </div>
                                              )
                                            })}
                                          </div>
                                        </div>
                                      )}
                                  </div>

                                  <div className="px-4 pb-3 pt-2 text-xs text-muted-foreground flex items-center gap-3 border-t mt-2">
                                    {page.model && (
                                      <span className="flex items-center gap-1">
                                        <span className="font-medium">
                                          Model:
                                        </span>{' '}
                                        {page.model}
                                      </span>
                                    )}
                                    {page.method && (
                                      <span className="flex items-center gap-1">
                                        <span className="font-medium">
                                          Method:
                                        </span>{' '}
                                        {page.method}
                                      </span>
                                    )}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            ),
                          )}
                        </Accordion>
                      )}

                    {(!selectedDocument.analysis.pages ||
                      !Array.isArray(selectedDocument.analysis.pages)) && (
                      <div className="space-y-3 p-3 bg-white text-xs"></div>
                    )}
                  </div>
                )}
            </div>
          </DialogContent>
        )}
      </Dialog>

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
