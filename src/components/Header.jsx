import { useState, useMemo } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useData } from '../context/DataContext'
import './Header.css'

function getCopy(data, key, fallback) {
  const v = data && data[key]
  return v !== undefined && v !== null ? String(v).trim() : fallback
}

const DEFAULT_NAV_LEFT = [
  { label: 'Home', to: '/#home' },
  { label: 'Projects', to: '/#projects' },
  { label: 'How It Works', to: '/#how-it-works' },
  { label: 'Reviews', to: '/#reviews' },
]

const DEFAULT_NAV_RIGHT = [
  { label: 'Reno-Grader', to: '/renograde', isRenoGrade: true },
  { label: 'Contact', to: '/#contact' },
]

const DEFAULT_NAV_CTA = { label: 'Try Reno-Grade', to: '/renograde' }

function buildNavFromGlobal(globalData) {
  const left = []
  for (let i = 1; i <= 4; i++) {
    const label = getCopy(globalData, `navLeft${i}Label`, '')
    const to = getCopy(globalData, `navLeft${i}Url`, '') || getCopy(globalData, `navLeft${i}Link`, '')
    if (label) left.push({ label, to: to || DEFAULT_NAV_LEFT[i - 1]?.to || '#' })
    else if (DEFAULT_NAV_LEFT[i - 1]) left.push(DEFAULT_NAV_LEFT[i - 1])
  }
  const right = []
  for (let i = 1; i <= 2; i++) {
    const label = getCopy(globalData, `navRight${i}Label`, '')
    const to = getCopy(globalData, `navRight${i}Url`, '') || getCopy(globalData, `navRight${i}Link`, '')
    if (label) right.push({ label, to: to || DEFAULT_NAV_RIGHT[i - 1]?.to || '#', isRenoGrade: i === 1 })
    else if (DEFAULT_NAV_RIGHT[i - 1]) right.push(DEFAULT_NAV_RIGHT[i - 1])
  }
  const ctaLabel = getCopy(globalData, 'navCtaLabel', '')
  const ctaUrl = getCopy(globalData, 'navCtaUrl', '') || getCopy(globalData, 'navCtaLink', '') || DEFAULT_NAV_CTA.to
  const cta = { label: ctaLabel || DEFAULT_NAV_CTA.label, to: ctaUrl }
  return {
    left: left.length ? left : DEFAULT_NAV_LEFT,
    right: right.length ? right : DEFAULT_NAV_RIGHT,
    cta,
    all: [...(left.length ? left : DEFAULT_NAV_LEFT), ...(right.length ? right : DEFAULT_NAV_RIGHT)],
  }
}

function NavLinkOrAnchor({ item, className, activeClass, onClick }) {
  const isInternal = item.to.startsWith('/') && !item.to.startsWith('//')
  if (isInternal) {
    if (activeClass !== undefined) {
      return (
        <NavLink to={item.to} className={({ isActive }) => `${className} ${isActive ? activeClass : ''}`.trim()} onClick={onClick}>
          {item.label}
        </NavLink>
      )
    }
    return <Link to={item.to} className={className} onClick={onClick}>{item.label}</Link>
  }
  return (
    <a href={item.to} className={className} target="_blank" rel="noopener noreferrer" onClick={onClick}>
      {item.label}
    </a>
  )
}

export default function Header() {
  const { global: globalData } = useData()
  const logoUrl = getCopy(globalData, 'navbarLogo', '') || '/logo.jpeg'
  const nav = useMemo(() => buildNavFromGlobal(globalData), [globalData])
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <motion.header
      className="header"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="header__inner">
        <nav className="header__nav header__nav--left">
          {nav.left.map((link) => (
            <NavLinkOrAnchor key={link.label} item={link} className="header__link" onClick={undefined} />
          ))}
        </nav>

        <Link to="/" className="header__logo" aria-label="Home">
          <img src={logoUrl} alt="" className="header__logo-img" />
        </Link>

        <nav className="header__nav header__nav--right">
          {nav.right.map((link, i) => (
            <NavLinkOrAnchor
              key={link.label}
              item={link}
              className="header__link"
              activeClass={i === 0 ? 'header__link--active' : undefined}
              onClick={undefined}
            />
          ))}
          {nav.cta.to.startsWith('/') && !nav.cta.to.startsWith('//') ? (
            <Link to={nav.cta.to} className="header__cta">{nav.cta.label}</Link>
          ) : (
            <a href={nav.cta.to} className="header__cta" target="_blank" rel="noopener noreferrer">{nav.cta.label}</a>
          )}
        </nav>

        <div className="header__mobile-actions">
          {nav.cta.to.startsWith('/') && !nav.cta.to.startsWith('//') ? (
            <Link to={nav.cta.to} className="header__cta header__cta--mobile">{nav.cta.label}</Link>
          ) : (
            <a href={nav.cta.to} className="header__cta header__cta--mobile" target="_blank" rel="noopener noreferrer">{nav.cta.label}</a>
          )}
          <button
            className="header__hamburger"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            <span className={`header__hamburger-line ${isMenuOpen ? 'open' : ''}`} />
            <span className={`header__hamburger-line ${isMenuOpen ? 'open' : ''}`} />
            <span className={`header__hamburger-line ${isMenuOpen ? 'open' : ''}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="header__mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="header__mobile-nav">
              {nav.all.map((link, i) => (
                <motion.div key={`${link.label}-${i}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <NavLinkOrAnchor item={link} className="header__mobile-link" onClick={closeMenu} />
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
