'use client'

import { useEffect, useState } from 'react'

/** Stable epoch for SSR + first client paint (avoids hydration mismatch). */
export const STABLE_SSR_DATE = new Date(2024, 0, 15, 12, 0, 0)

export function useClientNow(updateIntervalMs = 60_000) {
  const [now, setNow] = useState(STABLE_SSR_DATE)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const sync = () => setNow(new Date())
    sync()
    setMounted(true)
    const timer = setInterval(sync, updateIntervalMs)
    return () => clearInterval(timer)
  }, [updateIntervalMs])

  return {
    mounted,
    now,
    hour: now.getHours(),
    month: now.getMonth() + 1,
  }
}
