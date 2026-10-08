'use client'

import { useState, useTransition } from 'react'
import { ImageIcon, Loader2, RefreshCw, Sparkles } from 'lucide-react'
import type { DesignOption, RoomSpecs } from '@/lib/dere-types'
import { visualizeRoom } from '@/app/actions/visualize-room'
import { Button } from '@/components/ui/button'
import { DashboardCard } from './dashboard-card'

interface RoomPreviewCardProps {
  option: DesignOption
  specs: RoomSpecs
  optionIndex: number
  cacheKey: string
  images: Record<string, string>
  onImage: (key: string, src: string) => void
  className?: string
}

export function RoomPreviewCard({ option, specs, optionIndex, cacheKey, images, onImage, className }: RoomPreviewCardProps) {
  const [pendingKey, setPendingKey] = useState<string | null>(null)
  const [error, setError] = useState<{ key: string; message: string } | null>(null)
  const [, startTransition] = useTransition()

  const src = images[cacheKey]
  const isPending = pendingKey === cacheKey
  const errorMessage = error?.key === cacheKey ? error.message : null
  const { aesthetic } = option

  const generate = () => {
    const key = cacheKey
    setPendingKey(key)
    setError(null)
    startTransition(async () => {
      const result = await visualizeRoom(specs, optionIndex)
      if (result.ok) onImage(key, result.src)
      else setError({ key, message: result.error })
      setPendingKey((k) => (k === key ? null : k))
    })
  }

  return (
    <DashboardCard
      icon={ImageIcon}
      title="AI Room Preview"
      subtitle={`${option.option_name} · ${aesthetic.decor_style_name}`}
      className={className}
    >
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg border border-border bg-secondary md:w-3/5">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element -- data URL from the server action
            <img
              src={src}
              alt={`AI-generated preview of the ${aesthetic.decor_style_name} design using the selected palette and furniture`}
              className={`size-full object-cover transition-opacity ${isPending ? 'opacity-40' : ''}`}
            />
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-3 p-6 text-center">
              <div className="flex h-3 w-32 overflow-hidden rounded-full" aria-hidden="true">
                {aesthetic.color_swatches.map((s) => (
                  <span key={s.role} className="flex-1" style={{ backgroundColor: s.hex }} />
                ))}
              </div>
              <p className="max-w-xs text-sm text-muted-foreground">
                {isPending
                  ? 'Rendering your room with this palette and furniture…'
                  : 'See how this room could look once it is designed.'}
              </p>
            </div>
          )}
          {isPending ? (
            <div className="absolute inset-0 flex items-center justify-center" role="status">
              <Loader2 className="size-6 animate-spin text-primary" aria-hidden="true" />
              <span className="sr-only">Generating room preview</span>
            </div>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Palette used</h4>
            <ul className="mt-2 flex flex-wrap gap-2">
              {aesthetic.color_swatches.map((s) => (
                <li key={s.role} className="flex items-center gap-1.5 rounded-full border border-border px-2 py-1 text-xs">
                  <span className="size-3 rounded-full ring-1 ring-black/10" style={{ backgroundColor: s.hex }} aria-hidden="true" />
                  {s.label ?? s.hex}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Furniture & equipment</h4>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {aesthetic.key_furniture_items.map((f) => (
                <li key={f.name} className="rounded-md bg-secondary px-2 py-1 text-xs">
                  {f.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto flex flex-col gap-2">
            <Button onClick={generate} disabled={isPending} className="w-full sm:w-auto sm:self-start">
              {isPending ? (
                <Loader2 className="animate-spin" aria-hidden="true" />
              ) : src ? (
                <RefreshCw aria-hidden="true" />
              ) : (
                <Sparkles aria-hidden="true" />
              )}
              {isPending ? 'Generating…' : src ? 'Regenerate preview' : 'Generate room preview'}
            </Button>
            {errorMessage ? (
              <p className="text-xs text-destructive" role="alert">
                {errorMessage}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">AI concept image — layout and proportions are illustrative.</p>
            )}
          </div>
        </div>
      </div>
    </DashboardCard>
  )
}
