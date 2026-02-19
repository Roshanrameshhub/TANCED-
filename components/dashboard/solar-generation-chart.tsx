'use client'

import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
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
import { Sun, Leaf } from 'lucide-react'
import { getSolarGeneration } from '@/lib/tangedco-data'

interface SolarGenerationChartProps {
  districtBaseLoad: number
  currentHour: number
}

export function SolarGenerationChart({ districtBaseLoad, currentHour }: SolarGenerationChartProps) {
  const month = new Date().getMonth() + 1

  const chartData = Array.from({ length: 24 }, (_, hour) => {
    const solar = getSolarGeneration(hour, month, districtBaseLoad)
    return {
      hour: `${hour.toString().padStart(2, '0')}:00`,
      generation: solar,
      isCurrent: hour === currentHour,
    }
  })

  const currentSolar = chartData.find(d => d.isCurrent)?.generation || 0
  const peakSolar = Math.max(...chartData.map(d => d.generation))
  const totalDaily = chartData.reduce((sum, d) => sum + d.generation, 0)

  const solarColor = '#22c55e'

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sun className="h-4 w-4 text-status-normal" />
              Solar Generation (Simulated)
            </CardTitle>
            <CardDescription>
              Renewable energy contribution estimate
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-status-normal/15 px-2 py-1 text-xs font-medium text-status-normal">
            <Leaf className="h-3 w-3" />
            Clean Energy
          </div>
        </div>

        {/* Stats */}
        <div className="mt-3 grid grid-cols-3 gap-4 text-center">
          <div className="rounded-md bg-muted/50 p-2">
            <p className="text-xs text-muted-foreground">Current</p>
            <p className="text-lg font-semibold text-status-normal">{currentSolar} MW</p>
          </div>
          <div className="rounded-md bg-muted/50 p-2">
            <p className="text-xs text-muted-foreground">Peak (Noon)</p>
            <p className="text-lg font-semibold text-foreground">{peakSolar} MW</p>
          </div>
          <div className="rounded-md bg-muted/50 p-2">
            <p className="text-xs text-muted-foreground">Daily Total</p>
            <p className="text-lg font-semibold text-foreground">{totalDaily} MWh</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            generation: {
              label: 'Solar Generation (MW)',
              color: solarColor,
            },
          }}
          className="h-[160px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={solarColor} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={solarColor} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval={3}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={35}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => [`${value} MW`, 'Solar Generation']}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="generation"
                stroke={solarColor}
                strokeWidth={2}
                fill="url(#solarGradient)"
                name="generation"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Explanation */}
        <div className="mt-4 rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Renewable Awareness:</p>
          <p className="mt-1">
            This simulation estimates solar generation based on daylight hours and seasonal factors.
            During peak solar hours (10:00-15:00), renewable energy can offset{' '}
            {Math.round((peakSolar / districtBaseLoad) * 100)}% of base load demand,
            reducing stress on conventional generation.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
