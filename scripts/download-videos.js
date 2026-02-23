/**
 * Reads public/data.json, downloads all video and image URLs (including Google Drive
 * links like https://drive.google.com/file/d/ID/view?usp=sharing) to
 * public/downloaded-videos/ and public/downloaded-images/, then rewrites data.json
 * to use local paths. On each run, old files in those dirs are removed.
 *
 * Run after fetch-data.js (e.g. in build: fetch-data && download-media && vite build).
 */

import https from 'https'
import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getDriveFileId } from './utils/gdriveLink.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const PUBLIC_DIR = path.join(ROOT, 'public')
const VIDEOS_DIR = path.join(PUBLIC_DIR, 'downloaded-videos')
const IMAGES_DIR = path.join(PUBLIC_DIR, 'downloaded-images')
const DATA_JSON = path.join(PUBLIC_DIR, 'data.json')

/** Build download URL: for Drive use export=download, else use as-is */
function getDownloadUrl(url) {
  if (!url || typeof url !== 'string') return null
  const u = url.trim()
  const fileId = getDriveFileId(u)
  if (fileId) return `https://drive.google.com/uc?export=download&id=${fileId}`
  return u
}

/** Returns true if this looks like a real Drive or http(s) video URL (not a placeholder) */
function isDownloadableUrl(url) {
  if (!url || typeof url !== 'string') return false
  const u = url.trim()
  if (u.startsWith('http://') || u.startsWith('https://')) {
    if (u.includes('drive.google.com')) return !!getDriveFileId(u)
    return true
  }
  return false
}

/** Fetch URL and return { buffer, contentType } or null if failed */
function fetchBinary(url, redirectCount = 0) {
  const maxRedirects = 5
  return new Promise((resolve, reject) => {
    let u
    try {
      u = new URL(url)
    } catch {
      return resolve(null)
    }
    const opts = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
    }
    const protocol = u.protocol === 'https:' ? https : http
    const req = protocol.get(opts, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirectCount < maxRedirects) {
        const next = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, url).href
        return fetchBinary(next, redirectCount + 1).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) {
        return resolve(null)
      }
      const chunks = []
      res.on('data', (chunk) => chunks.push(chunk))
      res.on('end', () => {
        const buffer = Buffer.concat(chunks)
        const contentType = (res.headers['content-type'] || '').toLowerCase()
        resolve({ buffer, contentType })
      })

    })
    req.on('error', () => resolve(null))
  })
}

/**
 * Download from Google Drive, handling virus-scan confirmation for large files.
 * First request may return HTML with confirm token; second request with token returns the file.
 */
