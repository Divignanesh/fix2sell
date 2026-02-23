import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/Header'
import RenoGradeHero from '../components/RenoGradeHero'
import RenoGradeFormSection from '../components/RenoGradeFormSection'
import CTA from '../components/CTA'
import Footer from '../components/Footer'

export default function RenoGradePage() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash === '#renograde-hero') {
      const el = document.getElementById('renograde-hero')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.pathname, location.hash])

  return (
    <div className="app">
      <Header />
      <main>
        <RenoGradeHero />
        <RenoGradeFormSection />
        <section id="contact">
          <CTA />
        </section>
        <Footer />
      </main>
    </div>
  )
}
