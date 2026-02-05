/**
 * Converts Google Drive URLs:
 * - Images / direct: https://drive.google.com/uc?id=FILE_ID
 * - Videos (embed): https://drive.google.com/file/d/FILE_ID/preview
 *
 * Supported input formats:
 * - https://drive.google.com/file/d/FILE_ID/view?...
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 * - https://drive.google.com/thumbnail?id=FILE_ID&sz=...
 */

const DRIVE_FILE_D_REGEX = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
const DRIVE_OPEN_ID_REGEX = /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/
const DRIVE_UC_ID_REGEX = /drive\.google\.com\/uc\?id=([a-zA-Z0-9_-]+)/
const DRIVE_THUMBNAIL_ID_REGEX = /drive\.google\.com\/thumbnail\?id=([a-zA-Z0-9_-]+)/

const DIRECT_PREFIX = 'https://drive.google.com/uc?id='
const PREVIEW_PREFIX = 'https://drive.google.com/file/d/'
const PREVIEW_SUFFIX = '/preview'

function getDriveFileId(url) {
  if (!url || typeof url !== 'string') return null
  const trimmed = url.trim()
  const m1 = trimmed.match(DRIVE_FILE_D_REGEX)
  if (m1) return m1[1]
  const m2 = trimmed.match(DRIVE_OPEN_ID_REGEX)
  if (m2) return m2[1]
  const m3 = trimmed.match(DRIVE_UC_ID_REGEX)
  if (m3) return m3[1]
  const m4 = trimmed.match(DRIVE_THUMBNAIL_ID_REGEX)
  if (m4) return m4[1]
  return null
}

/**
 * @param {string} url - Any Google Drive URL or plain string
 * @returns {string} - https://drive.google.com/uc?id=FILE_ID or original string if no match
 */
function toDirectDriveUrl(url) {
  const fileId = getDriveFileId(url)
  if (fileId) return `${DIRECT_PREFIX}${fileId}`
  return url && typeof url === 'string' ? url.trim() : url
}

/**
 * Video embed format for iframe: https://drive.google.com/file/d/FILE_ID/preview
 * @param {string} url - Any Google Drive URL or plain string
 * @returns {string} - preview URL or original string if no match
 */
function toPreviewDriveUrl(url) {
  const fileId = getDriveFileId(url)
  if (fileId) return `${PREVIEW_PREFIX}${fileId}${PREVIEW_SUFFIX}`
  return url && typeof url === 'string' ? url.trim() : url
}

/**
 * Recursively convert any GDrive links in an object or array.
 * @param {object|array|string} obj
 * @returns {object|array|string}
 */
function convertDriveLinksInObject(obj) {
  if (obj === null || obj === undefined) return obj
  if (typeof obj === 'string') return toDirectDriveUrl(obj)
  if (Array.isArray(obj)) return obj.map((item) => convertDriveLinksInObject(item))
  if (typeof obj === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(obj)) {
      out[k] = convertDriveLinksInObject(v)
    }
    return out
  }
  return obj
}

export { toDirectDriveUrl, toPreviewDriveUrl, convertDriveLinksInObject }
