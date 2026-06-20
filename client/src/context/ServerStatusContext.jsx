import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api from '../services/api'
import { subscribeServerStatus } from '../utils/serverStatusEmitter'

const ServerStatusContext = createContext()

export const ServerStatusProvider = ({ children }) => {
  const [isServerDown, setIsServerDown] = useState(false)
  const [checking, setChecking] = useState(false)

  // Manual check — retry button ke liye
  const checkNow = useCallback(async () => {
    setChecking(true)
    try {
      await api.get('/health')
      setIsServerDown(false)
    } catch (err) {
      setIsServerDown(true)
    } finally {
      setChecking(false)
    }
  }, [])

  // Kisi bhi API call (interceptor se) immediately status update ho jaye
  useEffect(() => {
    const unsubscribe = subscribeServerStatus((down) => {
      setIsServerDown(down)
    })
    return unsubscribe
  }, [])

  // Background mein har 20 second baad health check — taaki user kuch click na kare tab bhi pata chal jaye
  useEffect(() => {
    const interval = setInterval(() => {
      checkNow()
    }, 20000)
    return () => clearInterval(interval)
  }, [checkNow])

  return (
    <ServerStatusContext.Provider value={{ isServerDown, checking, checkNow }}>
      {children}
    </ServerStatusContext.Provider>
  )
}

export const useServerStatus = () => {
  const context = useContext(ServerStatusContext)
  if (!context) throw new Error('useServerStatus must be used within ServerStatusProvider')
  return context
}

export default ServerStatusContext