import type { FloorPlan, FloorStatistics } from "./types"

export function computeStatistics(plan: FloorPlan): FloorStatistics {
  const { config, rows } = plan

  const roomArea = (config.roomWidth * config.roomLength) / 1_000_000 // mm² -> m²

  let totalPlanks = 0
  let coveredAreaMm2 = 0
  let totalPlankLength = 0

  for (const row of rows) {
    for (const plank of row.planks) {
      totalPlanks++
      coveredAreaMm2 += plank.length * plank.width
      totalPlankLength += plank.length
    }
  }

  const coveredArea = coveredAreaMm2 / 1_000_000

  const waste = roomArea - coveredArea
  const wastePercent = roomArea > 0 ? (waste / roomArea) * 100 : 0

  return {
    roomArea: Math.round(roomArea * 1000) / 1000,
    coveredArea: Math.round(coveredArea * 1000) / 1000,
    totalPlanks,
    totalRows: rows.length,
    waste: Math.round(waste * 1000) / 1000,
    wastePercent: Math.round(wastePercent * 10) / 10,
    totalPlankLength,
  }
}
