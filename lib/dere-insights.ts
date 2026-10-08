import type { BudgetLine, RoomSpecs } from './dere-types'

export type MaterialCategory = 'Furniture' | 'Cabinetry & Hardware' | 'Lighting & Electrical' | 'Finishes' | 'Paint'

export type Trade = 'Carpenter' | 'Electrician' | 'Painter' | 'Flooring Installer' | 'Stone Fabricator' | 'Window Fitter'

export const CATEGORY_ORDER: MaterialCategory[] = [
  'Furniture',
  'Cabinetry & Hardware',
  'Lighting & Electrical',
  'Finishes',
  'Paint',
]

interface ItemMeta {
  category: MaterialCategory
  trade?: Trade
  baseLaborHours?: number
  quantity: (ctx: RoomContext) => { qty: number; unit: string }
}

interface RoomContext {
  areaFt2: number
  wallAreaFt2: number
  windows: number
}

const one = () => ({ qty: 1, unit: 'pc' })
const pair = () => ({ qty: 2, unit: 'pcs' })

const ITEM_META: Record<string, ItemMeta> = {
  'Queen Bed Frame': { category: 'Furniture', trade: 'Carpenter', baseLaborHours: 4, quantity: one },
  Wardrobe: { category: 'Furniture', trade: 'Carpenter', baseLaborHours: 10, quantity: one },
  Nightstand: { category: 'Furniture', quantity: pair },
  Dresser: { category: 'Furniture', quantity: one },
  'Reading Chair': { category: 'Furniture', quantity: one },
  '3-Seater Sofa': { category: 'Furniture', quantity: one },
  'Coffee Table': { category: 'Furniture', quantity: one },
  'TV Console': { category: 'Furniture', trade: 'Carpenter', baseLaborHours: 6, quantity: one },
  'Accent Armchair': { category: 'Furniture', quantity: pair },
  Bookshelf: { category: 'Furniture', trade: 'Carpenter', baseLaborHours: 5, quantity: one },
  'Base Cabinet Run': {
    category: 'Cabinetry & Hardware',
    trade: 'Carpenter',
    baseLaborHours: 16,
    quantity: () => ({ qty: 8, unit: 'lin ft' }),
  },
  Countertop: {
    category: 'Cabinetry & Hardware',
    trade: 'Stone Fabricator',
    baseLaborHours: 8,
    quantity: () => ({ qty: 16, unit: 'ft²' }),
  },
  'Tall Pantry Unit': { category: 'Cabinetry & Hardware', trade: 'Carpenter', baseLaborHours: 6, quantity: one },
  'Breakfast Table': { category: 'Furniture', quantity: one },
  'Kitchen Island': { category: 'Cabinetry & Hardware', trade: 'Carpenter', baseLaborHours: 12, quantity: one },
  'Work Desk': { category: 'Furniture', quantity: one },
  'Task Chair': { category: 'Furniture', quantity: one },
  Bookcase: { category: 'Furniture', trade: 'Carpenter', baseLaborHours: 5, quantity: one },
  'Filing Cabinet': { category: 'Cabinetry & Hardware', quantity: one },
  'Lounge Chair': { category: 'Furniture', quantity: one },
  'Sofa Bed': { category: 'Furniture', quantity: one },
  'Compact Wardrobe': { category: 'Furniture', trade: 'Carpenter', baseLaborHours: 6, quantity: one },
  'Side Table': { category: 'Furniture', quantity: pair },
  'Luggage Bench': { category: 'Furniture', quantity: one },
  'Writing Desk': { category: 'Furniture', quantity: one },
  'Interior Wall Paint': {
    category: 'Paint',
    quantity: (c) => ({ qty: Math.max(1, Math.ceil((c.wallAreaFt2 * 2) / 350)), unit: 'gal' }),
  },
  'Limewash Feature Wall': {
    category: 'Paint',
    trade: 'Painter',
    baseLaborHours: 10,
    quantity: (c) => ({ qty: Math.max(1, Math.ceil((c.wallAreaFt2 * 0.3 * 2) / 250)), unit: 'gal' }),
  },
  'LED Ceiling Fixtures': {
    category: 'Lighting & Electrical',
    quantity: (c) => ({ qty: Math.max(2, Math.ceil(c.areaFt2 / 50)), unit: 'pcs' }),
  },
  'Layered Lighting Kit': {
    category: 'Lighting & Electrical',
    trade: 'Electrician',
    baseLaborHours: 8,
    quantity: (c) => ({ qty: Math.max(3, Math.ceil(c.areaFt2 / 35)), unit: 'pcs' }),
  },
  'Smart Dimmable Lighting': {
    category: 'Lighting & Electrical',
    trade: 'Electrician',
    baseLaborHours: 12,
    quantity: (c) => ({ qty: Math.max(4, Math.ceil(c.areaFt2 / 30)), unit: 'pcs' }),
  },
  'Textiles & Rug': { category: 'Finishes', quantity: () => ({ qty: 1, unit: 'set' }) },
  'Engineered Wood Flooring': {
    category: 'Finishes',
    trade: 'Flooring Installer',
    baseLaborHours: 14,
    quantity: (c) => ({ qty: Math.ceil(c.areaFt2 * 1.1), unit: 'ft²' }),
  },
  'Acoustic Wall Panels': {
    category: 'Finishes',
    trade: 'Carpenter',
    baseLaborHours: 6,
    quantity: (c) => ({ qty: Math.max(4, Math.ceil(c.wallAreaFt2 / 60)), unit: 'panels' }),
  },
  'Custom Window Treatments': {
    category: 'Finishes',
    trade: 'Window Fitter',
    baseLaborHours: 3,
    quantity: (c) => ({ qty: Math.max(1, c.windows), unit: c.windows === 1 ? 'window' : 'windows' }),
  },
}

