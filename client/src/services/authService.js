import api from './api'

export const login = (email, password) => api.post('/auth/login', { email, password })
export const register = (name, email, password) => api.post('/auth/register', { name, email, password })
export const getMe = () => api.get('/auth/me')
export const updateProfile = (data) => api.put('/auth/profile', data)
export const changePassword = (data) => api.put('/auth/change-password', data)