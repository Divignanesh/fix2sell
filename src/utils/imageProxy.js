/**
 * Image proxy helpers for the repo.
 * Use for any image URL that may be blocked when loaded directly (hotlinking, CORS).
 * External URLs (http/https) are run through a proxy; relative paths are returned as-is.
 *
 * Set VITE_IMAGE_PROXY in .env to use your own proxy (e.g. in production).
 * @see docs/INSTAGRAM-IMAGES.md (covers Instagram + general proxy usage)
 */

/** Proxy base URL. Set VITE_IMAGE_PROXY in .env to use your own proxy for all images. */
export const IMAGE_PROXY =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_IMAGE_PROXY
    ? String(import.meta.env.VITE_IMAGE_PROXY).replace(/\/?$/, '/')
    : 'https://corsproxy.io/?'

/**
 * Return a URL suitable for <img src>. External URLs (http/https) are proxied so they load
 * when the source blocks direct embedding. Relative paths (e.g. /downloaded-images/...) are returned as-is.
 */
export function getProxiedImageSrc(url) {
  if (!url || typeof url !== 'string') return ''
  const u = url.trim()
  if (!u) return ''
  if (u.startsWith('http://') || u.startsWith('https://')) {
    return IMAGE_PROXY + encodeURIComponent(u)
  }
  return u
}

// --- Instagram-specific (reel/post link → media image URL, then proxied) ---

/** True if url is an Instagram reel or post URL */
export function isInstagramReelUrl(url) {
  if (!url || typeof url !== 'string') return false
  const u = url.trim().toLowerCase()
  return (
    (u.includes('instagram.com/reel/') || u.includes('instagram.com/p/')) &&
    (u.startsWith('http://') || u.startsWith('https://'))
  )
}

/** Extract reel/post ID (shortcode) from Instagram URL. */
export function getInstagramMediaId(instagramUrl) {
  if (!instagramUrl || typeof instagramUrl !== 'string') return ''
  const u = instagramUrl.trim()
  try {
    const path = new URL(u).pathname
    const match = path.match(/\/(?:reel|p)\/([A-Za-z0-9_-]+)/)
    return match ? match[1] : ''
  } catch {
    return ''
  }
}

/** Build Instagram media image URL: https://www.instagram.com/p/{id}/media/?size=l */
export function getInstagramMediaImageUrl(instagramUrl) {
  const id = getInstagramMediaId(instagramUrl)
  if (!id) return ''
  return `https://www.instagram.com/p/${id}/media/?size=l`
}

/** For Instagram reel/post link: media URL then proxied. Use in <img src>. */
export function getInstagramImageSrc(instagramUrl) {
  const direct = getInstagramMediaImageUrl(instagramUrl)
  if (!direct) return ''
  return getProxiedImageSrc(direct)
}
