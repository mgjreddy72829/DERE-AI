'use client'

import { useMemo, useState, type KeyboardEvent } from 'react'
import { Crown, Leaf, Scale } from 'lucide-react'
import type { RoomSpecs } from '@/lib/dere-types'
import { generateDesigns, ROOM_TYPE_LABELS } from '@/lib/dere-generate'
import { TopNav } from './top-nav'
import { InputPanel } from './input-panel'
import { AestheticsCard } from './aesthetics-card'
import { SpatialCard } from './spatial-card'
import { BudgetCard } from './budget-card'

const DEFAULT_SPECS: RoomSpecs = {
  roomType: 'bedroom',
  lengthFt: 14,
  widthFt: 12,
  ceilingFt: 9,
  doors: 1,
  windows: 2,
  budgetUsd: 8000,
}

const TAB_ICONS = [Leaf, Scale, Crown]

export function Dashboard() {
  const [specs, setSpecs] = useState<RoomSpecs>(DEFAULT_SPECS)
  const [activeIndex, setActiveIndex] = useState(1)
  const response = useMemo(() => generateDesigns(specs), [specs])
  const active = response.options[activeIndex]

  const handleTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!delta) return
    e.preventDefault()
    const next = (activeIndex + delta + 3) % 3
    setActiveIndex(next)
    document.getElementById(`option-tab-${next}`)?.focus()
  }

  return (
    <div className="min-h-dvh bg-background">
      <TopNav />
      <div className="flex flex-col lg:flex-row">
        <InputPanel initialSpecs={DEFAULT_SPECS} onGenerate={setSpecs} />

        <main className="min-w-0 flex-1 p-4 md:p-6">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium uppercase tracking-wider text-accent">Generated designs</p>
            <h1 className="text-2xl font-semibold tracking-tight text-balance">
              {ROOM_TYPE_LABELS[specs.roomType]}
              <span className="text-muted-foreground">
                {' · '}
                {specs.lengthFt} {'×'} {specs.widthFt} ft
              </span>
            </h1>
            <p className="text-sm text-muted-foreground">
              {specs.doors} {specs.doors === 1 ? 'door' : 'doors'}, {specs.windows}{' '}
              {specs.windows === 1 ? 'window' : 'windows'}, {specs.ceilingFt} ft ceiling
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Design options"
            className="mt-6 grid grid-cols-1 gap-2 rounded-xl border border-border bg-card p-1.5 sm:grid-cols-3"
          >
            {response.options.map((option, i) => {
              const Icon = TAB_ICONS[i]
              const selected = i === activeIndex
              return (
                <button
                  key={option.option_name}
                  id={`option-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="option-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveIndex(i)}
                  onKeyDown={handleTabKey}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                    selected ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{option.option_name}</span>
                    <span className={`block text-xs tabular-nums ${selected ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      Walkability {option.ergonomics.walkability_score} {'·'} {option.budget.total_timeline_days} days
                    </span>
                  </span>
                </button>
              )
            })}
          </div>

          <div
            id="option-panel"
            role="tabpanel"
            aria-labelledby={`option-tab-${activeIndex}`}
            className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3"
          >
            <AestheticsCard aesthetic={active.aesthetic} />
            <SpatialCard ergonomics={active.ergonomics} />
            <BudgetCard budget={active.budget} maxBudgetInr={response.room_summary.max_budget_inr} />
          </div>
        </main>
      </div>
    </div>
  )
}
