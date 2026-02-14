export type PoseType = "coupe-perdue" | "joints-reguliers"

export type OffsetType = "1/2" | "1/3" | "custom"

export interface Plank {
  id: string
  length: number // mm
  width: number  // mm
}

export interface Row {
  id: string
  planks: Plank[]
}

export interface FloorConfig {
  roomWidth: number        // mm
  roomLength: number       // mm
  poseType: PoseType
  offsetType: OffsetType
  customOffset: number     // mm (used when offsetType is "custom")
  defaultPlankWidth: number  // mm
  defaultPlankLength: number // mm
}

export interface FloorPlan {
  config: FloorConfig
  rows: Row[]
}

export interface FloorStatistics {
  roomArea: number         // m²
  coveredArea: number      // m²
  totalPlanks: number
  totalRows: number
  waste: number            // m²
  wastePercent: number     // %
  totalPlankLength: number // mm
}
