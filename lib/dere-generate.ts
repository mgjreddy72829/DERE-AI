import type {
  Aesthetic,
  BudgetLine,
  ClearanceCheck,
  ColorSwatch,
  DesignOption,
  DesignResponse,
  OptionName,
  RoomSpecs,
  RoomType,
  SpatialFlowRule,
} from './dere-types'

export const MM_PER_FT = 304.8
export const INR_PER_USD = 83
export const CONTINGENCY_PERCENT = 10

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  bedroom: 'Bedroom',
  living_room: 'Living Room',
  kitchen: 'Kitchen',
  study_room: 'Study Room',
  guest_room: 'Guest Room',
}

interface FurnitureSpec {
  name: string
  width: number
  depth: number
  weight: number
  labor: 'DIY' | 'Pro'
}

const FURNITURE: Record<RoomType, FurnitureSpec[]> = {
  bedroom: [
    { name: 'Queen Bed Frame', width: 1600, depth: 2050, weight: 5, labor: 'Pro' },
    { name: 'Wardrobe', width: 1500, depth: 600, weight: 4, labor: 'Pro' },
    { name: 'Nightstand', width: 450, depth: 400, weight: 1, labor: 'DIY' },
    { name: 'Dresser', width: 1000, depth: 450, weight: 2, labor: 'DIY' },
    { name: 'Reading Chair', width: 700, depth: 750, weight: 2, labor: 'DIY' },
  ],
  living_room: [
    { name: '3-Seater Sofa', width: 2100, depth: 900, weight: 5, labor: 'DIY' },
    { name: 'Coffee Table', width: 1100, depth: 600, weight: 2, labor: 'DIY' },
    { name: 'TV Console', width: 1800, depth: 400, weight: 3, labor: 'Pro' },
    { name: 'Accent Armchair', width: 750, depth: 800, weight: 2, labor: 'DIY' },
    { name: 'Bookshelf', width: 900, depth: 350, weight: 2, labor: 'Pro' },
  ],
  kitchen: [
    { name: 'Base Cabinet Run', width: 2400, depth: 600, weight: 6, labor: 'Pro' },
    { name: 'Countertop', width: 2400, depth: 620, weight: 4, labor: 'Pro' },
    { name: 'Tall Pantry Unit', width: 600, depth: 600, weight: 2, labor: 'Pro' },
    { name: 'Breakfast Table', width: 900, depth: 700, weight: 2, labor: 'DIY' },
    { name: 'Kitchen Island', width: 1200, depth: 800, weight: 4, labor: 'Pro' },
  ],
  study_room: [
    { name: 'Work Desk', width: 1400, depth: 700, weight: 3, labor: 'DIY' },
    { name: 'Task Chair', width: 650, depth: 650, weight: 3, labor: 'DIY' },
    { name: 'Bookcase', width: 900, depth: 350, weight: 2, labor: 'Pro' },
    { name: 'Filing Cabinet', width: 450, depth: 600, weight: 1, labor: 'DIY' },
    { name: 'Lounge Chair', width: 750, depth: 800, weight: 2, labor: 'DIY' },
  ],
  guest_room: [
    { name: 'Sofa Bed', width: 1900, depth: 950, weight: 4, labor: 'DIY' },
    { name: 'Compact Wardrobe', width: 1000, depth: 550, weight: 3, labor: 'Pro' },
    { name: 'Side Table', width: 450, depth: 450, weight: 1, labor: 'DIY' },
    { name: 'Luggage Bench', width: 900, depth: 400, weight: 1, labor: 'DIY' },
    { name: 'Writing Desk', width: 1000, depth: 500, weight: 2, labor: 'DIY' },
  ],
}

interface TierSpec {
  name: OptionName
  styleSuffix: string
  furnitureCount: number
  budgetShare: number
  finish: string
  swatches: Aesthetic['color_swatches']
  extras: { name: string; weight: number; labor: 'DIY' | 'Pro' }[]
}

const swatch = (role: ColorSwatch['role'], hex: string, label: string): ColorSwatch => ({ role, hex, label })

