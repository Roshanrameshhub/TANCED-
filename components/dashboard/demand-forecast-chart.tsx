'use client'

import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
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
import { TrendingUp, Thermometer, Droplets } from 'lucide-react'

interface DemandData {
  hour: number
  demand: number
  temperature: number
  humidity: number
  baseLoad: number
  festival: string | null
  dayType: string
}

interface DemandForecastChartProps {
  data: DemandData[]
  districtName: string
  currentHour: number
}

export function DemandForecastChart({
  data,
  districtName,
  currentHour,
}: DemandForecastChartProps) {
  const chartData = data.map(d => ({
    ...d,
    hourLabel: `${d.hour.toString().padStart(2, '0')}:00`,
    isCurrent: d.hour === currentHour,
    isPast: d.hour < currentHour,
  }))

  const peakHour = data.reduce((max, d) => (d.demand > max.demand ? d : max), data[0])
  const currentDemand = data.find(d => d.hour === currentHour)
  const avgDemand = Math.round(data.reduce((sum, d) => sum + d.demand, 0) / data.length)
  const baseLoad = data[0]?.baseLoad || 0

  // Compute chart colors
  const demandColor = '#4f7cff'
  const temperatureColor = '#f59e0b'

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" />
              24-Hour Demand Forecast
            </CardTitle>
            <CardDescription>
              Hourly electricity demand projection for {districtName}
            </CardDescription>
          </div>
          <div className="flex gap-4 text-right text-xs">
            <div>
              <p className="text-muted-foreground">Current</p>
              <p className="text-lg font-semibold text-foreground">
                {currentDemand?.demand || '-'} MW
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Peak ({peakHour.hour}:00)</p>
              <p className="text-lg font-semibold text-status-high">
                {peakHour.demand} MW
              </p>
            </div>
          </div>
        </div>

        {/* Weather Summary */}
        {currentDemand && (
          <div className="mt-3 flex gap-4 rounded-md bg-muted/50 p-2 text-xs">
            <div className="flex items-center gap-1.5">
              <Thermometer className="h-3.5 w-3.5 text-status-critical" />
              <span className="text-muted-foreground">Temperature:</span>
              <span className="font-medium">{currentDemand.temperature}°C</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Droplets className="h-3.5 w-3.5 text-primary" />
              <span className="text-muted-foreground">Humidity:</span>
              <span className="font-medium">{currentDemand.humidity}%</span>
            </div>
            {currentDemand.festival && (
              <div className="flex items-center gap-1.5">
                <span className="text-status-high">Festival:</span>
                <span className="font-medium">{currentDemand.festival}</span>
              </div>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            demand: {
              label: 'Demand (MW)',
              color: demandColor,
            },
            temperature: {
              label: 'Temperature (°C)',
              color: temperatureColor,
            },
          }}
          className="h-[280px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={demandColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={demandColor} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="hourLabel"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval={2}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={45}
                tickFormatter={value => `${value}`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => {
                      if (name === 'demand') return [`${value} MW`, 'Demand']
                      if (name === 'temperature') return [`${value}°C`, 'Temperature']
                      return [value, name]
                    }}
                  />
                }
              />
              <ReferenceLine
                y={baseLoad}
                stroke="#888"
                strokeDasharray="5 5"
                label={{
                  value: `Base: ${baseLoad} MW`,
                  position: 'insideTopRight',
                  fontSize: 10,
                  fill: '#888',
                }}
              />
              <ReferenceLine
                x={`${currentHour.toString().padStart(2, '0')}:00`}
                stroke="#22c55e"
                strokeWidth={2}
                label={{
                  value: 'Now',
                  position: 'top',
                  fontSize: 10,
                  fill: '#22c55e',
                }}
              />
              <Area
                type="monotone"
                dataKey="demand"
                stroke={demandColor}
                strokeWidth={2}
                fill="url(#demandGradient)"
                name="demand"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Explanation */}
        <div className="mt-4 rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Understanding this chart:</p>
          <p className="mt-1">
            This forecast combines historical load patterns with weather data (temperature, humidity)
            and accounts for day type ({currentDemand?.dayType || 'weekday'}) variations.
            {currentDemand?.festival && ` Festival adjustment applied for ${currentDemand.festival}.`}
            {' '}Peak demand of <strong>{peakHour.demand} MW</strong> expected at{' '}
            <strong>{peakHour.hour}:00 hours</strong>. Average demand: {avgDemand} MW.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
