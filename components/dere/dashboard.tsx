'use client'

import { useMemo, useState } from 'react'
import type { RoomSpecs } from '@/lib/dere-types'
import { generateDesigns, ROOM_TYPE_LABELS } from '@/lib/dere-generate'
import { TopNav, type NavTab } from './top-nav'
import { InputPanel } from './input-panel'
import { OptionTabs } from './option-tabs'
import { AestheticsCard } from './aesthetics-card'
import { SpatialCard } from './spatial-card'
import { BudgetCard } from './budget-card'
import { RoomPreviewCard } from './room-preview-card'
import { MaterialsView } from './materials-view'
import { ContractorsView } from './contractors-view'
import { ProjectsView, type SavedProject } from './projects-view'
import { ViewHeader } from './view-header'
import { buildLaborTasks } from '@/lib/dere-insights'
import { formatUsdFromInr } from '@/lib/dere-generate'

const DEFAULT_SPECS: RoomSpecs = {
  roomType: 'bedroom',
  lengthFt: 14,
  widthFt: 12,
  ceilingFt: 9,
  doors: 1,
  windows: 2,
  budgetUsd: 8000,
}

const projectName = (specs: RoomSpecs) => `${ROOM_TYPE_LABELS[specs.roomType]} ${specs.lengthFt}×${specs.widthFt}`

const SEED_PROJECTS: SavedProject[] = [
  { id: 'p-1', name: 'Primary Bedroom', specs: DEFAULT_SPECS, createdAt: '2026-10-06T10:00:00Z', optionIndex: 1 },
  {
    id: 'p-2',
    name: 'Family Living Room',
    specs: { roomType: 'living_room', lengthFt: 20, widthFt: 15, ceilingFt: 10, doors: 2, windows: 3, budgetUsd: 18000 },
    createdAt: '2026-09-28T10:00:00Z',
    optionIndex: 2,
  },
  {
    id: 'p-3',
    name: 'Home Study',
    specs: { roomType: 'study_room', lengthFt: 11, widthFt: 10, ceilingFt: 9, doors: 1, windows: 1, budgetUsd: 4500 },
    createdAt: '2026-09-14T10:00:00Z',
    optionIndex: 0,
  },
]

