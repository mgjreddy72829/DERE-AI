import { Palette } from 'lucide-react'
import type { Aesthetic } from '@/lib/dere-types'
import { mmToFtIn } from '@/lib/dere-generate'
import { DashboardCard } from './dashboard-card'

export function AestheticsCard({ aesthetic }: { aesthetic: Aesthetic }) {
  return (
    <DashboardCard icon={Palette} title="Aesthetics & Moodboard" subtitle={aesthetic.decor_style_name}>
      <div
        className="flex h-24 overflow-hidden rounded-lg"
        role="img"
        aria-label={`Moodboard palette: ${aesthetic.color_swatches.map((s) => s.label ?? s.hex).join(', ')}`}
      >
        {aesthetic.color_swatches.map((s, i) => (
          <div key={s.role} style={{ backgroundColor: s.hex, flexGrow: [4, 3, 1, 2][i] }} />
        ))}
      </div>

      <ul className="mt-5 grid grid-cols-4 gap-2">
        {aesthetic.color_swatches.map((s) => (
          <li key={s.role} className="flex flex-col items-center gap-2 text-center">
            <span
              className="size-11 rounded-full shadow-sm ring-1 ring-black/10 ring-offset-2 ring-offset-card"
              style={{ backgroundColor: s.hex }}
              aria-hidden="true"
            />
            <span className="flex flex-col">
              <span className="text-xs font-medium leading-tight">{s.label}</span>
              <span className="font-mono text-[11px] uppercase text-muted-foreground">{s.hex}</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.role}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Key furniture</h4>
        <ul className="mt-2 divide-y divide-border">
          {aesthetic.key_furniture_items.map((item) => (
            <li key={item.name} className="flex items-start justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{item.name}</p>
                {item.material_or_finish ? (
                  <p className="truncate text-xs text-muted-foreground">{item.material_or_finish}</p>
                ) : null}
              </div>
              <span className="shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                {mmToFtIn(item.footprint_mm.width)} {'×'} {mmToFtIn(item.footprint_mm.depth)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </DashboardCard>
  )
}
