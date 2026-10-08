import { generateImage } from 'ai'

export const maxDuration = 120

const MODEL = 'google/gemini-3-pro-image'
const ASPECT_RATIOS = ['1:1', '16:9', '9:16', '4:3', '3:4', '3:2'] as const
type AspectRatio = (typeof ASPECT_RATIOS)[number]
const MAX_PROMPT_LENGTH = 1000

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const { prompt, aspectRatio } = (body ?? {}) as { prompt?: unknown; aspectRatio?: unknown }
  const cleanPrompt = typeof prompt === 'string' ? prompt.trim() : ''

  if (!cleanPrompt || cleanPrompt.length > MAX_PROMPT_LENGTH) {
    return Response.json(
      { error: `Prompt must be between 1 and ${MAX_PROMPT_LENGTH} characters.` },
      { status: 400 },
    )
  }
  if (!ASPECT_RATIOS.includes(aspectRatio as AspectRatio)) {
    return Response.json({ error: 'Unsupported aspect ratio.' }, { status: 400 })
  }

  try {
    const { image } = await generateImage({
      model: MODEL,
      prompt: cleanPrompt,
      aspectRatio: aspectRatio as AspectRatio,
    })

    return Response.json({
      image: image.base64,
      mediaType: image.mediaType,
    })
  } catch (err) {
    console.error('[api/generate]', err)
    const message = err instanceof Error ? err.message : ''
    if (/credit card/i.test(message)) {
      return Response.json(
        {
          error:
            'AI Gateway needs a credit card on file for your Vercel team to unlock free credits. Add one in Vercel → AI Gateway, then try again.',
        },
        { status: 402 },
      )
    }
    return Response.json({ error: 'Image generation failed. Please try again.' }, { status: 502 })
  }
}