const TIERS: TierSpec[] = [
  {
    name: 'Budget-Friendly Minimalist',
    styleSuffix: 'Scandi Minimal',
    furnitureCount: 3,
    budgetShare: 0.62,
    finish: 'Laminated birch ply',
    swatches: [
      swatch('primary', '#F2EEE7', 'Chalk White'),
      swatch('secondary', '#D6CFC4', 'Oat Linen'),
      swatch('accent', '#3A3A38', 'Graphite'),
      swatch('neutral', '#A9A398', 'Pebble Grey'),
    ],
    extras: [
      { name: 'Interior Wall Paint', weight: 2, labor: 'DIY' },
      { name: 'LED Ceiling Fixtures', weight: 1, labor: 'DIY' },
    ],
  },
  {
    name: 'Balanced Aesthetic',
    styleSuffix: 'Warm Japandi',
    furnitureCount: 4,
    budgetShare: 0.84,
    finish: 'Solid oak veneer',
    swatches: [
      swatch('primary', '#E7DED2', 'Rice Paper'),
      swatch('secondary', '#8C9B84', 'Sage Leaf'),
      swatch('accent', '#B5653F', 'Terracotta'),
      swatch('neutral', '#3D3833', 'Charred Wood'),
    ],
    extras: [
      { name: 'Limewash Feature Wall', weight: 2, labor: 'Pro' },
      { name: 'Layered Lighting Kit', weight: 2, labor: 'Pro' },
      { name: 'Textiles & Rug', weight: 1, labor: 'DIY' },
    ],
  },
  {
    name: 'Premium Ergonomic',
    styleSuffix: 'Modern Luxe',
    furnitureCount: 5,
    budgetShare: 0.97,
    finish: 'Walnut with brushed brass',
    swatches: [
      swatch('primary', '#1F2B2F', 'Deep Slate'),
      swatch('secondary', '#C8B69B', 'Travertine'),
      swatch('accent', '#A47A4E', 'Aged Brass'),
      swatch('neutral', '#EEE9E2', 'Porcelain'),
    ],
    extras: [
      { name: 'Engineered Wood Flooring', weight: 4, labor: 'Pro' },
      { name: 'Smart Dimmable Lighting', weight: 3, labor: 'Pro' },
      { name: 'Acoustic Wall Panels', weight: 2, labor: 'Pro' },
      { name: 'Custom Window Treatments', weight: 1, labor: 'Pro' },
    ],
  },
]

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n))
const round2 = (n: number) => Math.round(n * 100) / 100

