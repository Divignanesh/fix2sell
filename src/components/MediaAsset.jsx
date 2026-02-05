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
      return (
        <iframe
          src={u}
          title={alt || 'Video'}
          className={className}
          frameBorder="0"
          allow="autoplay"
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
