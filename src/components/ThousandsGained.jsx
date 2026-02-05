import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useData } from '../context/DataContext'
import { MediaAsset } from './MediaAsset'
import './ThousandsGained.css'

const defaultCards = [
  { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=400&h=533&q=70', renovation: '$44,605', profit: '$30,395', location: 'Riverside' },
  { image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&h=533&q=70', renovation: '$38,200', profit: '$41,800', location: 'Fremont' },
  { image: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&w=400&h=533&q=70', renovation: '$52,100', profit: '$28,900', location: 'Panorama City' },
  { image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&h=533&q=70', renovation: '$41,350', profit: '$35,650', location: 'Costa Mesa' },
  { image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&h=533&q=70', renovation: '$61,200', profit: '$48,800', location: 'San Francisco' },
  { image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=400&h=533&q=70', renovation: '$35,900', profit: '$27,100', location: 'Oakland' },
]

function MapPinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function ThousandsGained() {
  const { thousandsGained: dataCards, global: globalData } = useData()
  const cards = Array.isArray(dataCards) && dataCards.length > 0 ? dataCards : defaultCards
  const scrollRef = useRef(null)
  const ctaHref = (globalData && globalData.unlockPotentialUrl) || '#inquire'
  const ctaLabel = (globalData && globalData.unlockPotentialLabel) || 'CLICK TO UNLOCK YOUR HOME POTENTIAL'

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const step = 320
    const delay = 3500
    const interval = setInterval(() => {
      const maxScroll = el.scrollWidth - el.clientWidth
      if (maxScroll <= 0) return
      const next = el.scrollLeft + step
      if (next >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        el.scrollTo({ left: next, behavior: 'smooth' })
      }
    }, delay)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="thousands-gained">
      <div className="thousands-gained__inner">
        <motion.h2
          className="thousands-gained__title"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="thousands-gained__title-orange">Thousands</span>{' '}
          <span className="thousands-gained__title-blue">gained by homeowners</span>
        </motion.h2>
      </div>

      <div className="thousands-gained__carousel-wrap">
        <div
          ref={scrollRef}
          className="thousands-gained__carousel"
          role="region"
          aria-label="Homeowner results carousel"
        >
          {cards.map((card, i) => (
            <article key={i} className="thousands-gained__card">
              <div className="thousands-gained__card-image-wrap">
                <MediaAsset
                  url={card.image}
                  type={card.imageType}
                  alt=""
                  className="thousands-gained__card-image"
                />
                <div className="thousands-gained__card-overlay">
                  <div className="thousands-gained__card-figures">
                    <div className="thousands-gained__figure">
                      <span className="thousands-gained__figure-value thousands-gained__figure-value--renovation">
                        {card.renovation}
                      </span>
                      <span className="thousands-gained__figure-label">Renovation</span>
                    </div>
                    <div className="thousands-gained__figure">
                      <span className="thousands-gained__figure-value thousands-gained__figure-value--profit">
                        {card.profit}
                      </span>
                      <span className="thousands-gained__figure-label">Profit</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="thousands-gained__card-location">
                <span className="thousands-gained__card-pin" aria-hidden>
                  <MapPinIcon />
                </span>
                <span>{card.location}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="thousands-gained__inner">
        <motion.p
          className="thousands-gained__disclaimer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Individual results may vary. Testimonials are not intended to guarantee the same or similar results.
        </motion.p>

        <motion.a
          href={ctaHref}
          className="thousands-gained__cta"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {ctaLabel}
        </motion.a>
      </div>
    </section>
  )
}
