"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { FloorConfig, PoseType, OffsetType } from "@/lib/types"

interface FloorConfigPanelProps {
  config: FloorConfig
  onChange: (config: FloorConfig) => void
}

export function FloorConfigPanel({ config, onChange }: FloorConfigPanelProps) {
  function update(partial: Partial<FloorConfig>) {
    onChange({ ...config, ...partial })
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase mb-3">
          Dimensions de la piece
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="roomWidth" className="text-xs text-muted-foreground">
              Largeur (mm)
            </Label>
            <Input
              id="roomWidth"
              type="number"
              min={0}
              value={config.roomWidth || ""}
              onChange={(e) => update({ roomWidth: parseFloat(e.target.value) || 0 })}
              placeholder="3000"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="roomLength" className="text-xs text-muted-foreground">
              Longueur (mm)
            </Label>
            <Input
              id="roomLength"
              type="number"
              min={0}
              value={config.roomLength || ""}
              onChange={(e) => update({ roomLength: parseFloat(e.target.value) || 0 })}
              placeholder="5000"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase mb-3">
          Type de pose
        </h3>
        <Select
          value={config.poseType}
          onValueChange={(v) => update({ poseType: v as PoseType })}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="coupe-perdue">Coupe perdue</SelectItem>
            <SelectItem value="joints-reguliers">Joints reguliers</SelectItem>
          </SelectContent>
        </Select>

        {config.poseType === "joints-reguliers" && (
          <div className="mt-3 flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Decalage</Label>
              <Select
                value={config.offsetType}
                onValueChange={(v) => update({ offsetType: v as OffsetType })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1/2">1/2 lame</SelectItem>
                  <SelectItem value="1/3">1/3 lame</SelectItem>
                  <SelectItem value="custom">Personnalise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {config.offsetType === "custom" && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="customOffset" className="text-xs text-muted-foreground">
                  Decalage (mm)
                </Label>
                <Input
                  id="customOffset"
                  type="number"
                  min={0}
                  value={config.customOffset || ""}
                  onChange={(e) => update({ customOffset: parseFloat(e.target.value) || 0 })}
                  placeholder="300"
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase mb-3">
          Lame par defaut
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="defaultPlankLength" className="text-xs text-muted-foreground">
              Longueur (mm)
            </Label>
            <Input
              id="defaultPlankLength"
              type="number"
              min={0}
              value={config.defaultPlankLength || ""}
              onChange={(e) => update({ defaultPlankLength: parseFloat(e.target.value) || 0 })}
              placeholder="900"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="defaultPlankWidth" className="text-xs text-muted-foreground">
              Largeur (mm)
            </Label>
            <Input
              id="defaultPlankWidth"
              type="number"
              min={0}
              value={config.defaultPlankWidth || ""}
              onChange={(e) => update({ defaultPlankWidth: parseFloat(e.target.value) || 0 })}
              placeholder="150"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
