import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Layers } from 'lucide-react'
import { ImageGenerator } from '@/components/studio/image-generator'

export const metadata: Metadata = {
  title: 'Image Studio · DERE AI',
  description: 'Generate interior design images from a text prompt with Gemini 3 Pro Image.',
}

export default function StudioPage() {
  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-card/90 backdrop-blur">
        <div className="flex h-14 items-center gap-3 px-4 md:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Layers className="size-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold tracking-tight">DERE AI</span>
          </Link>
          <Link
            href="/"
            className="ml-auto flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:px-6">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium uppercase tracking-wider text-accent">Image Studio</p>
          <h1 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">
            Generate images from a prompt
          </h1>
          <p className="text-sm text-muted-foreground">Powered by Gemini 3 Pro Image via Vercel AI Gateway.</p>
        </div>
        <ImageGenerator />
      </main>
    </div>
  )
}
