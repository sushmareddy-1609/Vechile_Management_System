export default function StatCard({ label, value, icon: Icon, accent = 'signal' }) {
  const accentMap = {
    signal: 'text-signal-600 bg-signal-500/10',
    teal: 'text-route-teal bg-route-teal/10',
    red: 'text-route-red bg-route-red/10',
    blue: 'text-route-blue bg-route-blue/10',
  }

  return (
    <div className="bg-white rounded-lg border border-asphalt-700/10 p-5 flex items-center justify-between shadow-sm">
      <div>
        <div className="text-xs uppercase tracking-wider text-asphalt-700/60 font-medium mb-1">{label}</div>
        <div className="font-display text-4xl leading-none">{value}</div>
      </div>
      {Icon && (
        <div className={`p-3 rounded-md ${accentMap[accent]}`}>
          <Icon size={22} strokeWidth={2} />
        </div>
      )}
    </div>
  )
}
