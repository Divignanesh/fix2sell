import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AnimatedSection } from './AnimatedSection'
import { useData } from '../context/DataContext'
import { getProxiedImageSrc } from '../utils/imageProxy'
import './RenoGrader.css'

function getCopy(data, key, fallback) {
  const v = data && data[key]
  return v !== undefined && v !== null ? String(v).trim() : fallback
}

const FEATURE_ICONS = ['chart', 'budget', 'clock', 'person']
const FEATURE_COLORS = ['#F59E0B', '#10B981', '#3B82F6', '#F97316']

const DEFAULT_IMAGE_1 = 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80'
const DEFAULT_IMAGE_2 = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=400&q=80'

function getImageSrc(globalData, key, fallbackUrl) {
  const v = globalData && globalData[key]
  if (!v || typeof v !== 'string') return fallbackUrl
  const u = v.trim()
  if (u.startsWith('/')) return u
  return getProxiedImageSrc(u)
}

export default function RenoGrader() {
  const { global: globalData } = useData()
  const image1Src = getImageSrc(globalData, 'renoGraderImage1', DEFAULT_IMAGE_1)
  const image2Src = getImageSrc(globalData, 'renoGraderImage2', DEFAULT_IMAGE_2)
  const features = [
    { text: getCopy(globalData, 'renoGraderFeature1', 'ROI analysis for every improvement'), icon: FEATURE_ICONS[0], color: FEATURE_COLORS[0] },
    { text: getCopy(globalData, 'renoGraderFeature2', 'Budget optimization strategies'), icon: FEATURE_ICONS[1], color: FEATURE_COLORS[1] },
    { text: getCopy(globalData, 'renoGraderFeature3', 'Timeline and cost projections'), icon: FEATURE_ICONS[2], color: FEATURE_COLORS[2] },
    { text: getCopy(globalData, 'renoGraderFeature4', 'Market comparison insights'), icon: FEATURE_ICONS[3], color: FEATURE_COLORS[3] },
  ]

  return (
    <div className="reno-grader">
      <AnimatedSection className="reno-grader__inner">
        <div className="reno-grader__content">
          <motion.span
            className="reno-grader__badge"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            {getCopy(globalData, 'renoGraderBadge', 'Exclusive Tool')}
          </motion.span>
          <motion.h2
            className="reno-grader__title"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/renograde#renograde-hero" className="reno-grader__title-link">
              {getCopy(globalData, 'renoGraderTitlePrefix', 'Introducing the')}{' '}
              <span className="reno-grader__title-highlight">{getCopy(globalData, 'renoGraderTitleHighlight', 'Reno-Grader')}</span>
            </Link>
          </motion.h2>
          <motion.p
            className="reno-grader__text"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {getCopy(globalData, 'renoGraderBody', 'Our proprietary Reno-Grader tool analyzes your property and local market data to recommend the exact renovations that will deliver the highest return on investment. No guesswork, just proven results.')}
          </motion.p>
          <ul className="reno-grader__list">
            {features.map((item, i) => (
              <motion.li
                key={i}
                className="reno-grader__item"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <span className="reno-grader__item-icon" style={{ background: `${item.color}15`, color: item.color }} aria-hidden>
                  <FeatureIcon name={item.icon} />
                </span>
                <span>{item.text}</span>
              </motion.li>
            ))}
          </ul>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link to="/renograde#renograde-hero" className="reno-grader__cta">
              {getCopy(globalData, 'renoGraderCta', 'Try Reno-Grade for Free Estimate')}
            </Link>
          </motion.div>
        </div>
        <motion.div
          className="reno-grader__images"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="reno-grader__image reno-grader__image--main">
            <img
              src={image1Src}
              alt="Modern living room interior"
            />
          </div>
          <div className="reno-grader__image reno-grader__image--secondary">
            <img
              src={image2Src}
              alt="Beautiful kitchen interior"
            />
          </div>
        </motion.div>
      </AnimatedSection>
    </div>
  )
}

function FeatureIcon({ name }) {
  const icons = {
    chart: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <rect x="2" y="10" width="4" height="8" rx="1" />
        <rect x="8" y="6" width="4" height="12" rx="1" />
        <rect x="14" y="2" width="4" height="16" rx="1" />
      </svg>
    ),
    budget: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <rect x="2" y="4" width="16" height="3" rx="1" />
        <rect x="2" y="9" width="12" height="3" rx="1" />
        <rect x="2" y="14" width="8" height="3" rx="1" />
      </svg>
    ),
    clock: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="8" />
        <path d="M10 5v5l3.5 1.75" />
      </svg>
    ),
    person: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <circle cx="10" cy="6" r="3.5" />
        <path d="M3 18c0-4 3.5-6 7-6s7 2 7 6H3z" />
      </svg>
    ),
  }
  return icons[name] || icons.chart
}
