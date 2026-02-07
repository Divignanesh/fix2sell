import { createContext, useContext, useEffect, useState } from 'react'

const DataContext = createContext(null)
const DATA_STORAGE_KEY = 'app-data'

export function DataProvider({ children }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/data.json')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        const next = json && typeof json === 'object' ? json : {}
        setData(next)
        try {
          localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(next))
        } catch (_) {}
      })
      .catch(() => {
        try {
          const stored = localStorage.getItem(DATA_STORAGE_KEY)
          if (stored) {
            const parsed = JSON.parse(stored)
            if (parsed && typeof parsed === 'object') setData(parsed)
          } else {
            setData({})
          }
        } catch (_) {
          setData({})
        }
      })
  }, [])

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  return ctx?.data ?? {}
}

export function useSetData() {
  const ctx = useContext(DataContext)
  return ctx?.setData
}
