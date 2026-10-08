import { Bell, HelpCircle, Layers } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Dashboard', active: true },
  { label: 'Projects', active: false },
  { label: 'Materials', active: false },
  { label: 'Contractors', active: false },
]

export function TopNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card/90 backdrop-blur">
      <div className="flex h-14 items-center gap-6 px-4 md:px-6">
        <a href="#" className="flex items-center gap-2" aria-label="DERE AI home">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Layers className="size-4" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold tracking-tight">DERE AI</span>
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href="#"
                  aria-current={link.active ? 'page' : undefined}
                  className={
                    link.active
                      ? 'rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-foreground'
                      : 'rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground'
                  }
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <HelpCircle className="size-4" aria-hidden="true" />
            <span className="sr-only">Help</span>
          </button>
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
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
