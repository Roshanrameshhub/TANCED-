'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell, AlertTriangle, AlertCircle, Info, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Alert {
  id: string
  type: 'warning' | 'critical' | 'info'
  title: string
  message: string
  timestamp: string
  feeder?: string
}

interface AlertsPanelProps {
  alerts: Alert[]
}

const alertConfig = {
  critical: {
    icon: AlertTriangle,
    className: 'border-status-overload/50 bg-status-overload/5',
    iconClassName: 'text-status-overload',
  },
  warning: {
    icon: AlertCircle,
    className: 'border-status-critical/50 bg-status-critical/5',
    iconClassName: 'text-status-critical',
  },
  info: {
    icon: Info,
    className: 'border-primary/30 bg-primary/5',
    iconClassName: 'text-primary',
  },
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const criticalCount = alerts.filter(a => a.type === 'critical').length
  const warningCount = alerts.filter(a => a.type === 'warning').length

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4 text-primary" />
              Early Warning System
            </CardTitle>
            <CardDescription>
              1-2 hour ahead alerts for grid operators
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {criticalCount > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-status-overload/15 px-2 py-0.5 text-xs font-medium text-status-overload">
                {criticalCount} Critical
              </span>
            )}
            {warningCount > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-status-critical/15 px-2 py-0.5 text-xs font-medium text-status-critical">
                {warningCount} Warning
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-status-normal/15">
              <Bell className="h-6 w-6 text-status-normal" />
            </div>
            <p className="mt-3 text-sm font-medium text-foreground">No Active Alerts</p>
            <p className="mt-1 text-xs text-muted-foreground">
              All systems operating within normal parameters
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map(alert => {
              const config = alertConfig[alert.type]
              const Icon = config.icon

              return (
                <div
                  key={alert.id}
                  className={cn(
                    'rounded-lg border p-3 transition-colors',
                    config.className
                  )}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <Icon className={cn('h-5 w-5', config.iconClassName)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-medium text-foreground">
                        {alert.title}
                      </h4>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {alert.message}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(alert.timestamp).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {alert.feeder && (
                          <span className="rounded bg-muted px-1.5 py-0.5">
                            {alert.feeder}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Explanation */}
        <div className="mt-4 rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Alert System:</p>
          <p className="mt-1">
            This advisory system provides early warnings 1-2 hours ahead of potential high-load
            conditions, allowing grid operators to prepare contingency measures. All alerts are
            recommendations - actual load management decisions require operator authorization.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