function buildOption(specs: RoomSpecs, tier: TierSpec, maxBudgetInr: number): DesignOption {
  const lengthMm = Math.round(specs.lengthFt * MM_PER_FT)
  const widthMm = Math.round(specs.widthFt * MM_PER_FT)
  const shortSide = Math.min(lengthMm, widthMm)
  const area = lengthMm * widthMm

  const furniture = FURNITURE[specs.roomType].slice(0, tier.furnitureCount)
  const footprint = furniture.reduce((sum, f) => sum + f.width * f.depth, 0)
  const coverage = clamp(footprint / area)
  const deepest = Math.max(...furniture.map((f) => f.depth))

  const circulationActual = Math.max(0, Math.round(shortSide - deepest - 600 * (tier.furnitureCount > 3 ? 1 : 0.5)))
  const doorActual = Math.max(0, Math.round(950 - specs.doors * 40 - coverage * 300))
  const sideActual = Math.max(0, Math.round((shortSide - deepest) / 2 - 150))
  const windowActual = Math.max(0, Math.round(1200 - coverage * 900 - Math.max(0, 2 - specs.windows) * 150))

  const clearance_checks: ClearanceCheck[] = [
    { check_name: 'Primary circulation path', required_mm: 900, actual_mm: circulationActual, passed: circulationActual >= 900 },
    { check_name: 'Door swing clearance', required_mm: 800, actual_mm: doorActual, passed: doorActual >= 800 },
    { check_name: 'Furniture side access', required_mm: 600, actual_mm: sideActual, passed: sideActual >= 600 },
    { check_name: 'Window approach zone', required_mm: 750, actual_mm: windowActual, passed: windowActual >= 750 },
  ]

  const passedCount = clearance_checks.filter((c) => c.passed).length
  const connectivity = round2(clamp(1 - (specs.doors - 1) * 0.07 - coverage * 0.35))
  const path_efficiency = round2(clamp(1 - coverage * 0.9))
  const clearance_compliance = round2(passedCount / clearance_checks.length)
  const walkability_score = Math.round(100 * (0.35 * connectivity + 0.35 * path_efficiency + 0.3 * clearance_compliance))

  const spatial_flow_rules: SpatialFlowRule[] = [
    {
      rule_id: 'CIR-01',
      description: 'Continuous 900 mm path from entry to the furthest window',
      satisfied: clearance_checks[0].passed,
    },
    {
      rule_id: 'DOR-01',
      description: `No furniture inside the swing arc of ${specs.doors} door${specs.doors === 1 ? '' : 's'}`,
      satisfied: clearance_checks[1].passed,
    },
    {
      rule_id: 'DAY-01',
      description: `Daylight kept clear across ${specs.windows} window${specs.windows === 1 ? '' : 's'}`,
      satisfied: specs.windows > 0 && clearance_checks[3].passed,
    },
    {
      rule_id: 'ERG-01',
      description: 'Floor coverage stays below 45% for comfortable movement',
      satisfied: coverage < 0.45,
    },
  ]

  const availableInr = maxBudgetInr / (1 + CONTINGENCY_PERCENT / 100)
  const targetInr = availableInr * tier.budgetShare
  const lines = [
    ...furniture.map((f) => ({ name: f.name, weight: f.weight, labor: f.labor })),
    ...tier.extras,
  ]
  const totalWeight = lines.reduce((s, l) => s + l.weight, 0)
  const itemized_table: BudgetLine[] = lines.map((l) => ({
    item_name: l.name,
    estimated_cost: Math.round((targetInr * l.weight) / totalWeight / 100) * 100,
    labor_category: l.labor,
  }))
  const total_estimated_cost = itemized_table.reduce((s, l) => s + l.estimated_cost, 0)
  const contingency_reserved = Math.round(total_estimated_cost * (CONTINGENCY_PERCENT / 100))
  const areaFactor = clamp((specs.lengthFt * specs.widthFt) / 150, 0.6, 3)
  const laborDays = itemized_table.reduce((d, l) => d + (l.labor_category === 'Pro' ? 3 : 1), 0)

  return {
    option_name: tier.name,
    aesthetic: {
      decor_style_name: `${tier.styleSuffix} ${ROOM_TYPE_LABELS[specs.roomType]}`,
      color_swatches: tier.swatches,
      key_furniture_items: furniture.map((f) => ({
        name: f.name,
        footprint_mm: { width: f.width, depth: f.depth },
        material_or_finish: tier.finish,
      })),
    },
    ergonomics: {
      walkability_score,
      score_components: { connectivity, path_efficiency, clearance_compliance },
      spatial_flow_rules,
      clearance_checks,
    },
    budget: {
      currency: 'INR',
      itemized_table,
      total_estimated_cost,
      contingency_reserved,
      within_max_budget: total_estimated_cost + contingency_reserved <= maxBudgetInr,
      total_timeline_days: Math.min(365, Math.max(1, Math.round(laborDays * areaFactor))),
    },
  }
}

export function generateDesigns(specs: RoomSpecs): DesignResponse {
  const maxBudgetInr = Math.round(specs.budgetUsd * INR_PER_USD)
  const [a, b, c] = TIERS.map((tier) => buildOption(specs, tier, maxBudgetInr))

  return {
    app: 'DERE AI',
    schema_version: '1.0.0',
    room_summary: {
      room_type: specs.roomType,
      dimensions_mm: {
        length: Math.round(specs.lengthFt * MM_PER_FT),
        width: Math.round(specs.widthFt * MM_PER_FT),
        ceiling_height: Math.round(specs.ceilingFt * MM_PER_FT),
      },
      max_budget_inr: maxBudgetInr,
      contingency_percent: CONTINGENCY_PERCENT,
    },
    options: [a, b, c],
  }
}

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })

export const formatUsdFromInr = (amountInr: number) => usd.format(amountInr / INR_PER_USD)
export const formatInr = (amountInr: number) => inr.format(amountInr)
export const mmToFtIn = (mm: number) => {
  const totalIn = Math.round(mm / 25.4)
  return `${Math.floor(totalIn / 12)}′ ${totalIn % 12}″`
}
