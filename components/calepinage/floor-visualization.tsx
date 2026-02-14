"use client"

import { useMemo, useState, useRef, useCallback } from "react"
import type { FloorPlan } from "@/lib/types"

const WOOD_COLORS = [
  "#C8A882",
  "#B8956E",
  "#D4B896",
  "#A8845A",
  "#CDAA80",
  "#BF9A70",
]

const WOOD_COLORS_DARK = [
  "#8B7355",
  "#7A6548",
  "#947E62",
  "#6B5A3E",
  "#887058",
  "#7D6B4B",
]

const OVERFLOW_COLOR = "#E8B4B4"
const OVERFLOW_COLOR_DARK = "#8B5555"
const JOINT_COLOR_LIGHT = "#3D3329"
const JOINT_COLOR_DARK = "#5A4D3D"
const EDGE_COLOR_LIGHT = "#2A2419"
const EDGE_COLOR_DARK = "#5A4D3D"

const PADDING = 40
const LABEL_SPACE = 30

interface FloorVisualizationProps {
  plan: FloorPlan
}

interface HoveredPlank {
  rowIndex: number
  plankIndex: number
  x: number
  y: number
  width: number
  height: number
  plankLength: number
  plankWidth: number
  /** Coordinates relative to room origin (top-left = 0,0) in mm */
  startX: number
  startY: number
  endX: number
  endY: number
}