async function fetchDriveFile(fileId) {
  const baseUrl = `https://drive.google.com/uc?export=download&id=${fileId}`
  const first = await fetchBinary(baseUrl)
  if (!first) return null
  const ct = (first.contentType || '').toLowerCase()
  const buf = first.buffer
  if (ct.includes('text/html') || (buf && buf.length > 0 && buf[0] === 0x3c)) {
    const html = buf.toString('utf8')
    const confirmMatch = html.match(/confirm=([^&"'\s]+)/)
    const token = confirmMatch ? confirmMatch[1] : null
    if (token) {
      const withConfirm = `${baseUrl}&confirm=${token}`
      const second = await fetchBinary(withConfirm)
      if (second && second.buffer && second.buffer.length > 0) {
        const isHtml = (second.contentType || '').includes('text/html') || second.buffer[0] === 0x3c
        if (!isHtml) return second
      }
    }
    return null
  }
  return first
}

/** Return true if response looks like binary video (not HTML virus scan page etc.) */
function isLikelyVideo(buffer, contentType) {
  if (!buffer || buffer.length < 4) return false
  if (contentType && (contentType.includes('video/') || contentType.includes('application/octet-stream'))) return true
  if (contentType && contentType.includes('text/html')) return false
  const sig = buffer.slice(0, 12)
  if (sig[0] === 0x00 && sig[1] === 0x00 && (sig[2] === 0x00 || sig[2] === 0x01)) return true
  if (sig[0] === 0x1a && sig[1] === 0x45 && sig[2] === 0xdf && sig[3] === 0xa3) return true
  if (sig.toString('ascii', 0, 4) === 'ftyp') return true
  if (buffer[0] === 0x3c && buffer[1] === 0x21) return false
  if (buffer[0] === 0x3c && buffer[1] === 0x68) return false
  return true
}

function getExtension(contentType, url) {
  if (contentType && contentType.includes('webm')) return '.webm'
  if (contentType && contentType.includes('ogg')) return '.ogv'
  const u = (url || '').toLowerCase()
  if (u.includes('.webm')) return '.webm'
  if (u.includes('.ogv')) return '.ogv'
  return '.mp4'
}

/** Return true if response looks like an image (not HTML / virus scan page) */
function isLikelyImage(buffer, contentType) {
  if (!buffer || buffer.length < 4) return false
  if (contentType && contentType.includes('text/html')) return false
  if (contentType && (contentType.includes('image/') || contentType.includes('application/octet-stream'))) return true
  const sig = buffer.slice(0, 12)
  if (buffer[0] === 0x3c && (buffer[1] === 0x21 || buffer[1] === 0x68)) return false
  if (sig[0] === 0xff && sig[1] === 0xd8) return true
  if (sig.toString('ascii', 0, 4) === '\x89PNG') return true
  if (sig[0] === 0x47 && sig[1] === 0x49 && sig[2] === 0x46) return true
  if (sig.toString('ascii', 0, 4) === 'RIFF' && sig.toString('ascii', 8, 12) === 'WEBP') return true
  if (sig[0] === 0x00 && sig[1] === 0x00 && (sig[2] === 0x00 || sig[2] === 0x01)) return false
  if (sig[0] === 0x1a && sig[1] === 0x45 && sig[2] === 0xdf && sig[3] === 0xa3) return false
  if (sig.toString('ascii', 0, 4) === 'ftyp') return false
  return true
}

function getImageExtension(contentType, url) {
  const u = (url || '').toLowerCase()
  if (contentType) {
    if (contentType.includes('png')) return '.png'
    if (contentType.includes('gif')) return '.gif'
    if (contentType.includes('webp')) return '.webp'
    if (contentType.includes('svg')) return '.svg'
  }
  if (/\.[a-z0-9]+(\?|$)/i.test(url)) {
    const m = url.match(/\.(jpe?g|png|gif|webp|svg)(\?|$)/i)
    if (m) return '.' + m[1].toLowerCase().replace('jpeg', 'jpg')
  }
  return '.jpg'
}

async function downloadOne(url, name) {
  if (!isDownloadableUrl(url)) return null
  const fileId = getDriveFileId(url)
  const result = fileId
    ? await fetchDriveFile(fileId)
    : await fetchBinary(url.trim())
  if (!result || !result.buffer || !isLikelyVideo(result.buffer, result.contentType)) return null
  const ext = getExtension(result.contentType, url)
  const filename = name + ext
  const outPath = path.join(VIDEOS_DIR, filename)
  fs.writeFileSync(outPath, result.buffer)
  return '/' + path.relative(PUBLIC_DIR, outPath).replace(/\\/g, '/')
}

async function downloadOneImage(url, name) {
  if (!isDownloadableUrl(url)) return null
  const fileId = getDriveFileId(url)
  const result = fileId
    ? await fetchDriveFile(fileId)
    : await fetchBinary(url.trim())
  if (!result || !result.buffer || !isLikelyImage(result.buffer, result.contentType)) return null
  const ext = getImageExtension(result.contentType, url)
  const filename = name + ext
  const outPath = path.join(IMAGES_DIR, filename)
  fs.writeFileSync(outPath, result.buffer)
  return '/' + path.relative(PUBLIC_DIR, outPath).replace(/\\/g, '/')
}

function collectVideoEntries(data) {
  const entries = []
  if (data.global && data.global.heroBackgroundVideoUrl && isDownloadableUrl(data.global.heroBackgroundVideoUrl)) {
    entries.push({ url: data.global.heroBackgroundVideoUrl, set: (p) => { data.global.heroBackgroundVideoUrl = p }, name: 'hero-bg' })
  }
  if (Array.isArray(data.transformation)) {
    data.transformation.forEach((item, i) => {
      if (item.beforeType === 'video' && item.before && isDownloadableUrl(item.before)) entries.push({ url: item.before, set: (p) => { item.before = p }, name: `transformation-${i}-before` })
      if (item.afterType === 'video' && item.after && isDownloadableUrl(item.after)) entries.push({ url: item.after, set: (p) => { item.after = p }, name: `transformation-${i}-after` })
    })
  }
  if (Array.isArray(data.thousandsGained)) {
    data.thousandsGained.forEach((item, i) => {
      if (item.imageType === 'video' && item.image && isDownloadableUrl(item.image)) entries.push({ url: item.image, set: (p) => { item.image = p }, name: `thousands-${i}` })
    })
  }
  return entries
}

function collectImageEntries(data) {
  const entries = []
  if (Array.isArray(data.transformation)) {
    data.transformation.forEach((item, i) => {
      if (item.beforeType !== 'video' && item.before && isDownloadableUrl(item.before)) {
        entries.push({ url: item.before, set: (p) => { item.before = p }, name: `transformation-${i}-before` })
      }
      if (item.afterType !== 'video' && item.after && isDownloadableUrl(item.after)) {
        entries.push({ url: item.after, set: (p) => { item.after = p }, name: `transformation-${i}-after` })
      }
    })
  }
  if (Array.isArray(data.thousandsGained)) {
    data.thousandsGained.forEach((item, i) => {
      if (item.imageType !== 'video' && item.image && isDownloadableUrl(item.image)) {
        entries.push({ url: item.image, set: (p) => { item.image = p }, name: `thousands-${i}` })
      }
    })
  }
  if (Array.isArray(data.smartWay)) {
    data.smartWay.forEach((item, i) => {
      if (item.image && isDownloadableUrl(item.image)) {
        entries.push({ url: item.image, set: (p) => { item.image = p }, name: `smartway-${i}` })
      }
    })
  }
  return entries
}

async function main() {
  if (!fs.existsSync(DATA_JSON)) {
    console.warn('download-media: data.json not found, run fetch-data first')
    process.exit(0)
  }

  const data = JSON.parse(fs.readFileSync(DATA_JSON, 'utf8'))

  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true })
  if (fs.existsSync(VIDEOS_DIR)) {
    for (const f of fs.readdirSync(VIDEOS_DIR)) {
      fs.unlinkSync(path.join(VIDEOS_DIR, f))
    }
  } else {
    fs.mkdirSync(VIDEOS_DIR, { recursive: true })
  }
  if (fs.existsSync(IMAGES_DIR)) {
    for (const f of fs.readdirSync(IMAGES_DIR)) {
      fs.unlinkSync(path.join(IMAGES_DIR, f))
    }
  } else {
    fs.mkdirSync(IMAGES_DIR, { recursive: true })
  }

  const videoEntries = collectVideoEntries(data)
  for (const { url, set, name } of videoEntries) {
    const localPath = await downloadOne(url, name)
    if (localPath) {
      set(localPath)
      console.log('Downloaded video:', name, '->', localPath)
    } else {
      console.warn('Skipped (not a video or failed):', name)
    }
  }

  const imageEntries = collectImageEntries(data)
  for (const { url, set, name } of imageEntries) {
    const localPath = await downloadOneImage(url, name)
    if (localPath) {
      set(localPath)
      console.log('Downloaded image:', name, '->', localPath)
    } else {
      console.warn('Skipped (not an image or failed):', name)
    }
  }

  fs.writeFileSync(DATA_JSON, JSON.stringify(data, null, 2), 'utf8')
  console.log('Wrote', DATA_JSON, '- media URLs above were replaced with local paths')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
