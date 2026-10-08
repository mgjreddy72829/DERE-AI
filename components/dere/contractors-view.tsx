import { Clock, HardHat, Users } from 'lucide-react'
import type { DesignOption, RoomSpecs } from '@/lib/dere-types'
import { formatInr, formatUsdFromInr } from '@/lib/dere-generate'
import { buildLaborTasks, TRADE_ORDER } from '@/lib/dere-insights'
import { DashboardCard } from './dashboard-card'
import { StatTile } from './view-header'

export function ContractorsView({ option, specs }: { option: DesignOption; specs: RoomSpecs }) {
  const tasks = buildLaborTasks(option.budget.itemized_table, specs)
  const laborTotal = tasks.reduce((s, t) => s + t.labor_cost, 0)
  const hoursTotal = tasks.reduce((s, t) => s + t.labor_hours, 0)
  const daysTotal = tasks.reduce((s, t) => s + t.labor_days, 0)

  const trades = TRADE_ORDER.map((trade) => {
    const list = tasks.filter((t) => t.trade === trade)
    return {
      trade,
      count: list.length,
      hours: list.reduce((s, t) => s + t.labor_hours, 0),
      cost: list.reduce((s, t) => s + t.labor_cost, 0),
    }
  }).filter((t) => t.count > 0)

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <span className="flex size-10 items-center justify-center rounded-full bg-success/12 text-success">
          <HardHat className="size-5" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-base font-semibold">No pro trades needed</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Every item in {option.option_name} is DIY-friendly. Check the Materials tab for your shopping list.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Labor cost" value={formatUsdFromInr(laborTotal)} hint={formatInr(laborTotal)} />
        <StatTile label="Labor hours" value={`${hoursTotal} h`} hint={`${daysTotal} crew-days`} />
        <StatTile label="Pro tasks" value={tasks.length} hint="Tagged Pro trade" />
        <StatTile label="Trades required" value={trades.length} hint={trades.map((t) => t.trade).join(', ')} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <DashboardCard icon={Users} title="Trade breakdown" subtitle="Labor cost by specialty">
          <ul className="flex flex-col gap-4">
            {trades.map((t) => {
              const pct = laborTotal ? Math.round((t.cost / laborTotal) * 100) : 0
              return (
                <li key={t.trade}>
                  <div className="flex items-baseline justify-between gap-2 text-sm">
                    <span className="font-medium">{t.trade}</span>
                    <span className="tabular-nums">{formatUsdFromInr(t.cost)}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary" aria-hidden="true">
                    <div className="h-full rounded-full bg-accent transition-[width] duration-700" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-1 text-xs tabular-nums text-muted-foreground">
                    {t.count} {t.count === 1 ? 'task' : 'tasks'} {'·'} {t.hours} h {'·'} {pct}%
                  </p>
                </li>
              )
            })}
          </ul>
        </DashboardCard>

        <DashboardCard icon={HardHat} title="Pro trade tasks" subtitle="Scheduled labor with cost split" className="xl:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">Professional labor tasks</caption>
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th scope="col" className="pb-2 font-medium">Task</th>
                  <th scope="col" className="pb-2 font-medium">Trade</th>
                  <th scope="col" className="pb-2 font-medium">Timeline</th>
                  <th scope="col" className="pb-2 text-right font-medium">Labor</th>
                  <th scope="col" className="pb-2 text-right font-medium">Materials</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tasks.map((task) => (
                  <tr key={task.item_name} className="transition-colors hover:bg-secondary/40">
                    <td className="py-2.5 pr-3">{task.item_name}</td>
                    <td className="py-2.5 pr-3">
                      <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-accent/12 px-2 py-0.5 text-[11px] font-medium text-accent">
                        <HardHat className="size-3" aria-hidden="true" />
                        {task.trade}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3">
                      <span className="flex items-center gap-1.5 whitespace-nowrap tabular-nums text-muted-foreground">
                        <Clock className="size-3.5" aria-hidden="true" />
                        {task.labor_hours} h {'·'} {task.labor_days} {task.labor_days === 1 ? 'day' : 'days'}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 text-right font-medium tabular-nums">{formatUsdFromInr(task.labor_cost)}</td>
                    <td className="py-2.5 text-right tabular-nums text-muted-foreground">{formatUsdFromInr(task.material_cost)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-border font-semibold">
                  <td colSpan={2} className="pt-2.5">Total</td>
                  <td className="pt-2.5 tabular-nums">{hoursTotal} h</td>
                  <td className="pt-2.5 text-right tabular-nums">{formatUsdFromInr(laborTotal)}</td>
                  <td className="pt-2.5 text-right tabular-nums text-muted-foreground">
                    {formatUsdFromInr(tasks.reduce((s, t) => s + t.material_cost, 0))}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </DashboardCard>
      </div>
    </div>
  )
}
