'use client'

import { Zap, Clock, Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'
import { formatClockTime } from '@/lib/format-time'
import { STABLE_SSR_DATE } from '@/hooks/use-client-now'
import { useMounted } from '@/hooks/use-mounted'

export function DashboardHeader() {
  const mounted = useMounted()
  const [currentTime, setCurrentTime] = useState(STABLE_SSR_DATE)

  useEffect(() => {
    const sync = () => setCurrentTime(new Date())
    sync()
    const timer = setInterval(sync, 1000)
    return () => clearInterval(timer)
  }, [])

  const dateLabel = mounted
    ? currentTime.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '—'

  const timeLabel = mounted ? formatClockTime(currentTime) : '--:--:--'

  return (
    <header className="border-b border-border bg-background px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">TANGEDCO</h1>
              <p className="text-xs text-muted-foreground">
                Load Management System
              </p>
            </div>
          </div>
          <div className="hidden h-8 w-px bg-border md:block" />
          <div className="hidden md:block">
            <p className="text-sm font-medium text-foreground">
              Tamil Nadu Generation and Distribution Corporation
            </p>
            <p className="text-xs text-muted-foreground">
              Electricity Demand Forecasting & Feeder-Level Load Management
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
            <Calendar className="h-4 w-4" />
            <span suppressHydrationWarning>{dateLabel}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Clock className="h-4 w-4" />
            <span className="tabular-nums" suppressHydrationWarning>
              {timeLabel}
            </span>
          </div>
        </div>
      </div>
      <nav
        className="mt-3 flex flex-wrap gap-2 text-xs"
        aria-label="Dashboard sections"
      >
        {['Overview', 'Feeders', 'Analysis', 'Planning'].map(label => (
          <span
            key={label}
            className="rounded-full border border-border bg-muted px-3 py-1 text-muted-foreground"
          >
            {label}
          </span>
        ))}
      </nav>
    </header>
  )
}
