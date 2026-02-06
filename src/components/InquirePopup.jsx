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

export default function InquirePopup() {
  const { global: globalData } = useData()
  const formIframeUrl = (globalData && globalData.formIframeUrl) ? globalData.formIframeUrl.trim() : ''
  const showScrollPopup = parseGlobalFlag(globalData && globalData.showScrollPopup)
  const showExitIntentPopup = parseGlobalFlag(globalData && globalData.showExitIntentPopup)

  const [open, setOpen] = useState(false)

  const openPopup = useCallback(() => setOpen(true), [])

  const closePopup = useCallback(() => setOpen(false), [])

  // Scroll: show at 85%
  useEffect(() => {
    if (!showScrollPopup) return
    const onScroll = () => {
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
              <h2 id="inquire-popup-title" className="inquire-popup__title">Inquire Now</h2>
              <p className="inquire-popup__subtitle">Get your free home evaluation today</p>
              {isValidIframeUrl(formIframeUrl) ? (
                <div className="inquire-popup__iframe-wrap">
                  <iframe
                    src={formIframeUrl}
                    className="inquire-popup__iframe"
                    title="Inquiry form"
                  />
                </div>
              ) : (
                <form className="inquire-popup__form" onSubmit={(e) => e.preventDefault()}>
                  <input type="text" placeholder="Full Name" className="inquire-popup__input" aria-label="Full name" />
                  <input type="email" placeholder="Email Address" className="inquire-popup__input" aria-label="Email" />
                  <input type="tel" placeholder="Phone Number" className="inquire-popup__input" aria-label="Phone" />
                  <button type="submit" className="inquire-popup__submit">
                    Get My Estimate
                  </button>
                  <p className="inquire-popup__note">
                    By submitting, you agree to our <a href="#privacy">Privacy Policy</a> and <a href="#terms">Terms of Service</a>.
                  </p>
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
