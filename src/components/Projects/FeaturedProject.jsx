import { motion } from 'framer-motion'
import { ExternalLink, AlertCircle } from 'lucide-react'
import { GithubIcon } from '../Icons/SocialIcons.jsx'
import { useFeaturedProject } from '../../hooks/usePortfolioData'
import './FeaturedProject.css'

export default function FeaturedProject() {
  const { data: project } = useFeaturedProject()

  if (!project) return null

  const tags = Array.isArray(project.tech_tags)
    ? project.tech_tags
    : (project.tech_tags || '').split(',').map((t) => t.trim()).filter(Boolean)

  return (
    <section id="featured-project" className="section featured-project">
      <div className="container">
        <motion.p
          className="section-label"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Featured Project
        </motion.p>

        <motion.h2
          className="heading-lg featured-project__heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {project.title}
          <span className="featured-project__year"> — {project.year}</span>
        </motion.h2>

        <div className="gold-divider" />

        <div className="featured-project__body">
          {/* Overview */}
          <motion.div
            className="featured-project__block"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h3 className="featured-project__block-title">Overview</h3>
            <p className="featured-project__para">{project.description}</p>
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            className="featured-project__block"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="featured-project__block-title">Technology Stack</h3>
            <div className="featured-project__tags">
              {tags.map((tag) => (
                <span key={tag} className="tag tag-gold featured-project__tag">{tag}</span>
              ))}
            </div>
          </motion.div>

          {/* Technical Implementation */}
          <motion.div
            className="featured-project__block"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <h3 className="featured-project__block-title">Technical Implementation</h3>
            <ul className="featured-project__list">
              <li>Trained a <strong>Vision Transformer (ViT)</strong> in PyTorch for image and video deepfake classification</li>
              <li>Built an <strong>OpenCV pipeline</strong> for frame extraction, normalization, and data augmentation from video inputs</li>
              <li>Exposed the trained model via a <strong>FastAPI REST API</strong> for real-time inference requests</li>
              <li>Designed the inference endpoint to accept both image and video uploads for flexible usage</li>
            </ul>
          </motion.div>

          {/* Results */}
          {project.result_metric && (
            <motion.div
              className="featured-project__block"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="featured-project__block-title">Results</h3>
              <div className="featured-project__metric-card">
                <div className="featured-project__metric-value">{project.result_metric}</div>
                {project.result_note && (
                  <div className="featured-project__metric-note">
                    <AlertCircle size={14} />
                    {project.result_note}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Limitations */}
          <motion.div
            className="featured-project__block"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <h3 className="featured-project__block-title">Honest Limitations</h3>
            <ul className="featured-project__list featured-project__list--muted">
              <li>Detection accuracy is measured on a held-out validation set; real-world performance may differ depending on deepfake generation methods not seen during training</li>
              <li>The model is best suited for the types of manipulation it was trained on; novel or adversarially crafted deepfakes may evade detection</li>
              <li>Processing time scales with video length and frame count; large files require more compute resources</li>
            </ul>
          </motion.div>

          {/* Links */}
          {(project.github_url || project.demo_url) && (
            <motion.div
              className="featured-project__links"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  id="featured-github-btn"
                >
                  <GithubIcon size={16} />
                  View on GitHub
                </a>
              )}
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  id="featured-demo-btn"
                >
                  <ExternalLink size={16} />
                  Live Demo
                </a>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
