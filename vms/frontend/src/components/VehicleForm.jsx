import { useState } from 'react'
import { X } from 'lucide-react'
import { TYPE_LABELS, FUEL_LABELS, STATUS_LABELS } from '../utils/format.js'

const empty = {
  model: '',
  brand: '',
  owner: '',
  registrationNumber: '',
  type: 'CAR',
  fuelType: 'PETROL',
  status: 'ACTIVE',
  color: '',
  manufactureYear: new Date().getFullYear(),
  mileage: 0,
  purchaseDate: '',
  insuranceExpiryDate: '',
  notes: '',
}

export default function VehicleForm({ initial, onCancel, onSubmit, submitting, errors }) {
  const [form, setForm] = useState(initial ? { ...empty, ...initial } : empty)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <div className="fixed inset-0 bg-asphalt-950/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-asphalt-700/10 sticky top-0 bg-white">
          <h2 className="font-display text-2xl">{initial ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
          <button onClick={onCancel} className="text-asphalt-700/50 hover:text-asphalt-900">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Brand" error={errors?.brand}>
            <input className="input" required value={form.brand} onChange={(e) => update('brand', e.target.value)} placeholder="Toyota" />
          </Field>
          <Field label="Model" error={errors?.model}>
            <input className="input" required value={form.model} onChange={(e) => update('model', e.target.value)} placeholder="Corolla" />
          </Field>
          <Field label="Owner" error={errors?.owner}>
            <input className="input" required value={form.owner} onChange={(e) => update('owner', e.target.value)} placeholder="Jane Smith" />
          </Field>
          <Field label="Registration Number" error={errors?.registrationNumber}>
            <input
              className="input font-mono uppercase"
              required
              value={form.registrationNumber}
              onChange={(e) => update('registrationNumber', e.target.value.toUpperCase())}
              placeholder="ABC-1234"
            />
          </Field>

          <Field label="Type">
            <select className="input" value={form.type} onChange={(e) => update('type', e.target.value)}>
              {Object.entries(TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </Field>
          <Field label="Fuel Type">
            <select className="input" value={form.fuelType} onChange={(e) => update('fuelType', e.target.value)}>
              {Object.entries(FUEL_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select className="input" value={form.status} onChange={(e) => update('status', e.target.value)}>
              {Object.entries(STATUS_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </Field>
          <Field label="Color">
            <input className="input" value={form.color || ''} onChange={(e) => update('color', e.target.value)} placeholder="White" />
          </Field>

          <Field label="Manufacture Year">
            <input type="number" className="input" value={form.manufactureYear || ''} onChange={(e) => update('manufactureYear', Number(e.target.value))} />
          </Field>
          <Field label="Mileage (km)">
            <input type="number" step="0.1" className="input" value={form.mileage ?? ''} onChange={(e) => update('mileage', Number(e.target.value))} />
          </Field>
          <Field label="Purchase Date">
            <input type="date" className="input" value={form.purchaseDate || ''} onChange={(e) => update('purchaseDate', e.target.value)} />
          </Field>
          <Field label="Insurance Expiry">
            <input type="date" className="input" value={form.insuranceExpiryDate || ''} onChange={(e) => update('insuranceExpiryDate', e.target.value)} />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Notes">
              <textarea className="input" rows={2} value={form.notes || ''} onChange={(e) => update('notes', e.target.value)} placeholder="Optional notes…" />
            </Field>
          </div>

          <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md text-sm font-medium text-asphalt-700 hover:bg-asphalt-700/5">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-md text-sm font-semibold bg-signal-500 text-asphalt-950 hover:bg-signal-400 disabled:opacity-50"
            >
              {submitting ? 'Saving…' : initial ? 'Save Changes' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .input {
          width: 100%;
          border: 1px solid rgba(27,31,36,0.15);
          border-radius: 6px;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
          background: white;
        }
        .input:focus {
          border-color: #F2A93B;
          box-shadow: 0 0 0 3px rgba(242,169,59,0.25);
        }
      `}</style>
    </div>
  )
}

function Field({ label, children, error }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-asphalt-700/70 mb-1">{label}</span>
      {children}
      {error && <span className="block text-xs text-route-red mt-1">{error}</span>}
    </label>
  )
}
