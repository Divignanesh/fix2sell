import { motion } from 'framer-motion'
import { useData } from '../context/DataContext'
import './RenoGradeHero.css'

function getCopy(data, key, fallback) {
  const v = data && data[key]
  return v !== undefined && v !== null ? String(v).trim() : fallback
}

export default function RenoGradeHero() {
  const { global: globalData } = useData()
  return (
    <section id="renograde-hero" className="reno-grade-hero">
      <div className="reno-grade-hero__inner">
        <motion.h1
          className="reno-grade-hero__title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="reno-grade-hero__title-line reno-grade-hero__title-orange">{getCopy(globalData, 'renoGradeHeroLine1', 'No Cost. No Obligation.')}</span>
          <span className="reno-grade-hero__title-line reno-grade-hero__title-dark">{getCopy(globalData, 'renoGradeHeroLine2', 'Big Insight.')}</span>
        </motion.h1>
        <motion.p
          className="reno-grade-hero__subtitle"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {getCopy(globalData, 'renoGradeHeroSubtitle', 'Learning what buyers want after they list.')}
        </motion.p>
        <motion.p
          className="reno-grade-hero__desc"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {getCopy(globalData, 'renoGradeHeroDesc', 'Reno-Grade shows you first so you list with confidence and control.')}
        </motion.p>
      </div>
    </section>
  )
}
