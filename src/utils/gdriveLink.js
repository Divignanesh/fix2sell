/**
 * Converts Google Drive URLs:
 * - For images / direct view: https://drive.google.com/uc?id=FILE_ID
 * - For videos (embed): https://drive.google.com/file/d/FILE_ID/preview
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
  return (
    trimmed.match(DRIVE_FILE_D_REGEX)?.[1] ||
    trimmed.match(DRIVE_OPEN_ID_REGEX)?.[1] ||
    trimmed.match(DRIVE_UC_ID_REGEX)?.[1] ||
    trimmed.match(DRIVE_THUMBNAIL_ID_REGEX)?.[1]
  )
}

function toDirectDriveUrl(url) {
  const fileId = getDriveFileId(url)
  if (fileId) return `${DIRECT_PREFIX}${fileId}`
  return url && typeof url === 'string' ? url.trim() : url
}

/** Use for video embeds: Drive preview URL for iframe */
export function toPreviewDriveUrl(url) {
  const fileId = getDriveFileId(url)
  if (fileId) return `${PREVIEW_PREFIX}${fileId}${PREVIEW_SUFFIX}`
  return url && typeof url === 'string' ? url.trim() : url
}

export function convertDriveLinksInObject(obj) {
  if (obj === null || obj === undefined) return obj
  if (typeof obj === 'string') return toDirectDriveUrl(obj)
  if (Array.isArray(obj)) return obj.map(convertDriveLinksInObject)
  if (typeof obj === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(obj)) {
      out[k] = convertDriveLinksInObject(v)
    }
    return out
  }
  return obj
}