/** Share of each pro line item that goes to labor rather than materials. */
const LABOR_SHARE: Record<Trade, number> = {
  Carpenter: 0.3,
  Electrician: 0.45,
  Painter: 0.55,
  'Flooring Installer': 0.35,
  'Stone Fabricator': 0.25,
  'Window Fitter': 0.2,
}

export const TRADE_ORDER: Trade[] = [
  'Carpenter',
  'Electrician',
  'Painter',
  'Flooring Installer',
  'Stone Fabricator',
  'Window Fitter',
]

const HOURS_PER_DAY = 8

function roomContext(specs: RoomSpecs): RoomContext {
  const areaFt2 = specs.lengthFt * specs.widthFt
  const wallAreaFt2 = 2 * (specs.lengthFt + specs.widthFt) * specs.ceilingFt
  return { areaFt2, wallAreaFt2, windows: specs.windows }
}

function metaFor(name: string): ItemMeta {
  return ITEM_META[name] ?? { category: 'Furniture', quantity: one }
}

export interface MaterialItem {
  item_name: string
  category: MaterialCategory
  quantity: number
  unit: string
  estimated_cost: number
  sourcing: 'DIY' | 'Buy'
}

export function buildMaterials(lines: BudgetLine[], specs: RoomSpecs): MaterialItem[] {
  const ctx = roomContext(specs)
  return lines.map((line) => {
    const meta = metaFor(line.item_name)
    const { qty, unit } = meta.quantity(ctx)
    return {
      item_name: line.item_name,
      category: meta.category,
      quantity: qty,
      unit,
      estimated_cost: line.estimated_cost,
      sourcing: line.labor_category === 'DIY' ? 'DIY' : 'Buy',
    }
  })
}

export interface LaborTask {
  item_name: string
  trade: Trade
  labor_hours: number
  labor_days: number
  labor_cost: number
  material_cost: number
}

export function buildLaborTasks(lines: BudgetLine[], specs: RoomSpecs): LaborTask[] {
  const areaScale = Math.min(2.5, Math.max(0.7, (specs.lengthFt * specs.widthFt) / 150))
  return lines
    .filter((line) => line.labor_category === 'Pro')
    .map((line) => {
      const meta = metaFor(line.item_name)
      const trade = meta.trade ?? 'Carpenter'
      const labor_hours = Math.round((meta.baseLaborHours ?? 4) * areaScale)
      const labor_cost = Math.round((line.estimated_cost * LABOR_SHARE[trade]) / 100) * 100
      return {
        item_name: line.item_name,
        trade,
        labor_hours,
        labor_days: Math.max(1, Math.ceil(labor_hours / HOURS_PER_DAY)),
        labor_cost,
        material_cost: line.estimated_cost - labor_cost,
      }
    })
}
