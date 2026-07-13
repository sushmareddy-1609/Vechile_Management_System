import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import VehicleList from './pages/VehicleList.jsx'
import VehicleDetails from './pages/VehicleDetails.jsx'

export default function App() {
  return (
    <div className="min-h-screen flex bg-paper text-asphalt-900">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vehicles" element={<VehicleList />} />
          <Route path="/vehicles/:id" element={<VehicleDetails />} />
        </Routes>
      </main>
    </div>
  )
}
