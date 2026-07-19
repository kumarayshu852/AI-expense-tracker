import api from './api'

export const getBillSplits = () => api.get('/billsplit')
export const getBillSplitById = (id) => api.get(`/billsplit/${id}`)
export const createBillSplit = (data) => api.post('/billsplit', data)
export const addExpense = (id, data) => api.post(`/billsplit/${id}/expense`, data)
export const removeExpense = (id, expenseId) => api.delete(`/billsplit/${id}/expense/${expenseId}`)
export const settleBillSplit = (id) => api.put(`/billsplit/${id}/settle`)
export const deleteBillSplit = (id) => api.delete(`/billsplit/${id}`)