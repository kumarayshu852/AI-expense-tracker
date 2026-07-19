import api from './api'

export const getHealthScore = () => api.get('/health-score')