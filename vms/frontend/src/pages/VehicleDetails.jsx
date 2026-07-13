import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Wrench, Trash2 } from 'lucide-react'
import { vehicleApi, maintenanceApi } from '../api/vehicleApi.js'
import MaintenanceForm from '../components/MaintenanceForm.jsx'
import {
  STATUS_STYLES,
  STATUS_LABELS,
  TYPE_LABELS,
  FUEL_LABELS,
  SERVICE_TYPE_LABELS,
  formatDate,
  formatCurrency,
} from '../utils/format.js'

export default function VehicleDetails() {
  const { id } = useParams()
  const [vehicle, setVehicle] = useState(null)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    Promise.all([vehicleApi.getById(id), maintenanceApi.getForVehicle(id)])
      .then(([v, m]) => {
        setVehicle(v.data.data)
        setRecords(m.data.data)
      })
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  async function handleAddRecord(form) {
    setSubmitting(true)
    try {
      await maintenanceApi.add(id, form)
      setShowForm(false)
      load()
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteRecord(recordId) {
    await maintenanceApi.remove(recordId)
    load()
  }

  if (loading || !vehicle) {
    return <div className="p-8 text-asphalt-700/60 font-mono text-sm">Loading vehicle…</div>
  }

  const totalCost = records.reduce((sum, r) => sum + (r.cost || 0), 0)

  return (
    <div className="p-8 max-w-5xl">
      <Link to="/vehicles" className="inline-flex items-center gap-1 text-sm text-asphalt-700/60 hover:text-asphalt-900 mb-4">
        <ArrowLeft size={15} /> Back to Fleet
      </Link>

      <div className="bg-white rounded-lg border border-asphalt-700/10 shadow-sm p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-display text-4xl">{vehicle.brand} {vehicle.model}</h1>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[vehicle.status]}`}>
                {STATUS_LABELS[vehicle.status]}
              </span>
            </div>
            <span className="plate">{vehicle.registrationNumber}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
          <Detail label="Owner" value={vehicle.owner} />
          <Detail label="Type" value={TYPE_LABELS[vehicle.type]} />
          <Detail label="Fuel" value={FUEL_LABELS[vehicle.fuelType] || '—'} />
          <Detail label="Color" value={vehicle.color || '—'} />
          <Detail label="Year" value={vehicle.manufactureYear || '—'} />
          <Detail label="Mileage" value={vehicle.mileage != null ? `${vehicle.mileage} km` : '—'} />
          <Detail label="Purchased" value={formatDate(vehicle.purchaseDate)} />
          <Detail label="Insurance Expiry" value={formatDate(vehicle.insuranceExpiryDate)} />
        </div>

        {vehicle.notes && (
          <div className="mt-5 pt-5 border-t border-asphalt-700/10 text-sm text-asphalt-700/70">
            {vehicle.notes}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-asphalt-700/10 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-asphalt-700/10">
          <div className="flex items-center gap-2">
            <Wrench size={18} className="text-signal-600" />
            <h2 className="font-display text-2xl">Maintenance History</h2>
            <span className="text-xs text-asphalt-700/50 font-mono ml-1">{formatCurrency(totalCost)} total</span>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold bg-signal-500 text-asphalt-950 hover:bg-signal-400"
          >
            <Plus size={15} /> Log Service
          </button>
        </div>

        {records.length === 0 ? (
          <p className="p-6 text-sm text-asphalt-700/50">No maintenance records yet. Log the first service above.</p>
        ) : (
          <ul className="divide-y divide-asphalt-700/10">
            {records.map((r) => (
              <li key={r.id} className="px-6 py-4 flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium">{SERVICE_TYPE_LABELS[r.serviceType] || r.serviceType}</div>
                  <div className="text-xs text-asphalt-700/50 mb-1">
                    {formatDate(r.serviceDate)} · {r.odometerReading != null ? `${r.odometerReading} km` : '—'}
                    {r.nextServiceDue && ` · Next due ${formatDate(r.nextServiceDue)}`}
                  </div>
                  {r.description && <p className="text-sm text-asphalt-700/70">{r.description}</p>}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-sm font-medium">{formatCurrency(r.cost)}</span>
                  <button onClick={() => handleDeleteRecord(r.id)} className="p-1.5 rounded-md hover:bg-route-red/10 text-route-red">
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showForm && (
        <MaintenanceForm submitting={submitting} onCancel={() => setShowForm(false)} onSubmit={handleAddRecord} />
      )}
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-asphalt-700/50 mb-0.5">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  )
}
