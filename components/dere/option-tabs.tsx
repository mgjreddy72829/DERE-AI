'use client'

import type { KeyboardEvent } from 'react'
import { Crown, Leaf, Scale } from 'lucide-react'
import type { DesignOption } from '@/lib/dere-types'

const TAB_ICONS = [Leaf, Scale, Crown]

interface OptionTabsProps {
  options: readonly DesignOption[]
  activeIndex: number
  onChange: (index: number) => void
  panelId: string
  meta?: (option: DesignOption) => string
}

export function OptionTabs({ options, activeIndex, onChange, panelId, meta }: OptionTabsProps) {
  const handleKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!delta) return
    e.preventDefault()
    const next = (activeIndex + delta + options.length) % options.length
    onChange(next)
    document.getElementById(`${panelId}-tab-${next}`)?.focus()
  }

  return (
    <div
      role="tablist"
      aria-label="Design options"
      className="grid grid-cols-1 gap-2 rounded-xl border border-border bg-card p-1.5 sm:grid-cols-3"
    >
      {options.map((option, i) => {
        const Icon = TAB_ICONS[i] ?? Scale
        const selected = i === activeIndex
        return (
          <button
            key={option.option_name}
            id={`${panelId}-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={panelId}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(i)}
            onKeyDown={handleKey}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
              selected ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground hover:bg-secondary'
            }`}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">{option.option_name}</span>
              <span className={`block text-xs tabular-nums ${selected ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                {meta
                  ? meta(option)
                  : `Walkability ${option.ergonomics.walkability_score} · ${option.budget.total_timeline_days} days`}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
