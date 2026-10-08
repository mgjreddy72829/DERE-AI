import { Check, Footprints, X } from 'lucide-react'
import type { Ergonomics } from '@/lib/dere-types'
import { DashboardCard } from './dashboard-card'

function scoreTone(score: number) {
  if (score >= 75) return { color: 'var(--success)', label: 'Excellent flow' }
  if (score >= 55) return { color: 'var(--warning)', label: 'Workable flow' }
  return { color: 'var(--destructive)', label: 'Congested' }
}

function WalkabilityRing({ score }: { score: number }) {
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - score / 100)
  const tone = scoreTone(score)

  return (
    <div className="flex items-center gap-5">
      <div
        className="relative size-32 shrink-0"
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Walkability score"
      >
        <svg viewBox="0 0 120 120" className="size-full -rotate-90">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--secondary)" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={tone.color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold tabular-nums tracking-tight">{score}</span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">of 100</span>
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Walkability</p>
        <p className="mt-0.5 text-base font-semibold" style={{ color: tone.color }}>
          {tone.label}
        </p>
      </div>
    </div>
  )
}

function ComponentBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">{Math.round(value * 100)}%</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full bg-primary transition-[width] duration-700" style={{ width: `${value * 100}%` }} />
      </div>
    </div>
  )
}

export function SpatialCard({ ergonomics }: { ergonomics: Ergonomics }) {
  const c = ergonomics.score_components

  return (
    <DashboardCard icon={Footprints} title="Spatial Layout" subtitle="Ergonomic flow & clearances">
      <WalkabilityRing score={ergonomics.walkability_score} />

      {c ? (
        <div className="mt-5 flex flex-col gap-3">
          <ComponentBar label="Connectivity" value={c.connectivity} />
          <ComponentBar label="Path efficiency" value={c.path_efficiency} />
          <ComponentBar label="Clearance compliance" value={c.clearance_compliance} />
        </div>
      ) : null}

      <div className="mt-6">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Clearance checks</h4>
        <ul className="mt-2 flex flex-col gap-1.5">
          {ergonomics.clearance_checks.map((check) => (
            <li key={check.check_name} className="flex items-center justify-between gap-2 rounded-md bg-secondary/60 px-2.5 py-2 text-xs">
              <span className="flex min-w-0 items-center gap-2">
                <StatusDot passed={check.passed} />
                <span className="truncate">{check.check_name}</span>
              </span>
              <span className="shrink-0 tabular-nums text-muted-foreground">
                <span className={check.passed ? 'text-foreground' : 'font-medium text-destructive'}>{check.actual_mm}</span>
                {' / '}
                {check.required_mm} mm
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Flow rules</h4>
        <ul className="mt-2 flex flex-col gap-2">
          {ergonomics.spatial_flow_rules.map((rule) => (
            <li key={rule.rule_id} className="flex items-start gap-2 text-xs">
              <StatusDot passed={rule.satisfied} />
              <span className="text-pretty">
                <span className="font-mono text-muted-foreground">{rule.rule_id}</span> {rule.description}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </DashboardCard>
  )
}

function StatusDot({ passed }: { passed: boolean }) {
  return (
    <span
      className={`flex size-4 shrink-0 items-center justify-center rounded-full ${passed ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive'}`}
    >
      {passed ? <Check className="size-2.5" strokeWidth={3} aria-hidden="true" /> : <X className="size-2.5" strokeWidth={3} aria-hidden="true" />}
      <span className="sr-only">{passed ? 'Passed' : 'Failed'}</span>
    </span>
  )
}
