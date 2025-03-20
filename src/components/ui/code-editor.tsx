'use client'

import React from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import { Button } from './button'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: 'json' | 'text'
  className?: string
  minHeight?: string
  maxHeight?: string
}

export function CodeMirrorEditor({
  value,
  onChange,
  language = 'json',
  className,
  minHeight = '150px',
  maxHeight,
}: CodeEditorProps) {
  const { theme } = useTheme()
  const isDarkTheme = theme === 'dark'

  const formatJSON = () => {
    if (language === 'json') {
      try {
        const parsed = JSON.parse(value)
        const formatted = JSON.stringify(parsed, null, 2)
        onChange(formatted)
      } catch (error) {
        // Don't format invalid JSON
        console.log('Invalid JSON', error)
      }
    }
  }

  const extensions = language === 'json' ? [json()] : []

  return (
    <div className={cn('rounded-md border', className)}>
      <div className="flex items-center justify-between px-3 py-1.5 bg-muted/50 border-b">
        <span className="text-xs text-muted-foreground font-medium">
          {language.toUpperCase()}
        </span>
        {language === 'json' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={formatJSON}
            className="h-6 px-1.5 text-xs"
          >
            Format
          </Button>
        )}
      </div>
      <div className="relative">
        <CodeMirror
          value={value}
          onChange={onChange}
          theme={isDarkTheme ? oneDark : undefined}
          extensions={extensions}
          style={{
            minHeight,
            maxHeight,
            fontSize: '14px',
          }}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            autocompletion: true,
            closeBrackets: true,
            bracketMatching: true,
          }}
          className="text-sm font-mono"
        />
      </div>
    </div>
  )
}
