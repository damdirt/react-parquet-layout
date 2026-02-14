"use client"

import { useCallback, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, FileText, X } from "lucide-react"
import { parseCSV } from "@/lib/csv-parser"
import type { Row } from "@/lib/types"

interface CsvImportProps {
  defaultPlankWidth: number
  onImport: (rows: Row[]) => void
}

export function CsvImport({ defaultPlankWidth, onImport }: CsvImportProps) {
  const [fileName, setFileName] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [parsedRows, setParsedRows] = useState<Row[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(
    (file: File) => {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setPreview(content)
        const rows = parseCSV(content, defaultPlankWidth)
        setParsedRows(rows)
      }
      reader.readAsText(file)
    },
    [defaultPlankWidth]
  )

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && (file.name.endsWith(".csv") || file.type === "text/csv")) {
      processFile(file)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  function handleImport() {
    if (parsedRows.length > 0) {
      onImport(parsedRows)
    }
  }

  function reset() {
    setFileName(null)
    setPreview(null)
    setParsedRows([])
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        className={`
          relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors cursor-pointer
          ${isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}
        `}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Importer un fichier CSV"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click()
        }}
      >
        <Upload className="h-8 w-8 text-muted-foreground mb-3" />
        <p className="text-sm font-medium text-foreground">
          Glissez un fichier CSV ici
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          ou cliquez pour parcourir
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="rounded-lg border border-border bg-muted/30 p-3">
        <p className="text-xs font-medium text-muted-foreground mb-1">Format attendu :</p>
        <p className="text-xs text-muted-foreground">
          Une ligne par rangee, longueurs separees par <code className="px-1 py-0.5 rounded bg-muted text-foreground">;</code> ou <code className="px-1 py-0.5 rounded bg-muted text-foreground">,</code>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Format etendu : <code className="px-1 py-0.5 rounded bg-muted text-foreground">{"longueur:largeur"}</code>
        </p>
        <pre className="mt-2 text-[11px] text-muted-foreground bg-muted rounded p-2 overflow-x-auto">
{`900;600;900
450;900;450
900;600;900`}
        </pre>
      </div>

      {fileName && (
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{fileName}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                reset()
              }}
              className="h-7 w-7 p-0 text-muted-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>

          {preview && (
            <pre className="text-[11px] text-muted-foreground bg-muted rounded p-2 overflow-x-auto max-h-32 mb-3">
              {preview}
            </pre>
          )}

          <p className="text-xs text-muted-foreground mb-3">
            {parsedRows.length} rangee{parsedRows.length > 1 ? "s" : ""} detectee{parsedRows.length > 1 ? "s" : ""},{" "}
            {parsedRows.reduce((sum, r) => sum + r.planks.length, 0)} lame{parsedRows.reduce((sum, r) => sum + r.planks.length, 0) > 1 ? "s" : ""}
          </p>

          <Button onClick={handleImport} className="w-full" disabled={parsedRows.length === 0}>
            Importer les donnees
          </Button>
        </div>
      )}
    </div>
  )
}
