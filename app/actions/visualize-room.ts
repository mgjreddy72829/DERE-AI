'use server'

import { generateImage } from 'ai'
import type { RoomSpecs, RoomType } from '@/lib/dere-types'
import { generateDesigns, ROOM_TYPE_LABELS } from '@/lib/dere-generate'

const ROOM_TYPES = Object.keys(ROOM_TYPE_LABELS) as RoomType[]

const inRange = (n: unknown, min: number, max: number) =>
  typeof n === 'number' && Number.isFinite(n) && n >= min && n <= max

function validate(specs: RoomSpecs, optionIndex: number) {
  return (
    ROOM_TYPES.includes(specs.roomType) &&
    inRange(specs.lengthFt, 4, 100) &&
    inRange(specs.widthFt, 4, 100) &&
    inRange(specs.ceilingFt, 6, 30) &&
    inRange(specs.doors, 0, 10) &&
    inRange(specs.windows, 0, 20) &&
    inRange(specs.budgetUsd, 0, 10_000_000) &&
    [0, 1, 2].includes(optionIndex)
  )
}

export type VisualizeResult = { ok: true; src: string } | { ok: false; error: string }

export async function visualizeRoom(specs: RoomSpecs, optionIndex: number): Promise<VisualizeResult> {
  if (!validate(specs, optionIndex)) return { ok: false, error: 'Invalid room specs.' }

  // Rebuild the design server-side so the prompt only ever contains generator output.
  const option = generateDesigns(specs).options[optionIndex]
  const { aesthetic } = option

  const palette = aesthetic.color_swatches
    .map((s) => `${s.role}: ${s.label ?? ''} (${s.hex})`)
    .join('; ')
  const furniture = aesthetic.key_furniture_items
    .map((f) => (f.material_or_finish ? `${f.name} in ${f.material_or_finish}` : f.name))
    .join('; ')

  const prompt = [
    `Photorealistic interior design visualization of a ${ROOM_TYPE_LABELS[specs.roomType].toLowerCase()}, ${aesthetic.decor_style_name} style.`,
    `Room is ${specs.lengthFt} ft by ${specs.widthFt} ft with a ${specs.ceilingFt} ft ceiling, ${specs.doors} door(s) and ${specs.windows} window(s).`,
    `Color palette strictly used on walls, textiles and finishes — ${palette}.`,
    `Furniture and equipment shown: ${furniture}.`,
    'Wide-angle eye-level view from the doorway, natural daylight, realistic proportions, uncluttered, architectural photography, no people, no text.',
  ].join(' ')

  try {
    const { image } = await generateImage({
      model: 'bfl/flux-2-pro',
      prompt,
      aspectRatio: '3:2',
    })
    return { ok: true, src: `data:${image.mediaType};base64,${image.base64}` }
  } catch (err) {
    console.error('[visualizeRoom]', err)
    const message = err instanceof Error ? err.message : ''
    if (/credit card/i.test(message)) {
      return {
        ok: false,
        error: 'AI Gateway needs a credit card on file for your Vercel team to unlock free credits. Add one in Vercel → AI Gateway, then try again.',
      }
    }
    return { ok: false, error: 'Could not generate the preview. Please try again.' }
  }
}
