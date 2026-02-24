import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useData } from '../context/DataContext'
import './InquirePopup.css'

const SCROLL_THRESHOLD = 0.85
const STORAGE_SCROLL = 'inquire-popup-scroll-shown'
const STORAGE_EXIT = 'inquire-popup-exit-shown'

function isValidIframeUrl(url) {
  if (!url || typeof url !== 'string') return false
  const u = url.trim()
  return u.startsWith('http://') || u.startsWith('https://')
}

function parseGlobalFlag(value) {
  if (value === undefined || value === null) return false
  const s = String(value).trim().toLowerCase()
  return s === 'true' || s === '1' || s === 'yes'
}

/** Read boolean from global; try exact key then normalized (lowercase, no spaces) for sheet export variations */
function getGlobalFlag(globalData, key) {
  if (!globalData || typeof globalData !== 'object') return false
  const exact = globalData[key]
  const normalizedKey = key.replace(/\s+/g, '').toLowerCase()
  const fromNormalized = Object.keys(globalData).find((k) => k.replace(/\s+/g, '').toLowerCase() === normalizedKey)
  const value = exact ?? (fromNormalized != null ? globalData[fromNormalized] : undefined)
  return parseGlobalFlag(value)
}

function getCopy(data, key, fallback) {
  const v = data && data[key]
  return v !== undefined && v !== null ? String(v).trim() : fallback
}

function checkScrollThreshold(openPopup) {
  try {
    if (sessionStorage.getItem(STORAGE_SCROLL) === '1') return
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    if (scrollHeight <= 0) return
    const pct = scrollTop / scrollHeight
    if (pct >= SCROLL_THRESHOLD) {
      sessionStorage.setItem(STORAGE_SCROLL, '1')
      openPopup()
    }
  } catch (_) {}
}

export default function InquirePopup() {
  const { global: globalData } = useData()
  const formIframeUrl = (globalData && globalData.formIframeUrl) ? globalData.formIframeUrl.trim() : ''
  const showScrollPopup = getGlobalFlag(globalData, 'showScrollPopup')
  const showExitIntentPopup = getGlobalFlag(globalData, 'showExitIntentPopup')
  const [iframeLoaded, setIframeLoaded] = useState(false)

  // Preconnect to iframe origin so it loads faster
  useEffect(() => {
    if (!formIframeUrl) return
    let origin
    try {
      origin = new URL(formIframeUrl).origin
    } catch {
      return
    }
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = origin
    document.head.appendChild(link)
    return () => { link.parentNode?.removeChild(link) }
  }, [formIframeUrl])

  useEffect(() => {
    setIframeLoaded(false)
  }, [formIframeUrl])

  const [open, setOpen] = useState(false)

  const openPopup = useCallback(() => setOpen(true), [])

  const closePopup = useCallback(() => setOpen(false), [])

  // Scroll: show at 85%. Run check once when effect runs so we catch user who already scrolled before data loaded.
  useEffect(() => {
    if (!showScrollPopup) return
    const onScroll = () => checkScrollThreshold(openPopup)
    checkScrollThreshold(openPopup)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [showScrollPopup, openPopup])

  // Exit intent: mouse leaves viewport at top
  useEffect(() => {
    if (!showExitIntentPopup) return
    const onMouseLeave = (e) => {
      try {
        if (sessionStorage.getItem(STORAGE_EXIT) === '1') return
        if (e.clientY <= 0) {
          sessionStorage.setItem(STORAGE_EXIT, '1')
          openPopup()
        }
      } catch (_) {}
    }
    document.documentElement.addEventListener('mouseleave', onMouseLeave)
    return () => document.documentElement.removeEventListener('mouseleave', onMouseLeave)
  }, [showExitIntentPopup, openPopup])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="inquire-popup__backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closePopup}
          role="dialog"
          aria-modal="true"
          aria-labelledby="inquire-popup-title"
        >
          <motion.div
            className="inquire-popup__box"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="inquire-popup__close"
              onClick={closePopup}
              aria-label="Close"
            >
              <CloseIcon />
            </button>
            <div className="inquire-popup__inner">
              {isValidIframeUrl(formIframeUrl) ? (
                <div className="inquire-popup__iframe-wrap">
                  <iframe
                    src={formIframeUrl}
                    className="inquire-popup__iframe"
                    title="Inquiry form"
                    onLoad={() => setIframeLoaded(true)}
                  />
                  <div
                    className={`inquire-popup__iframe-loading ${iframeLoaded ? 'inquire-popup__iframe-loading--done' : ''}`}
                    aria-hidden={iframeLoaded}
                  >
                    <span className="inquire-popup__iframe-spinner" aria-hidden />
                    <span className="inquire-popup__iframe-loading-text">Loading form…</span>
                  </div>
                </div>
              ) : (
                <form className="inquire-popup__form" onSubmit={(e) => e.preventDefault()}>
                  <input type="text" placeholder={getCopy(globalData, 'heroPlaceholderName', 'Full Name')} className="inquire-popup__input" aria-label="Full name" />
                  <input type="email" placeholder={getCopy(globalData, 'heroPlaceholderEmail', 'Email Address')} className="inquire-popup__input" aria-label="Email" />
                  <input type="tel" placeholder={getCopy(globalData, 'heroPlaceholderPhone', 'Phone Number')} className="inquire-popup__input" aria-label="Phone" />
                  <button type="submit" className="inquire-popup__submit">
                    {getCopy(globalData, 'inquirePopupSubmitLabel', 'Get My Estimate')}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}
