import { motion } from 'framer-motion'
import { useData } from '../context/DataContext'
import './BannerStrip.css'

function getCopy(data, key, fallback) {
  const v = data && data[key]
  return v !== undefined && v !== null ? String(v).trim() : fallback
}

export default function BannerStrip() {
  const { global: globalData } = useData()
  return (
    <motion.section
      className="banner-strip"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="banner-strip__inner">
        <a href="#inquire" className="banner-strip__cta">
          {getCopy(globalData, 'bannerStripCta', 'CLICK TO UNLOCK YOUR HOME POTENTIAL')}
        </a>
      </div>
    </motion.section>
  )
}
