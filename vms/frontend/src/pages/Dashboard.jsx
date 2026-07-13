import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Car, CheckCircle2, Wrench, AlertTriangle, DollarSign } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { vehicleApi } from '../api/vehicleApi.js'
import StatCard from '../components/StatCard.jsx'
import { formatCurrency, formatDate, daysUntil, TYPE_LABELS } from '../utils/format.js'

const PIE_COLORS = ['#F2A93B', '#3E8E7E', '#3E6E9E', '#D64545', '#8B5FBF', '#4C4F54']

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    vehicleApi
      .dashboardStats()
      .then((res) => mounted && setStats(res.data.data))
      .catch(() => mounted && setError('Could not load dashboard stats. Is the backend running on :8080?'))
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return <div className="p-8 text-asphalt-700/60 font-mono text-sm">Loading fleet data…</div>
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-route-red/10 border border-route-red/30 text-route-red rounded-md p-4 text-sm">
          {error}
        </div>
      </div>
    )
  }

  const typeData = Object.entries(stats.countByType || {}).map(([name, value]) => ({
    name: TYPE_LABELS[name] || name,
    value,
  }))

  const statusData = [
    { name: 'Active', value: stats.activeVehicles },
    { name: 'Inactive', value: stats.inactiveVehicles },
    { name: 'Maintenance', value: stats.underMaintenanceVehicles },
    { name: 'Sold', value: stats.soldVehicles },
  ]

  return (
    <div className="p-8 max-w-7xl">
      <header className="mb-8">
        <div className="text-xs uppercase tracking-[0.2em] text-signal-600 font-semibold mb-1">Fleet Overview</div>
        <h1 className="font-display text-4xl">Dashboard</h1>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Vehicles" value={stats.totalVehicles} icon={Car} accent="signal" />
        <StatCard label="Active" value={stats.activeVehicles} icon={CheckCircle2} accent="teal" />
        <StatCard label="In Maintenance" value={stats.underMaintenanceVehicles} icon={Wrench} accent="blue" />
        <StatCard label="Maintenance Spend" value={formatCurrency(stats.totalMaintenanceCost)} icon={DollarSign} accent="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-asphalt-700/10 p-5 shadow-sm">
          <h2 className="font-display text-xl mb-4">Fleet by Type</h2>
          {typeData.length === 0 ? (
            <p className="text-sm text-asphalt-700/50">No vehicles yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={typeData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {typeData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-lg border border-asphalt-700/10 p-5 shadow-sm">
          <h2 className="font-display text-xl mb-4">Fleet by Status</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eae8e2" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#F2A93B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-asphalt-700/10 shadow-sm">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-asphalt-700/10">
          <AlertTriangle size={18} className="text-signal-600" />
          <h2 className="font-display text-xl">Insurance Expiring Within 30 Days</h2>
        </div>
        {stats.insuranceExpiringSoon.length === 0 ? (
          <p className="p-5 text-sm text-asphalt-700/50">Nothing expiring soon. You're clear.</p>
        ) : (
          <ul className="divide-y divide-asphalt-700/10">
            {stats.insuranceExpiringSoon.map((v) => {
              const days = daysUntil(v.insuranceExpiryDate)
              return (
                <li key={v.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <Link to={`/vehicles/${v.id}`} className="font-medium hover:text-signal-600">
                      {v.brand} {v.model}
                    </Link>
                    <div className="text-xs text-asphalt-700/50">{v.owner}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="plate">{v.registrationNumber}</span>
                    <span className={`text-xs font-medium ${days <= 7 ? 'text-route-red' : 'text-signal-600'}`}>
                      {days <= 0 ? 'Expired' : `${days}d left`} · {formatDate(v.insuranceExpiryDate)}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
