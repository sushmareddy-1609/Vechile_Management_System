import { useState } from 'react'
import { X } from 'lucide-react'
import { SERVICE_TYPE_LABELS } from '../utils/format.js'

const empty = {
  serviceDate: new Date().toISOString().slice(0, 10),
  serviceType: 'OIL_CHANGE',
  description: '',
  cost: 0,
  odometerReading: 0,
  nextServiceDue: '',
}

export default function MaintenanceForm({ onCancel, onSubmit, submitting }) {
  const [form, setForm] = useState(empty)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-asphalt-950/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-asphalt-700/10">
          <h2 className="font-display text-2xl">Log Maintenance</h2>
          <button onClick={onCancel} className="text-asphalt-700/50 hover:text-asphalt-900">
            <X size={22} />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit(form)
          }}
          className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <label className="block">
            <span className="block text-xs font-medium text-asphalt-700/70 mb-1">Service Date</span>
            <input type="date" required className="input" value={form.serviceDate} onChange={(e) => update('serviceDate', e.target.value)} />
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-asphalt-700/70 mb-1">Service Type</span>
            <select className="input" value={form.serviceType} onChange={(e) => update('serviceType', e.target.value)}>
              {Object.entries(SERVICE_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-asphalt-700/70 mb-1">Cost ($)</span>
            <input type="number" step="0.01" className="input" value={form.cost} onChange={(e) => update('cost', Number(e.target.value))} />
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-asphalt-700/70 mb-1">Odometer (km)</span>
            <input type="number" step="0.1" className="input" value={form.odometerReading} onChange={(e) => update('odometerReading', Number(e.target.value))} />
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-asphalt-700/70 mb-1">Next Service Due</span>
            <input type="date" className="input" value={form.nextServiceDue} onChange={(e) => update('nextServiceDue', e.target.value)} />
          </label>
          <div className="sm:col-span-2">
            <span className="block text-xs font-medium text-asphalt-700/70 mb-1">Description</span>
            <textarea className="input" rows={2} value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="What was done…" />
          </div>
          <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md text-sm font-medium hover:bg-asphalt-700/5">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-md text-sm font-semibold bg-signal-500 text-asphalt-950 hover:bg-signal-400 disabled:opacity-50"
            >
              {submitting ? 'Saving…' : 'Add Record'}
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
