import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me')
          setUser(res.data.data.user)
        } catch (err) {
          localStorage.removeItem('token')
          setToken(null)
        }
      }
      setLoading(false)
    }
    fetchUser()
  }, [token])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    const { user, token } = res.data.data
    localStorage.setItem('token', token)
    setToken(token)
    setUser(user)
    return user
  }

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password })
    const { user, token } = res.data.data
    localStorage.setItem('token', token)
    setToken(token)
    setUser(user)
    return user
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  // Profile update hone ke baad sidebar/topbar mein naam turant reflect ho jaye, isliye yeh function
  const updateUser = (updatedFields) => {
    setUser((prev) => ({ ...prev, ...updatedFields }))
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export default AuthContext