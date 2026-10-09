import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { GithubIcon } from '../Icons/SocialIcons.jsx'
import { useProjects } from '../../hooks/usePortfolioData'
import './Projects.css'

function ProjectCard({ project, index }) {
  const tags = Array.isArray(project.tech_tags)
    ? project.tech_tags
    : (project.tech_tags || '').split(',').map((t) => t.trim()).filter(Boolean)

  return (
    <motion.article
      className="project-card card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
      aria-label={`Project: ${project.title}`}
    >
      {/* Header */}
      <div className="project-card__header">
        <div className="project-card__title-row">
          <h3 className="project-card__title">{project.title}</h3>
          <span className="project-card__year">{project.year}</span>
        </div>
      </div>

      {/* Description */}
      {project.description && (
        <p className="project-card__desc">{project.description}</p>
      )}

      {/* Tags */}
      <div className="project-card__tags">
        {tags.map((tag) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      {/* Links */}
      {(project.github_url || project.demo_url) && (
        <div className="project-card__links">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card__link"
              aria-label={`GitHub for ${project.title}`}
            >
              <GithubIcon size={15} />
              GitHub
            </a>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card__link project-card__link--demo"
              aria-label={`Live demo for ${project.title}`}
            >
              <ExternalLink size={15} />
              Demo
            </a>
          )}
        </div>
      )}
    </motion.article>
  )
}

export default function Projects() {
  const { data: allProjects } = useProjects()

  // Filter out the featured project for this grid
  const additionalProjects = allProjects.filter((p) => !p.is_featured)

  if (!additionalProjects || additionalProjects.length === 0) return null

  return (
    <section id="projects" className="section projects">
      <div className="container">
        <motion.p
          className="section-label"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Additional Projects
        </motion.p>

        <motion.h2
          className="heading-lg projects__heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          More of my work
        </motion.h2>

        <div className="gold-divider" />

        <div className="projects__grid">
          {additionalProjects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
