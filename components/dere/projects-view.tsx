import { ArrowRight, CalendarDays, Footprints, Plus, Trash2 } from 'lucide-react'
import type { RoomSpecs } from '@/lib/dere-types'
import { formatUsdFromInr, generateDesigns, ROOM_TYPE_LABELS } from '@/lib/dere-generate'

export interface SavedProject {
  id: string
  name: string
  specs: RoomSpecs
  createdAt: string
  optionIndex: number
}

const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

interface ProjectsViewProps {
  projects: SavedProject[]
  activeProjectId: string
  onOpen: (id: string) => void
  onDelete: (id: string) => void
  onNew: () => void
}

export function ProjectsView({ projects, activeProjectId, onOpen, onDelete, onNew }: ProjectsViewProps) {
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {projects.map((project) => {
        const response = generateDesigns(project.specs)
        const option = response.options[project.optionIndex]
        const isActive = project.id === activeProjectId
        const committed = option.budget.total_estimated_cost + option.budget.contingency_reserved

        return (
          <li
            key={project.id}
            className={`flex flex-col rounded-xl border bg-card p-5 shadow-sm transition-colors ${
              isActive ? 'border-primary ring-1 ring-primary/30' : 'border-border hover:border-primary/40'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {ROOM_TYPE_LABELS[project.specs.roomType]}
                </p>
                <h3 className="mt-0.5 truncate text-base font-semibold tracking-tight">{project.name}</h3>
              </div>
              {isActive ? (
                <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-[11px] font-medium text-primary-foreground">
                  Active
                </span>
              ) : null}
            </div>

            <div className="mt-4 flex h-8 overflow-hidden rounded-md" aria-hidden="true">
              {option.aesthetic.color_swatches.map((s) => (
                <span key={s.role} className="flex-1" style={{ backgroundColor: s.hex }} />
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {option.option_name} {'·'} {option.aesthetic.decor_style_name}
            </p>

            <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4 text-sm">
              <div>
                <dt className="text-[11px] text-muted-foreground">Size</dt>
                <dd className="font-medium tabular-nums">
                  {project.specs.lengthFt}
                  {'×'}
                  {project.specs.widthFt} ft
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Footprints className="size-3" aria-hidden="true" />
                  Walk
                </dt>
                <dd className="font-medium tabular-nums">{option.ergonomics.walkability_score}</dd>
              </div>
              <div>
                <dt className="text-[11px] text-muted-foreground">Committed</dt>
                <dd className="font-medium tabular-nums">{formatUsdFromInr(committed)}</dd>
              </div>
            </dl>

            <div className="mt-5 flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="size-3.5" aria-hidden="true" />
                {dateFormat.format(new Date(project.createdAt))}
              </span>
              <button
                type="button"
                onClick={() => onDelete(project.id)}
                disabled={projects.length === 1}
                className="ml-auto flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:pointer-events-none disabled:opacity-40"
              >
                <Trash2 className="size-4" aria-hidden="true" />
                <span className="sr-only">Delete {project.name}</span>
              </button>
              <button
                type="button"
                onClick={() => onOpen(project.id)}
                className="flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                Open
                <ArrowRight className="size-3.5" aria-hidden="true" />
                <span className="sr-only">{project.name}</span>
              </button>
            </div>
          </li>
        )
      })}

      <li>
        <button
          type="button"
          onClick={onNew}
          className="flex h-full min-h-60 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card/50 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-secondary">
            <Plus className="size-5" aria-hidden="true" />
          </span>
          New room blueprint
        </button>
      </li>
    </ul>
  )
}
