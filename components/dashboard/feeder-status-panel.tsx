'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { StatusBadge } from './status-badge'
import { GitBranch, AlertTriangle, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeederLoad {
  feederId: string
  feederName: string
  capacity: number
  currentLoad: number
  loadPercentage: number
  status: 'normal' | 'high' | 'critical' | 'overload'
  priority: 'critical' | 'high' | 'medium' | 'low'
}

interface FeederStatusPanelProps {
  feederLoads: FeederLoad[]
  districtName: string
}

const priorityLabels: Record<string, string> = {
  critical: 'Essential Services',
  high: 'High Priority',
  medium: 'Standard',
  low: 'Load Shedding Eligible',
}

export function FeederStatusPanel({ feederLoads, districtName }: FeederStatusPanelProps) {
  const totalCapacity = feederLoads.reduce((sum, f) => sum + f.capacity, 0)
  const totalLoad = feederLoads.reduce((sum, f) => sum + f.currentLoad, 0)
  const overallPercentage = Math.round((totalLoad / totalCapacity) * 100)

  const criticalFeeders = feederLoads.filter(f => f.status === 'critical' || f.status === 'overload')
  const priorityFeeders = feederLoads.filter(f => f.priority === 'critical')

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <GitBranch className="h-4 w-4 text-primary" />
              Feeder Status Overview
            </CardTitle>
            <CardDescription>
              Real-time feeder load distribution for {districtName}
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total Load</p>
            <p className="text-lg font-semibold">
              {totalLoad} / {totalCapacity} MW
            </p>
          </div>
        </div>

        {/* Overall capacity bar */}
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Grid Capacity Utilization</span>
            <span
              className={cn('font-medium', {
                'text-status-normal': overallPercentage < 75,
                'text-status-high': overallPercentage >= 75 && overallPercentage < 90,
                'text-status-critical': overallPercentage >= 90,
              })}
            >
              {overallPercentage}%
            </span>
          </div>
          <Progress
            value={overallPercentage}
            className={cn('h-2', {
              '[&>div]:bg-status-normal': overallPercentage < 75,
              '[&>div]:bg-status-high': overallPercentage >= 75 && overallPercentage < 90,
              '[&>div]:bg-status-critical': overallPercentage >= 90,
            })}
          />
        </div>

        {/* Alerts */}
        {criticalFeeders.length > 0 && (
          <div className="mt-3 flex items-center gap-2 rounded-md bg-status-critical/10 p-2 text-xs text-status-critical">
            <AlertTriangle className="h-4 w-4" />
            <span>
              {criticalFeeders.length} feeder(s) approaching or exceeding safe operating limits
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {/* Priority feeders notice */}
        {priorityFeeders.length > 0 && (
          <div className="mb-4 flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 p-2 text-xs">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">
              <strong className="text-foreground">{priorityFeeders.length} Essential Service Feeder(s)</strong>{' '}
              - Hospitals, water supply, emergency services protected from load shedding
            </span>
          </div>
        )}

        {/* Feeder list */}
        <div className="space-y-3">
          {feederLoads.map(feeder => (
            <div
              key={feeder.feederId}
              className={cn(
                'rounded-lg border p-3 transition-colors',
                feeder.status === 'overload' && 'border-status-overload/50 bg-status-overload/5',
                feeder.status === 'critical' && 'border-status-critical/50 bg-status-critical/5',
                feeder.status === 'high' && 'border-status-high/30',
                feeder.status === 'normal' && 'border-border'
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="truncate text-sm font-medium">{feeder.feederName}</h4>
                    {feeder.priority === 'critical' && (
                      <Shield className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {priorityLabels[feeder.priority]} | Capacity: {feeder.capacity} MW
                  </p>
                </div>
                <StatusBadge status={feeder.status} />
              </div>

              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    Load: {feeder.currentLoad} MW
                  </span>
                  <span
                    className={cn('font-medium', {
                      'text-status-normal': feeder.loadPercentage < 75,
                      'text-status-high': feeder.loadPercentage >= 75 && feeder.loadPercentage < 90,
                      'text-status-critical': feeder.loadPercentage >= 90 && feeder.loadPercentage <= 100,
                      'text-status-overload': feeder.loadPercentage > 100,
                    })}
                  >
                    {feeder.loadPercentage}%
                  </span>
                </div>
                <Progress
                  value={Math.min(feeder.loadPercentage, 100)}
                  className={cn('h-1.5', {
                    '[&>div]:bg-status-normal': feeder.loadPercentage < 75,
                    '[&>div]:bg-status-high': feeder.loadPercentage >= 75 && feeder.loadPercentage < 90,
                    '[&>div]:bg-status-critical': feeder.loadPercentage >= 90 && feeder.loadPercentage <= 100,
                    '[&>div]:bg-status-overload': feeder.loadPercentage > 100,
                  })}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Explanation */}
        <div className="mt-4 rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Feeder Load Guidelines:</p>
          <ul className="mt-1 list-inside list-disc space-y-0.5">
            <li>
              <span className="text-status-normal">Normal (below 75%)</span>: Safe operating range
            </li>
            <li>
              <span className="text-status-high">High (75-90%)</span>: Monitor closely, prepare contingency
            </li>
            <li>
              <span className="text-status-critical">Critical (90-100%)</span>: Consider load redistribution
            </li>
            <li>
              <span className="text-status-overload">Overload (above 100%)</span>: Immediate action required
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
