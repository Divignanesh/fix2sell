import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { AnimatedSection } from './AnimatedSection'
import { useData } from '../context/DataContext'
import './HowItWorks.css'

function getCopy(data, key, fallback) {
  const v = data && data[key]
  return v !== undefined && v !== null ? String(v).trim() : fallback
}

const DEFAULT_STEPS = [
  { step: '1', letter: 'D', title: 'Discovery', desc: "We guide you through the selling process, identifying essential upgrades to maximize your property's market value and appeal." },
  { step: '2', letter: 'E', title: 'Estimation', desc: 'Our professional team visits your home, takes precise measurements, and prepares accurate cost estimates for renovation work.' },
  { step: '3', letter: 'A', title: 'Action', desc: 'We handle property upscaling, professional cleaning and staging, plus high-quality MLS listings with photos, videos, and compelling content.' },
  { step: '4', letter: 'L', title: 'Listing', desc: 'We manage all agreements, launch a tailored selling strategy, handle buyer offers, lead negotiations, and finalize the sale.' },
]

export default function HowItWorks() {
  const { global: globalData } = useData()
  const stepLabel = getCopy(globalData, 'howItWorksStepLabel', 'Step')
  const steps = [
    { step: '1', letter: getCopy(globalData, 'howItWorksStep1Letter', 'D'), title: getCopy(globalData, 'howItWorksStep1Title', DEFAULT_STEPS[0].title), desc: getCopy(globalData, 'howItWorksStep1Desc', DEFAULT_STEPS[0].desc) },
    { step: '2', letter: getCopy(globalData, 'howItWorksStep2Letter', 'E'), title: getCopy(globalData, 'howItWorksStep2Title', DEFAULT_STEPS[1].title), desc: getCopy(globalData, 'howItWorksStep2Desc', DEFAULT_STEPS[1].desc) },
    { step: '3', letter: getCopy(globalData, 'howItWorksStep3Letter', 'A'), title: getCopy(globalData, 'howItWorksStep3Title', DEFAULT_STEPS[2].title), desc: getCopy(globalData, 'howItWorksStep3Desc', DEFAULT_STEPS[2].desc) },
    { step: '4', letter: getCopy(globalData, 'howItWorksStep4Letter', 'L'), title: getCopy(globalData, 'howItWorksStep4Title', DEFAULT_STEPS[3].title), desc: getCopy(globalData, 'howItWorksStep4Desc', DEFAULT_STEPS[3].desc) },
  ]
  const timelineRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)
  
  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Scroll progress for animated line
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 80%", "end 60%"]
  })
  
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <AnimatedSection className="how-it-works">
      <div className="how-it-works__inner">
        <div className="how-it-works__header">
          <motion.h2
            className="how-it-works__title"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {getCopy(globalData, 'howItWorksTitle', 'How')}{' '}
            <span className="how-it-works__title-highlight">{getCopy(globalData, 'howItWorksTitleHighlight', 'Fix2Sell')}</span>{' '}
            {getCopy(globalData, 'howItWorksTitleSuffix', 'Works?')}
          </motion.h2>
          <motion.p
            className="how-it-works__subtitle"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {getCopy(globalData, 'howItWorksSubtitle', "A simple, straightforward process to maximize your home's value")}
          </motion.p>
        </div>
        
        <div className="how-it-works__timeline" ref={timelineRef}>
          {/* Animated vertical line for mobile */}
          {isMobile && (
            <div className="how-it-works__vertical-line-track">
              <motion.div 
                className="how-it-works__vertical-line"
                style={{ height: lineHeight }}
              />
            </div>
          )}
          
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              className="how-it-works__card-wrapper"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {/* Timeline connector for desktop */}
              {i < steps.length - 1 && (
                <div className="how-it-works__connector" aria-hidden />
              )}
              
              {/* Step indicator dot for mobile */}
              {isMobile && (
                <motion.div 
                  className="how-it-works__step-dot"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                />
              )}
              
              <article className="how-it-works__card">
                <span className="how-it-works__card-step">{stepLabel} {item.step}</span>
                <div className="how-it-works__card-letter">
                  {item.letter}
                </div>
                <h3 className="how-it-works__card-title">{item.title}</h3>
                <p className="how-it-works__card-desc">{item.desc}</p>
              </article>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}
