import { motion } from 'framer-motion'
import { useInternships } from '../../hooks/usePortfolioData'
import './Experience.css'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const [year, month] = dateStr.split('-')
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${monthNames[parseInt(month, 10) - 1]} ${year}`
}

export default function Experience() {
  const { data: internships } = useInternships()

  if (!internships || internships.length === 0) return null

  return (
    <section id="experience" className="section experience">
      <div className="container">
        <motion.p
          className="section-label"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Internship & Experience
        </motion.p>

        <motion.h2
          className="heading-lg experience__heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Where I've worked
        </motion.h2>

        <div className="gold-divider" />

        <div className="experience__timeline">
          {internships.map((item, i) => (
            <motion.article
              key={item.id}
              className="experience__item"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: i * 0.15, ease: [0.25, 0.4, 0.25, 1] }}
              aria-label={`${item.role} at ${item.company}`}
            >
              {/* Timeline dot */}
              <div className="experience__dot" aria-hidden="true">
                <div className="experience__dot-inner" />
              </div>

              {/* Content */}
              <div className="experience__content">
                <div className="experience__header">
                  <div className="experience__title-block">
                    <h3 className="experience__role">{item.role}</h3>
                    <p className="experience__company">
                      {item.company}
                      {item.location ? `, ${item.location}` : ''}
                    </p>
                  </div>
                  <div className="experience__date-badge">
                    <time dateTime={item.start_date}>
                      {formatDate(item.start_date)}
                    </time>
                    {' — '}
                    {item.is_ongoing ? (
                      <span className="experience__ongoing">Present</span>
                    ) : (
                      <time dateTime={item.end_date}>{formatDate(item.end_date)}</time>
                    )}
                  </div>
                </div>

                {Array.isArray(item.bullets) && item.bullets.length > 0 && (
                  <ul className="experience__bullets">
                    {item.bullets.map((bullet, bi) => (
                      <li key={bi} className="experience__bullet">{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
