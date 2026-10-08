import { Armchair, Hammer, Lamp, Layers, Package, PaintRoller, ShoppingCart, Wrench, type LucideIcon } from 'lucide-react'
import type { DesignOption, RoomSpecs } from '@/lib/dere-types'
import { formatInr, formatUsdFromInr } from '@/lib/dere-generate'
import { buildMaterials, CATEGORY_ORDER, type MaterialCategory, type MaterialItem } from '@/lib/dere-insights'
import { StatTile } from './view-header'

const CATEGORY_ICONS: Record<MaterialCategory, LucideIcon> = {
  Furniture: Armchair,
  'Cabinetry & Hardware': Wrench,
  'Lighting & Electrical': Lamp,
  Finishes: Layers,
  Paint: PaintRoller,
}

function SourcingBadge({ sourcing }: { sourcing: MaterialItem['sourcing'] }) {
  return sourcing === 'DIY' ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-success/12 px-2 py-0.5 text-[11px] font-medium text-success">
      <Hammer className="size-3" aria-hidden="true" />
      DIY
    </span>
  ) : (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-accent/12 px-2 py-0.5 text-[11px] font-medium text-accent"
      title="Purchase and have a pro install"
    >
      <ShoppingCart className="size-3" aria-hidden="true" />
      Buy
    </span>
  )
}

export function MaterialsView({ option, specs }: { option: DesignOption; specs: RoomSpecs }) {
  const materials = buildMaterials(option.budget.itemized_table, specs)
  const total = materials.reduce((s, m) => s + m.estimated_cost, 0)
  const diyCount = materials.filter((m) => m.sourcing === 'DIY').length

  const groups = CATEGORY_ORDER.map((category) => {
    const items = materials.filter((m) => m.category === category)
    return { category, items, subtotal: items.reduce((s, m) => s + m.estimated_cost, 0) }
  }).filter((g) => g.items.length > 0)

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Shopping list total" value={formatUsdFromInr(total)} hint={formatInr(total)} />
        <StatTile label="Line items" value={materials.length} hint={`${groups.length} categories`} />
        <StatTile label="DIY items" value={diyCount} hint="Self-install" />
        <StatTile label="Buy items" value={materials.length - diyCount} hint="Pro-installed" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {groups.map(({ category, items, subtotal }) => {
          const Icon = CATEGORY_ICONS[category]
          const share = total ? Math.round((subtotal / total) * 100) : 0
          return (
            <section key={category} aria-labelledby={`cat-${category}`} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <header className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 id={`cat-${category}`} className="text-sm font-semibold tracking-tight">
                      {category}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {items.length} {items.length === 1 ? 'item' : 'items'} {'·'} {share}% of spend
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold tabular-nums">{formatUsdFromInr(subtotal)}</p>
                  <p className="text-[11px] tabular-nums text-muted-foreground">{formatInr(subtotal)}</p>
                </div>
              </header>

              <div className="mt-3 h-1 overflow-hidden rounded-full bg-secondary" aria-hidden="true">
                <div className="h-full rounded-full bg-primary transition-[width] duration-700" style={{ width: `${share}%` }} />
              </div>

              <ul className="mt-4 divide-y divide-border">
                {items.map((item) => (
                  <li key={item.item_name} className="flex items-center gap-3 py-2.5">
                    <Package className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{item.item_name}</p>
                      <p className="text-xs tabular-nums text-muted-foreground">
                        Qty {item.quantity} {item.unit}
                      </p>
                    </div>
                    <SourcingBadge sourcing={item.sourcing} />
                    <span className="w-20 text-right text-sm tabular-nums">{formatUsdFromInr(item.estimated_cost)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </div>
  )
}
