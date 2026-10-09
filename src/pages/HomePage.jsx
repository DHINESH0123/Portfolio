import { useScrollReveal } from '../hooks/useUtils'
import Hero from '../components/Hero/Hero.jsx'
import About from '../components/About/About.jsx'
import Statistics from '../components/Statistics/Statistics.jsx'
import Skills from '../components/Skills/Skills.jsx'
import FeaturedProject from '../components/Projects/FeaturedProject.jsx'
import Projects from '../components/Projects/Projects.jsx'
import Experience from '../components/Experience/Experience.jsx'
import Education from '../components/Education/Education.jsx'
import Certificates from '../components/Certificates/Certificates.jsx'
import Contact from '../components/Contact/Contact.jsx'
import Footer from '../components/Footer/Footer.jsx'

export default function HomePage() {
  useScrollReveal()

  return (
    <main id="main-content">
      <Hero />
      <About />
      <Statistics />
      <Skills />
      <FeaturedProject />
      <Projects />
      <Experience />
      <Education />
      <Certificates />
      <Contact />
      <Footer />
    </main>
  )
}
