import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useData } from '../context/DataContext'
import './Header.css'

function getCopy(data, key, fallback) {
  const v = data && data[key]
  return v !== undefined && v !== null ? String(v).trim() : fallback
}

const navLinksLeft = [
  { label: 'Home', href: '#home', to: '/#home' },
  { label: 'Projects', href: '#projects', to: '/#projects' },
  { label: 'How It Works', href: '#how-it-works', to: '/#how-it-works' },
  { label: 'Reviews', href: '#reviews', to: '/#reviews' },
]

const navLinksRight = [
  { label: 'Reno-Grader', to: '/renograde', isRenoGrade: true },
  { label: 'Contact', href: '#contact', to: '/#contact' },
]

const allNavLinks = [
  ...navLinksLeft,
  { label: 'Reno-Grader', to: '/renograde', isRenoGrade: true },
  { label: 'Contact', href: '#contact', to: '/#contact' },
]

export default function Header() {
  const { global: globalData } = useData()
  const logoUrl = getCopy(globalData, 'navbarLogo', '') || '/logo.jpeg'
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
          {navLinksLeft.map((link) => (
            <Link key={link.label} to={link.to} className="header__link">
              {link.label}
            </Link>
          ))}
        </nav>
        
        <Link to="/" className="header__logo" aria-label="Home">
          <img src={logoUrl} alt="" className="header__logo-img" />
        </Link>
        
        <nav className="header__nav header__nav--right">
          <NavLink
            to="/renograde"
            className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}
          >
            Reno-Grader
          </NavLink>
          <Link to="/#contact" className="header__link">
            Contact
          </Link>
          <Link to="/renograde" className="header__cta">
            Try Reno-Grade
          </Link>
        </nav>
        
        {/* Mobile: Try Reno-Grade button beside hamburger */}
        <div className="header__mobile-actions">
          <Link to="/renograde" className="header__cta header__cta--mobile">
            Try Reno-Grade
          </Link>
          <button 
            className="header__hamburger"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            <span className={`header__hamburger-line ${isMenuOpen ? 'open' : ''}`} />
            <span className={`header__hamburger-line ${isMenuOpen ? 'open' : ''}`} />
            <span className={`header__hamburger-line ${isMenuOpen ? 'open' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Mobile menu overlay */}
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
              {allNavLinks.map((link, i) => (
                <motion.div key={link.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  {link.isRenoGrade ? (
                    <Link to="/renograde" className="header__mobile-link" onClick={closeMenu}>
                      {link.label}
                    </Link>
                  ) : (
                    <Link to={link.to} className="header__mobile-link" onClick={closeMenu}>
                      {link.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
