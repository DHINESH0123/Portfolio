import { motion } from 'framer-motion'
import { Award, ExternalLink, FileText, X, ZoomIn } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCertificates } from '../../hooks/usePortfolioData'
import PdfViewer from './PdfViewer'
import './Certificates.css'

function isPDF(url) {
  return url && url.toLowerCase().includes('.pdf')
}

function CertModal({ cert, onClose }) {
  // Close on Escape + lock body scroll
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])
  return (
    <div
      className="cert-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${cert.title} certificate`}
      onClick={onClose}
    >
      <motion.div
        className="cert-modal"
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.88 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="cert-modal__header">
          <div>
            <h3 className="cert-modal__title">{cert.title}</h3>
            <p className="cert-modal__issuer">{cert.issuer}{cert.issue_year ? ` · ${cert.issue_year}` : ''}</p>
          </div>
          <button
            className="cert-modal__close"
            onClick={onClose}
            aria-label="Close certificate viewer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="cert-modal__body">
          {isPDF(cert.image_url) ? (
            <PdfViewer
              url={cert.image_url}
              title={cert.title}
            />
          ) : (
            <img
              src={cert.image_url}
              alt={`${cert.title} certificate`}
              className="cert-modal__img"
            />
          )}
        </div>

        {/* Footer actions */}
        <div className="cert-modal__footer">
          <a
            href={cert.image_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            {isPDF(cert.image_url) ? <FileText size={14} /> : <ZoomIn size={14} />}
            Open full size
          </a>
          {cert.verification_url && (
            <a
              href={cert.verification_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
            >
              <ExternalLink size={14} />
              Verify
            </a>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default function Certificates() {
  const { data: certs } = useCertificates()
  const [active, setActive] = useState(null)

  if (!certs || certs.length === 0) return null

  return (
    <section id="certificates" className="section certificates">
      <div className="container">
        <motion.p
          className="section-label"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Certificates
        </motion.p>

        <motion.h2
          className="heading-lg certificates__heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Credentials &amp; learning
        </motion.h2>

        <div className="gold-divider" />

        <div className="certificates__grid">
          {certs.map((cert, i) => (
            <motion.article
              key={cert.id}
              className={`cert-card card${cert.image_url ? ' cert-card--clickable' : ''}`}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              onClick={() => cert.image_url && setActive(cert)}
              aria-label={`${cert.title} from ${cert.issuer}${cert.image_url ? ' — click to view' : ''}`}
              role={cert.image_url ? 'button' : undefined}
              tabIndex={cert.image_url ? 0 : undefined}
              onKeyDown={(e) => { if (cert.image_url && (e.key === 'Enter' || e.key === ' ')) setActive(cert) }}
            >
              {/* Card Icon */}
              <div className="cert-card__icon" aria-hidden="true">
                {cert.image_url && isPDF(cert.image_url) ? (
                  <FileText size={26} />
                ) : (
                  <Award size={26} />
                )}
              </div>

              <div className="cert-card__body">
                <h3 className="cert-card__title">{cert.title}</h3>
                <p className="cert-card__issuer">{cert.issuer}</p>
                {cert.issue_year && (
                  <span className="cert-card__year">{cert.issue_year}</span>
                )}
              </div>

              {cert.credential_id && (
                <p className="cert-card__credential">ID: {cert.credential_id}</p>
              )}

              <div className="cert-card__actions">
                {cert.image_url && (
                  <span className="cert-card__view-hint">
                    {isPDF(cert.image_url) ? <FileText size={12} /> : <ZoomIn size={12} />}
                    {isPDF(cert.image_url) ? 'Click to view PDF' : 'Click to view'}
                  </span>
                )}
                {cert.verification_url && (
                  <a
                    href={cert.verification_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cert-card__verify"
                    aria-label={`Verify: ${cert.title}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={13} />
                    Verify
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Lightbox modal */}
      {active && <CertModal cert={active} onClose={() => setActive(null)} />}
    </section>
  )
}
