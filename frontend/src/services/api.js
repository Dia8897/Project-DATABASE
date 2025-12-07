import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5050/api',  // Use proxy in dev
});

// Add request interceptor for auth token if needed
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


export const adminAPI = {
  // Stats
  getStats: () => api.get('/admins/stats'),

  // Event requests
  getEventRequests: () => api.get('/admins/event-requests'),
  approveEventRequest: (id) => api.put(`/admins/event-requests/${id}/approve`),
  rejectEventRequest: (id) => api.put(`/admins/event-requests/${id}/reject`),

  // Host applications (event applications)
  getHostApplications: () => api.get('/applications'),
  getApplicationsForEvent: (eventId) => api.get(`/applications/event/${eventId}`),
  approveHostApplication: (id, assignedRole) => api.put(`/applications/${id}`, { status: 'accepted', assignedRole }),
  rejectHostApplication: (id) => api.put(`/applications/${id}`, { status: 'rejected' })
};

export const userAPI = {
  getUser: (id) => api.get(`/users/${id}`),
};

export default api;
