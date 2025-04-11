'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileType2, AlertCircle, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { useDocuments } from '@/hooks/use-documents'

interface DocumentUploadProps {
  caseId: string
  onUploadComplete?: () => void
}

export function DocumentUpload({
  caseId,
  onUploadComplete,
}: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const { uploadDocument } = useDocuments(caseId)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0 || !caseId) return

      const file = acceptedFiles[0]
      setIsUploading(true)
      setUploadError(null)
      setUploadSuccess(false)
      setUploadProgress(0)

      // Create form data
      const formData = new FormData()
      formData.append('file', file)

      try {
        // Progress simulation - in a real app, you'd use the actual upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return prev
            }
            return prev + 10
          })
        }, 300)

        // Upload the document using the hook
        await uploadDocument.mutateAsync(formData)

        clearInterval(progressInterval)
        setUploadProgress(100)
        setUploadSuccess(true)

        // Call the callback if provided
        if (onUploadComplete) {
          setTimeout(onUploadComplete, 1000)
        }
      } catch (error) {
        console.error('Upload error:', error)
        setUploadError('Failed to upload document. Please try again.')
      } finally {
        // Reset the state after 2 seconds
        setTimeout(() => {
          setIsUploading(false)
          setUploadProgress(0)
          setUploadSuccess(false)
        }, 2000)
      }
    },
    [caseId, onUploadComplete, uploadDocument],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    disabled: isUploading || uploadDocument.isPending,
  })

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg px-6 py-10 text-center ${
            isDragActive
              ? 'border-primary bg-primary/10'
              : 'border-muted-foreground/20'
          } ${isUploading || uploadDocument.isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-muted/50'}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-3">
            {isUploading || uploadDocument.isPending ? (
              <>
                <Upload className="h-10 w-10 text-primary animate-pulse" />
                <div className="text-lg font-medium">Uploading document...</div>
                <Progress
                  value={uploadProgress}
                  className="w-full max-w-xs h-2"
                />
                <div className="text-sm text-muted-foreground">
                  {uploadProgress}%
                </div>
              </>
            ) : uploadSuccess ? (
              <>
                <Check className="h-10 w-10 text-green-500" />
                <div className="text-lg font-medium">Upload complete!</div>
              </>
            ) : uploadError ? (
              <>
                <AlertCircle className="h-10 w-10 text-destructive" />
                <div className="text-lg font-medium">Upload failed</div>
                <div className="text-sm text-muted-foreground">
                  {uploadError}
                </div>
                <Button variant="secondary" size="sm" className="mt-2">
                  Try again
                </Button>
              </>
            ) : (
              <>
                <FileType2 className="h-10 w-10 text-primary" />
                <div>
                  <div className="text-lg font-medium">
                    {isDragActive
                      ? 'Drop the file here'
                      : 'Drag and drop your document'}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    or click to select a file (PDF, JPG, PNG)
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Max file size: 10MB
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
