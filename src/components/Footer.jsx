import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useData } from '../context/DataContext'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import './Footer.css'

function getCopy(data, key, fallback) {
  const v = data && data[key]
  return v !== undefined && v !== null ? String(v).trim() : fallback
}

const FALLBACK_QUICK_LINKS = [
  { label: 'Home', url: '/#home' },
  { label: 'Programs', url: '/#projects' },
  { label: 'How It Works', url: '/#how-it-works' },
  { label: 'Testimonials', url: '/#reviews' },
  { label: 'FAQ', url: '/#faq' },
]
const FALLBACK_HELP_LINKS = [
  { label: 'Privacy Policy', url: '#' },
  { label: 'Terms of Service', url: '#' },
  { label: 'Contact Support', url: '/#contact' },
]

function SocialIcon({ name, ariaLabel }) {
  const iconName = name?.toLowerCase()
  const size = 18
  const iconProps = { size, 'aria-hidden': true, className: 'footer__social-icon' }
  const icons = {
    facebook: <FaFacebookF {...iconProps} />,
    instagram: <FaInstagram {...iconProps} />,
    linkedin: <FaLinkedinIn {...iconProps} />,
    twitter: <FaXTwitter {...iconProps} />,
    whatsapp: <FaWhatsapp {...iconProps} />,
  }
  const Icon = icons[iconName] || null
  return Icon ? <span aria-label={ariaLabel || name}>{Icon}</span> : null
}

export default function Footer() {
  const { global: globalData, footer: footerRows } = useData()
  const footerList = Array.isArray(footerRows) ? footerRows : []
  const norm = (s) => (s || '').trim().toLowerCase().replace(/\s+/g, ' ').replace(/\s*&\s*/g, ' and ')
  const quickLinks = footerList.filter((r) => norm(r.section) === 'quick links').length
    ? footerList.filter((r) => norm(r.section) === 'quick links').map((r) => ({ label: r.label || '', url: r.url || '#' }))
    : FALLBACK_QUICK_LINKS
  const helpLinks = footerList.filter((r) => norm(r.section) === 'help and support').length
    ? footerList.filter((r) => norm(r.section) === 'help and support').map((r) => ({ label: r.label || '', url: r.url || '#' }))
    : FALLBACK_HELP_LINKS
  const socialLinks = footerList.filter((r) => norm(r.section) === 'social').map((r) => ({ label: r.label || '', url: r.url || '#', icon: (r.icon || '').toLowerCase() }))

  const DEFAULT_LOGO = '/logo.jpeg'
  const footerLogoFromData = getCopy(globalData, 'footerLogo', '') || DEFAULT_LOGO
  const expLogoFromData = getCopy(globalData, 'expLogo', '')
  const [footerLogoUrl, setFooterLogoUrl] = useState(footerLogoFromData)
  const [expLogoUrl, setExpLogoUrl] = useState(expLogoFromData)

  useEffect(() => {
    setFooterLogoUrl(footerLogoFromData)
    setExpLogoUrl(expLogoFromData)
  }, [footerLogoFromData, expLogoFromData])

  const headingQuickLinks = getCopy(globalData, 'footerHeadingQuickLinks', 'Quick Links')
  const headingHelp = getCopy(globalData, 'footerHeadingHelp', 'Help & Support')
  const headingContact = getCopy(globalData, 'footerHeadingContact', 'Contact Details')
  const address = getCopy(globalData, 'footerAddress', '123 Main Street, Hamilton, ON L8P 1A1')
  const phone = getCopy(globalData, 'footerPhone', '(123) 456-7890')
  const email = getCopy(globalData, 'footerEmail', 'info@msrealty.com')
  const copyright = getCopy(globalData, 'footerCopyright', '© 2026 MS Realty. All rights reserved.')
  const disclaimerGoogle = getCopy(globalData, 'footerDisclaimerGoogle', '')
  const disclaimerMeta = getCopy(globalData, 'footerDisclaimerMeta', '')

  const renderLink = (item) => {
    const isInternal = item.url.startsWith('/') && !item.url.startsWith('//')
    if (isInternal) return <Link to={item.url} className="footer__link">{item.label}</Link>
    return <a href={item.url} className="footer__link" target="_blank" rel="noopener noreferrer">{item.label}</a>
  }

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
              <img
                src={footerLogoUrl}
                alt=""
                className="footer__logo-img"
                onError={() => setFooterLogoUrl(DEFAULT_LOGO)}
              />
            </Link>
            {expLogoUrl && (
              <div className="footer__exp-logo">
                <img
                  src={expLogoUrl}
                  alt=""
                  className="footer__exp-logo-img"
                  onError={() => setExpLogoUrl('')}
                />
              </div>
            )}
          </div>
          {socialLinks.length > 0 && (
            <div className="footer__social">
              {socialLinks.map((item, i) => (
                <a key={i} href={item.url} className="footer__social-link" aria-label={item.label || item.icon} target="_blank" rel="noopener noreferrer">
                  <SocialIcon name={item.icon} ariaLabel={item.label} />
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="footer__col">
          <h4 className="footer__heading">{headingQuickLinks}</h4>
          <ul className="footer__list">
            {quickLinks.map((item, i) => (
              <li key={i}>
                {item.url.startsWith('/') && !item.url.startsWith('//') ? (
                  <Link to={item.url} className="footer__link">{item.label}</Link>
                ) : (
                  <a href={item.url} className="footer__link" target="_blank" rel="noopener noreferrer">{item.label}</a>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="footer__col">
          <h4 className="footer__heading">{headingHelp}</h4>
          <ul className="footer__list">
            {helpLinks.map((item, i) => (
              <li key={i}>
                {renderLink(item)}
              </li>
            ))}
          </ul>
        </div>
        <div className="footer__col footer__col--contact">
          <h4 className="footer__heading">{headingContact}</h4>
          <ul className="footer__contact-list">
            <li>
              <span className="footer__contact-icon footer__contact-icon--location">
                <LocationIcon />
              </span>
              <span>{address}</span>
            </li>
            <li>
              <span className="footer__contact-icon footer__contact-icon--phone">
                <PhoneIcon />
              </span>
              <a href={`tel:${phone.replace(/\D/g, '')}`} className="footer__link">{phone}</a>
            </li>
            <li>
              <span className="footer__contact-icon footer__contact-icon--email">
                <EmailIcon />
              </span>
              <a href={`mailto:${email}`} className="footer__link">{email}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer__bottom">
        <p className="footer__copyright">{copyright}</p>
        <div className="footer__disclaimers">
          {disclaimerGoogle && <p className="footer__disclaimer">{disclaimerGoogle}</p>}
          {disclaimerMeta && <p className="footer__disclaimer">{disclaimerMeta}</p>}
        </div>
      </div>
    </motion.footer>
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
