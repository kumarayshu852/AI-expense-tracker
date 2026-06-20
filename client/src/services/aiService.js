import api from './api'

export const chatWithAI = (message) => api.post('/ai/chat', { message })
export const getAIInsights = () => api.get('/ai/insights')
export const getChatHistory = () => api.get('/ai/history')
export const clearChatHistory = () => api.delete('/ai/history')