import api from './api'

export const getDashboardStats = (params = {}) => api.get('/analytics/dashboard', { params })
export const getCategoryBreakdown = (params = {}) => api.get('/analytics/categories', { params })
export const getDailyTrend = (params = {}) => api.get('/analytics/trend', { params })