export type RoomType = 'bedroom' | 'living_room' | 'kitchen' | 'study_room' | 'guest_room'

export type OptionName = 'Budget-Friendly Minimalist' | 'Balanced Aesthetic' | 'Premium Ergonomic'

export type SwatchRole = 'primary' | 'secondary' | 'accent' | 'neutral'

export interface ColorSwatch {
  role: SwatchRole
  hex: string
  label?: string
}

export interface FurnitureItem {
  name: string
  footprint_mm: { width: number; depth: number }
  material_or_finish?: string
}

export interface Aesthetic {
  decor_style_name: string
  color_swatches: [ColorSwatch, ColorSwatch, ColorSwatch, ColorSwatch]
  key_furniture_items: FurnitureItem[]
}

export interface SpatialFlowRule {
  rule_id: string
  description: string
  satisfied: boolean
}

export interface ClearanceCheck {
  check_name: string
  required_mm: number
  actual_mm: number
  passed: boolean
}

export interface Ergonomics {
  walkability_score: number
  score_components?: {
    connectivity: number
    path_efficiency: number
    clearance_compliance: number
  }
  spatial_flow_rules: SpatialFlowRule[]
  clearance_checks: ClearanceCheck[]
}

export interface BudgetLine {
  item_name: string
  estimated_cost: number
  labor_category: 'DIY' | 'Pro'
}

export interface Budget {
  currency: 'INR'
  itemized_table: BudgetLine[]
  total_estimated_cost: number
  contingency_reserved: number
  within_max_budget: boolean
  total_timeline_days: number
}

export interface DesignOption {
  option_name: OptionName
  aesthetic: Aesthetic
  ergonomics: Ergonomics
  budget: Budget
}

export interface DesignResponse {
  app: 'DERE AI'
  schema_version: string
  room_summary: {
    room_type: RoomType
    dimensions_mm: { length: number; width: number; ceiling_height: number }
    max_budget_inr: number
    contingency_percent: number
  }
  options: [DesignOption, DesignOption, DesignOption]
}

export interface RoomSpecs {
  roomType: RoomType
  lengthFt: number
  widthFt: number
  ceilingFt: number
  doors: number
  windows: number
  budgetUsd: number
}
