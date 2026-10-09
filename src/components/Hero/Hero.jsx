import { useState, useRef, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Download, ArrowDown, ChevronRight } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '../Icons/SocialIcons.jsx'
import { useProfile } from '../../hooks/usePortfolioData'
import dhineshPhoto from '../../assets/DHINESH LINKEDIN.png'
import './Hero.css'

const Hero3D = lazy(() => import('./Hero3D.jsx'))

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.25, 0.4, 0.25, 1] },
  }),
}

export default function Hero() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const heroRef = useRef(null)
  const { data: profile } = useProfile()

  const handleMouseMove = (e) => {
    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return
    setPointer({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    })
  }

  const scrollToProjects = () => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
  }
  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      className="hero"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      aria-label="Hero — Introduction"
    >
      {/* 3D Canvas — lazy loaded */}
      <Suspense fallback={null}>
        <Hero3D pointer={pointer} />
      </Suspense>

      {/* Editorial grid overlay */}
      <div className="hero__grid-overlay" aria-hidden="true" />

      <div className="container hero__container">
        {/* Left: Text Content */}
        <div className="hero__content">
          {/* Open to Work badge */}
          {profile?.open_to_work && (
            <motion.div
              className="hero__badge"
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0}
            >
              <span className="hero__badge-dot" aria-hidden="true" />
              Open to opportunities
            </motion.div>
          )}

          {/* Section label */}
          <motion.p
            className="section-label"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
          >
            AI Developer & LLM Engineer
          </motion.p>

          {/* Name */}
          <motion.h1
            className="heading-display hero__name"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
          >
            {profile?.name || 'Dhinesh Shanmugam'}
          </motion.h1>

          {/* Title */}
          <motion.p
            className="hero__title"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
          >
            {profile?.title || 'AI Developer | LLM & Machine Learning Engineer | Full-Stack (FastAPI + React)'}
          </motion.p>

          <div className="gold-divider" />

          {/* Intro */}
          <motion.p
            className="hero__intro"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
          >
            {profile?.hero_intro ||
              "B.Tech graduate in Artificial Intelligence and Data Science. I build LLM-powered applications with Python, LangChain, and FastAPI, and I'm currently an AI Developer Intern at Skandax Nexus."}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="hero__actions"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={5}
          >
            <button
              className="btn btn-primary btn-lg"
              onClick={scrollToProjects}
              id="hero-explore-btn"
            >
              Explore My Projects
              <ChevronRight size={18} />
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={scrollToContact}
              id="hero-contact-btn"
            >
              Contact Me
            </button>
            {profile?.resume_url ? (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold btn-lg"
                id="hero-resume-btn"
              >
                <Download size={18} />
                Download Resume
              </a>
            ) : (
              <span className="hero__resume-placeholder">
                <Download size={16} />
                Resume — coming soon
              </span>
            )}
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="hero__socials"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={6}
          >
            <a
              href={profile?.github || 'https://github.com/DHINESH0123'}
              target="_blank"
              rel="noopener noreferrer"
              className="hero__social-link"
              aria-label="GitHub profile"
            >
              <GithubIcon size={20} />
              GitHub
            </a>
            <a
              href={profile?.linkedin || 'https://linkedin.com/in/dhinesh-shanmugam-711531264'}
              target="_blank"
              rel="noopener noreferrer"
              className="hero__social-link"
              aria-label="LinkedIn profile"
            >
              <LinkedinIcon size={20} />
              LinkedIn
            </a>
          </motion.div>
        </div>

        {/* Right: Photo */}
        <motion.div
          className="hero__photo-wrap"
          initial={{ opacity: 0, scale: 0.9, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <div className="hero__photo-frame">
            <div className="hero__photo-ring" aria-hidden="true" />
            <div className="hero__photo-accent" aria-hidden="true" />
            <img
              src={dhineshPhoto}
              alt="Dhinesh Shanmugam — AI Developer, smiling in a navy shirt"
              className="hero__photo"
              loading="eager"
              width={400}
              height={500}
            />
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="hero__scroll-cue"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        aria-hidden="true"
      >
        <span>Scroll</span>
        <ArrowDown size={16} className="hero__scroll-arrow" />
      </motion.div>
    </section>
  )
}
