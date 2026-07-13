import client from './client'

export const vehicleApi = {
  search: (params) => client.get('/vehicles', { params }),
  getById: (id) => client.get(`/vehicles/${id}`),
  create: (data) => client.post('/vehicles', data),
  update: (id, data) => client.put(`/vehicles/${id}`, data),
  remove: (id) => client.delete(`/vehicles/${id}`),
  dashboardStats: () => client.get('/vehicles/dashboard/stats'),
  exportCsvUrl: () => `${client.defaults.baseURL}/vehicles/export/csv`,
}

export const maintenanceApi = {
  getForVehicle: (vehicleId) => client.get(`/vehicles/${vehicleId}/maintenance`),
  add: (vehicleId, data) => client.post(`/vehicles/${vehicleId}/maintenance`, data),
  update: (recordId, data) => client.put(`/maintenance/${recordId}`, data),
  remove: (recordId) => client.delete(`/maintenance/${recordId}`),
  totalCost: (vehicleId) => client.get(`/vehicles/${vehicleId}/maintenance/total-cost`),
}
