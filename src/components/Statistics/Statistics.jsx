import { motion } from 'framer-motion'
import { useStatistics } from '../../hooks/usePortfolioData'
import { useAnimatedCounter } from '../../hooks/useUtils'
import './Statistics.css'

function StatCard({ stat, index }) {
  const { count, ref } = useAnimatedCounter(stat.value)

  return (
    <motion.div
      ref={ref}
      className="stat-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <div className="stat-card__value">
        <span className="stat-card__number">{count}</span>
        {stat.suffix && <span className="stat-card__suffix">{stat.suffix}</span>}
      </div>
      <p className="stat-card__label">{stat.label}</p>
    </motion.div>
  )
}

export default function Statistics() {
  const { data: stats } = useStatistics()

  if (!stats || stats.length === 0) return null

  return (
    <section className="section-sm statistics" aria-label="Key Statistics">
      <div className="container">
        <div className="statistics__grid">
          {stats.map((stat, i) => (
            <StatCard key={stat.id} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
