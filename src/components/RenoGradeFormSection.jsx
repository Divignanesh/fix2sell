import { useState } from 'react'
import { motion } from 'framer-motion'
import { useData } from '../context/DataContext'
import './RenoGradeFormSection.css'

function isValidIframeUrl(url) {
  if (!url || typeof url !== 'string') return false
  const u = url.trim()
  return u.startsWith('http://') || u.startsWith('https://')
}

const planItems = [
  'Your RenoGrade score',
  "The value you're leaving on the table",
  'A path to pay $0 upfront and settle at closing',
  'The 3-5 upgrades with the highest ROI',
  'Your projected list price with improvements',
]

const rankItems = [
  { range: '80-100', label: 'Ready to shine' },
  { range: '60-79', label: 'Strong ROI zone' },
  { range: '40-59', label: 'Makeover opportunity' },
  { range: '0-39', label: 'Big upside potential' },
]

const whyItems = [
  'What buyers really think',
  'Your true pricing potential',
  'The upgrades that increase value',
  'How your home compares to others',
]

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" fill="#D1FAE5" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function XCircleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" fill="#FEE2E2" />
      <path d="m15 9-6 6M9 9l6 6" />
    </svg>
  )
}

/* Checkmark circle outline – outline circle + outline checkmark (IonIcons / SVG Repo style) */
function OrangeCheckIcon() {
  return (
    <svg
      className="reno-grade-form__check-circle-svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}

function BenefitIcon({ name }) {
  const icons = {
    chart: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <rect x="2" y="10" width="4" height="8" rx="1" />
        <rect x="8" y="6" width="4" height="12" rx="1" />
        <rect x="14" y="2" width="4" height="16" rx="1" />
      </svg>
    ),
    clock: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="8" />
        <path d="M10 5v5l3.5 1.75" />
      </svg>
    ),
    shield: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2L3 5v5c0 5 7 8 7 8s7-3 7-8V5l-7-3z" />
      </svg>
    ),
    check: <OrangeCheckIcon />,
  }
  return <span className="reno-grade-form__benefit-icon-inner">{icons[name] || icons.check}</span>
}

