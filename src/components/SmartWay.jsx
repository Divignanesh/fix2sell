import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AnimatedSection } from './AnimatedSection'
import { useData } from '../context/DataContext'
import { isInstagramReelUrl, getInstagramImageSrc, getProxiedImageSrc } from '../utils/imageProxy'
import './SmartWay.css'

const DEFAULT_SLIDES = [
  { image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80', link: '#', title: 'Reel thumbnail' },
]

const BENEFIT_ICONS = ['chart', 'clock', 'shield', 'check']
const CAROUSEL_INTERVAL_MS = 4000

function getCopy(data, key, fallback) {
  const v = data && data[key]
  return v !== undefined && v !== null ? String(v).trim() : fallback
}

export default function SmartWay() {
  const { smartWay: dataSlides, global: globalData } = useData()
  const slides = Array.isArray(dataSlides) && dataSlides.length > 0 ? dataSlides : DEFAULT_SLIDES
  const benefits = [
    { accent: getCopy(globalData, 'smartWayBenefit1Accent', 'Sell for more'), text: getCopy(globalData, 'smartWayBenefit1Text', '— 8-10% above market average'), icon: BENEFIT_ICONS[0] },
    { accent: getCopy(globalData, 'smartWayBenefit2Accent', 'Faster Sales'), text: getCopy(globalData, 'smartWayBenefit2Text', '— Properties move 4x faster post-reno'), icon: BENEFIT_ICONS[1] },
    { accent: getCopy(globalData, 'smartWayBenefit3Accent', 'Risk-Free'), text: getCopy(globalData, 'smartWayBenefit3Text', '— Pay nothing until your home sells'), icon: BENEFIT_ICONS[2] },
    { accent: getCopy(globalData, 'smartWayBenefit4Accent', 'Full Service'), text: getCopy(globalData, 'smartWayBenefit4Text', '— We handle all renovations for you'), icon: BENEFIT_ICONS[3] },
  ]
  const [currentIndex, setCurrentIndex] = useState(0)
  const slide = slides[currentIndex]

  const goNext = () => {
    setCurrentIndex((i) => (i + 1) % slides.length)
  }

  const goPrev = () => {
    setCurrentIndex((i) => (i - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    if (slides.length <= 1) return
    const t = setInterval(goNext, CAROUSEL_INTERVAL_MS)
    return () => clearInterval(t)
  }, [slides.length])

  const handlePlayClick = (url) => {
    if (!url) return
    const u = typeof url === 'string' ? url.trim() : ''
    if (!u) return
    if (u.startsWith('http://') || u.startsWith('https://')) {
      window.open(u, '_blank', 'noopener,noreferrer')
    } else if (u.startsWith('#')) {
      window.location.hash = u
    }
  }

  return (
    <section className="smart-way">
      <AnimatedSection className="smart-way__inner">
        <motion.div
          className="smart-way__image"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="smart-way__image-container">
            {/* Render all slides so Instagram embeds start loading before slide is shown */}
            {slides.map((s, i) => {
              const active = i === currentIndex
              const isInstagram = isInstagramReelUrl(s?.link)
              return (
                <div
                  key={i}
                  className={`smart-way__slide ${active ? 'smart-way__slide--active' : ''}`}
                  aria-hidden={!active}
                >
                  {isInstagram && s?.link ? (
                    <a
                      href={s.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="smart-way__thumbnail-clickable smart-way__instagram-link"
                      aria-label={`View on Instagram – ${s?.title || 'Reel'}`}
                    >
                      <div className="smart-way__oval-inner smart-way__carousel-wrap">
                        <div className="smart-way__img-placeholder" aria-hidden />
                        <img
                          src={s?.image ? s.image : getInstagramImageSrc(s.link)}
                          alt={s?.title || `Slide ${i + 1}`}
                          className="smart-way__house-img"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.style.visibility = 'hidden'
                            const wrap = e.target.closest('.smart-way__carousel-wrap')
                            const placeholder = wrap?.querySelector('.smart-way__img-placeholder')
                            if (placeholder) placeholder.classList.add('smart-way__img-placeholder--show')
                          }}
                        />
                      </div>
                      <span className="smart-way__play-btn" aria-hidden>
                        <PlayIcon />
                      </span>
                    </a>
                  ) : (
                    <div
                      className="smart-way__thumbnail-clickable"
                      onClick={() => handlePlayClick(s?.link)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handlePlayClick(s?.link)
                        }
                      }}
                      role="button"
                      tabIndex={active ? 0 : -1}
                      aria-label={`Play – ${s?.title || 'Watch'}`}
                    >
                      <div className="smart-way__oval-inner smart-way__carousel-wrap">
                        <img
                          src={s?.image ? getProxiedImageSrc(s.image) : ''}
                          alt={s?.title || `Slide ${i + 1}`}
                          className="smart-way__house-img"
                        />
                      </div>
                      <span className="smart-way__play-btn" aria-hidden>
                        <PlayIcon />
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
            {slides.length > 1 && (
              <>
                <button
                  type="button"
                  className="smart-way__nav-btn smart-way__nav-btn--left"
                  onClick={goPrev}
                  aria-label="Previous slide"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="smart-way__nav-btn smart-way__nav-btn--right"
                  onClick={goNext}
                  aria-label="Next slide"
                >
                  ›
                </button>
                <div className="smart-way__carousel-dots">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`smart-way__carousel-dot ${i === currentIndex ? 'smart-way__carousel-dot--active' : ''}`}
                      onClick={() => setCurrentIndex(i)}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>
        <motion.div
          className="smart-way__content"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="smart-way__title">
            {getCopy(globalData, 'smartWayTitle', 'The Smart Way to')}{' '}
            <span className="smart-way__title-highlight">{getCopy(globalData, 'smartWayTitleHighlight', 'Sell For More')}</span>
          </h2>
          <p className="smart-way__text">
            {getCopy(globalData, 'smartWayBody', "Fix2Sell helps you increase your home's value before listing it for sale. We make the right upgrades to improve its appeal and selling price — without you paying any renovation costs upfront.")}
          </p>
          <ul className="smart-way__list">
            {benefits.map((item, i) => (
              <motion.li
                key={i}
                className="smart-way__item"
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <span className="smart-way__item-icon" aria-hidden>
                  <BenefitIcon name={item.icon} />
                </span>
                <span>
                  <span className="smart-way__item-accent">{item.accent}</span>
                  {item.text}
                </span>
              </motion.li>
            ))}
          </ul>
          <a href="#inquire" className="smart-way__cta">
            {getCopy(globalData, 'smartWayCta', 'Learn More About Fix2Sell')}
            <ArrowIcon />
          </a>
        </motion.div>
      </AnimatedSection>
    </section>
  )
}

function BenefitIcon({ name }) {
  const icons = {
    chart: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17l5-5 4 4 5-9" />
        <path d="M14 7h3v3" />
      </svg>
    ),
    clock: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="7.5" />
        <path d="M10 5.5V10l3 1.5" />
      </svg>
    ),
    shield: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2L3 5.5v5c0 4.14 3.5 7.5 7 8.5 3.5-1 7-4.36 7-8.5v-5L10 2z" />
        <path d="M7 10l2 2 4-4" />
      </svg>
    ),
    check: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="7.5" />
        <path d="M7 10l2 2 4-4" />
      </svg>
    ),
  }
  return icons[name] || icons.check
}

function AvatarIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="8" r="4" />
      <path d="M12 14c-4 0-7 2-7 4.5V20h14v-1.5c0-2.5-3-4.5-7-4.5z" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10h11.67M10 4.17l5.83 5.83-5.83 5.83" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="32" cy="32" r="32" fill="rgba(0,0,0,0.5)" />
      <path d="M26 20v24l18-12-18-12z" fill="#fff" />
    </svg>
  )
}
