/** Locale-independent time formatting (SSR-safe). */
export function formatTimeFromIso(iso: string): string {
  const match = iso.match(/T(\d{2}):(\d{2})/)
  if (!match) return '--:--'
  return `${match[1]}:${match[2]}`
}

export function formatClockTime(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0')
  const m = date.getMinutes().toString().padStart(2, '0')
  const s = date.getSeconds().toString().padStart(2, '0')
  return `${h}:${m}:${s}`
}

const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const

export function formatWeekday(date: Date): string {
  return WEEKDAYS[date.getDay()] ?? 'Unknown'
}

/** Locale-independent thousands separator (SSR-safe). */
export function formatInteger(n: number): string {
  const s = Math.round(n).toString()
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