export default function RenoGradeFormSection() {
  const { global: globalData } = useData()
  const renogradeFormIframeUrl = (globalData && globalData.renogradeFormIframeUrl) ? globalData.renogradeFormIframeUrl.trim() : ''
  const renogradeFormIframeHeight = (() => {
    const v = globalData && globalData.renogradeFormIframeHeight
    if (v === undefined || v === null || v === '') return 1482
    const n = parseInt(String(v).trim(), 10)
    return Number.isFinite(n) && n > 0 ? n : 1482
  })()
  const [agreed, setAgreed] = useState(false)

  return (
    <section className="reno-grade-form">
      <div className="reno-grade-form__inner">
        {/* Left: Form or iframe */}
        <div className="reno-grade-form__form-wrap">
          <div className="reno-grade-form__form-box">
            {isValidIframeUrl(renogradeFormIframeUrl) ? (
              <iframe
                src={renogradeFormIframeUrl}
                className="reno-grade-form__iframe"
                title="RenoGrade form"
                height={renogradeFormIframeHeight}
              />
            ) : (
            <form className="reno-grade-form__form" onSubmit={(e) => e.preventDefault()}>
              <div className="reno-grade-form__field reno-grade-form__field--search">
                <label>Address *</label>
                <span className="reno-grade-form__input-wrap">
                  <span className="reno-grade-form__search-icon" aria-hidden><SearchIcon /></span>
                  <input type="text" placeholder="Search address" required />
                </span>
              </div>
              <div className="reno-grade-form__field">
                <label>Street Address *</label>
                <input type="text" placeholder="Address" required />
              </div>
              <div className="reno-grade-form__row">
                <div className="reno-grade-form__field">
                  <label>City *</label>
                  <input type="text" placeholder="City" required />
                </div>
                <div className="reno-grade-form__field">
                  <label>State *</label>
                  <input type="text" placeholder="State" required />
                </div>
              </div>
              <div className="reno-grade-form__row">
                <div className="reno-grade-form__field">
                  <label>Country</label>
                  <span className="reno-grade-form__select-wrap">
                    <select>
                      <option value="">Country</option>
                    </select>
                    <ChevronDownIcon />
                  </span>
                </div>
                <div className="reno-grade-form__field">
                  <label>Postal Code</label>
                  <input type="text" placeholder="Postal Code" />
                </div>
              </div>
              <div className="reno-grade-form__row">
                <div className="reno-grade-form__field">
                  <label>First Name *</label>
                  <input type="text" placeholder="First Name" required />
                </div>
                <div className="reno-grade-form__field">
                  <label>Last Name *</label>
                  <input type="text" placeholder="Last Name" required />
                </div>
              </div>
              <div className="reno-grade-form__row">
                <div className="reno-grade-form__field">
                  <label>Phone *</label>
                  <input type="tel" placeholder="Phone" required />
                </div>
                <div className="reno-grade-form__field">
                  <label>Email *</label>
                  <input type="email" placeholder="Email" required />
                </div>
              </div>
              <div className="reno-grade-form__field">
                <label>Home Condition</label>
                <span className="reno-grade-form__select-wrap">
                  <select>
                    <option value="">Select</option>
                  </select>
                  <ChevronDownIcon />
                </span>
              </div>
              <div className="reno-grade-form__field">
                <label>Kitchen/Bath Condition</label>
                <span className="reno-grade-form__select-wrap">
                  <select>
                    <option value="">Select</option>
                  </select>
                  <ChevronDownIcon />
                </span>
              </div>
              <div className="reno-grade-form__field">
                <label>Exterior / Curb Appeal</label>
                <span className="reno-grade-form__select-wrap">
                  <select>
                    <option value="">Select</option>
                  </select>
                  <ChevronDownIcon />
                </span>
              </div>
              <div className="reno-grade-form__field">
                <label>Selling Timeline</label>
                <span className="reno-grade-form__select-wrap">
                  <select>
                    <option value="">Select</option>
                  </select>
                  <ChevronDownIcon />
                </span>
              </div>
              <div className="reno-grade-form__field">
                <label>What&apos;s the most important thing your home needs focus on?</label>
                <textarea placeholder="Your answer" rows={4} />
              </div>
              <label className="reno-grade-form__checkbox-wrap">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                <span className="reno-grade-form__checkbox-text">
                  By checking this box, I agree to receive marketing communications from this business, including text messages and phone calls. I understand that some calls may be automated, pre-recorded, or use an AI voice agent. Message frequency may vary and message/data rates may apply. I may reply STOP at any time to opt out or HELP for assistance.
                </span>
              </label>
              <button type="submit" className="reno-grade-form__submit">
                Proceed To Unlock Potential
              </button>
            </form>
            )}
          </div>
        </div>

        {/* Right: Info content */}
        <div className="reno-grade-form__content">
          <motion.h2
            className="reno-grade-form__main-heading"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            RenoGrade – Your <span className="reno-grade-form__highlight">Home&apos;s Sale-Readiness</span> Score in 60 Seconds
          </motion.h2>
          <motion.p
            className="reno-grade-form__main-subtitle"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            Buyers don&apos;t set the price — your home&apos;s condition does. RenoGrade reveals your hidden value gap before you list.
          </motion.p>

          {/* Why You Need This Score – with orange divider above */}
          <hr className="reno-grade-form__divider reno-grade-form__divider--orange" />
          <div className="reno-grade-form__block">
            <h3 className="reno-grade-form__block-title reno-grade-form__block-title--bold">
              Why You Need This <span className="reno-grade-form__highlight">Score</span>
            </h3>
            <p className="reno-grade-form__block-intro">Buyers instantly decide:</p>
            <div className="reno-grade-form__decide">
              <span className="reno-grade-form__decide-item">
                <CheckCircleIcon />
                <span>This is move-in ready</span>
              </span>
              <span className="reno-grade-form__decide-item">
                <XCircleIcon />
                <span>This home needs money</span>
              </span>
            </div>
            <p className="reno-grade-form__block-intro reno-grade-form__subsection-title">Reno-Grade reveals:</p>
            <ul className="reno-grade-form__benefit-list reno-grade-form__grid-2col">
              {whyItems.map((text, i) => (
                <li key={i} className="reno-grade-form__benefit-item">
                  <span className="reno-grade-form__benefit-icon">
                    <BenefitIcon name="check" />
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <p className="reno-grade-form__block-outro">All summarized in a clear score out of 100.</p>
          </div>
          <hr className="reno-grade-form__divider" />

          <div className="reno-grade-form__block">
            <h3 className="reno-grade-form__block-title reno-grade-form__block-title--bold">
              Your Customized <span className="reno-grade-form__highlight">Fix2Sell</span> Plan Includes:
            </h3>
            <ul className="reno-grade-form__plan-list reno-grade-form__grid-2col">
              {planItems.map((text, i) => (
                <li key={i} className="reno-grade-form__plan-item">
                  <span className="reno-grade-form__benefit-icon">
                    <BenefitIcon name="check" />
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <hr className="reno-grade-form__divider" />

          <div className="reno-grade-form__block">
            <h3 className="reno-grade-form__block-title reno-grade-form__block-title--bold">
              Where Does Your <span className="reno-grade-form__highlight">Home Rank?</span>
            </h3>
            <ul className="reno-grade-form__rank-list reno-grade-form__grid-2col">
              {rankItems.map((item, i) => (
                <li key={i} className="reno-grade-form__rank-item">
                  <span className="reno-grade-form__benefit-icon">
                    <BenefitIcon name="check" />
                  </span>
                  <span><strong>{item.range}:</strong> {item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
