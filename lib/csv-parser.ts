import type { Row, Plank } from "./types"

let counter = 0
function uid(): string {
  return `csv-${Date.now()}-${counter++}`
}

/**
 * Parse CSV content into rows of planks.
 *
 * Format: one line per row.
 * Each value is a plank length in mm, or length:width for custom width.
 * Separator is auto-detected (`;` or `,`).
 * Empty lines are skipped.
 */
export function parseCSV(content: string, defaultWidth: number): Row[] {
  const lines = content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  if (lines.length === 0) return []

  // auto-detect separator: if any line contains `;`, use `;`, otherwise `,`
  const separator = lines.some((l) => l.includes(";")) ? ";" : ","

  return lines.map((line) => {
    const values = line.split(separator).map((v) => v.trim()).filter((v) => v.length > 0)

    const planks: Plank[] = values.map((val) => {
      let length: number
      let width: number = defaultWidth

      if (val.includes(":")) {
        const parts = val.split(":")
        length = parseFloat(parts[0]) || 0
        width = parseFloat(parts[1]) || defaultWidth
      } else {
        length = parseFloat(val) || 0
      }

      return { id: uid(), length, width }
    })

    return { id: uid(), planks }
  })
}
