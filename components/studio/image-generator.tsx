'use client'

import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { AlertCircle, Download, ImageIcon, Loader2, Sparkles } from 'lucide-react'

const ASPECT_RATIOS = [
  { value: '1:1', label: 'Square', w: 1, h: 1 },
  { value: '16:9', label: 'Wide', w: 16, h: 9 },
  { value: '9:16', label: 'Tall', w: 9, h: 16 },
  { value: '4:3', label: 'Classic', w: 4, h: 3 },
  { value: '3:4', label: 'Portrait', w: 3, h: 4 },
  { value: '3:2', label: 'Photo', w: 3, h: 2 },
] as const

type AspectRatio = (typeof ASPECT_RATIOS)[number]['value']

interface GeneratedImage {
  id: string
  src: string
  prompt: string
  aspectRatio: AspectRatio
}

const SUGGESTIONS = [
  'Japandi living room with oak floors, linen sofa and soft morning light',
  'Industrial loft kitchen with matte black fixtures and exposed brick',
  'Calm bedroom in sage green and terracotta with rattan accents',
]

export function ImageGenerator() {
  const [prompt, setPrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1')
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    const text = prompt.trim()
    if (!text || isLoading) return
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, aspectRatio }),
      })
      const data = (await res.json()) as { image?: string; mediaType?: string; error?: string }
      if (!res.ok || !data.image) throw new Error(data.error ?? 'Image generation failed.')
      setImages((prev) => [
        {
          id: crypto.randomUUID(),
          src: `data:${data.mediaType ?? 'image/png'};base64,${data.image}`,
          prompt: text,
          aspectRatio,
        },
        ...prev,
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image generation failed.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    generate()
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== 'Enter' || e.shiftKey) return
    if (e.nativeEvent.isComposing || e.keyCode === 229) return
    e.preventDefault()
    generate()
  }

  const pendingRatio = ASPECT_RATIOS.find((r) => r.value === aspectRatio)!

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-5 rounded-xl border border-border bg-card p-5 lg:sticky lg:top-20 lg:w-96 lg:shrink-0"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="prompt" className="text-sm font-medium">
            Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={1000}
            rows={5}
            placeholder="Describe the image you want to create…"
            className="resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm leading-relaxed placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Enter to generate · Shift+Enter for newline</span>
            <span>{prompt.length}/1000</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setPrompt(s)}
              className="rounded-full border border-border px-3 py-1 text-left text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-medium">Aspect ratio</legend>
          <div className="grid grid-cols-3 gap-2">
            {ASPECT_RATIOS.map((r) => {
              const active = r.value === aspectRatio
              const scale = 18 / Math.max(r.w, r.h)
              return (
                <label
                  key={r.value}
                  className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border px-2 py-2.5 text-xs transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/40 ${
                    active
                      ? 'border-primary bg-primary/5 text-foreground'
                      : 'border-border text-muted-foreground hover:border-primary/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="aspectRatio"
                    value={r.value}
                    checked={active}
                    onChange={() => setAspectRatio(r.value)}
                    className="sr-only"
                  />
                  <span className="flex size-5 items-center justify-center" aria-hidden="true">
                    <span
                      className={`rounded-[3px] border-[1.5px] ${active ? 'border-primary' : 'border-current'}`}
                      style={{ width: r.w * scale, height: r.h * scale }}
                    />
                  </span>
                  <span className="font-medium">{r.value}</span>
                  <span className="sr-only">{r.label}</span>
                </label>
              )
            })}
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={!prompt.trim() || isLoading}
          className="flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Generating…
            </>
          ) : (
            <>
              <Sparkles className="size-4" aria-hidden="true" />
              Generate
            </>
          )}
        </button>

        {error && (
          <div
            role="alert"
            className="flex gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}
      </form>

      <section aria-label="Generated images" aria-busy={isLoading} className="min-w-0 flex-1">
        {images.length === 0 && !isLoading ? (
          <div className="flex min-h-80 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-secondary">
              <ImageIcon className="size-5 text-muted-foreground" aria-hidden="true" />
            </span>
            <p className="text-sm font-medium">No images yet</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Write a prompt, choose an aspect ratio and hit Generate. Results appear here.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {isLoading && (
              <li
                className="flex animate-pulse items-center justify-center rounded-xl border border-border bg-secondary"
                style={{ aspectRatio: `${pendingRatio.w} / ${pendingRatio.h}` }}
              >
                <Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden="true" />
                <span className="sr-only">Generating image</span>
              </li>
            )}
            {images.map((img) => (
              <li key={img.id} className="group overflow-hidden rounded-xl border border-border bg-card">
                {/* eslint-disable-next-line @next/next/no-img-element -- base64 data URL */}
                <img
                  src={img.src}
                  alt={img.prompt}
                  className="w-full object-cover"
                  style={{ aspectRatio: img.aspectRatio.replace(':', ' / ') }}
                />
                <div className="flex items-start gap-2 p-3">
                  <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">
                    {img.prompt}
                  </p>
                  <a
                    href={img.src}
                    download={`image-${img.id.slice(0, 8)}.png`}
                    className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <Download className="size-4" aria-hidden="true" />
                    <span className="sr-only">Download image</span>
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
