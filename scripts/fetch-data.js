/**
 * Fetches data from Google Sheets (public CSV export), converts GDrive links,
 * and writes public/data.json for the app to consume.
 * Sheet must be "Anyone with the link can view".
 */

import https from 'https'
import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { csvToObjects } from './parseCsv.js'
import { convertDriveLinksInObject, toPreviewDriveUrl } from './utils/gdriveLink.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const PUBLIC_DIR = path.join(ROOT, 'public')
const DATA_JSON = path.join(PUBLIC_DIR, 'data.json')

const SPREADSHEET_ID = '1caX4ZO29BRmy_XUh-Vm7RQgGJ-6zF3_wQz9nrlGAw_U'
const GIDS = {
  transformation: '1819444701',
  thousandsGained: '151674308',
  testimonials: '409592819',
  faq: '308847142',
  global: '0',
}

function fetchUrl(url, redirectCount = 0) {
  const maxRedirects = 5
  return new Promise((resolve, reject) => {
    const u = new URL(url)
    const opts = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; fetch-data/1.0)' },
    }
    const protocol = u.protocol === 'https:' ? https : http
    const req = protocol.get(opts, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirectCount < maxRedirects) {
        const next = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, url).href
        return resolve(fetchUrl(next, redirectCount + 1))
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Fetch failed: ${res.statusCode}`))
        return
      }
      const chunks = []
      res.on('data', (chunk) => chunks.push(chunk))
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    })
    req.on('error', reject)
  })
}

function fetchCsv(gid) {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${gid}`
  return fetchUrl(url)
}

function get(r, key) {
  const v = r[key]
  return v !== undefined && v !== null ? String(v).trim() : ''
}

function mediaType(r, key) {
  const v = get(r, key)
  return (v && String(v).toLowerCase() === 'video') ? 'video' : 'image'
}

function mapTransformation(rows) {
  return rows
    .filter((r) => get(r, 'label') || get(r, 'beforeimage') || get(r, 'afterimage'))
    .map((r) => ({
      label: get(r, 'label'),
      before: get(r, 'beforeimage'),
      after: get(r, 'afterimage'),
      beforeType: mediaType(r, 'beforeimagetype'),
      afterType: mediaType(r, 'afterimagetype'),
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
      imageType: mediaType(r, 'imagetype'),
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
      imageType: mediaType(r, 'imagetype'),
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

async function main() {
  const data = {}
  const sheets = [
    { key: 'transformation', gid: GIDS.transformation, map: mapTransformation },
    { key: 'thousandsGained', gid: GIDS.thousandsGained, map: mapThousandsGained },
    { key: 'testimonials', gid: GIDS.testimonials, map: mapTestimonials },
    { key: 'faq', gid: GIDS.faq, map: mapFaq },
    { key: 'global', gid: GIDS.global, map: mapGlobal },
  ]

  for (const { key, gid, map } of sheets) {
    try {
      const csv = await fetchCsv(gid)
      const rows = csvToObjects(csv)
      data[key] = map(rows)
    } catch (err) {
      console.warn(`Sheet ${key} (gid=${gid}):`, err.message)
      if (key === 'global') data[key] = {}
      else data[key] = []
    }
  }

  const withDriveLinks = convertDriveLinksInObject(data)

  // Convert Drive video URLs to preview format (for iframe); images stay as uc?id=
  if (withDriveLinks.global && withDriveLinks.global.heroBackgroundVideoUrl) {
    withDriveLinks.global.heroBackgroundVideoUrl = toPreviewDriveUrl(withDriveLinks.global.heroBackgroundVideoUrl)
  }
  if (Array.isArray(withDriveLinks.transformation)) {
    withDriveLinks.transformation.forEach((item) => {
      if (item.beforeType === 'video' && item.before) item.before = toPreviewDriveUrl(item.before)
      if (item.afterType === 'video' && item.after) item.after = toPreviewDriveUrl(item.after)
    })
  }
  if (Array.isArray(withDriveLinks.thousandsGained)) {
    withDriveLinks.thousandsGained.forEach((item) => {
      if (item.imageType === 'video' && item.image) item.image = toPreviewDriveUrl(item.image)
    })
  }
  if (Array.isArray(withDriveLinks.testimonials)) {
    withDriveLinks.testimonials.forEach((item) => {
      if (item.imageType === 'video' && item.image) item.image = toPreviewDriveUrl(item.image)
    })
  }

  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true })
  fs.writeFileSync(DATA_JSON, JSON.stringify(withDriveLinks, null, 2), 'utf8')
  console.log('Wrote', DATA_JSON)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
