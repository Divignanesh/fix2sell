import { motion } from 'framer-motion'
import { AnimatedSection } from './AnimatedSection'
import { useData } from '../context/DataContext'
import './WhySell.css'

function getCopy(data, key, fallback) {
  const v = data && data[key]
  return v !== undefined && v !== null ? String(v).trim() : fallback
}

const DEFAULT_TITLE = 'Why Most Homes Sell Below Market Value?'
const DEFAULT_INTRO = 'Sellers typically fall into one of these three categories. Fix2Sell solves all three problems.'
const DEFAULT_CARDS = [
  { title: 'Price assurance', desc: 'Feel secure knowing your project cost won\'t rise unexpectedly due to changes in material or labor prices.', icon: 'price' },
  { title: 'Contractor re-match', desc: 'In the rare event your contractor is unable to complete the job, we\'ll connect you with another qualified pro to keep your project on track.', icon: 'contractor' },
  { title: 'Customer Support', desc: 'Should an issue arise, Fix2Sell is there to help resolve it smoothly and provide support.', icon: 'support' },
  { title: 'Workmanship warranty', desc: 'Every contractor in our network stands behind their work by providing a workmanship warranty.', icon: 'warranty' },
]

export default function WhySell() {
  const { global: globalData } = useData()
  const title = getCopy(globalData, 'whySellTitle', DEFAULT_TITLE)
  const intro = getCopy(globalData, 'whySellIntro', DEFAULT_INTRO)
  const cards = [
    { title: getCopy(globalData, 'whySellCard1Title', DEFAULT_CARDS[0].title), desc: getCopy(globalData, 'whySellCard1Desc', DEFAULT_CARDS[0].desc), icon: DEFAULT_CARDS[0].icon },
    { title: getCopy(globalData, 'whySellCard2Title', DEFAULT_CARDS[1].title), desc: getCopy(globalData, 'whySellCard2Desc', DEFAULT_CARDS[1].desc), icon: DEFAULT_CARDS[1].icon },
    { title: getCopy(globalData, 'whySellCard3Title', DEFAULT_CARDS[2].title), desc: getCopy(globalData, 'whySellCard3Desc', DEFAULT_CARDS[2].desc), icon: DEFAULT_CARDS[2].icon },
    { title: getCopy(globalData, 'whySellCard4Title', DEFAULT_CARDS[3].title), desc: getCopy(globalData, 'whySellCard4Desc', DEFAULT_CARDS[3].desc), icon: DEFAULT_CARDS[3].icon },
  ]

  return (
    <AnimatedSection className="why-sell">
      <div className="why-sell__inner">
        <motion.div
          className="why-sell__content"
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="why-sell__icon-wrap">
            <IconChartDepreciation />
          </div>
          <h2 className="why-sell__title">{title}</h2>
          <p className="why-sell__text">{intro}</p>
        </motion.div>
        <div className="why-sell__cards">
          {cards.map((card, i) => (
            <motion.article
              key={card.title}
              className="why-sell__card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="why-sell__card-icon">
                <CardIcon name={card.icon} />
              </div>
              <h3 className="why-sell__card-title">{card.title}</h3>
              <p className="why-sell__card-desc">{card.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}

/* Main icon: bar chart (one bar lower) + downward arrow – steel blue */
function IconChartDepreciation() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="16" y="20" width="8" height="24" rx="2" fill="currentColor" opacity="0.85" />
      <rect x="28" y="12" width="8" height="32" rx="2" fill="currentColor" />
      <rect x="40" y="28" width="8" height="16" rx="2" fill="currentColor" opacity="0.6" />
      <path d="M12 10l8 8 6-6 8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28 8v2M28 46v2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M8 28h2M46 28h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

function CardIcon({ name }) {
  const icons = {
    price: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        {/* Wallet icon */}
        <rect x="6" y="12" width="28" height="20" rx="3" stroke="currentColor" strokeWidth="1.8" fill="none" />
        <path d="M6 18h28" stroke="currentColor" strokeWidth="1.8" />
        <path d="M10 8h16a4 4 0 014 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        <rect x="24" y="22" width="6" height="4" rx="1" fill="currentColor" opacity="0.6" />
        <circle cx="27" cy="24" r="1" fill="currentColor" />
      </svg>
    ),
    contractor: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <circle cx="14" cy="14" r="4" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="26" cy="14" r="4" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 26c0-2.2 1.8-4 4-4h12c2.2 0 4 1.8 4 4v4H10v-4z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 22h4M16 28h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    support: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <circle cx="20" cy="16" r="6" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 28c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M20 32v-2a2 2 0 012-2h4l2 4-2 2h-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    warranty: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M20 6L8 14v12h24V14L20 6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
        <path d="M16 22l3 3 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  }
  return icons[name] || null
}
