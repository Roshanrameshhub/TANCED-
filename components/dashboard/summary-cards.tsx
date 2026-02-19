'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Zap, TrendingUp, Gauge, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SummaryCardsProps {
  currentDemand: number
  peakDemand: number
  peakHour: number
  solarGeneration: number
  gridUtilization: number
  dayType: string
  festival: string | null
}

export function SummaryCards({
  currentDemand,
  peakDemand,
  peakHour,
  solarGeneration,
  gridUtilization,
  dayType,
  festival,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {/* Current Demand */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Current Demand</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{currentDemand}</p>
              <p className="text-xs text-muted-foreground">Megawatts (MW)</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="rounded bg-muted px-1.5 py-0.5 capitalize">
              {dayType}
            </span>
            {festival && (
              <span className="rounded bg-status-high/15 px-1.5 py-0.5 text-status-high">
                {festival}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Peak Forecast */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Peak Forecast</p>
              <p className="mt-1 text-2xl font-bold text-status-high">{peakDemand}</p>
              <p className="text-xs text-muted-foreground">at {peakHour}:00 hrs</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-high/10">
              <TrendingUp className="h-5 w-5 text-status-high" />
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {peakHour >= 18 && peakHour <= 21
              ? 'Evening peak expected'
              : peakHour >= 12 && peakHour <= 14
              ? 'Afternoon peak expected'
              : 'Off-peak hours'}
          </p>
        </CardContent>
      </Card>

      {/* Grid Utilization */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Grid Utilization</p>
              <p
                className={cn('mt-1 text-2xl font-bold', {
                  'text-status-normal': gridUtilization < 75,
                  'text-status-high': gridUtilization >= 75 && gridUtilization < 90,
                  'text-status-critical': gridUtilization >= 90,
                })}
              >
                {gridUtilization}%
              </p>
              <p className="text-xs text-muted-foreground">of total capacity</p>
            </div>
            <div
              className={cn('flex h-10 w-10 items-center justify-center rounded-lg', {
                'bg-status-normal/10': gridUtilization < 75,
                'bg-status-high/10': gridUtilization >= 75 && gridUtilization < 90,
                'bg-status-critical/10': gridUtilization >= 90,
              })}
            >
              <Gauge
                className={cn('h-5 w-5', {
                  'text-status-normal': gridUtilization < 75,
                  'text-status-high': gridUtilization >= 75 && gridUtilization < 90,
                  'text-status-critical': gridUtilization >= 90,
                })}
              />
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {gridUtilization < 75
              ? 'Operating within safe limits'
              : gridUtilization < 90
              ? 'Elevated load - monitoring'
              : 'High utilization - action advised'}
          </p>
        </CardContent>
      </Card>

      {/* Solar Generation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Solar Generation</p>
              <p className="mt-1 text-2xl font-bold text-status-normal">{solarGeneration}</p>
              <p className="text-xs text-muted-foreground">MW (simulated)</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-normal/10">
              <Sun className="h-5 w-5 text-status-normal" />
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {solarGeneration > 0
              ? `Reducing grid stress by ${Math.round((solarGeneration / currentDemand) * 100)}%`
              : 'No solar generation (night hours)'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
