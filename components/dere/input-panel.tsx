'use client'

import { useState, type FormEvent } from 'react'
import { DollarSign, DoorOpen, Ruler, Sparkles, SquareDashed } from 'lucide-react'
import type { RoomSpecs, RoomType } from '@/lib/dere-types'
import { ROOM_TYPE_LABELS } from '@/lib/dere-generate'

interface InputPanelProps {
  initialSpecs: RoomSpecs
  onGenerate: (specs: RoomSpecs) => void
}

const inputClass =
  'h-9 w-full rounded-md border border-input bg-card px-3 text-sm tabular-nums outline-none transition-shadow focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20'

function NumberField({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
}: {
  id: string
  label: string
  value: number
  min: number
  max: number
  step?: number
  suffix?: string
  onChange: (value: number) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={Number.isNaN(value) ? '' : value}
          onChange={(e) => onChange(e.target.valueAsNumber)}
          className={suffix ? `${inputClass} pr-8` : inputClass}
          required
        />
        {suffix ? (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground">
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  )
}

function SectionLabel({ icon: Icon, children }: { icon: typeof Ruler; children: React.ReactNode }) {
  return (
    <legend className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      <Icon className="size-3.5" aria-hidden="true" />
      {children}
    </legend>
  )
}

export function InputPanel({ initialSpecs, onGenerate }: InputPanelProps) {
  const [specs, setSpecs] = useState<RoomSpecs>(initialSpecs)
  const update = <K extends keyof RoomSpecs>(key: K, value: RoomSpecs[K]) =>
    setSpecs((prev) => ({ ...prev, [key]: value }))

  const area = (specs.lengthFt || 0) * (specs.widthFt || 0)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onGenerate(specs)
  }

  return (
    <aside
      aria-label="Room specifications"
      className="border-b border-border bg-card lg:sticky lg:top-14 lg:h-[calc(100dvh-3.5rem)] lg:w-80 lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-b-0"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-5">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Room Specs</h2>
          <p className="mt-1 text-sm text-muted-foreground text-pretty">
            Describe your space and DERE AI will generate three design directions.
          </p>
        </div>

        <fieldset>
          <SectionLabel icon={SquareDashed}>Room type</SectionLabel>
          <label htmlFor="room-type" className="sr-only">
            Room type
          </label>
          <select
            id="room-type"
            value={specs.roomType}
            onChange={(e) => update('roomType', e.target.value as RoomType)}
            className={inputClass}
          >
            {(Object.keys(ROOM_TYPE_LABELS) as RoomType[]).map((type) => (
              <option key={type} value={type}>
                {ROOM_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </fieldset>

        <fieldset>
          <SectionLabel icon={Ruler}>Dimensions</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            <NumberField id="length" label="Length" suffix="ft" min={4} max={60} step={0.5} value={specs.lengthFt} onChange={(v) => update('lengthFt', v)} />
            <NumberField id="width" label="Width" suffix="ft" min={4} max={60} step={0.5} value={specs.widthFt} onChange={(v) => update('widthFt', v)} />
            <NumberField id="ceiling" label="Ceiling height" suffix="ft" min={7} max={20} step={0.5} value={specs.ceilingFt} onChange={(v) => update('ceilingFt', v)} />
            <div className="flex flex-col justify-end gap-1.5">
              <span className="text-xs text-muted-foreground">Floor area</span>
              <span className="flex h-9 items-center rounded-md bg-secondary px-3 text-sm font-medium tabular-nums">
                {area.toFixed(0)} ft²
              </span>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <SectionLabel icon={DoorOpen}>Openings</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            <NumberField id="doors" label="Doors" min={1} max={6} value={specs.doors} onChange={(v) => update('doors', v)} />
            <NumberField id="windows" label="Windows" min={0} max={10} value={specs.windows} onChange={(v) => update('windows', v)} />
          </div>
        </fieldset>

        <fieldset>
          <SectionLabel icon={DollarSign}>Budget</SectionLabel>
          <NumberField id="budget" label="Maximum budget" suffix="USD" min={500} max={500000} step={100} value={specs.budgetUsd} onChange={(v) => update('budgetUsd', v)} />
          <p className="mt-2 text-xs text-muted-foreground">10% is held back as contingency.</p>
        </fieldset>

        <button
          type="submit"
          className="flex h-10 items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
        >
          <Sparkles className="size-4" aria-hidden="true" />
          Generate designs
        </button>
      </form>
    </aside>
  )
}
