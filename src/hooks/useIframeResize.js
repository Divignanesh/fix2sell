import { useEffect } from 'react'

/**
 * Optional hook to handle iframe resize (e.g. via postMessage from embedded form).
 * @param {React.RefObject<HTMLIFrameElement|null>} iframeRef
 * @param {boolean} enabled
 * @param {number} defaultHeight
 */
export function useIframeResize(iframeRef, enabled, defaultHeight) {
  useEffect(() => {
    if (!enabled || !iframeRef?.current) return
    const iframe = iframeRef.current
    const handleMessage = (e) => {
      if (e.data && typeof e.data === 'object' && typeof e.data.height === 'number' && e.data.height > 0) {
        iframe.style.height = `${e.data.height}px`
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [enabled, iframeRef])
}
