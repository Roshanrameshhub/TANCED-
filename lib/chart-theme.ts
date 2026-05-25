/** Theme-aware chart colors (reads CSS variables from globals.css). */
export const chartTheme = {
  primary: 'var(--chart-1)',
  secondary: 'var(--chart-2)',
  tertiary: 'var(--chart-3)',
  quaternary: 'var(--chart-4)',
  muted: 'var(--chart-5)',
  foreground: 'var(--foreground)',
  mutedForeground: 'var(--muted-foreground)',
  accent: 'var(--accent)',
  statusNormal: 'var(--status-normal)',
  statusHigh: 'var(--status-high)',
} as const
