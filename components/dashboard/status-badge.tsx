import { cn } from '@/lib/utils'

type StatusType = 'normal' | 'high' | 'critical' | 'overload' | 'shutdown' | 'info'

interface StatusBadgeProps {
  status: StatusType
  label?: string
  className?: string
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  normal: {
    label: 'Normal Load',
    className: 'bg-status-normal/15 text-status-normal border-status-normal/30',
  },
  high: {
    label: 'High Load',
    className: 'bg-status-high/15 text-status-high border-status-high/30',
  },
  critical: {
    label: 'Critical Alert',
    className: 'bg-status-critical/15 text-status-critical border-status-critical/30',
  },
  overload: {
    label: 'Overload',
    className: 'bg-status-overload/15 text-status-overload border-status-overload/30',
  },
  shutdown: {
    label: 'Shutdown Planned',
    className: 'bg-muted text-muted-foreground border-border',
  },
  info: {
    label: 'Information',
    className: 'bg-primary/15 text-primary border-primary/30',
  },
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium',
        config.className,
        className
      )}
    >
      <span
        className={cn('h-1.5 w-1.5 rounded-full', {
          'bg-status-normal': status === 'normal',
          'bg-status-high': status === 'high',
          'bg-status-critical': status === 'critical',
          'bg-status-overload animate-pulse': status === 'overload',
          'bg-muted-foreground': status === 'shutdown',
          'bg-primary': status === 'info',
        })}
      />
      {label || config.label}
    </span>
  )
}
