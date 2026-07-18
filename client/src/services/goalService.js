import api from './api'

export const getGoals = () => api.get('/goals')
export const createGoal = (data) => api.post('/goals', data)
export const addToGoal = (id, amount) => api.put(`/goals/${id}/add`, { amount })
export const updateGoal = (id, data) => api.put(`/goals/${id}`, data)
export const deleteGoal = (id) => api.delete(`/goals/${id}`)