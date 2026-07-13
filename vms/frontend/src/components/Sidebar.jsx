import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Car, Signpost } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/vehicles', label: 'Fleet', icon: Car, end: false },
]

export default function Sidebar() {
  return (
    <aside className="w-60 shrink-0 bg-asphalt-900 text-paper flex flex-col min-h-screen">
      <div className="px-5 py-6 flex items-center gap-2 border-b border-asphalt-700">
        <Signpost className="text-signal-500" size={26} strokeWidth={2.2} />
        <div className="leading-none">
          <div className="font-display text-2xl tracking-wide">FleetLog</div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-asphalt-700/0 text-signal-500/80">
            Vehicle Ops
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md font-medium text-sm transition-colors ${
                isActive
                  ? 'bg-signal-500 text-asphalt-950'
                  : 'text-paper/70 hover:bg-asphalt-800 hover:text-paper'
              }`
            }
          >
            <Icon size={18} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-asphalt-700 text-[11px] text-paper/40 font-mono">
        v1.0 · Spring Boot + React
      </div>
    </aside>
  )
}
