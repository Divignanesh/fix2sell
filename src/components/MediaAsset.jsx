/**
 * Renders image or video from sheet data.
 * - type 'image' → <img>
 * - type 'video' + Drive preview URL → <iframe> (Drive embed)
 * - type 'video' + direct URL → <video>
 */

function isDrivePreviewUrl(url) {
  if (!url || typeof url !== 'string') return false
  return url.trim().includes('drive.google.com') && url.trim().includes('/preview')
}

export function MediaAsset({ url, type = 'image', alt = '', className, ...props }) {
  if (!url || typeof url !== 'string') return null
  const u = url.trim()
  const isVideo = (type && String(type).toLowerCase()) === 'video'

  if (isVideo) {
    if (isDrivePreviewUrl(u)) {
      const srcWithAutoplay = u.includes('autoplay') ? u : `${u}${u.includes('?') ? '&' : '?'}autoplay=1`
      return (
        <iframe
          src={srcWithAutoplay}
          title={alt || 'Video'}
          className={className}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          {...props}
        />
      )
    }
    return (
      <video
        src={u}
        className={className}
        muted
        loop
        playsInline
        autoPlay
        {...props}
      />
    )
  }

  return <img src={u} alt={alt} className={className} {...props} />
}
