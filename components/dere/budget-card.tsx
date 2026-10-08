import { CalendarDays, CircleAlert, CircleCheck, HardHat, Hammer, Wallet } from 'lucide-react'
import type { Budget } from '@/lib/dere-types'
import { formatInr, formatUsdFromInr } from '@/lib/dere-generate'
import { DashboardCard } from './dashboard-card'

function LaborBadge({ category }: { category: 'DIY' | 'Pro' }) {
  return category === 'DIY' ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-success/12 px-2 py-0.5 text-[11px] font-medium text-success">
      <Hammer className="size-3" aria-hidden="true" />
      DIY
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent/12 px-2 py-0.5 text-[11px] font-medium text-accent">
      <HardHat className="size-3" aria-hidden="true" />
      Pro
    </span>
  )
}

export function BudgetCard({ budget, maxBudgetInr }: { budget: Budget; maxBudgetInr: number }) {
  const committed = budget.total_estimated_cost + budget.contingency_reserved
  const usedPct = Math.min(100, (committed / maxBudgetInr) * 100)
  const proCount = budget.itemized_table.filter((l) => l.labor_category === 'Pro').length

  return (
    <DashboardCard icon={Wallet} title="Renovation Budget" subtitle="Itemized estimate" className="lg:col-span-2 2xl:col-span-1">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-secondary/60 p-3">
          <p className="text-xs text-muted-foreground">Estimated total</p>
          <p className="mt-1 text-xl font-semibold tabular-nums tracking-tight">{formatUsdFromInr(budget.total_estimated_cost)}</p>
          <p className="text-[11px] tabular-nums text-muted-foreground">{formatInr(budget.total_estimated_cost)}</p>
        </div>
        <div className="rounded-lg bg-secondary/60 p-3">
          <p className="text-xs text-muted-foreground">Timeline</p>
          <p className="mt-1 flex items-center gap-1.5 text-xl font-semibold tabular-nums tracking-tight">
            <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
            {budget.total_timeline_days} days
          </p>
          <p className="text-[11px] text-muted-foreground">
            {proCount} pro {proCount === 1 ? 'task' : 'tasks'}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-medium">
            {budget.within_max_budget ? (
              <CircleCheck className="size-3.5 text-success" aria-hidden="true" />
            ) : (
              <CircleAlert className="size-3.5 text-destructive" aria-hidden="true" />
            )}
            {budget.within_max_budget ? 'Within budget' : 'Over budget'}
          </span>
          <span className="tabular-nums text-muted-foreground">
            {formatUsdFromInr(committed)} of {formatUsdFromInr(maxBudgetInr)}
          </span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div
            className={`h-full rounded-full transition-[width] duration-700 ${budget.within_max_budget ? 'bg-primary' : 'bg-destructive'}`}
            style={{ width: `${usedPct}%` }}
          />
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-sm">
          <caption className="sr-only">Itemized renovation costs</caption>
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th scope="col" className="pb-2 font-medium">Item</th>
              <th scope="col" className="pb-2 font-medium">Labor</th>
              <th scope="col" className="pb-2 text-right font-medium">Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {budget.itemized_table.map((line) => (
              <tr key={line.item_name} className="transition-colors hover:bg-secondary/40">
                <td className="py-2.5 pr-2">{line.item_name}</td>
                <td className="py-2.5 pr-2">
                  <LaborBadge category={line.labor_category} />
                </td>
                <td className="py-2.5 text-right tabular-nums">{formatUsdFromInr(line.estimated_cost)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-border text-muted-foreground">
              <td colSpan={2} className="pt-2.5 text-xs">Contingency reserve</td>
              <td className="pt-2.5 text-right text-xs tabular-nums">{formatUsdFromInr(budget.contingency_reserved)}</td>
            </tr>
            <tr className="font-semibold">
              <td colSpan={2} className="pt-1.5">Total committed</td>
              <td className="pt-1.5 text-right tabular-nums">{formatUsdFromInr(committed)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </DashboardCard>
  )
}
