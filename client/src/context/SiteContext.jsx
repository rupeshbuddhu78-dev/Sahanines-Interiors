import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const SiteContext = createContext()

export const useSite = () => useContext(SiteContext)

export const SiteProvider = ({ children }) => {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/settings')
        if (data.success) setSettings(data.settings)
      } catch (err) {
        console.error('Failed to fetch settings:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  return (
    <SiteContext.Provider value={{ settings, setSettings, loading }}>
      {children}
    </SiteContext.Provider>
  )
}
