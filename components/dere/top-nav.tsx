import { Bell, HelpCircle, Layers } from 'lucide-react'

export const NAV_TABS = ['Dashboard', 'Projects', 'Materials', 'Contractors'] as const
export type NavTab = (typeof NAV_TABS)[number]

interface TopNavProps {
  activeTab: NavTab
  onTabChange: (tab: NavTab) => void
}

export function TopNav({ activeTab, onTabChange }: TopNavProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card/90 backdrop-blur">
      <div className="flex h-14 items-center gap-3 px-4 md:gap-6 md:px-6">
        <button
          type="button"
          onClick={() => onTabChange('Dashboard')}
          className="flex shrink-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-label="DERE AI home"
        >
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Layers className="size-4" aria-hidden="true" />
          </span>
          <span className="hidden text-sm font-semibold tracking-tight sm:inline">DERE AI</span>
        </button>

        <nav aria-label="Primary" className="min-w-0 overflow-x-auto">
          <ul className="flex items-center gap-1">
            {NAV_TABS.map((tab) => {
              const active = tab === activeTab
              return (
                <li key={tab}>
                  <button
                    type="button"
                    onClick={() => onTabChange(tab)}
                    aria-current={active ? 'page' : undefined}
                    className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                      active
                        ? 'bg-secondary font-medium text-foreground'
                        : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                    }`}
                  >
                    {tab}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1">
          <button
            type="button"
            className="hidden size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:flex"
          >
            <HelpCircle className="size-4" aria-hidden="true" />
            <span className="sr-only">Help</span>
          </button>
          <button
            type="button"
            className="hidden size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:flex"
          >
            <Bell className="size-4" aria-hidden="true" />
            <span className="sr-only">Notifications</span>
          </button>
          <span
            className="ml-2 flex size-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground"
            aria-label="Signed in as Aria Rao"
          >
            AR
          </span>
        </div>
      </div>
    </header>
  )
}
