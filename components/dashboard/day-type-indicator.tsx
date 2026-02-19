'use client'

import { Card, CardContent } from '@/components/ui/card'
import { getDayType, type DayType } from '@/lib/tangedco-data'
import { Briefcase, Home, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DayTypeIndicatorProps {
  currentDate: Date
}

const dayTypeConfig: Record<DayType, {
  icon: typeof Briefcase
  label: string
  description: string
  loadPattern: string
  className: string
}> = {
  weekday: {
    icon: Briefcase,
    label: 'Weekday',
    description: 'Normal working day pattern',
    loadPattern: 'Industrial + Commercial + Residential mix. Peak at 19:00-21:00 hours.',
    className: 'bg-primary/10 text-primary',
  },
  weekend: {
    icon: Home,
    label: 'Weekend',
    description: 'Reduced commercial activity',
    loadPattern: 'Lower industrial load. Residential dominant. Gradual morning rise.',
    className: 'bg-status-normal/10 text-status-normal',
  },
  holiday: {
    icon: Calendar,
    label: 'Government Holiday',
    description: 'Non-working day pattern',
    loadPattern: 'Similar to weekend. Higher residential in mornings and evenings.',
    className: 'bg-status-high/10 text-status-high',
  },
}

export function DayTypeIndicator({ currentDate }: DayTypeIndicatorProps) {
  const dayType = getDayType(currentDate)
  const config = dayTypeConfig[dayType]
  const Icon = config.icon

  const dayName = currentDate.toLocaleDateString('en-IN', { weekday: 'long' })

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg', config.className)}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-foreground">{dayName}</h4>
              <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', config.className)}>
                {config.label}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">{config.description}</p>
          </div>
        </div>
        <div className="mt-3 rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Load Pattern:</span> {config.loadPattern}
        </div>
      </CardContent>
    </Card>
  )
}
