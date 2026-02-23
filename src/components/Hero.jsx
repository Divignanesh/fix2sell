import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useData } from '../context/DataContext'
import './Hero.css'

const DEFAULT_LOCATION_TEXT = 'in Toronto & GTA'

const FALLBACK_BADGE_TEXTS = ['Reno', 'Listing & Selling', 'Reno Consulting', 'Renovations', 'Reno Financial']

const FALLBACK_HERO_STATS = [
  { prefix: '', value: '$20M+', label: 'Worth Home Sold' },
  { prefix: '', value: '$20K', label: 'Average Reno Cost' },
  { prefix: 'Upto', value: '$50K', label: 'Profit Made' },
]

function getCopy(data, key, fallback) {
  if (!data || typeof data !== 'object') return fallback
  const v = data[key] ?? data[key?.toLowerCase?.()] ?? data[key?.charAt(0)?.toUpperCase() + key?.slice(1)]
  return v !== undefined && v !== null ? String(v).trim() : fallback
}

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
  const defaultLocation = getCopy(globalData, 'heroLocationDefault', DEFAULT_LOCATION_TEXT) || DEFAULT_LOCATION_TEXT
  const [badgeIndex, setBadgeIndex] = useState(0)
  const [locationText, setLocationText] = useState(defaultLocation || DEFAULT_LOCATION_TEXT)
  const [isMobile, setIsMobile] = useState(true)

  const badgeTexts = (() => {
    const raw = getCopy(globalData, 'heroRotatingWords', '')
    return raw ? raw.split(',').map((s) => s.trim()).filter(Boolean) : FALLBACK_BADGE_TEXTS
  })()

  const heroStats = [
    {
      prefix: getCopy(globalData, 'heroStat1Prefix', FALLBACK_HERO_STATS[0].prefix),
      value: getCopy(globalData, 'heroStat1Value', FALLBACK_HERO_STATS[0].value),
      label: getCopy(globalData, 'heroStat1Label', FALLBACK_HERO_STATS[0].label),
    },
    {
      prefix: getCopy(globalData, 'heroStat2Prefix', FALLBACK_HERO_STATS[1].prefix),
      value: getCopy(globalData, 'heroStat2Value', FALLBACK_HERO_STATS[1].value),
      label: getCopy(globalData, 'heroStat2Label', FALLBACK_HERO_STATS[1].label),
    },
    {
      prefix: getCopy(globalData, 'heroStat3Prefix', FALLBACK_HERO_STATS[2].prefix),
      value: getCopy(globalData, 'heroStat3Value', FALLBACK_HERO_STATS[2].value),
      label: getCopy(globalData, 'heroStat3Label', FALLBACK_HERO_STATS[2].label),
    },
  ]

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
    const len = badgeTexts.length
    if (!len) return
    const interval = setInterval(() => {
      setBadgeIndex((prev) => (prev + 1) % len)
    }, 3000)
    return () => clearInterval(interval)
  }, [badgeTexts.length])

  // Run geolocation on mount (like original); only update for Canada so sheet default is kept otherwise
  useEffect(() => {
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
  }, [])

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
            <span className="hero__badge-accent">{getCopy(globalData, 'heroBrand', '#Fix2Sell')}</span>
            <span className="hero__badge-separator">{' '}{getCopy(globalData, 'heroBadgeIsYour', 'is your').trim()}{' '}</span>
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
            <span className="hero__badge-separator">{' '}{getCopy(globalData, 'heroPartnerSuffix', 'partner').trim()}</span>
          </motion.div>
          <motion.h1
            className="hero__title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {getCopy(globalData, 'heroTitleLine1', 'Sell Your Home for').trim()}{' '}
            <span className="hero__title-highlight">{getCopy(globalData, 'heroTitleHighlight1', '8-10% More Than').trim()}</span>{' '}
            {getCopy(globalData, 'heroTitleLine2', 'Current Market Price').trim()}{' '}
            <span className="hero__title-highlight">{locationText}</span>
          </motion.h1>
          <motion.p
            className="hero__desc"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            {getCopy(globalData, 'heroDesc', "Transform your home's appeal with smart, value-boosting improvements all at zero upfront cost. From design to closing, we handle everything to get you maximum profit.")}
          </motion.p>
          <motion.div
            className="hero__stats"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {heroStats.map((stat, i) => (
              <div key={i} className="hero__stat-card">
                <div className="hero__stat-prefix">{stat.prefix || '\u00A0'}</div>
                <div className="hero__stat-value">{stat.value}</div>
                <div className="hero__stat-label">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
        <motion.div
          id="inquire"
          className="hero__card"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="hero__card-inner">
            <h3 className="hero__card-title">{getCopy(globalData, 'heroFormTitle', 'Inquire Now')}</h3>
            <p className="hero__card-subtitle">{getCopy(globalData, 'heroFormSubtitle', 'Get your free home evaluation today')}</p>
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
                <input type="text" placeholder={getCopy(globalData, 'heroPlaceholderName', 'Full Name')} className="hero__input" aria-label="Full name" />
                <input type="email" placeholder={getCopy(globalData, 'heroPlaceholderEmail', 'Email Address')} className="hero__input" aria-label="Email" />
                <input type="tel" placeholder={getCopy(globalData, 'heroPlaceholderPhone', 'Phone Number')} className="hero__input" aria-label="Phone" />
                <button type="submit" className="hero__submit">
                  {getCopy(globalData, 'heroSubmitLabel', 'Get My Estimate')}
                </button>
                <p className="hero__form-note">
                  {getCopy(globalData, 'heroFormNote', 'By submitting, you agree to our Privacy Policy and Terms of Service.')}
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
