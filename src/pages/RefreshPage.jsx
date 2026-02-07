import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSetData } from '../context/DataContext'
import { csvToObjects } from '../utils/csvParse'
import { convertDriveLinksInObject } from '../utils/gdriveLink'

const REFRESH_SECRET = 'fix2sell_refresh'
const SPREADSHEET_ID = '1caX4ZO29BRmy_XUh-Vm7RQgGJ-6zF3_wQz9nrlGAw_U'
const GIDS = {
  transformation: '1819444701',
  thousandsGained: '151674308',
  testimonials: '409592819',
  faq: '308847142',
  global: '0',
}

/** Get cell value; sheet headers must be lowercase, no spaces. */
function get(r, key) {
  const v = r[key]
  return v !== undefined && v !== null ? String(v).trim() : ''
}

function mapTransformation(rows) {
  return rows
    .filter((r) => get(r, 'label') || get(r, 'beforeimage') || get(r, 'afterimage'))
    .map((r) => ({
      label: get(r, 'label'),
      before: get(r, 'beforeimage'),
      after: get(r, 'afterimage'),
      stats: [
        { value: get(r, 'stat1value'), label: get(r, 'stat1label') },
        { value: get(r, 'stat2value'), label: get(r, 'stat2label') },
        { value: get(r, 'stat3value'), label: get(r, 'stat3label') },
      ].filter((s) => s.value || s.label),
    }))
}

function mapThousandsGained(rows) {
  return rows
    .filter((r) => get(r, 'image') || get(r, 'renovation') || get(r, 'location') || get(r, 'profit'))
    .map((r) => ({
      image: get(r, 'image'),
      renovation: get(r, 'renovation'),
      profit: get(r, 'profit'),
      location: get(r, 'location'),
    }))
}

function mapTestimonials(rows) {
  return rows
    .filter((r) => get(r, 'quote') || get(r, 'name'))
    .map((r, i) => ({
      id: i + 1,
      quote: get(r, 'quote'),
      name: get(r, 'name'),
      location: get(r, 'location'),
      image: get(r, 'image'),
    }))
}

function mapFaq(rows) {
  return rows
    .filter((r) => get(r, 'question') || get(r, 'answer'))
    .map((r) => ({
      q: get(r, 'question'),
      a: get(r, 'answer'),
    }))
}

function mapGlobal(rows) {
  const obj = {}
  rows.forEach((r) => {
    const key = get(r, 'key')
    if (key) obj[key] = get(r, 'value')
  })
  return obj
}

export default function RefreshPage() {
  const [searchParams] = useSearchParams()
  const setData = useSetData()
  const [status, setStatus] = useState('checking') // checking | ok | error
  const [message, setMessage] = useState('')

  useEffect(() => {
    const secret = searchParams.get('secret')
    if (secret !== REFRESH_SECRET) {
      setStatus('notfound')
      return
    }

    const sheets = [
      { key: 'transformation', gid: GIDS.transformation, map: mapTransformation },
      { key: 'thousandsGained', gid: GIDS.thousandsGained, map: mapThousandsGained },
      { key: 'testimonials', gid: GIDS.testimonials, map: mapTestimonials },
      { key: 'faq', gid: GIDS.faq, map: mapFaq },
      { key: 'global', gid: GIDS.global, map: mapGlobal },
    ]

    // Cache-bust so we always get fresh data (Google/proxy may cache the CSV)
    const cacheBust = () => `&_=${Date.now()}`

    const sheetUrl = (gid) =>
      `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${gid}${cacheBust()}`

    // CORS proxy so the browser can fetch Google Sheets (Sheets blocks direct requests)
    const fetchCsv = (gid) => {
      const url = sheetUrl(gid)
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`
      return fetch(proxyUrl, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
      }).then((res) => {
        if (!res.ok) throw new Error(res.status)
        return res.text()
      })
    }

    const data = {}

    Promise.all(
      sheets.map(({ key, gid, map }) =>
        fetchCsv(gid)
          .then((csv) => {
            const rows = csvToObjects(csv)
            data[key] = map(rows)
          })
          .catch((err) => {
            data[key] = key === 'global' ? {} : []
            console.warn(`Sheet ${key}:`, err.message)
          })
      )
    )
      .then(() => {
        const withDriveLinks = convertDriveLinksInObject(data)
        if (setData) setData(withDriveLinks)
        setStatus('ok')
        setMessage('Data refreshed. You can go back to the home page.')
      })
      .catch((err) => {
        setStatus('error')
        setMessage(err.message || 'Refresh failed. Google Sheets may block CORS from the browser.')
      })
  }, [searchParams, setData])

  if (status === 'notfound') {
    return (
      <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>404</h1>
        <p style={{ color: '#666' }}>Page not found</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '480px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Refresh data</h1>
      {status === 'checking' && <p>Checking secret and fetching from Google Sheets…</p>}
      {status === 'ok' && <p style={{ color: 'green' }}>{message}</p>}
      {status === 'error' && <p style={{ color: 'crimson' }}>{message}</p>}
    </div>
  )
}
