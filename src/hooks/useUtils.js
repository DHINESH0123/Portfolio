import { useState, useEffect, useRef } from 'react'

/**
 * useScrollReveal — adds 'visible' class to elements with 'reveal' class
 * when they enter the viewport.
 */
export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    const elements = document.querySelectorAll('.reveal')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  })
}

/**
 * useAnimatedCounter — animates a number from 0 to target when visible
 */
export function useAnimatedCounter(target, duration = 1500) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return
    // Parse numeric part from target (e.g. "8.07", "10,000", "89")
    const numeric = parseFloat(String(target).replace(/,/g, ''))
    if (isNaN(numeric)) {
      setCount(target)
      return
    }
    const isDecimal = String(target).includes('.')
    const steps = 60
    const increment = numeric / steps
    let current = 0
    let step = 0
    const timer = setInterval(() => {
      step++
      current = Math.min(current + increment, numeric)
      if (isDecimal) {
        setCount(current.toFixed(2))
      } else {
        setCount(Math.floor(current).toLocaleString())
      }
      if (step >= steps) {
        clearInterval(timer)
        setCount(isDecimal ? numeric.toFixed(2) : numeric.toLocaleString())
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [hasStarted, target, duration])

  return { count, ref }
}

/**
 * useReducedMotion — returns true if user prefers reduced motion
 */
export function useReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mq.matches)
    const handler = (e) => setPrefersReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return prefersReduced
}

