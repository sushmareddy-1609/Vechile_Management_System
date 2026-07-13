import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Download, ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react'
import { vehicleApi } from '../api/vehicleApi.js'
import VehicleForm from '../components/VehicleForm.jsx'
import { STATUS_STYLES, STATUS_LABELS, TYPE_LABELS } from '../utils/format.js'

const PAGE_SIZE = 8

export default function VehicleList() {
  const [data, setData] = useState({ content: [], totalPages: 0, totalElements: 0, number: 0 })
  const [keyword, setKeyword] = useState('')
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    vehicleApi
      .search({ keyword: keyword || undefined, type: type || undefined, status: status || undefined, page, size: PAGE_SIZE })
      .then((res) => setData(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [keyword, type, status, page])

  useEffect(() => {
    load()
  }, [load])

  function openAdd() {
    setEditing(null)
    setFormErrors(null)
    setShowForm(true)
  }

  function openEdit(vehicle) {
    setEditing(vehicle)
    setFormErrors(null)
    setShowForm(true)
  }

  async function handleSubmit(form) {
    setSubmitting(true)
    setFormErrors(null)
    try {
      if (editing) {
        await vehicleApi.update(editing.id, form)
      } else {
        await vehicleApi.create(form)
      }
      setShowForm(false)
      load()
    } catch (err) {
      const data = err?.response?.data
      if (data?.data && typeof data.data === 'object') {
        setFormErrors(data.data)
      } else {
        setFormErrors({ registrationNumber: data?.message || 'Something went wrong' })
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    await vehicleApi.remove(deleteTarget.id)
    setDeleteTarget(null)
    load()
  }

  return (
    <div className="p-8 max-w-7xl">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-signal-600 font-semibold mb-1">Registry</div>
          <h1 className="font-display text-4xl">Fleet</h1>
        </div>
        <div className="flex gap-2">
          <a
            href={vehicleApi.exportCsvUrl()}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border border-asphalt-700/20 hover:bg-asphalt-700/5"
          >
            <Download size={16} /> Export CSV
          </a>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold bg-signal-500 text-asphalt-950 hover:bg-signal-400"
          >
            <Plus size={16} /> Add Vehicle
          </button>
        </div>
      </header>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-asphalt-700/40" />
          <input
            className="w-full pl-9 pr-3 py-2 rounded-md border border-asphalt-700/15 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-signal-500/30 focus:border-signal-500"
            placeholder="Search by model, brand, owner, or plate…"
            value={keyword}
            onChange={(e) => {
              setPage(0)
              setKeyword(e.target.value)
            }}
          />
        </div>
        <select
          className="px-3 py-2 rounded-md border border-asphalt-700/15 text-sm bg-white"
          value={type}
          onChange={(e) => {
            setPage(0)
            setType(e.target.value)
          }}
        >
          <option value="">All Types</option>
          {Object.entries(TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select
          className="px-3 py-2 rounded-md border border-asphalt-700/15 text-sm bg-white"
          value={status}
          onChange={(e) => {
            setPage(0)
            setStatus(e.target.value)
          }}
        >
          <option value="">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg border border-asphalt-700/10 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-asphalt-900 text-paper/80 text-left">
              <th className="px-4 py-3 font-medium">Vehicle</th>
              <th className="px-4 py-3 font-medium">Owner</th>
              <th className="px-4 py-3 font-medium">Plate</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-asphalt-700/10">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-asphalt-700/50 font-mono text-xs">Loading…</td></tr>
            ) : data.content.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-asphalt-700/50">No vehicles match your search.</td></tr>
            ) : (
              data.content.map((v) => (
                <tr key={v.id} className="hover:bg-paper/60">
                  <td className="px-4 py-3">
                    <Link to={`/vehicles/${v.id}`} className="font-medium hover:text-signal-600">
                      {v.brand} {v.model}
                    </Link>
                    <div className="text-xs text-asphalt-700/50">{v.manufactureYear} · {v.color || '—'}</div>
                  </td>
                  <td className="px-4 py-3">{v.owner}</td>
                  <td className="px-4 py-3"><span className="plate">{v.registrationNumber}</span></td>
                  <td className="px-4 py-3">{TYPE_LABELS[v.type] || v.type}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[v.status]}`}>
                      {STATUS_LABELS[v.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(v)} className="p-2 rounded-md hover:bg-asphalt-700/10 text-asphalt-700">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => setDeleteTarget(v)} className="p-2 rounded-md hover:bg-route-red/10 text-route-red">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-4 py-3 border-t border-asphalt-700/10 text-sm">
          <span className="text-asphalt-700/50">
            {data.totalElements} vehicle{data.totalElements === 1 ? '' : 's'}
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="p-1.5 rounded-md border border-asphalt-700/15 disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-mono text-xs">
              {data.totalPages === 0 ? 0 : page + 1} / {data.totalPages}
            </span>
            <button
              disabled={page >= data.totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded-md border border-asphalt-700/15 disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <VehicleForm
          initial={editing}
          submitting={submitting}
          errors={formErrors}
          onCancel={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-asphalt-950/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-6 shadow-xl">
            <h3 className="font-display text-2xl mb-2">Delete vehicle?</h3>
            <p className="text-sm text-asphalt-700/70 mb-5">
              This will permanently remove <strong>{deleteTarget.brand} {deleteTarget.model}</strong> ({deleteTarget.registrationNumber}) and its maintenance history.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-md text-sm font-medium hover:bg-asphalt-700/5">
                Cancel
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 rounded-md text-sm font-semibold bg-route-red text-white hover:bg-route-red/90">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
