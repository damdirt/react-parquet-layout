"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { PlankRowInput } from "./plank-row"
import type { Row, FloorConfig } from "@/lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ManualInputProps {
  rows: Row[]
  config: FloorConfig
  onChange: (rows: Row[]) => void
}

let counter = 0
function uid(): string {
  return `row-${Date.now()}-${counter++}`
}

export function ManualInput({ rows, config, onChange }: ManualInputProps) {
  function addRow() {
    const newPlankId = uid()
    onChange([
      ...rows,
      {
        id: uid(),
        planks: [
          {
            id: newPlankId,
            length: config.defaultPlankLength,
            width: config.defaultPlankWidth,
          },
        ],
      },
    ])
  }

  function updateRow(index: number, row: Row) {
    onChange(rows.map((r, i) => (i === index ? row : r)))
  }

  function removeRow(index: number) {
    onChange(rows.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-3">
      <ScrollArea className="max-h-[50vh]">
        <div className="flex flex-col gap-3 pr-3">
          {rows.map((row, i) => (
            <PlankRowInput
              key={row.id}
              row={row}
              rowIndex={i}
              defaultPlankLength={config.defaultPlankLength}
              defaultPlankWidth={config.defaultPlankWidth}
              onChange={(r) => updateRow(i, r)}
              onRemove={() => removeRow(i)}
            />
          ))}
        </div>
      </ScrollArea>

      <Button onClick={addRow} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Ajouter une rangee
      </Button>
    </div>
  )
}
