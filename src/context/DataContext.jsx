import { createContext, useContext, useEffect, useState } from 'react'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    // No cache: always fetch fresh data (cache-bust so browser doesn't serve cached data.json)
    const url = `/data.json?_=${Date.now()}`
    fetch(url, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        const next = json && typeof json === 'object' ? json : {}
        setData(next)
      })
      .catch(() => {
        setData({})
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
