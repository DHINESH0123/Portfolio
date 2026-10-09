import { motion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'
import { useEducation } from '../../hooks/usePortfolioData'
import './Education.css'

export default function Education() {
  const { data: education } = useEducation()

  if (!education || education.length === 0) return null

  return (
    <section id="education" className="section education">
      <div className="container">
        <motion.p
          className="section-label"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Education
        </motion.p>

        <motion.h2
          className="heading-lg education__heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Academic background
        </motion.h2>

        <div className="gold-divider" />

        <div className="education__list">
          {education.map((edu, i) => (
            <motion.article
              key={edu.id}
              className="education__item"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              aria-label={`${edu.degree} at ${edu.institution}`}
            >
              <div className="education__icon" aria-hidden="true">
                <GraduationCap size={22} />
              </div>

              <div className="education__content">
                <div className="education__header">
                  <div>
                    <h3 className="education__degree">{edu.degree}</h3>
                    <p className="education__institution">
                      {edu.institution}
                      {edu.location ? `, ${edu.location}` : ''}
                    </p>
                  </div>
                  <div className="education__meta">
                    <span className="education__years">
                      {edu.start_year} — {edu.end_year}
                    </span>
                    {edu.grade && (
                      <span className="education__grade">{edu.grade}</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
