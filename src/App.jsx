import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import Transformation from './components/Transformation'
import ThousandsGained from './components/ThousandsGained'
import WhySell from './components/WhySell'
import SmartWay from './components/SmartWay'
import HowItWorks from './components/HowItWorks'
import Testimonials from './components/Testimonials'
import CTA from './components/CTA'
import RenoGrader from './components/RenoGrader'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import InquirePopup from './components/InquirePopup'
import RenoGradePage from './pages/RenoGradePage'
import RefreshPage from './pages/RefreshPage'
import { initCenteredNavigation } from './utils/scrollToCenter'
import './App.css'

function HomePage() {
  useEffect(() => {
    const cleanup = initCenteredNavigation()
    return cleanup
  }, [])

  return (
    <div className="app">
      <Header />
      <InquirePopup />
      <main>
        <section id="home">
          <Hero />
        </section>
        <section id="projects">
          <Transformation />
        </section>
        <ThousandsGained />
        <WhySell />
        <SmartWay />
        <section id="how-it-works">
          <HowItWorks />
        </section>
        <section id="reviews">
          <Testimonials />
        </section>
        <section id="contact">
          <CTA />
        </section>
        <section id="renograder">
          <RenoGrader />
        </section>
        <section id="faq">
          <FAQ />
        </section>
        <Footer />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/renograde" element={<RenoGradePage />} />
      <Route path="/refresh" element={<RefreshPage />} />
    </Routes>
  )
}
