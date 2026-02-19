'use client'

import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
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
import { History } from 'lucide-react'

interface ComparisonChartProps {
  today: Array<{ hour: number; demand: number }>
  lastWeek: Array<{ hour: number; demand: number }>
  districtName: string
}

export function ComparisonChart({ today, lastWeek, districtName }: ComparisonChartProps) {
  const chartData = today.map((t, i) => ({
    hour: `${t.hour.toString().padStart(2, '0')}:00`,
    today: t.demand,
    lastWeek: lastWeek[i]?.demand || 0,
  }))

  const todayTotal = today.reduce((sum, d) => sum + d.demand, 0)
  const lastWeekTotal = lastWeek.reduce((sum, d) => sum + d.demand, 0)
  const percentChange = Math.round(((todayTotal - lastWeekTotal) / lastWeekTotal) * 100)

  // Compute colors
  const todayColor = '#4f7cff'
  const lastWeekColor = '#94a3b8'

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <History className="h-4 w-4 text-primary" />
              Historical Comparison
            </CardTitle>
            <CardDescription>
              Today vs Same Day Last Week - {districtName}
            </CardDescription>
          </div>
          <div className="text-right text-xs">
            <p className="text-muted-foreground">Week-over-Week</p>
            <p
              className={`text-lg font-semibold ${
                percentChange > 0 ? 'text-status-high' : 'text-status-normal'
              }`}
            >
              {percentChange > 0 ? '+' : ''}
              {percentChange}%
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            today: {
              label: 'Today',
              color: todayColor,
            },
            lastWeek: {
              label: 'Last Week',
              color: lastWeekColor,
            },
          }}
          className="h-[200px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
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
                width={40}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [`${value} MW`, name === 'today' ? 'Today' : 'Last Week']}
                  />
                }
              />
              <Legend
                verticalAlign="top"
                height={30}
                formatter={(value) => (value === 'today' ? 'Today' : 'Last Week')}
              />
              <Line
                type="monotone"
                dataKey="today"
                stroke={todayColor}
                strokeWidth={2}
                dot={false}
                name="today"
              />
              <Line
                type="monotone"
                dataKey="lastWeek"
                stroke={lastWeekColor}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="lastWeek"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Analysis */}
        <div className="mt-4 rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Trend Analysis:</p>
          <p className="mt-1">
            {percentChange > 5
              ? `Demand is ${percentChange}% higher than last week. Consider preemptive capacity measures.`
              : percentChange < -5
              ? `Demand is ${Math.abs(percentChange)}% lower than last week. Current capacity is adequate.`
              : 'Demand patterns are consistent with last week. No unusual variations detected.'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
