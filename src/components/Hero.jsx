import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useData } from '../context/DataContext'
import './Hero.css'

const DEFAULT_LOCATION_TEXT = 'in Toronto & GTA'

const badgeTexts = [
  'Reno',
  'Listing & Selling',
  'Reno Consulting',
  'Renovations',
  'Reno Financial',
]

const listItems = [
  { label: 'Upfront Cost', accent: 'ZERO' },
  { label: 'Compromise', accent: 'ZERO' },
  { label: 'Stress', accent: 'ZERO' },
]

function isValidIframeUrl(url) {
  if (!url || typeof url !== 'string') return false
  const u = url.trim()
  return u.startsWith('http://') || u.startsWith('https://')
}

function isValidVideoUrl(url) {
  if (!url || typeof url !== 'string') return false
  const u = url.trim()
  return u.startsWith('http://') || u.startsWith('https://') || u.startsWith('/')
}

/** Drive preview URL is for iframe; direct MP4 etc. use <video> */
function isDrivePreviewUrl(url) {
  if (!url || typeof url !== 'string') return false
  const u = url.trim()
  return u.includes('drive.google.com') && u.includes('/preview')
}

/** Append autoplay param for Drive embed (no button, muted in embed) */
function drivePreviewUrlWithAutoplay(url) {
  if (!url || typeof url !== 'string') return url
  const u = url.trim()
  const sep = u.includes('?') ? '&' : '?'
  return u.includes('autoplay') ? u : `${u}${sep}autoplay=1`
}

export default function Hero() {
  const { global: globalData } = useData()
  const formIframeUrl = (globalData && globalData.formIframeUrl) ? globalData.formIframeUrl.trim() : ''
  const heroBackgroundVideoUrl = (globalData && globalData.heroBackgroundVideoUrl) ? globalData.heroBackgroundVideoUrl.trim() : ''
  const heroVideoOnMobile = (() => {
    const v = globalData && globalData.heroVideoOnMobile
    if (v === undefined || v === null) return false
    const s = String(v).trim().toLowerCase()
    return s === 'true' || s === '1' || s === 'yes'
  })()
  const collectUserLocation = (() => {
    const v = globalData && globalData.collectUserLocation
    if (v === undefined || v === null) return false
    const s = String(v).trim().toLowerCase()
    return s === 'true' || s === '1' || s === 'yes'
  })()
  const defaultLocation = (globalData && globalData.heroLocationDefault) ? String(globalData.heroLocationDefault).trim() : DEFAULT_LOCATION_TEXT
  const [badgeIndex, setBadgeIndex] = useState(0)
  const [locationText, setLocationText] = useState(defaultLocation || DEFAULT_LOCATION_TEXT)
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    if (!defaultLocation) return
    setLocationText((prev) => (prev === DEFAULT_LOCATION_TEXT ? defaultLocation : prev))
  }, [defaultLocation])

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 769px)')
    const update = () => setIsMobile(!mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setBadgeIndex((prev) => (prev + 1) % badgeTexts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!collectUserLocation) return
    let cancelled = false
    let abortController = null
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (cancelled) return
        const { latitude, longitude } = position.coords
        abortController = new AbortController()
        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          {
            signal: abortController.signal,
            headers: { Accept: 'application/json', 'User-Agent': 'Fix2Sell-Hero-Location/1.0' },
          }
        )
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (cancelled || !data?.address) return
            const { country_code, state, city } = data.address
            if (country_code?.toLowerCase() === 'ca') {
              const region = state || city || 'Canada'
              setLocationText(`in ${region}`)
            }
          })
          .catch(() => {})
      },
      () => { /* permission denied or error: keep default */ },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )

    return () => {
      cancelled = true
      if (abortController) abortController.abort()
    }
  }, [collectUserLocation])

  const showBackgroundVideo = isValidVideoUrl(heroBackgroundVideoUrl) && (!isMobile || heroVideoOnMobile)

  return (
    <section id="home" className="hero">
      {showBackgroundVideo && (
        <>
          <div className="hero__video-wrap">
            {isDrivePreviewUrl(heroBackgroundVideoUrl) ? (
              <iframe
                src={drivePreviewUrlWithAutoplay(heroBackgroundVideoUrl)}
                className="hero__video hero__video--iframe"
                title=""
                aria-hidden
                allow="autoplay; encrypted-media"
              />
            ) : (
              <video
                className="hero__video"
                src={heroBackgroundVideoUrl}
                autoPlay
                muted
                loop
                playsInline
                aria-hidden
              />
            )}
          </div>
          <div className="hero__video-overlay" aria-hidden />
        </>
      )}
      <div className="hero__inner">
        <div className="hero__content">
          <motion.div
            className="hero__badge"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="hero__badge-accent">#Fix2Sell</span>
            <span className="hero__badge-separator"> is your </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={badgeIndex}
                className="hero__badge-text"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {badgeTexts[badgeIndex]}
              </motion.span>
            </AnimatePresence>
            <span className="hero__badge-separator"> partner</span>
          </motion.div>
          <motion.h1
            className="hero__title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Sell Your Home for{' '}
            <span className="hero__title-highlight">8-10% More Than</span>{' '}
            Current Market Price{' '}
            <span className="hero__title-highlight">{locationText}</span>
          </motion.h1>
          <motion.p
            className="hero__desc"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            Transform your home's appeal with smart, value-boosting improvements all at zero upfront cost. From design to closing, we handle everything to get you maximum profit.
          </motion.p>
          <motion.ul
            className="hero__list"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.08 } },
              hidden: {},
            }}
          >
            {listItems.map((item, i) => (
              <motion.li
                key={i}
                className="hero__list-item"
                variants={{
                  hidden: { opacity: 0, x: -12 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.4 }}
              >
                <span className="hero__list-icon" aria-hidden>
                  <CheckCircleIcon />
                </span>
                <span className="hero__list-accent">{item.accent}</span>
                <span className="hero__list-label">{item.label}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
        <motion.div
          id="inquire"
          className="hero__card"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="hero__card-inner">
            <h3 className="hero__card-title">Inquire Now</h3>
            <p className="hero__card-subtitle">Get your free home evaluation today</p>
            {isValidIframeUrl(formIframeUrl) ? (
              <div className="hero__form-iframe-wrap">
                <iframe
                  src={formIframeUrl}
                  className="hero__form-iframe"
                  title="Inquiry form"
                />
              </div>
            ) : (
              <form className="hero__form" onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Full Name" className="hero__input" aria-label="Full name" />
                <input type="email" placeholder="Email Address" className="hero__input" aria-label="Email" />
                <input type="tel" placeholder="Phone Number" className="hero__input" aria-label="Phone" />
                <button type="submit" className="hero__submit">
                  Get My Estimate
                </button>
                <p className="hero__form-note">
                  By submitting, you agree to our <a href="#privacy">Privacy Policy</a> and <a href="#terms">Terms of Service</a>.
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function CheckCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="8.33" stroke="currentColor" strokeWidth="1.67" />
      <path d="M7.5 10l1.67 1.67 3.33-3.34" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
