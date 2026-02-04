import { useRef, useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { AnimatedSection } from './AnimatedSection'
import { useData } from '../context/DataContext'
import './Testimonials.css'

const defaultTestimonials = [
  { id: 1, quote: "\"To them it's not about the sale, it's about trying to help families move on. They treated me like I was their only client, and I had that one-on-one attention.\"", name: "Charlisa Boyd", location: "Sold to Opendoor in Raleigh, NC", image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&h=200&q=80" },
  { id: 2, quote: "\"Opendoor's offer came in right near our appraisal, but we never had to list the house or do showings. For the kind of value Opendoor gives you, it's just a no-brainer.\"", name: "Adam Leon", location: "Sold to Opendoor in Phoenix, AZ", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80" },
  { id: 3, quote: "\"The whole process was incredibly smooth. Fix2Sell handled everything from renovations to staging. We sold for 15% more than expected!\"", name: "Sarah Mitchell", location: "Sold in Austin, TX", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80" },
  { id: 4, quote: "\"I was skeptical at first, but the team delivered beyond my expectations. The renovation suggestions were spot-on and the ROI was amazing.\"", name: "Michael Chen", location: "Sold in San Francisco, CA", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200&q=80" },
]

function isValidImageUrl(url) {
  if (!url || typeof url !== 'string') return false
  const u = url.trim()
  return u.startsWith('http://') || u.startsWith('https://')
}

export default function Testimonials() {
  const { testimonials: dataTestimonials } = useData()
  const testimonials = Array.isArray(dataTestimonials) && dataTestimonials.length > 0 ? dataTestimonials : defaultTestimonials
  const scrollRef = useRef(null)
  const loadedKeysRef = useRef(new Set())
  const quoteWrapRefs = useRef([])
  const [failedImages, setFailedImages] = useState(() => new Set())
  const [loadedImages, setLoadedImages] = useState(() => new Set())
  const [overflowIndices, setOverflowIndices] = useState(() => new Set())
  const [scrollableIndices, setScrollableIndices] = useState(() => new Set())

  const markImageFailed = (idx) =>
    setFailedImages((s) => new Set(s).add(idx))
  const markImageLoaded = (idx, url) => {
    const key = `${idx}-${url}`
    loadedKeysRef.current.add(key)
    setLoadedImages((s) => new Set(s).add(idx))
  }

  const checkOverflow = useCallback(() => {
    const next = new Set()
    quoteWrapRefs.current.forEach((el, i) => {
      if (el && el.scrollHeight > el.clientHeight) next.add(i)
    })
    setOverflowIndices((prev) =>
      prev.size === next.size && [...prev].every((i) => next.has(i)) ? prev : next
    )
  }, [])

  useEffect(() => {
    const t = setTimeout(checkOverflow, 100)
    return () => clearTimeout(t)
  }, [testimonials, checkOverflow])

  useEffect(() => {
    const ro = new ResizeObserver(checkOverflow)
    quoteWrapRefs.current.forEach((el) => el && ro.observe(el))
    return () => ro.disconnect()
  }, [testimonials, checkOverflow])

  const toggleScrollable = (idx) => {
    setScrollableIndices((s) => {
      const next = new Set(s)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  // Scroll 2 cards at a time (card width 290px + gap 20px = 310px each, 2 cards = 620px)
  const scrollAmount = 620
  
  const handlePrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
    }
  }
  
  const handleNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <AnimatedSection className="testimonials">
      <div className="testimonials__inner">
        <div className="testimonials__left">
          <motion.h2
            className="testimonials__title"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="testimonials__title-orange">Join our customers</span>{' '}
            <span className="testimonials__title-dark">and move without the hassle</span>
          </motion.h2>
          
          <div className="testimonials__nav">
            <button 
              className="testimonials__nav-btn" 
              onClick={handlePrev}
              aria-label="Previous testimonials"
            >
              <ArrowLeftIcon />
            </button>
            <button 
              className="testimonials__nav-btn" 
              onClick={handleNext}
              aria-label="Next testimonials"
            >
              <ArrowRightIcon />
            </button>
          </div>
        </div>
        
        <div className="testimonials__cards" ref={scrollRef}>
          {testimonials.map((item, idx) => {
            const imageUrl = item.image && isValidImageUrl(item.image) ? item.image.trim() : null
            const loadKey = imageUrl ? `${idx}-${imageUrl}` : ''
            const alreadyLoaded = loadKey && loadedKeysRef.current.has(loadKey)
            const showImg = imageUrl && (alreadyLoaded || !failedImages.has(idx))
            return (
            <article key={item.id ?? idx} className="testimonials__card">
              <div className="testimonials__card-photo">
                {showImg ? (
                  <img
                    src={imageUrl}
                    alt={item.name || 'Testimonial'}
                    onLoad={() => markImageLoaded(idx, imageUrl)}
                    onError={() => {
                      if (!loadedKeysRef.current.has(loadKey)) markImageFailed(idx)
                    }}
                  />
                ) : (
                  <div className="testimonials__card-photo-placeholder" aria-hidden />
                )}
              </div>
              <div
                className={`testimonials__card-quote-wrap ${scrollableIndices.has(idx) ? 'testimonials__card-quote-wrap--scrollable' : ''}`}
                ref={(el) => { quoteWrapRefs.current[idx] = el }}
              >
                <p className="testimonials__card-quote">{item.quote}</p>
              </div>
              {overflowIndices.has(idx) && (
                <button
                  type="button"
                  className="testimonials__card-readmore"
                  onClick={() => toggleScrollable(idx)}
                  aria-expanded={scrollableIndices.has(idx)}
                >
                  {scrollableIndices.has(idx) ? 'Show less' : 'Read more'}
                </button>
              )}
              <div className="testimonials__card-author">
                <span className="testimonials__card-name">{item.name}</span>
                <span className="testimonials__card-location">{item.location}</span>
              </div>
            </article>
          )})}
        </div>
      </div>
    </AnimatedSection>
  )
}

function ArrowLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 10H5M10 5l-5 5 5 5" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 10h10M10 5l5 5-5 5" />
    </svg>
  )
}
