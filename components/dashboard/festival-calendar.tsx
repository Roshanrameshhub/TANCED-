'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { festivals, getActiveFestival } from '@/lib/tangedco-data'
import { CalendarDays, TrendingUp, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FestivalCalendarProps {
  currentDate: Date
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export function FestivalCalendar({ currentDate }: FestivalCalendarProps) {
  const activeFestival = getActiveFestival(currentDate)
  const currentMonth = currentDate.getMonth() + 1

  // Get upcoming festivals (next 3 months)
  const upcomingFestivals = festivals
    .filter(f => {
      const festivalMonth = f.month
      // Include festivals in current month (if after today) or next 3 months
      if (festivalMonth === currentMonth && f.day >= currentDate.getDate()) return true
      if (festivalMonth > currentMonth && festivalMonth <= currentMonth + 3) return true
      // Handle year wrap (e.g., if current month is November, include January)
      if (currentMonth > 9 && festivalMonth <= (currentMonth + 3) % 12) return true
      return false
    })
    .slice(0, 4)

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="h-4 w-4 text-primary" />
              Festival Load Calendar
            </CardTitle>
            <CardDescription>
              Tamil Nadu festivals affecting electricity demand
            </CardDescription>
          </div>
          {activeFestival && (
            <div className="flex items-center gap-1.5 rounded-full bg-status-high/15 px-2.5 py-1 text-xs font-medium text-status-high">
              <Star className="h-3 w-3" />
              Festival Active
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Active Festival Alert */}
        {activeFestival && (
          <div className="mb-4 rounded-lg border border-status-high/30 bg-status-high/5 p-3">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-status-high" />
              <div>
                <h4 className="font-medium text-foreground">{activeFestival.name}</h4>
                <p className="text-xs text-muted-foreground">
                  Currently active - Load multiplier: <strong className="text-status-high">+{Math.round((activeFestival.loadMultiplier - 1) * 100)}%</strong>
                </p>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Residential consumption is expected to be higher due to festival activities, decorative lighting,
              and increased cooking appliance usage. Plan for additional capacity.
            </p>
          </div>
        )}

        {/* Upcoming Festivals */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Upcoming High-Demand Periods</h4>
          <div className="space-y-2">
            {upcomingFestivals.map(festival => (
              <div
                key={festival.name}
                className={cn(
                  'flex items-center justify-between rounded-lg border p-3',
                  festival.type === 'major' ? 'border-status-high/30 bg-status-high/5' : 'border-border'
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 flex-col items-center justify-center rounded-md text-xs',
                      festival.type === 'major' ? 'bg-status-high/15 text-status-high' : 'bg-muted text-muted-foreground'
                    )}
                  >
                    <span className="font-bold">{festival.day}</span>
                    <span className="text-[10px]">{monthNames[festival.month - 1].slice(0, 3)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{festival.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {festival.duration > 1 ? `${festival.duration} days` : '1 day'} |{' '}
                      {festival.type === 'major' ? 'Major Festival' : festival.type === 'medium' ? 'Regional Festival' : 'Local Festival'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <TrendingUp className={cn('h-4 w-4', {
                    'text-status-overload': festival.loadMultiplier >= 1.4,
                    'text-status-critical': festival.loadMultiplier >= 1.3 && festival.loadMultiplier < 1.4,
                    'text-status-high': festival.loadMultiplier >= 1.2 && festival.loadMultiplier < 1.3,
                    'text-muted-foreground': festival.loadMultiplier < 1.2,
                  })} />
                  <span className={cn('font-medium', {
                    'text-status-overload': festival.loadMultiplier >= 1.4,
                    'text-status-critical': festival.loadMultiplier >= 1.3 && festival.loadMultiplier < 1.4,
                    'text-status-high': festival.loadMultiplier >= 1.2 && festival.loadMultiplier < 1.3,
                    'text-muted-foreground': festival.loadMultiplier < 1.2,
                  })}>
                    +{Math.round((festival.loadMultiplier - 1) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Load Impact Guide */}
        <div className="mt-4 rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Festival Load Impact:</p>
          <ul className="mt-1 list-inside list-disc space-y-0.5">
            <li><strong>Deepavali (+45%):</strong> Highest demand due to decorative lighting</li>
            <li><strong>Pongal (+35%):</strong> Extended cooking and family gatherings</li>
            <li><strong>Tamil New Year (+25%):</strong> Moderate increase in residential load</li>
            <li>Load adjustments are automatically factored into forecasts</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
