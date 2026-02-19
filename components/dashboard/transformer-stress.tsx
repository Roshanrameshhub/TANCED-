'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Gauge, AlertTriangle, CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { calculateTransformerStress } from '@/lib/tangedco-data'

interface TransformerStressProps {
  loadPercentage: number
  hoursAtHighLoad: number
  districtName: string
}

const stressConfig = {
  low: {
    icon: CheckCircle,
    className: 'text-status-normal',
    bgClassName: 'bg-status-normal/15',
    progressClassName: '[&>div]:bg-status-normal',
    label: 'Low Stress',
  },
  moderate: {
    icon: AlertCircle,
    className: 'text-status-high',
    bgClassName: 'bg-status-high/15',
    progressClassName: '[&>div]:bg-status-high',
    label: 'Moderate Stress',
  },
  high: {
    icon: AlertTriangle,
    className: 'text-status-critical',
    bgClassName: 'bg-status-critical/15',
    progressClassName: '[&>div]:bg-status-critical',
    label: 'High Stress',
  },
  critical: {
    icon: XCircle,
    className: 'text-status-overload',
    bgClassName: 'bg-status-overload/15',
    progressClassName: '[&>div]:bg-status-overload',
    label: 'Critical Stress',
  },
}

export function TransformerStress({
  loadPercentage,
  hoursAtHighLoad,
  districtName,
}: TransformerStressProps) {
  const { stressLevel, recommendation } = calculateTransformerStress(loadPercentage, hoursAtHighLoad)
  const config = stressConfig[stressLevel]
  const Icon = config.icon

  // Calculate stress score for progress bar (0-100)
  const stressScore = Math.min(100, Math.round((loadPercentage / 100) * (1 + hoursAtHighLoad * 0.1) * 100))

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Gauge className="h-4 w-4 text-primary" />
              Transformer Stress Indicator
            </CardTitle>
            <CardDescription>
              Advisory status for {districtName} grid transformers
            </CardDescription>
          </div>
          <div className={cn('flex items-center gap-1.5 rounded-full px-2.5 py-1', config.bgClassName)}>
            <Icon className={cn('h-4 w-4', config.className)} />
            <span className={cn('text-xs font-medium', config.className)}>
              {config.label}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stress metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">Current Load</p>
            <p className={cn('text-2xl font-bold', {
              'text-status-normal': loadPercentage < 75,
              'text-status-high': loadPercentage >= 75 && loadPercentage < 90,
              'text-status-critical': loadPercentage >= 90,
            })}>
              {loadPercentage}%
            </p>
            <p className="text-xs text-muted-foreground">of rated capacity</p>
          </div>
          <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">High Load Duration</p>
            <p className="text-2xl font-bold text-foreground">
              {hoursAtHighLoad}h
            </p>
            <p className="text-xs text-muted-foreground">consecutive hours</p>
          </div>
        </div>

        {/* Stress indicator bar */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Overall Stress Index</span>
            <span className={cn('font-medium', config.className)}>{stressScore}%</span>
          </div>
          <Progress value={stressScore} className={cn('h-2', config.progressClassName)} />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Safe</span>
            <span>Monitor</span>
            <span>Action</span>
            <span>Emergency</span>
          </div>
        </div>

        {/* Recommendation */}
        <div className={cn('mt-4 rounded-md border p-3', config.bgClassName.replace('/15', '/10'), `border-${config.className.replace('text-', '')}/30`)}>
          <p className={cn('text-sm font-medium', config.className)}>Recommendation:</p>
          <p className="mt-1 text-xs text-muted-foreground">{recommendation}</p>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Advisory Note:</p>
          <p className="mt-1">
            This is a predictive indicator based on load trends. Actual transformer health requires
            on-site inspection. This system provides decision support only - not direct control over
            transformer operations.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
