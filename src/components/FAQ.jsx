import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedSection } from './AnimatedSection'
import { useData } from '../context/DataContext'
import './FAQ.css'

function getCopy(data, key, fallback) {
  const v = data && data[key]
  return v !== undefined && v !== null ? String(v).trim() : fallback
}

const defaultItems = [
  { q: 'Do I need to pay anything upfront?', a: 'No. Fix2Sell covers all renovation costs upfront. You only pay when your home sells, from the sale proceeds.' },
  { q: "What if my home doesn't sell for more after the upgrades?", a: 'We work with you to set realistic targets. Our Reno-Grader and market analysis help ensure upgrades are chosen for maximum ROI in your area.' },
  { q: 'Who manages the contractors and renovation work?', a: 'We do. Fix2Sell coordinates all contractors, timelines, and quality so you can focus on your move.' },
  { q: 'How long does the Fix2Sell process take?', a: 'Typically 4–8 weeks from assessment to listing, depending on scope. We’ll give you a clear timeline after your evaluation.' },
  { q: 'Am I obligated to list my home with you after getting the RenoGrade™ score?', a: 'No. The RenoGrade™ score and consultation are free with no obligation to use our listing services.' },
  { q: 'What kind of upgrades qualify for Fix2Sell?', a: 'We focus on value-boosting improvements: kitchens, baths, flooring, paint, staging, and key repairs that increase sale price.' },
]

export default function FAQ() {
  const { faq: dataFaq, global: globalData } = useData()
  const items = Array.isArray(dataFaq) && dataFaq.length > 0 ? dataFaq : defaultItems
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <AnimatedSection className="faq">
      <div className="faq__inner">
        <motion.h2
          className="faq__title"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {getCopy(globalData, 'faqTitle', 'Frequently Asked Questions')}
        </motion.h2>
        <motion.p
          className="faq__subtitle"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {getCopy(globalData, 'faqSubtitle', 'Short, straight answers to the most common questions sellers ask before they use Fix2Sell and request their RenoGrade™ score.')}
        </motion.p>
        <div className="faq__list">
          {items.map((item, i) => (
            <motion.div
              key={i}
              className="faq__item-wrap"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <button
                type="button"
                className={`faq__item ${openIndex === i ? 'faq__item--open' : ''}`}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
                aria-controls={`faq-answer-${i}`}
                id={`faq-question-${i}`}
              >
                <span>{item.q}</span>
                <span className="faq__icon" aria-hidden>
                  <ChevronIcon open={openIndex === i} />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    id={`faq-answer-${i}`}
                    className="faq__answer"
                    role="region"
                    aria-labelledby={`faq-question-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <p className="faq__answer-text">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}

function ChevronIcon({ open }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)' }}>
      <path d="M4 6l4 4 4-4" />
    </svg>
  )
}
