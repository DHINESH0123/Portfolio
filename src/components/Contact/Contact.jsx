import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, Send, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '../Icons/SocialIcons.jsx'
import { useProfile } from '../../hooks/usePortfolioData'
import { supabase } from '../../lib/supabase'
import './Contact.css'

const RATE_LIMIT_MS = 60000 // 1 minute between submissions
let lastSubmitTime = 0

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Name is required'
  if (!form.email.trim()) errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address'
  if (!form.subject.trim()) errors.subject = 'Subject is required'
  if (!form.message.trim()) errors.message = 'Message is required'
  else if (form.message.trim().length < 20) errors.message = 'Message must be at least 20 characters'
  return errors
}

export default function Contact() {
  const { data: profile } = useProfile()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const honeypotRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Honeypot check
    if (honeypotRef.current?.value) return

    // Rate limit
    const now = Date.now()
    if (now - lastSubmitTime < RATE_LIMIT_MS) {
      setStatus('error')
      setErrorMsg('Please wait a moment before sending another message.')
      return
    }

    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setStatus('loading')
    try {
      // 1. Send the email via /api/send-email (handles Resend safely via server/dev middleware)
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
        }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to send message')
      }

      // 2. Also log in Supabase contact_messages if configured (non-blocking)
      try {
        await supabase.from('contact_messages').insert([
          {
            name: form.name.trim(),
            email: form.email.trim(),
            subject: form.subject.trim(),
            message: form.message.trim(),
          },
        ])
      } catch (dbErr) {
        console.warn('[Contact form database log note]:', dbErr)
      }

      lastSubmitTime = Date.now()
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      console.error('[Contact form error]', err)
      setStatus('error')
      const msg = err?.message || ''
      setErrorMsg(
        msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('DISCONNECTED')
          ? 'No internet connection. Please check your network and try again.'
          : msg || 'Something went wrong. Please try again or email directly.'
      )
    }
  }

  const email = profile?.email || 'dhinesh280105@gmail.com'
  const linkedin = profile?.linkedin || 'https://linkedin.com/in/dhinesh-shanmugam-711531264'
  const github = profile?.github || 'https://github.com/DHINESH0123'

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <motion.p
          className="section-label"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Get in Touch
        </motion.p>

        <motion.h2
          className="heading-lg contact__heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Let's work together
        </motion.h2>

        <div className="gold-divider" />

        <div className="contact__inner">
          {/* Left: Info */}
          <motion.div
            className="contact__info"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.2 }}
          >
            <p className="contact__intro">
              I'm actively looking for Junior AI Developer roles and related ML or full-stack opportunities.
              If you're working on something interesting or have a role that fits, I'd love to hear from you.
            </p>

            <div className="contact__details">
              <a href={`mailto:${email}`} className="contact__detail-link">
                <Mail size={18} />
                <span>{email}</span>
              </a>
              <div className="contact__detail-link contact__detail-link--static">
                <MapPin size={18} />
                <span>Chennai, India</span>
              </div>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="contact__detail-link"
              >
                <LinkedinIcon size={18} />
                <span>LinkedIn</span>
              </a>
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="contact__detail-link"
              >
                <GithubIcon size={18} />
                <span>GitHub</span>
              </a>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            className="contact__form-wrap"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.25 }}
          >
            {status === 'success' ? (
              <div className="contact__success" role="alert">
                <CheckCircle size={40} />
                <h3>Message sent!</h3>
                <p>Thanks for reaching out, {form.name || 'there'}. I'll get back to you soon.</p>
                <button
                  className="btn btn-secondary"
                  onClick={() => setStatus('idle')}
                  id="contact-send-another-btn"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                className="contact__form"
                onSubmit={handleSubmit}
                noValidate
                aria-label="Contact form"
              >
                {/* Honeypot — hidden from real users */}
                <input
                  ref={honeypotRef}
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
                />

                <div className="contact__form-row">
                  <div className="contact__field">
                    <label htmlFor="contact-name" className="contact__label">Name</label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      className={`contact__input${errors.name ? ' contact__input--error' : ''}`}
                      placeholder="Your name"
                      value={form.name}
                      onChange={handleChange}
                      autoComplete="name"
                      required
                    />
                    {errors.name && <p className="contact__field-error" role="alert">{errors.name}</p>}
                  </div>
                  <div className="contact__field">
                    <label htmlFor="contact-email" className="contact__label">Email</label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      className={`contact__input${errors.email ? ' contact__input--error' : ''}`}
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                      required
                    />
                    {errors.email && <p className="contact__field-error" role="alert">{errors.email}</p>}
                  </div>
                </div>

                <div className="contact__field">
                  <label htmlFor="contact-subject" className="contact__label">Subject</label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    className={`contact__input${errors.subject ? ' contact__input--error' : ''}`}
                    placeholder="What's this about?"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  />
                  {errors.subject && <p className="contact__field-error" role="alert">{errors.subject}</p>}
                </div>

                <div className="contact__field">
                  <label htmlFor="contact-message" className="contact__label">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={6}
                    className={`contact__textarea${errors.message ? ' contact__input--error' : ''}`}
                    placeholder="Tell me about the opportunity or project..."
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                  {errors.message && <p className="contact__field-error" role="alert">{errors.message}</p>}
                </div>

                {status === 'error' && (
                  <div className="contact__form-error" role="alert">
                    <AlertCircle size={16} />
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary btn-lg contact__submit-btn"
                  disabled={status === 'loading'}
                  id="contact-submit-btn"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader size={18} className="contact__spinner" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
