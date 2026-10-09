import { Mail, ArrowUp } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '../Icons/SocialIcons.jsx'
import { useProfile } from '../../hooks/usePortfolioData'
import './Footer.css'

export default function Footer() {
  const { data: profile } = useProfile()
  const year = new Date().getFullYear()

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="footer" role="contentinfo">
      <div className="container footer__inner">
        {/* Brand */}
        <div className="footer__brand">
          <div className="footer__logo">
            <span className="footer__logo-initials">DS</span>
            <span className="footer__logo-name">
              Dhinesh Shanmugam<span className="footer__dot">.</span>
            </span>
          </div>
          <p className="footer__tagline">
            AI Developer · LLM Engineer · Full-Stack
          </p>
          <p className="footer__location">Chennai, India</p>
        </div>

        {/* Links */}
        <div className="footer__links">
          <a
            href={profile?.github || 'https://github.com/DHINESH0123'}
            target="_blank"
            rel="noopener noreferrer"
            className="footer__social"
            aria-label="GitHub"
          >
            <GithubIcon size={20} />
          </a>
          <a
            href={profile?.linkedin || 'https://linkedin.com/in/dhinesh-shanmugam-711531264'}
            target="_blank"
            rel="noopener noreferrer"
            className="footer__social"
            aria-label="LinkedIn"
          >
            <LinkedinIcon size={20} />
          </a>
          <a
            href={`mailto:${profile?.email || 'dhinesh280105@gmail.com'}`}
            className="footer__social"
            aria-label="Email"
          >
            <Mail size={20} />
          </a>
        </div>

        {/* Copyright */}
        <div className="footer__bottom">
          <p className="footer__copy">
            © {year} Dhinesh Shanmugam. All rights reserved.
          </p>
          <button
            className="footer__back-top"
            onClick={scrollTop}
            aria-label="Back to top"
            id="footer-back-to-top"
          >
            <ArrowUp size={16} />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  )
}
