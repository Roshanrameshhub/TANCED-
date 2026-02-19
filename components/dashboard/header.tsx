'use client'

import { Zap, Clock, Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'

export function DashboardHeader() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="border-b border-border bg-card px-6 py-4">
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
            <span>
              {currentTime.toLocaleDateString('en-IN', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Clock className="h-4 w-4" />
            <span className="tabular-nums">
              {currentTime.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
