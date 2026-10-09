/**
 * usePortfolioData — fetches all public portfolio data from Supabase.
 * Falls back to seed data if Supabase is not configured.
 */
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {
  seedProfile,
  seedStatistics,
  seedSkills,
  seedProjects,
  seedInternships,
  seedEducation,
  seedCertificates,
} from '../data/seed'

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL
  return url && url !== 'your_supabase_project_url' && !url.includes('placeholder')
}

export function useProfile() {
  const [data, setData] = useState(seedProfile)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured()) return
    setLoading(true)
    supabase.from('profile').select('*').order('id', { ascending: true }).limit(1).maybeSingle()
      .then(({ data: d, error }) => {
        if (error) {
          console.warn('[useProfile] Error fetching profile:', error)
        } else if (d) {
          setData(d)
        }
        setLoading(false)
      })
  }, [])

  return { data, loading }
}

export function useStatistics() {
  const [data, setData] = useState(seedStatistics.filter(s => s.is_published))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured()) return
    setLoading(true)
    supabase.from('statistics').select('*').eq('is_published', true).order('display_order').order('id')
      .then(({ data: d, error }) => {
        if (error) {
          console.warn('[useStatistics] Error fetching statistics:', error)
        } else if (d && d.length > 0) {
          const seen = new Set()
          const unique = d.filter(item => {
            const key = item.label?.trim().toLowerCase()
            if (!key || seen.has(key)) return false
            seen.add(key)
            return true
          })
          setData(unique)
        }
        setLoading(false)
      })
  }, [])

  return { data, loading }
}

export function useSkills() {
  const [data, setData] = useState(seedSkills.filter(s => s.is_published))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured()) return
    setLoading(true)
    supabase.from('skills').select('*').eq('is_published', true).order('category').order('display_order').order('id')
      .then(({ data: d, error }) => {
        if (error) {
          console.warn('[useSkills] Error fetching skills:', error)
        } else if (d && d.length > 0) {
          const seen = new Set()
          const unique = d.filter(item => {
            const key = `${item.category?.trim().toLowerCase()}::${item.name?.trim().toLowerCase()}`
            if (seen.has(key)) return false
            seen.add(key)
            return true
          })
          setData(unique)
        }
        setLoading(false)
      })
  }, [])

  return { data, loading }
}

export function useProjects() {
  const [data, setData] = useState(seedProjects.filter(p => p.is_published))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured()) return
    setLoading(true)
    supabase.from('projects').select('*').eq('is_published', true).order('display_order').order('id')
      .then(({ data: d, error }) => {
        if (error) {
          console.warn('[useProjects] Error fetching projects:', error)
        } else if (d && d.length > 0) {
          const seen = new Set()
          const unique = d.filter(item => {
            const key = item.title?.trim().toLowerCase()
            if (!key || seen.has(key)) return false
            seen.add(key)
            return true
          })
          setData(unique)
        }
        setLoading(false)
      })
  }, [])

  return { data, loading }
}

export function useFeaturedProject() {
  const [data, setData] = useState(seedProjects.find(p => p.is_featured && p.is_published) || null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured()) return
    setLoading(true)
    supabase.from('projects').select('*').eq('is_published', true).eq('is_featured', true).order('updated_at', { ascending: false }).limit(1).maybeSingle()
      .then(({ data: d, error }) => {
        if (error) {
          console.warn('[useFeaturedProject] Error fetching featured project:', error)
        } else if (d) {
          setData(d)
        }
        setLoading(false)
      })
  }, [])

  return { data, loading }
}

export function useInternships() {
  const [data, setData] = useState(seedInternships.filter(i => i.is_published))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured()) return
    setLoading(true)
    supabase.from('internships').select('*').eq('is_published', true).order('display_order').order('id')
      .then(({ data: d, error }) => {
        if (error) {
          console.warn('[useInternships] Error fetching internships:', error)
        } else if (d && d.length > 0) {
          const seen = new Set()
          const unique = d.filter(item => {
            // Normalize company name (e.g. "Skandax Nexus Pvt. Ltd." vs "Skandax Nexus")
            const normalizedCompany = item.company?.trim().toLowerCase().replace(/\s+pvt\.?\s*ltd\.?/gi, '')
            const key = `${item.role?.trim().toLowerCase()}::${normalizedCompany}`
            if (seen.has(key)) return false
            seen.add(key)
            return true
          })
          setData(unique)
        }
        setLoading(false)
      })
  }, [])

  return { data, loading }
}

export function useEducation() {
  const [data, setData] = useState(seedEducation.filter(e => e.is_published))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured()) return
    setLoading(true)
    supabase.from('education').select('*').eq('is_published', true).order('display_order').order('id')
      .then(({ data: d, error }) => {
        if (error) {
          console.warn('[useEducation] Error fetching education:', error)
        } else if (d && d.length > 0) {
          const seen = new Set()
          const unique = d.filter(item => {
            const key = `${item.degree?.trim().toLowerCase()}::${item.institution?.trim().toLowerCase()}`
            if (seen.has(key)) return false
            seen.add(key)
            return true
          })
          setData(unique)
        }
        setLoading(false)
      })
  }, [])

  return { data, loading }
}

export function useCertificates() {
  const [data, setData] = useState(seedCertificates.filter(c => c.is_published))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured()) return
    setLoading(true)
    supabase.from('certificates').select('*').eq('is_published', true).order('display_order').order('id')
      .then(({ data: d, error }) => {
        if (error) {
          console.warn('[useCertificates] Error fetching certificates:', error)
        } else if (d && d.length > 0) {
          const seen = new Set()
          const unique = d.filter(item => {
            const key = `${item.title?.trim().toLowerCase()}::${item.issuer?.trim().toLowerCase()}`
            if (seen.has(key)) return false
            seen.add(key)
            return true
          })
          setData(unique)
        }
        setLoading(false)
      })
  }, [])

  return { data, loading }
}
