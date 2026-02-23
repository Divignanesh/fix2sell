import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AnimatedSection } from './AnimatedSection'
import { useData } from '../context/DataContext'
import './CTA.css'

function getCopy(data, key, fallback) {
  const v = data && data[key]
  return v !== undefined && v !== null ? String(v).trim() : fallback
}

export default function CTA() {
  const location = useLocation()
  const { global: globalData } = useData()
  const bookAMeetingUrl = (globalData && globalData.bookAMeetingUrl) || ''
  const bookAMeetingLabel = (globalData && globalData.bookAMeetingLabel) || 'Book A Meeting'
  const inquireHref = bookAMeetingUrl || (location.pathname === '/renograde' ? '/#inquire' : '#inquire')

  return (
    <AnimatedSection className="cta">
      <div className="cta__inner">
        <motion.h2
          className="cta__title"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {getCopy(globalData, 'ctaTitle', "Ready To Maximize Your Home's Value?")}
        </motion.h2>
        <motion.p
          className="cta__text"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {getCopy(globalData, 'ctaText', "Join hundreds of homeowners who've sold for 8-10% above market value with Fix2Sell. Get your free home evaluation and personalized renovation plan today.")}
        </motion.p>
        <motion.a
          href={inquireHref}
          className="cta__button"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          {bookAMeetingLabel}
          <ArrowIcon />
        </motion.a>
      </div>
    </AnimatedSection>
  )
}

function ArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.17 10h11.67M10 4.17l5.83 5.83-5.83 5.83" />
    </svg>
  )
}
