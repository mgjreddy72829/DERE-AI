import type { LucideIcon } from 'lucide-react'

interface DashboardCardProps {
  icon: LucideIcon
  title: string
  subtitle?: string
  className?: string
  children: React.ReactNode
}

export function DashboardCard({ icon: Icon, title, subtitle, className, children }: DashboardCardProps) {
  return (
    <section className={`flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm ${className ?? ''}`}>
      <header className="mb-5 flex items-start gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
          {subtitle ? <p className="truncate text-xs text-muted-foreground">{subtitle}</p> : null}
        </div>
      </header>
      {children}
    </section>
  )
}
