import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Footer.css'

const quickLinks = [
  { label: 'Home', to: '/#home' },
  { label: 'Programs', to: '/#projects' },
  { label: 'How It Works', to: '/#how-it-works' },
  { label: 'Testimonials', to: '/#reviews' },
  { label: 'FAQ', to: '/#faq' },
]

const helpLinks = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Contact Support', to: '/#contact' },
]

export default function Footer() {
  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="footer__inner">
        <div className="footer__brand">
          <div className="footer__logos">
            <Link to="/" className="footer__logo">
              <img src="/logo.jpeg" alt="MS Realty - Authenticity is Perpetual" className="footer__logo-img" />
            </Link>
            <div className="footer__exp-logo">
              <span className="footer__exp-text">eXp</span>
              <span className="footer__exp-sub">REALTY</span>
            </div>
          </div>
          <div className="footer__social">
            <a href="#" className="footer__social-link" aria-label="Facebook">
              <FacebookIcon />
            </a>
            <a href="#" className="footer__social-link" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="#" className="footer__social-link" aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
          </div>
        </div>
        <div className="footer__col">
          <h4 className="footer__heading">Quick Links</h4>
          <ul className="footer__list">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.to} className="footer__link">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer__col">
          <h4 className="footer__heading">Help & Support</h4>
          <ul className="footer__list">
            {helpLinks.map((link) => (
              <li key={link.label}>
                {link.to ? (
                  <Link to={link.to} className="footer__link">{link.label}</Link>
                ) : (
                  <a href={link.href} className="footer__link">{link.label}</a>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="footer__col footer__col--contact">
          <h4 className="footer__heading">Contact Details</h4>
          <ul className="footer__contact-list">
            <li>
              <span className="footer__contact-icon footer__contact-icon--location">
                <LocationIcon />
              </span>
              <span>123 Main Street, Hamilton, ON L8P 1A1</span>
            </li>
            <li>
              <span className="footer__contact-icon footer__contact-icon--phone">
                <PhoneIcon />
              </span>
              <a href="tel:1234567890" className="footer__link">(123) 456-7890</a>
            </li>
            <li>
              <span className="footer__contact-icon footer__contact-icon--email">
                <EmailIcon />
              </span>
              <a href="mailto:info@msrealty.com" className="footer__link">info@msrealty.com</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer__bottom">
        <p className="footer__copyright">© 2026 MS Realty. All rights reserved.</p>
      </div>
    </motion.footer>
  )
}

function HouseIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 14l12-10 12 10v14a2 2 0 01-2 2H6a2 2 0 01-2-2V14z" />
      <path d="M12 28V18h8v10" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="10" r="3" />
      <path d="M12 2a8 8 0 00-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 00-8-8z" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 6l-10 7L2 6" />
    </svg>
  )
}
