export const STATUS_STYLES = {
  ACTIVE: 'bg-route-teal/10 text-route-teal border border-route-teal/30',
  INACTIVE: 'bg-asphalt-700/10 text-asphalt-700 border border-asphalt-700/30',
  UNDER_MAINTENANCE: 'bg-signal-500/10 text-signal-600 border border-signal-500/40',
  SOLD: 'bg-route-red/10 text-route-red border border-route-red/30',
}

export const STATUS_LABELS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  UNDER_MAINTENANCE: 'In Maintenance',
  SOLD: 'Sold',
}

export const TYPE_LABELS = {
  CAR: 'Car',
  TRUCK: 'Truck',
  BUS: 'Bus',
  MOTORCYCLE: 'Motorcycle',
  VAN: 'Van',
  SUV: 'SUV',
}

export const FUEL_LABELS = {
  PETROL: 'Petrol',
  DIESEL: 'Diesel',
  ELECTRIC: 'Electric',
  HYBRID: 'Hybrid',
  CNG: 'CNG',
}

export const SERVICE_TYPE_LABELS = {
  OIL_CHANGE: 'Oil Change',
  TIRE_ROTATION: 'Tire Rotation',
  BRAKE_SERVICE: 'Brake Service',
  GENERAL_INSPECTION: 'General Inspection',
  ENGINE_REPAIR: 'Engine Repair',
  BATTERY_REPLACEMENT: 'Battery Replacement',
  INSURANCE_RENEWAL: 'Insurance Renewal',
  OTHER: 'Other',
}

export function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function formatCurrency(value) {
  if (value === null || value === undefined) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export function daysUntil(dateStr) {
  if (!dateStr) return null
  const today = new Date()
  const target = new Date(dateStr)
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24))
}
