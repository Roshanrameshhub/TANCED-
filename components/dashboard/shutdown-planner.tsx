'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Power, Shield, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatusBadge } from './status-badge'

interface ShutdownPlan {
  feederId: string
  feederName: string
  scheduledStart: string
  duration: number
  loadReduction: number
  priority: string
}

interface ShutdownPlannerProps {
  shutdownPlan: ShutdownPlan[]
  deficitMW: number
  isSimulating: boolean
  onSimulate: () => void
}

export function ShutdownPlanner({
  shutdownPlan,
  deficitMW,
  isSimulating,
  onSimulate,
}: ShutdownPlannerProps) {
  const totalReduction = shutdownPlan.reduce((sum, p) => sum + p.loadReduction, 0)

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4 text-primary" />
              Rotational Shutdown Planner
            </CardTitle>
            <CardDescription>
              Fair load distribution during high-demand periods
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onSimulate}
            disabled={isSimulating}
          >
            <Power className="mr-2 h-4 w-4" />
            {isSimulating ? 'Simulating...' : 'Simulate Shutdown'}
          </Button>
        </div>

        {/* Deficit indicator */}
        {deficitMW > 0 && (
          <div className="mt-3 flex items-center gap-2 rounded-md bg-status-critical/10 p-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-status-critical" />
            <span className="text-muted-foreground">
              Estimated power deficit:{' '}
              <strong className="text-status-critical">{deficitMW} MW</strong>
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {shutdownPlan.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-status-normal/15">
              <Power className="h-6 w-6 text-status-normal" />
            </div>
            <p className="mt-3 text-sm font-medium text-foreground">No Shutdowns Required</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Current load is within manageable limits. Click Simulate to see a sample plan.
            </p>
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="mb-4 grid grid-cols-2 gap-4 text-center">
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">Feeders Affected</p>
                <p className="text-2xl font-bold text-foreground">{shutdownPlan.length}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">Total Load Reduction</p>
                <p className="text-2xl font-bold text-status-normal">{totalReduction} MW</p>
              </div>
            </div>

            {/* Plan table */}
            <div className="rounded-lg border border-border">
              <div className="grid grid-cols-12 gap-2 border-b border-border bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground">
                <div className="col-span-4">Feeder</div>
                <div className="col-span-2">Time</div>
                <div className="col-span-2">Duration</div>
                <div className="col-span-2">Reduction</div>
                <div className="col-span-2">Status</div>
              </div>
              <div className="divide-y divide-border">
                {shutdownPlan.map((plan, index) => (
                  <div
                    key={plan.feederId}
                    className={cn(
                      'grid grid-cols-12 items-center gap-2 px-3 py-2 text-sm',
                      index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                    )}
                  >
                    <div className="col-span-4">
                      <p className="truncate font-medium text-foreground">{plan.feederName}</p>
                      <p className="text-xs text-muted-foreground capitalize">{plan.priority} priority</p>
                    </div>
                    <div className="col-span-2 flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      {plan.scheduledStart}
                    </div>
                    <div className="col-span-2 text-xs">{plan.duration} min</div>
                    <div className="col-span-2 text-xs font-medium text-status-normal">
                      -{plan.loadReduction} MW
                    </div>
                    <div className="col-span-2">
                      <StatusBadge status="shutdown" label="Planned" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Protected feeders notice */}
            <div className="mt-4 flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 p-2 text-xs">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">
                <strong className="text-foreground">Essential services protected:</strong>{' '}
                Hospital, water supply, and emergency service feeders are excluded from rotational shutdowns.
              </span>
            </div>
          </>
        )}

        {/* Explanation */}
        <div className="mt-4 rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Operational Guidelines:</p>
          <ul className="mt-1 list-inside list-disc space-y-0.5">
            <li>Rotational shutdowns distribute outage time fairly across non-critical areas</li>
            <li>Maximum 60-minute rotation per area to minimize disruption</li>
            <li>This is a <strong>planning simulation</strong> - actual shutdowns require operator authorization</li>
            <li>Follow TNEB Standard Operating Procedures for load shedding implementation</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