export function FloorVisualization({ plan }: FloorVisualizationProps) {
  const { config, rows } = plan
  const [hovered, setHovered] = useState<HoveredPlank | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect()
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }, [])

  const roomW = config.roomWidth || 1
  const roomL = config.roomLength || 1

  const svgWidth = roomL + PADDING * 2 + LABEL_SPACE
  const svgHeight = roomW + PADDING * 2 + LABEL_SPACE

  const plankElements = useMemo(() => {
    const elements: React.ReactNode[] = []
    let currentY = 0

    for (let ri = 0; ri < rows.length; ri++) {
      const row = rows[ri]
      let currentX = 0
      const rowHeight = row.planks.length > 0 ? row.planks[0].width : config.defaultPlankWidth

      for (let pi = 0; pi < row.planks.length; pi++) {
        const plank = row.planks[pi]
        const pW = plank.length
        const pH = plank.width

        const isOverflow = currentX + pW > roomL || currentY + pH > roomW
        const colorIndex = ri % WOOD_COLORS.length
        const fillLight = isOverflow ? OVERFLOW_COLOR : WOOD_COLORS[colorIndex]
        const fillDark = isOverflow ? OVERFLOW_COLOR_DARK : WOOD_COLORS_DARK[colorIndex]

        const drawW = Math.min(pW, Math.max(0, roomL - currentX))
        const drawH = Math.min(pH, Math.max(0, roomW - currentY))

        if (drawW > 0 && drawH > 0) {
          const x = PADDING + LABEL_SPACE + currentX
          const y = PADDING + currentY
          const isHovered =
            hovered?.rowIndex === ri && hovered?.plankIndex === pi

          const isLastPlankInRow = pi === row.planks.length - 1 || currentX + pW >= roomL
          const isLastRow = ri === rows.length - 1 || currentY + pH >= roomW

          elements.push(
            <g key={`${ri}-${pi}`}>
              {/* Plank fill */}
              <rect
                x={x}
                y={y}
                width={drawW}
                height={drawH}
                style={
                  {
                    "--plank-fill-light": fillLight,
                    "--plank-fill-dark": fillDark,
                  } as React.CSSProperties
                }
                fill="none"
                rx={0}
                opacity={isHovered ? 0.85 : 1}
                onMouseEnter={() =>
                  setHovered({
                    rowIndex: ri,
                    plankIndex: pi,
                    x,
                    y,
                    width: drawW,
                    height: drawH,
                    plankLength: plank.length,
                    plankWidth: plank.width,
                    startX: currentX,
                    startY: currentY,
                    endX: currentX + pW,
                    endY: currentY + pH,
                  })
                }
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer fill-[var(--plank-fill-light)] dark:fill-[var(--plank-fill-dark)] transition-opacity"
              />

              {/* Wood grain lines */}
              {drawW > 30 && drawH > 10 && (
                <>
                  <line
                    x1={x + 4}
                    y1={y + drawH * 0.3}
                    x2={x + drawW - 4}
                    y2={y + drawH * 0.3}
                    stroke="#00000008"
                    strokeWidth={0.5}
                    pointerEvents="none"
                  />
                  <line
                    x1={x + 4}
                    y1={y + drawH * 0.7}
                    x2={x + drawW - 4}
                    y2={y + drawH * 0.7}
                    stroke="#00000008"
                    strokeWidth={0.5}
                    pointerEvents="none"
                  />
                </>
              )}

              {/* Vertical joint line (right edge of plank) */}
              {!isLastPlankInRow && drawW > 0 && (
                <line
                  x1={x + drawW}
                  y1={y}
                  x2={x + drawW}
                  y2={y + drawH}
                  className="stroke-[var(--edge-light)] dark:stroke-[var(--edge-dark)]"
                  style={
                    {
                      "--edge-light": EDGE_COLOR_LIGHT,
                      "--edge-dark": EDGE_COLOR_DARK,
                    } as React.CSSProperties
                  }
                  strokeWidth={1.5}
                  pointerEvents="none"
                />
              )}

              {/* Horizontal joint line (bottom edge of row) */}
              {!isLastRow && pi === 0 && (
                <line
                  x1={PADDING + LABEL_SPACE}
                  y1={y + drawH}
                  x2={PADDING + LABEL_SPACE + roomL}
                  y2={y + drawH}
                  className="stroke-[var(--joint-light)] dark:stroke-[var(--joint-dark)]"
                  style={
                    {
                      "--joint-light": JOINT_COLOR_LIGHT,
                      "--joint-dark": JOINT_COLOR_DARK,
                    } as React.CSSProperties
                  }
                  strokeWidth={1}
                  pointerEvents="none"
                />
              )}

              {/* Hover highlight border */}
              {isHovered && (
                <rect
                  x={x + 1}
                  y={y + 1}
                  width={drawW - 2}
                  height={drawH - 2}
                  fill="none"
                  strokeWidth={2.5}
                  rx={0}
                  pointerEvents="none"
                  className="stroke-foreground"
                />
              )}
            </g>
          )
        }

        // Draw overflow portion with a different pattern
        if (currentX + pW > roomL && currentX < roomL) {
          const overflowX = PADDING + LABEL_SPACE + roomL
          const overflowW = currentX + pW - roomL
          const clippedH = Math.min(pH, Math.max(0, roomW - currentY))
          if (clippedH > 0) {
            elements.push(
              <rect
                key={`${ri}-${pi}-overflow`}
                x={overflowX}
                y={PADDING + currentY}
                width={Math.min(overflowW, 50)}
                height={clippedH}
                fill={OVERFLOW_COLOR}
                fillOpacity={0.3}
                stroke={OVERFLOW_COLOR}
                strokeWidth={1}
                strokeDasharray="4 2"
                rx={1}
                pointerEvents="none"
              />
            )
          }
        }

        currentX += pW
      }

      currentY += rowHeight
    }

    return elements
  }, [rows, config, roomL, roomW, hovered])

  // Dimension labels
  const dimensionLabels = useMemo(() => {
    const labels: React.ReactNode[] = []
    const ox = PADDING + LABEL_SPACE
    const oy = PADDING

    const dimFontSize = Math.min(12, Math.max(8, roomL / 12))
    const dimFontSizeV = Math.min(12, Math.max(8, roomW / 10))

    // Top: room length (horizontal axis = X)
    labels.push(
      <g key="dim-length">
        <line
          x1={ox}
          y1={oy - 12}
          x2={ox + roomL}
          y2={oy - 12}
          className="stroke-muted-foreground"
          strokeWidth={1}
          markerStart="url(#arrowLeft)"
          markerEnd="url(#arrowRight)"
        />
        <text
          x={ox + roomL / 2}
          y={oy - 18}
          textAnchor="middle"
          className="fill-muted-foreground"
          fontSize={dimFontSize}
          fontFamily="var(--font-sans)"
          fontWeight={600}
        >
          Longueur : {config.roomLength} mm
        </text>
        {/* Origin marker */}
        <circle cx={ox} cy={oy} r={3} className="fill-foreground/60" />
        <text
          x={ox - 6}
          y={oy - 6}
          textAnchor="end"
          className="fill-foreground/60"
          fontSize={Math.max(7, dimFontSize - 2)}
          fontFamily="var(--font-sans)"
        >
          0,0
        </text>
        {/* X-axis label at end */}
        <text
          x={ox + roomL + 6}
          y={oy + 4}
          textAnchor="start"
          className="fill-muted-foreground"
          fontSize={Math.max(7, dimFontSize - 1)}
          fontFamily="var(--font-sans)"
          fontWeight={500}
        >
          X
        </text>
      </g>
    )

    // Left: room width (vertical axis = Y)
    labels.push(
      <g key="dim-width">
        <line
          x1={ox - 12}
          y1={oy}
          x2={ox - 12}
          y2={oy + roomW}
          className="stroke-muted-foreground"
          strokeWidth={1}
          markerStart="url(#arrowUp)"
          markerEnd="url(#arrowDown)"
        />
        <text
          x={ox - 18}
          y={oy + roomW / 2}
          textAnchor="middle"
          className="fill-muted-foreground"
          fontSize={dimFontSizeV}
          fontFamily="var(--font-sans)"
          fontWeight={600}
          transform={`rotate(-90, ${ox - 18}, ${oy + roomW / 2})`}
        >
          Largeur : {config.roomWidth} mm
        </text>
        {/* Y-axis label at bottom */}
        <text
          x={ox - 4}
          y={oy + roomW + 14}
          textAnchor="end"
          className="fill-muted-foreground"
          fontSize={Math.max(7, dimFontSizeV - 1)}
          fontFamily="var(--font-sans)"
          fontWeight={500}
        >
          Y
        </text>
      </g>
    )

    return labels
  }, [roomL, roomW, config])

  if (rows.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 rounded-lg border-2 border-dashed border-border">
        <p className="text-sm text-muted-foreground">
          Ajoutez des rangees pour visualiser le calepinage
        </p>
      </div>
    )
  }

  return (
    <div className="relative w-full">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto"
        onMouseMove={handleMouseMove}
        style={{ maxHeight: "70vh" }}
      >
        <defs>
          <marker id="arrowLeft" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
            <path d="M 6 0 L 0 3 L 6 6" className="fill-none stroke-muted-foreground" strokeWidth="1" />
          </marker>
          <marker id="arrowRight" markerWidth="6" markerHeight="6" refX="0" refY="3" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6" className="fill-none stroke-muted-foreground" strokeWidth="1" />
          </marker>
          <marker id="arrowUp" markerWidth="6" markerHeight="6" refX="3" refY="6" orient="auto">
            <path d="M 0 6 L 3 0 L 6 6" className="fill-none stroke-muted-foreground" strokeWidth="1" />
          </marker>
          <marker id="arrowDown" markerWidth="6" markerHeight="6" refX="3" refY="0" orient="auto">
            <path d="M 0 0 L 3 6 L 6 0" className="fill-none stroke-muted-foreground" strokeWidth="1" />
          </marker>
          <clipPath id="room-clip">
            <rect
              x={PADDING + LABEL_SPACE}
              y={PADDING}
              width={roomL}
              height={roomW}
            />
          </clipPath>
        </defs>

        {/* Background */}
        <rect
          x={PADDING + LABEL_SPACE}
          y={PADDING}
          width={roomL}
          height={roomW}
          className="fill-muted/50"
          rx={2}
        />

        {/* Planks clipped to room */}
        <g clipPath="url(#room-clip)">{plankElements}</g>

        {/* Plank boundary tick marks along top and left edges */}
        <g pointerEvents="none">
          {(() => {
            const ticks: React.ReactNode[] = []
            const ox = PADDING + LABEL_SPACE
            const oy = PADDING
            const tickLen = 5
            const tickFontSize = Math.min(8, Math.max(5, roomL / 20))

            // Vertical edges (from plank X positions) - ticks on top edge
            let cumX = 0
            if (rows.length > 0) {
              for (const plank of rows[0].planks) {
                cumX += plank.length
                if (cumX < roomL) {
                  ticks.push(
                    <g key={`tick-x-${cumX}`}>
                      <line
                        x1={ox + cumX}
                        y1={oy - tickLen}
                        x2={ox + cumX}
                        y2={oy}
                        className="stroke-muted-foreground/60"
                        strokeWidth={0.75}
                      />
                      <text
                        x={ox + cumX}
                        y={oy - tickLen - 2}
                        textAnchor="middle"
                        className="fill-muted-foreground/50"
                        fontSize={tickFontSize}
                        fontFamily="var(--font-sans)"
                      >
                        {cumX}
                      </text>
                    </g>
                  )
                }
              }
            }

            // Horizontal edges (from row Y positions) - ticks on left edge
            let cumY = 0
            for (const row of rows) {
              const h = row.planks.length > 0 ? row.planks[0].width : 0
              cumY += h
              if (cumY < roomW) {
                ticks.push(
                  <g key={`tick-y-${cumY}`}>
                    <line
                      x1={ox - tickLen}
                      y1={oy + cumY}
                      x2={ox}
                      y2={oy + cumY}
                      className="stroke-muted-foreground/60"
                      strokeWidth={0.75}
                    />
                    <text
                      x={ox - tickLen - 2}
                      y={oy + cumY + 3}
                      textAnchor="end"
                      className="fill-muted-foreground/50"
                      fontSize={tickFontSize}
                      fontFamily="var(--font-sans)"
                    >
                      {cumY}
                    </text>
                  </g>
                )
              }
            }
            return ticks
          })()}
        </g>

        {/* Room border */}
        <rect
          x={PADDING + LABEL_SPACE}
          y={PADDING}
          width={roomL}
          height={roomW}
          fill="none"
          className="stroke-foreground/70 dark:stroke-foreground/50"
          strokeWidth={2.5}
          rx={1}
        />

        {/* Dimension labels */}
        {dimensionLabels}
      </svg>

      {/* Tooltip with coordinates */}
      {hovered && (
        <div
          className="absolute pointer-events-none z-10 rounded-md border border-border bg-card px-3 py-2.5 shadow-lg min-w-[180px]"
          style={{
            left: tooltipPos.x + 14,
            top: tooltipPos.y - 60,
          }}
        >
          <p className="text-xs font-semibold text-foreground">
            Rangee {hovered.rowIndex + 1}, Lame {hovered.plankIndex + 1}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Dimensions : {hovered.plankLength} x {hovered.plankWidth} mm
          </p>
          <div className="mt-1.5 pt-1.5 border-t border-border">
            <p className="text-[11px] text-muted-foreground">
              <span className="font-medium text-foreground/80">Debut</span>{" "}
              ({hovered.startX}, {hovered.startY})
            </p>
            <p className="text-[11px] text-muted-foreground">
              <span className="font-medium text-foreground/80">Fin</span>{" "}
              ({hovered.endX}, {hovered.endY})
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