export function Dashboard() {
  const [navTab, setNavTab] = useState<NavTab>('Dashboard')
  const [projects, setProjects] = useState<SavedProject[]>(SEED_PROJECTS)
  const [activeProjectId, setActiveProjectId] = useState(SEED_PROJECTS[0].id)
  const [panelKey, setPanelKey] = useState(0)
  const [previewImages, setPreviewImages] = useState<Record<string, string>>({})

  const activeProject = projects.find((p) => p.id === activeProjectId) ?? projects[0]
  const { specs, optionIndex } = activeProject
  const response = useMemo(() => generateDesigns(specs), [specs])
  const active = response.options[optionIndex]

  const updateActive = (patch: Partial<SavedProject>) =>
    setProjects((prev) => prev.map((p) => (p.id === activeProject.id ? { ...p, ...patch } : p)))

  const handleGenerate = (next: RoomSpecs) => {
    const project: SavedProject = {
      id: crypto.randomUUID(),
      name: projectName(next),
      specs: next,
      createdAt: new Date().toISOString(),
      optionIndex,
    }
    setProjects((prev) => [project, ...prev])
    setActiveProjectId(project.id)
  }

  const openProject = (id: string) => {
    setActiveProjectId(id)
    setPanelKey((k) => k + 1)
    setNavTab('Dashboard')
  }

  const deleteProject = (id: string) => {
    const remaining = projects.filter((p) => p.id !== id)
    if (remaining.length === 0) return
    setProjects(remaining)
    if (id === activeProject.id) {
      setActiveProjectId(remaining[0].id)
      setPanelKey((k) => k + 1)
    }
  }

  const newProject = () => {
    setPanelKey((k) => k + 1)
    setNavTab('Dashboard')
  }

  const projectContext = (
    <>
      {activeProject.name}
      <span className="text-muted-foreground">
        {' · '}
        {active.option_name}
      </span>
    </>
  )

  const optionTabs = (meta?: Parameters<typeof OptionTabs>[0]['meta']) => (
    <OptionTabs
      options={response.options}
      activeIndex={optionIndex}
      onChange={(i) => updateActive({ optionIndex: i })}
      panelId={`${navTab.toLowerCase()}-panel`}
      meta={meta}
    />
  )

  return (
    <div className="min-h-dvh bg-background">
      <TopNav activeTab={navTab} onTabChange={setNavTab} />

      {navTab === 'Dashboard' ? (
        <div className="flex flex-col lg:flex-row">
          <InputPanel key={`${activeProject.id}-${panelKey}`} initialSpecs={specs} onGenerate={handleGenerate} />

          <main className="min-w-0 flex-1 p-4 md:p-6">
            <ViewHeader
              eyebrow="Generated designs"
              title={
                <>
                  {ROOM_TYPE_LABELS[specs.roomType]}
                  <span className="text-muted-foreground">
                    {' · '}
                    {specs.lengthFt} {'×'} {specs.widthFt} ft
                  </span>
                </>
              }
              description={`${specs.doors} ${specs.doors === 1 ? 'door' : 'doors'}, ${specs.windows} ${
                specs.windows === 1 ? 'window' : 'windows'
              }, ${specs.ceilingFt} ft ceiling · ${activeProject.name}`}
            />
            <div className="mt-6">{optionTabs()}</div>
            <div
              id="dashboard-panel"
              role="tabpanel"
              aria-labelledby={`dashboard-panel-tab-${optionIndex}`}
              className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3"
            >
              <AestheticsCard aesthetic={active.aesthetic} />
              <SpatialCard ergonomics={active.ergonomics} />
              <BudgetCard budget={active.budget} maxBudgetInr={response.room_summary.max_budget_inr} />
              <RoomPreviewCard
                option={active}
                specs={specs}
                optionIndex={optionIndex}
                cacheKey={`${activeProject.id}-${optionIndex}-${JSON.stringify(specs)}`}
                images={previewImages}
                onImage={(key, src) => setPreviewImages((prev) => ({ ...prev, [key]: src }))}
                className="lg:col-span-2 2xl:col-span-3"
              />
            </div>
          </main>
        </div>
      ) : (
        <main className="mx-auto w-full max-w-7xl p-4 md:p-6">
          {navTab === 'Projects' ? (
            <>
              <ViewHeader
                eyebrow="Saved blueprints"
                title="Projects"
                description="Every set of room specs you generate is saved here for this session. Open one to load it into the dashboard."
              />
              <div className="mt-6">
                <ProjectsView
                  projects={projects}
                  activeProjectId={activeProject.id}
                  onOpen={openProject}
                  onDelete={deleteProject}
                  onNew={newProject}
                />
              </div>
            </>
          ) : null}

          {navTab === 'Materials' ? (
            <>
              <ViewHeader
                eyebrow="Shopping list"
                title={projectContext}
                description="Materials extracted from the selected design option, grouped by category."
              />
              <div className="mt-6">
                {optionTabs((o) => `${o.budget.itemized_table.length} items · ${formatUsdFromInr(o.budget.total_estimated_cost)}`)}
              </div>
              <div id="materials-panel" role="tabpanel" aria-labelledby={`materials-panel-tab-${optionIndex}`} className="mt-4">
                <MaterialsView option={active} specs={specs} />
              </div>
            </>
          ) : null}

          {navTab === 'Contractors' ? (
            <>
              <ViewHeader
                eyebrow="Pro trades & labor"
                title={projectContext}
                description="Only tasks tagged as Pro trade work, with labor timelines and cost split."
              />
              <div className="mt-6">
                {optionTabs((o) => {
                  const n = buildLaborTasks(o.budget.itemized_table, specs).length
                  return `${n} pro ${n === 1 ? 'task' : 'tasks'}`
                })}
              </div>
              <div id="contractors-panel" role="tabpanel" aria-labelledby={`contractors-panel-tab-${optionIndex}`} className="mt-4">
                <ContractorsView option={active} specs={specs} />
              </div>
            </>
          ) : null}
        </main>
      )}
    </div>
  )
}
