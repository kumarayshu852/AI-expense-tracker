import api from './api'

export const getRecurring = () => api.get('/recurring')
export const createRecurring = (data) => api.post('/recurring', data)
export const toggleRecurring = (id) => api.put(`/recurring/${id}/toggle`)
export const deleteRecurring = (id) => api.delete(`/recurring/${id}`)
export const triggerProcess = () => api.post('/recurring/process')