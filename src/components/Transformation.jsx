import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedSection } from './AnimatedSection'
import { useData } from '../context/DataContext'
import { MediaAsset } from './MediaAsset'
import './Transformation.css'

function getCopy(data, key, fallback) {
  const v = data && data[key]
  return v !== undefined && v !== null ? String(v).trim() : fallback
}

const AUTO_SCROLL_INTERVAL_MS = 3000

const defaultSlides = [
  {
    label: 'Kitchen Transformation',
    before: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=60',
    after: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=60',
    stats: [
      { value: '$18,500', label: 'Investment' },
      { value: '$52,000', label: 'Value Increase' },
      { value: '4 days', label: 'To Sell' },
    ],
  },
  {
    label: 'Bathroom Transformation',
    before: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=60',
    after: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=60',
    stats: [
      { value: '$12,200', label: 'Investment' },
      { value: '$28,000', label: 'Value Increase' },
      { value: '3 days', label: 'To Sell' },
    ],
  },
  {
    label: 'Living Room Transformation',
    before: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=60',
    after: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60',
    stats: [
      { value: '$15,000', label: 'Investment' },
      { value: '$35,000', label: 'Value Increase' },
      { value: '5 days', label: 'To Sell' },
    ],
  },
]

function ArrowLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

function isValidSlide(item) {
  return item && typeof item === 'object' && (item.before != null || item.after != null || item.label)
}

export default function Transformation() {
  const { transformation: dataSlides, global: globalData } = useData()
  const rawSlides = Array.isArray(dataSlides) && dataSlides.length > 0 ? dataSlides : defaultSlides
  const slides = rawSlides.filter(isValidSlide)
  const safeSlides = slides.length > 0 ? slides : defaultSlides
  const [currentIndex, setCurrentIndex] = useState(0)
  const index = Math.min(currentIndex, safeSlides.length - 1)
  const slide = safeSlides[index]

  const isCarousel = safeSlides.length > 1
  const goPrev = () => setCurrentIndex((i) => (i === 0 ? safeSlides.length - 1 : i - 1))
  const goNext = () => setCurrentIndex((i) => (i === safeSlides.length - 1 ? 0 : i + 1))

  useEffect(() => {
    if (!isCarousel) return
    const timer = setInterval(goNext, AUTO_SCROLL_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [isCarousel])

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, safeSlides.length - 1))
  }, [safeSlides.length])

  return (
    <AnimatedSection className="transformation">
      <div className="transformation__inner">
        <div className="transformation__header">
          <motion.h2
            className="transformation__title"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {getCopy(globalData, 'transformationTitle', 'See The Transformation')}
          </motion.h2>
          <motion.p
            className="transformation__subtitle"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {getCopy(globalData, 'transformationSubtitle', 'Strategic renovations that dramatically increase home value and sell faster')}
          </motion.p>
        </div>

        <div className="transformation__carousel-wrap">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="transformation__slide"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
            >
              <div className="transformation__images">
                <div className="transformation__image-card transformation__image-card--before">
                  <MediaAsset url={slide.before} type={slide.beforeType} alt={getCopy(globalData, 'transformationLabelBefore', 'Before')} />
                  <span className="transformation__image-label">{getCopy(globalData, 'transformationLabelBefore', 'Before')}</span>
                </div>
                <div className="transformation__image-card transformation__image-card--after">
                  <MediaAsset url={slide.after} type={slide.afterType} alt={getCopy(globalData, 'transformationLabelAfter', 'After')} />
                  <span className="transformation__image-label">{getCopy(globalData, 'transformationLabelAfter', 'After')}</span>
                </div>
              </div>
              <p className="transformation__section-label">{slide.label}</p>
              <div className="transformation__stats">
                {(Array.isArray(slide.stats) ? slide.stats : []).map((stat, idx) => (
                  <div key={stat?.label ?? stat?.value ?? idx} className="transformation__stat">
                    <span className="transformation__stat-value">{stat?.value}</span>
                    <span className="transformation__stat-label">{stat?.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {isCarousel && (
            <>
              <button
                type="button"
                className="transformation__nav-btn transformation__nav-btn--left"
                onClick={(e) => { e.stopPropagation(); goPrev() }}
                aria-label="Previous slide"
              >
                <ArrowLeftIcon />
              </button>
              <button
                type="button"
                className="transformation__nav-btn transformation__nav-btn--right"
                onClick={(e) => { e.stopPropagation(); goNext() }}
                aria-label="Next slide"
              >
                <ArrowRightIcon />
              </button>
            </>
          )}
        </div>

        {isCarousel && (
          <>
            <button
              type="button"
              className="transformation__zone transformation__zone--left"
              onClick={goPrev}
              aria-label="Previous slide"
            />
            <button
              type="button"
              className="transformation__zone transformation__zone--right"
              onClick={goNext}
              aria-label="Next slide"
            />
          </>
        )}
      </div>
    </AnimatedSection>
  )
}
