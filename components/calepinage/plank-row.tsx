"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, X } from "lucide-react"
import type { Row, Plank } from "@/lib/types"

interface PlankRowProps {
  row: Row
  rowIndex: number
  defaultPlankLength: number
  defaultPlankWidth: number
  onChange: (row: Row) => void
  onRemove: () => void
}

let counter = 0
function uid(): string {
  return `plank-${Date.now()}-${counter++}`
}

export function PlankRowInput({
  row,
  rowIndex,
  defaultPlankLength,
  defaultPlankWidth,
  onChange,
  onRemove,
}: PlankRowProps) {
  function updatePlank(plankIndex: number, partial: Partial<Plank>) {
    const updated = row.planks.map((p, i) =>
      i === plankIndex ? { ...p, ...partial } : p
    )
    onChange({ ...row, planks: updated })
  }

  function addPlank() {
    onChange({
      ...row,
      planks: [
        ...row.planks,
        { id: uid(), length: defaultPlankLength, width: defaultPlankWidth },
      ],
    })
  }

  function removePlank(plankIndex: number) {
    onChange({
      ...row,
      planks: row.planks.filter((_, i) => i !== plankIndex),
    })
  }

  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Rangee {rowIndex + 1}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
          aria-label={`Supprimer la rangee ${rowIndex + 1}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {row.planks.map((plank, pi) => (
          <div key={plank.id} className="flex items-end gap-2">
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              {pi === 0 && (
                <Label className="text-[10px] text-muted-foreground">Long. (mm)</Label>
              )}
              <Input
                type="number"
                min={0}
                value={plank.length || ""}
                onChange={(e) =>
                  updatePlank(pi, { length: parseFloat(e.target.value) || 0 })
                }
                className="h-8 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              {pi === 0 && (
                <Label className="text-[10px] text-muted-foreground">Larg. (mm)</Label>
              )}
              <Input
                type="number"
                min={0}
                value={plank.width || ""}
                onChange={(e) =>
                  updatePlank(pi, { width: parseFloat(e.target.value) || 0 })
                }
                className="h-8 text-sm"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removePlank(pi)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive shrink-0"
              aria-label="Supprimer la lame"
              disabled={row.planks.length <= 1}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={addPlank}
        className="mt-2 h-7 text-xs text-primary hover:text-primary"
      >
        <Plus className="h-3 w-3 mr-1" />
        Ajouter une lame
      </Button>
    </div>
  )
}
