import { motion } from 'framer-motion'
import { useProfile } from '../../hooks/usePortfolioData'
import dhineshPhoto from '../../assets/DHINESH LINKEDIN.png'
import './About.css'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.25, 0.4, 0.25, 1] }
  }),
}

export default function About() {
  const { data: profile } = useProfile()
  const aboutText = profile?.about_text || ''
  const paragraphs = aboutText.split('\n\n').filter(Boolean)

  return (
    <section id="about" className="section about">
      <div className="container">
        <div className="about__inner">
          {/* Left: Photo + Quick Facts */}
          <motion.div
            className="about__photo-col"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            custom={0}
          >
            <div className="about__photo-wrap">
              <img
                src={dhineshPhoto}
                alt="Dhinesh Shanmugam — AI Developer"
                className="about__photo"
                loading="lazy"
                width={340}
                height={420}
              />
              <div className="about__photo-badge">
                <span className="about__photo-badge-text">Available for Hire</span>
              </div>
            </div>

            {/* Quick info card */}
            <div className="about__quick-card card">
              <div className="about__quick-row">
                <span className="about__quick-label">Location</span>
                <span className="about__quick-value">Chennai, India</span>
              </div>
              <div className="about__quick-row">
                <span className="about__quick-label">Current Role</span>
                <span className="about__quick-value">AI Developer Intern</span>
              </div>
              <div className="about__quick-row">
                <span className="about__quick-label">Company</span>
                <span className="about__quick-value">Skandax Nexus</span>
              </div>
              <div className="about__quick-row">
                <span className="about__quick-label">Graduation</span>
                <span className="about__quick-value">B.Tech AI & DS, 2026</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Text */}
          <div className="about__text-col">
            <motion.p
              className="section-label"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
            >
              About Me
            </motion.p>

            <motion.h2
              className="heading-lg about__heading"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
            >
              Building the future with{' '}
              <span className="text-gold italic">intelligent systems</span>
            </motion.h2>

            <div className="gold-divider" />

            {paragraphs.map((para, i) => (
              <motion.p
                key={i}
                className="about__para"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 2}
              >
                {para}
              </motion.p>
            ))}

            {/* Highlights */}
            <motion.div
              className="about__highlights"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={paragraphs.length + 2}
            >
              {[
                { label: 'LLM Applications', icon: '🤖' },
                { label: 'Python & LangChain', icon: '🐍' },
                { label: 'FastAPI Backends', icon: '⚡' },
                { label: 'React Frontends', icon: '⚛️' },
              ].map((item) => (
                <div key={item.label} className="about__highlight-chip">
                  <span>{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
