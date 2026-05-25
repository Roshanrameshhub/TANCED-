'use client'

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { BarChart3 } from 'lucide-react'
import { chartTheme } from '@/lib/chart-theme'

interface DemandData {
  hour: number
  demand: number
}

interface PeakAnalysisChartProps {
  data: DemandData[]
  baseLoad: number
  districtName: string
  currentHour: number
}

export function PeakAnalysisChart({
  data,
  baseLoad,
  districtName,
  currentHour,
}: PeakAnalysisChartProps) {
  const chartData = data.map(d => ({
    hour: `${d.hour.toString().padStart(2, '0')}:00`,
    demand: d.demand,
    hourNum: d.hour,
    isPeak: d.hour >= 18 && d.hour <= 21,
    isCurrent: d.hour === currentHour,
  }))

  const peakHours = data.filter(d => d.hour >= 18 && d.hour <= 21)
  const offPeakHours = data.filter(d => d.hour < 6 || d.hour > 22)
  const avgPeak = Math.round(peakHours.reduce((sum, d) => sum + d.demand, 0) / peakHours.length)
  const avgOffPeak = Math.round(offPeakHours.reduce((sum, d) => sum + d.demand, 0) / offPeakHours.length)

  const normalColor = chartTheme.primary
  const peakColor = chartTheme.tertiary
  const currentColor = chartTheme.statusNormal
  const baseLineColor = chartTheme.mutedForeground

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-primary" />
              Peak Load Analysis
            </CardTitle>
            <CardDescription>
              Hourly demand distribution for {districtName}
            </CardDescription>
          </div>
          <div className="flex gap-4 text-right text-xs">
            <div>
              <p className="text-muted-foreground">Peak Hours Avg</p>
              <p className="text-lg font-semibold text-status-high">{avgPeak} MW</p>
            </div>
            <div>
              <p className="text-muted-foreground">Off-Peak Avg</p>
              <p className="text-lg font-semibold text-foreground">{avgOffPeak} MW</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 flex gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded" style={{ backgroundColor: normalColor }} />
            <span className="text-muted-foreground">Normal Hours</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded" style={{ backgroundColor: peakColor }} />
            <span className="text-muted-foreground">Peak Hours (18:00-21:00)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded" style={{ backgroundColor: currentColor }} />
            <span className="text-muted-foreground">Current Hour</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            demand: {
              label: 'Demand (MW)',
              color: normalColor,
            },
          }}
          className="h-[200px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 9 }}
                tickLine={false}
                axisLine={false}
                interval={2}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name, props) => {
                      const payload = props.payload
                      const label = payload.isPeak ? ' (Peak Hour)' : payload.isCurrent ? ' (Current)' : ''
                      return [`${value} MW${label}`, 'Demand']
                    }}
                  />
                }
              />
              <ReferenceLine
                y={baseLoad}
                stroke={baseLineColor}
                strokeDasharray="3 3"
                label={{
                  value: 'Base',
                  position: 'insideTopRight',
                  fontSize: 10,
                  fill: baseLineColor,
                }}
              />
              <Bar dataKey="demand" radius={[2, 2, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.isCurrent
                        ? currentColor
                        : entry.isPeak
                        ? peakColor
                        : normalColor
                    }
                    opacity={entry.hourNum < currentHour ? 0.6 : 1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Peak insights */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
          <div className="rounded-md bg-muted/50 p-2">
            <p className="font-medium text-foreground">Peak-to-Off-Peak Ratio</p>
            <p className="mt-1 text-muted-foreground">
              Evening peak demand is <strong>{Math.round((avgPeak / avgOffPeak) * 100 - 100)}% higher</strong> than off-peak hours.
              This differential indicates typical residential and commercial evening usage patterns.
            </p>
          </div>
          <div className="rounded-md bg-muted/50 p-2">
            <p className="font-medium text-foreground">Capacity Planning Note</p>
            <p className="mt-1 text-muted-foreground">
              Grid infrastructure must be sized for peak demand ({avgPeak} MW) while efficiently handling
              lower off-peak loads ({avgOffPeak} MW).
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
