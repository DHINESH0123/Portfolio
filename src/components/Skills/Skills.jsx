import { motion } from 'framer-motion'
import { useSkills } from '../../hooks/usePortfolioData'
import './Skills.css'

const CATEGORY_ORDER = [
  'Languages',
  'Generative AI & NLP',
  'Machine Learning & Deep Learning',
  'Backend & APIs',
  'Databases',
  'Tools',
]

function groupSkills(skills) {
  const grouped = {}
  skills.forEach((skill) => {
    if (!grouped[skill.category]) grouped[skill.category] = []
    grouped[skill.category].push(skill)
  })
  return grouped
}

export default function Skills() {
  const { data: skills } = useSkills()

  if (!skills || skills.length === 0) return null

  const grouped = groupSkills(skills)
  const categories = CATEGORY_ORDER.filter((cat) => grouped[cat]?.length > 0)

  return (
    <section id="skills" className="section skills">
      <div className="container">
        <motion.p
          className="section-label"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Technical Skills
        </motion.p>

        <motion.h2
          className="heading-lg skills__heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          What I work with
        </motion.h2>

        <div className="gold-divider" />

        <div className="skills__categories">
          {categories.map((cat, ci) => (
            <motion.div
              key={cat}
              className="skills__category"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: ci * 0.1 }}
            >
              <h3 className="skills__cat-title">{cat}</h3>
              <div className="skills__tags">
                {grouped[cat].map((skill, si) => (
                  <motion.span
                    key={skill.id}
                    className="skills__tag"
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: ci * 0.08 + si * 0.04 }}
                    whileHover={{ y: -3, boxShadow: '0 4px 16px rgba(184,154,90,0.2)' }}
                  >
                    {skill.name}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
