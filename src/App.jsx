import { useState } from 'react'
import { supabase, missingSupabaseEnv } from './lib/supabaseClient'

import logoImg from './assets/logo1.png'
import aboutImg from './assets/aboutus.jpg'
import statsImg from './assets/statsimg.jpg'
import expectImg from './assets/p4.jpg'
import contactImg from './assets/contactus.jpg'
import p1 from './assets/p1.jpg'
import p2 from './assets/p2.jpg'
import p3 from './assets/p3.jpg'
import p4 from './assets/p4.jpg'
import p5 from './assets/p5.jpg'
import p6 from './assets/p6.jpg'
const videoBg = 'https://res.cloudinary.com/dvlitsp9h/video/upload/v1774979134/Capture_every_wedding_moment_with_the_all-new_FE_50_150_mm_F2_GM_Featuring_Amar_Ramesh_1080P_njfo56.mp4'
const values = [
  {
    num: '01',
    title: 'Creativity',
    body: 'We believe that every photo shoot is an opportunity to create something unique and special. We approach every project with a fresh and creative perspective, always striving to capture shots that are both beautiful and unexpected.',
  },
  {
    num: '02',
    title: 'Excellence',
    body: 'We are committed to delivering the highest quality photography services, with a focus on attention to detail and exceptional customer service. Our goal is to exceed your expectations every step of the way, from the initial consultation to the final delivery of your photos.',
  },
  {
    num: '03',
    title: 'Professionalism',
    body: 'We conduct ourselves with the utmost professionalism, ensuring that every interaction with our clients is positive and enjoyable. We understand that photography is an intimate and personal art form, and we treat every client with the respect and consideration they deserve.',
  },
  {
    num: '04',
    title: 'Passion',
    body: 'We are passionate about photography and the power it has to capture and preserve memories that will last a lifetime. We believe that there is beauty in every moment, and we are dedicated to helping our clients capture and preserve those moments in stunning detail.',
  },
]

const stats = [
  { value: '356,789', label: 'Successful Projects' },
  { value: '8,567',   label: 'Satisfied Clients'   },
  { value: '20+',     label: 'Years of Experience' },
  { value: '40+',     label: 'Awards Won'          },
]

const bullets = [
  'A collaborative planning session that aligns every detail with your story.',
  'Relaxed direction and posing guidance so you feel confident and natural.',
  'Thoughtful lighting and composition for a clean, editorial finish.',
  'Secure backups and careful handling to protect every captured moment.',
  'Curated, hand-edited galleries delivered on time with print options.',
]

const categories = ['All', 'Pre-Wedding', 'Weddings & Engagements', 'Maternity & Newborns']

const portfolioItems = [
  { id: 1, img: p1, title: 'A Dreamy Beach Wedding',      cat: 'Wedding Photography',             category: 'Weddings & Engagements' },
  { id: 2, img: p2, title: 'A Beautiful Newborn Session', cat: 'Maternity & Newborn Photography', category: 'Maternity & Newborns'   },
  { id: 3, img: p3, title: 'Urban Portrait Series',       cat: 'Portrait Photography',            category: 'Family Portraits'       },
  { id: 4, img: p4, title: 'Golden Hour Couple',          cat: 'Wedding Photography',             category: 'Weddings & Engagements' },
  { id: 5, img: p5, title: 'Maternity in Nature',         cat: 'Maternity & Newborn Photography', category: 'Maternity & Newborns'   },
  { id: 6, img: p6, title: 'Sunset Pre-Wedding Stroll',   cat: 'Pre-Wedding Photography',         category: 'Pre-Wedding'            },
]

const navItems = [
  { label: 'About', target: 'about' },
  { label: 'Portfolio', target: 'portfolio' },
  { label: 'What to expect', target: 'expect' },
  { label: 'Contact', target: 'contact' },
]

const SCROLL_DELAY_MS = 250

function ContactSection() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    sessionType: '',
    location: '',
    date: '',
    details: '',
    expectations: '',
  })
  const [status, setStatus] = useState({ state: 'idle', message: '' })

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (missingSupabaseEnv) {
      setStatus({ state: 'error', message: 'Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' })
      console.error('Supabase env vars missing: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
      return
    }

    setStatus({ state: 'loading', message: 'Sending...' })

    try {
      const { error } = await supabase.from('contact_requests').insert({
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone,
        session_type: form.sessionType,
        location: form.location,
        shoot_date: form.date,
        details: form.details,
        expectations: form.expectations,
      })

      if (error) throw error

      setStatus({ state: 'success', message: 'Sent! We will contact you shortly.' })
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        sessionType: '',
        location: '',
        date: '',
        details: '',
        expectations: '',
      })
    } catch (err) {
      console.error('Supabase contact insert failed', err)
      const message = err?.message ? `Could not send: ${err.message}` : 'Could not send. Please try again.'
      setStatus({ state: 'error', message })
    }
  }

  return (
    <div className='duration-700'>

      {/* ── CONTACT FORM SECTION ── */}
      <section id="contact" className="w-full bg-[#ebeae6] px-6 py-20 text-[#1a1a18] sm:px-8 md:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-6xl">

          {/* Header row */}
          <div className="mb-14 flex items-start justify-between">
            <div>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 400,
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  color: '#1c1511',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                }}
              >
                Contact Us
              </h2>
              <p
                className="mt-2 text-[13px] text-[#8a8a7e]"
                style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}
              >
                Get in Touch with the One Shot Fotograf Team
              </p>
            </div>
            {/* Rotating badge */}
            <div className="relative flex h-[100px] w-[100px] shrink-0 items-center justify-center">
              <svg
                className="absolute inset-0 animate-[spin_18s_linear_infinite]"
                viewBox="0 0 100 100"
                width="100"
                height="100"
              >
                <defs>
                  <path id="cp2" d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" />
                </defs>
                <text style={{ fontFamily: "'Jost',sans-serif", fontSize: '8px', fontWeight: 400, letterSpacing: '0.18em', fill: '#6b6460' }}>
                  <textPath href="#cp2">ONE SHOT PHOTOGRAF - STUDIO </textPath>
                </text>
              </svg>
              <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#c8c4bc] bg-[#ebeae6]">
                <img
                  src={logoImg}
                  alt="Chavi Studio logo"
                  className="h-8 w-8 object-contain"
                />
              </div>
            </div>
          </div>

          {/* Form + Image grid */}
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_1fr]">

            {/* Left: Form */}
            <div className="flex flex-col gap-6">
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 400,
                  fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)',
                  color: '#1c1511',
                  letterSpacing: '-0.01em',
                }}
              >
                Book Your Session Now
              </h3>

              {/* Input styles shared */}
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

                {/* Row 1: First + Last name */}
                <div className="grid grid-cols-2 gap-5">
                  {[
                    { label: 'First Name', required: true },
                    { label: 'Last Name', required: true },
                  ].map((f) => (
                    <div key={f.label} className="flex flex-col gap-1">
                      <label
                        className="text-[11px] uppercase tracking-[0.15em] text-[#6b6460]"
                        style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400 }}
                      >
                        {f.label}{f.required && <span className="text-[#b07a60]">*</span>}
                      </label>
                      <input
                        type="text"
                        value={form[f.label === 'First Name' ? 'firstName' : 'lastName']}
                        onChange={handleChange(f.label === 'First Name' ? 'firstName' : 'lastName')}
                        required={f.required}
                        className="w-full border-0 border-b border-[#c0bdb5] bg-transparent pb-2 text-[13px] text-[#1c1511] outline-none transition-colors focus:border-[#1c1511]"
                        style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}
                      />
                    </div>
                  ))}
                </div>

                {/* Row 2: Email + Phone */}
                <div className="grid grid-cols-2 gap-5">
                  {[
                    { label: 'Email', type: 'email', required: true },
                    { label: 'Phone Number', type: 'tel', required: true },
                  ].map((f) => (
                    <div key={f.label} className="flex flex-col gap-1">
                      <label
                        className="text-[11px] uppercase tracking-[0.15em] text-[#6b6460]"
                        style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400 }}
                      >
                        {f.label}{f.required && <span className="text-[#b07a60]">*</span>}
                      </label>
                      <input
                        type={f.type}
                        value={form[f.label === 'Email' ? 'email' : 'phone']}
                        onChange={handleChange(f.label === 'Email' ? 'email' : 'phone')}
                        required={f.required}
                        className="w-full border-0 border-b border-[#c0bdb5] bg-transparent pb-2 text-[13px] text-[#1c1511] outline-none transition-colors focus:border-[#1c1511]"
                        style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}
                      />
                    </div>
                  ))}
                </div>

                {/* Row 3: Session type dropdown */}
                <div className="flex flex-col gap-1">
                  <label
                    className="text-[11px] uppercase tracking-[0.15em] text-[#6b6460]"
                    style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400 }}
                  >
                    Photo Session Type<span className="text-[#b07a60]">*</span>
                  </label>
                  <select
                    value={form.sessionType}
                    onChange={handleChange('sessionType')}
                    required
                    className="w-full appearance-none border-0 border-b border-[#c0bdb5] bg-transparent pb-2 text-[13px] text-[#6b6460] outline-none transition-colors focus:border-[#1c1511]"
                    style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}
                  >
                    <option value="" disabled></option>
                    <option>Wedding & Engagement</option>
                    <option>Family Portrait</option>
                    <option>Maternity & Newborn</option>
                    <option>Real Estate</option>
                    <option>Other</option>
                  </select>
                </div>

                {/* Row 4: Location + Date */}
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1">
                    <label
                      className="text-[11px] uppercase tracking-[0.15em] text-[#6b6460]"
                      style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400 }}
                    >
                      Location<span className="text-[#b07a60]">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.location}
                      onChange={handleChange('location')}
                      required
                      className="w-full border-0 border-b border-[#c0bdb5] bg-transparent pb-2 text-[13px] text-[#1c1511] outline-none transition-colors focus:border-[#1c1511]"
                      style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      className="text-[11px] uppercase tracking-[0.15em] text-[#6b6460]"
                      style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400 }}
                    >
                      Photoshoot Date<span className="text-[#b07a60]">*</span>
                    </label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={handleChange('date')}
                      required
                      className="w-full border-0 border-b border-[#c0bdb5] bg-transparent pb-2 text-[13px] text-[#6b6460] outline-none transition-colors focus:border-[#1c1511]"
                      style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}
                    />
                  </div>
                </div>

                {/* Row 5: Photoshoot detail textarea */}
                <div className="flex flex-col gap-1">
                  <label
                    className="text-[11px] uppercase tracking-[0.15em] text-[#6b6460]"
                    style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400 }}
                  >
                    Tell us more about your photoshoot detail
                  </label>
                  <textarea
                    rows={3}
                    value={form.details}
                    onChange={handleChange('details')}
                    className="w-full resize-none border-0 border-b border-[#c0bdb5] bg-transparent pb-2 text-[13px] text-[#1c1511] outline-none transition-colors focus:border-[#1c1511]"
                    style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}
                  />
                </div>

                {/* Row 6: Expectations textarea */}
                <div className="flex flex-col gap-1">
                  <label
                    className="text-[11px] uppercase tracking-[0.15em] text-[#6b6460]"
                    style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400 }}
                  >
                    Tell us what you expect from the photoshoot
                  </label>
                  <textarea
                    rows={3}
                    value={form.expectations}
                    onChange={handleChange('expectations')}
                    className="w-full resize-none border-0 border-b border-[#c0bdb5] bg-transparent pb-2 text-[13px] text-[#1c1511] outline-none transition-colors focus:border-[#1c1511]"
                    style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}
                  />
                </div>

                {/* Thank you note */}
                <p
                  className="text-[12px] italic text-[#8a8a7e]"
                  style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}
                >
                  Thanks so much! I'll get back to you soon with more info about a session together.
                </p>

                {/* Submit */}
                <div>
                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={status.state === 'loading'}
                      className="flex items-center gap-2 rounded-full bg-[#1c1511] px-7 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-white transition-all duration-300 hover:bg-[#3a2e26] disabled:cursor-not-allowed disabled:opacity-70"
                      style={{ fontFamily: "'Jost', sans-serif" }}
                    >
                      {status.state === 'loading' ? 'Sending...' : 'Submit'}
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                        <path d="M2 12L12 2M12 2H4M12 2V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    {status.message && (
                      <span className={`text-[12px] ${status.state === 'error' ? 'text-[#8b3d3f]' : 'text-[#2f5c3f]'}`} style={{ fontFamily: "'Jost', sans-serif" }}>
                        {status.message}
                      </span>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Right: Image */}
            <div className="overflow-hidden rounded-sm lg:h-full">
              <img
                src={contactImg}
                alt="Photography session"
                className="h-[420px] w-full object-cover object-top transition-transform duration-700 hover:scale-105 lg:h-full lg:min-h-[600px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="w-full bg-[#5c5549] px-6 py-16 sm:px-8 md:px-12 lg:px-16">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 md:grid-cols-2">

          {/* Left: blurb */}
          <div className="flex items-center">
            <p
              className="max-w-md text-[13px] leading-[1.85] text-white/60"
              style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}
            >
              Feel free to contact us using any of the methods listed below. We are always happy to hear from our clients and visitors, and will do our best to respond to your inquiry as soon as possible. If you need to schedule a consultation or book a session, please don't hesitate to reach out to us by phone or email. Thank you for considering One Shot Fotograf for your photography needs!
            </p>
          </div>

          {/* Right: contact details */}
          <div className="flex flex-col gap-0">
            {[
              { label: 'Phone', value: '+91 81047 74243' },
              { label: 'Email', value: 'omkarwaingankar4@gmail.com' },
              { label: 'Address', value: 'C-301, Balaji Aangan Complex,\nSundaram Blg, 90ft Road \nThakurli(E) - 421201.' },
            ].map((item, idx, arr) => (
              <div
                key={item.label}
                className={`py-6 ${idx < arr.length - 1 ? 'border-b border-white/15' : ''}`}
              >
                <p
                  className="mb-1 text-[10px] uppercase tracking-[0.3em] text-white/40"
                  style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400 }}
                >
                  {item.label}
                </p>
                <p
                  className="whitespace-pre-line text-[18px] text-white/90"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, letterSpacing: '-0.01em' }}
                >
                  {item.value}
                </p>
              </div>
            ))}

            {/* Social media */}
            <div className="border-t border-white/15 pt-6">
              <p
                className="mb-4 text-[10px] uppercase tracking-[0.3em] text-white/40"
                style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400 }}
              >
                Follow Us on Social Media
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.facebook.com/Oneshotfotograf"
                  target='_blank'
                  title="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white/80 transition-all duration-200 hover:border-white/60 hover:text-white"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M14.5 6.5H16V3.5H14.5C12.56 3.5 11 5.06 11 7V9H9V12H11V20H14V12H16L17 9H14V7C14 6.72 14.22 6.5 14.5 6.5Z" fill="currentColor" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/one_shot_fotograf/"
                  title="Instagram"
                  target='_blank'
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white/80 transition-all duration-200 hover:border-white/60 hover:text-white"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M8.5 3.5H15.5C17.99 3.5 19.5 5.01 19.5 7.5V16.5C19.5 18.99 17.99 20.5 15.5 20.5H8.5C6.01 20.5 4.5 18.99 4.5 16.5V7.5C4.5 5.01 6.01 3.5 8.5 3.5Z" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="16.3" cy="7.7" r="0.9" fill="currentColor" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}

function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [view, setView] = useState('GALLERY')

  const filtered = activeCategory === 'All'
    ? portfolioItems
    : portfolioItems.filter(i => i.category === activeCategory)

  const heroItems = portfolioItems.slice(0, 2)

  return (
    <section id="portfolio" className="w-full bg-[#ebeae6] px-6 pt-16 pb-20 text-[#1a1a18] sm:px-8 md:px-12 lg:px-16 transition-all duration-200">
      <div className="mx-auto w-full max-w-6xl">

        {/* ── Title row ── */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 400,
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                color: '#1c1511',
                letterSpacing: '-0.02em',
              }}
            >
              Our Portfolio
            </h2>
            <button className="flex h-8 w-8 items-center justify-center rounded-full border border-[#b0aca4] text-[#1c1511] transition-all duration-300 hover:bg-[#1c1511] hover:text-[#ebeae6]">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M2 12L12 2M12 2H4M12 2V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <span
            className="text-[10px] uppercase tracking-[0.3em] text-[#8a8a7e]"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            Photo / Graphy
          </span>
        </div>

        {/* ── Two hero images ── */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {heroItems.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-sm">
              <img
                src={item.img}
                alt={item.title}
                className="h-[260px] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[320px] md:h-[380px] lg:h-[420px]"
              />
            </div>
          ))}
        </div>

        {/* ── Category filter tabs ── */}
        <div className="mt-14">
          <div className="flex items-center gap-0">
            <button className="mr-3 shrink-0 text-[#8a8a7e] transition-colors hover:text-[#1c1511]">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div className="flex flex-1 items-center gap-7 overflow-x-auto pb-1 scrollbar-hide lg:gap-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="relative shrink-0 pb-3 transition-colors duration-200"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: '13px',
                    fontWeight: activeCategory === cat ? 600 : 400,
                    color: activeCategory === cat ? '#1c1511' : '#8a8a7e',
                  }}
                >
                  {cat}
                  {activeCategory === cat && (
                    <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[#1c1511]" />
                  )}
                </button>
              ))}
            </div>

            <button className="ml-3 shrink-0 text-[#8a8a7e] transition-colors hover:text-[#1c1511]">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <hr className="border-t border-[#c8c8be]" />
        </div>

        {/* ── Gallery / List toggle ── */}
        <div className="mb-5 mt-3 flex justify-end">
          <div className="flex items-center gap-2">
            {['GALLERY', 'LIST'].map((v, i) => (
              <span key={v} className="flex items-center gap-2">
                {i > 0 && <span className="text-[11px] text-[#c8c8be]">/</span>}
                <button
                  onClick={() => setView(v)}
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: '10px',
                    fontWeight: view === v ? 600 : 400,
                    letterSpacing: '0.2em',
                    color: view === v ? '#1c1511' : '#8a8a7e',
                  }}
                >
                  {v}
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* ── Gallery Grid ── */}
        {view === 'GALLERY' ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item, idx) => (
              <div
                key={item.id}
                className={`group relative overflow-hidden rounded-sm ${
                  idx < 2 ? 'sm:col-span-1' : ''
                }`}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    idx < 2
                      ? 'h-[300px] md:h-[380px]'
                      : 'h-[240px] md:h-[280px]'
                  }`}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent px-5 pb-5 pt-10">
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontWeight: 400,
                      fontSize: idx < 2 ? '1.2rem' : '1rem',
                      color: '#fff',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="mt-0.5 text-[9px] uppercase tracking-[0.22em] text-white/65"
                    style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400 }}
                  >
                    {item.cat}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group flex cursor-pointer items-center gap-5 border-b border-[#c8c8be] py-4 transition-colors duration-200 first:border-t hover:bg-[#e2e0da]"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="h-14 w-20 shrink-0 rounded-sm object-cover"
                />
                <div className="flex-1">
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontWeight: 400,
                      fontSize: '1.15rem',
                      color: '#1c1511',
                    }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-[#8a8a7e]"
                    style={{ fontFamily: "'Jost', sans-serif" }}
                  >
                    {item.cat}
                  </p>
                </div>
                <span className="text-sm text-[#8a8a7e] transition-transform duration-300 group-hover:translate-x-1">→</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)
  const toggleMenu = () => setIsMenuOpen((prev) => !prev)

  const handleNavClick = (target) => {
    const el = document.getElementById(target)
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, SCROLL_DELAY_MS)
      closeMenu()
    }
  }

  return (
    <div className="w-full overflow-x-hidden font-sans text-white">

      {/* ── HERO SECTION ── */}
      <section id="hero" className="relative min-h-screen w-full overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={videoBg}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 flex min-h-screen flex-col">

          {/* ── HEADER / NAV ── */}
          <header className="relative w-full px-4 py-4 sm:px-6 sm:py-5 md:px-10 md:py-6">
            <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <img
                  src={logoImg}
                  alt="Chavi Studios logo"
                  className="h-8 w-8 rounded-full object-cover shadow-md sm:h-9 sm:w-9 md:h-10 md:w-10"
                />
                <span
                  className="text-base font-light sm:text-lg md:text-xl"
                  style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.1em' }}
                >
                  ONE SHOT FOTOGRAF
                </span>
              </div>
              <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-4 text-[12px] font-medium uppercase tracking-[0.18em] lg:flex lg:gap-6">
                {navItems.map((item) => (
                  <button
                    key={item.target}
                    type="button"
                    onClick={() => handleNavClick(item.target)}
                    className="opacity-75 transition-opacity hover:opacity-100"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
              <button
                type="button"
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
                onClick={toggleMenu}
                className="flex flex-col gap-[5px] opacity-90 transition-opacity hover:opacity-100 lg:hidden"
              >
                <div className="h-[1.5px] w-6 bg-white sm:w-7 md:w-8" />
                <div className="h-[1.5px] w-6 bg-white sm:w-7 md:w-8" />
              </button>
            </div>

            {isMenuOpen && (
              <div className="fixed inset-0 z-40 lg:hidden">
                <div className="absolute inset-0 bg-black/50" onClick={closeMenu} />
                <div className="absolute right-4 top-4 w-[240px] rounded-md bg-[#1c1511] p-4 shadow-lg shadow-black/40">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold tracking-[0.12em] text-white">Menu</span>
                    <button type="button" aria-label="Close menu" onClick={closeMenu} className="text-white/70 transition hover:text-white">
                      ×
                    </button>
                  </div>
                  <div className="flex flex-col divide-y divide-white/10">
                    {navItems.map((item) => (
                      <button
                        key={item.target}
                        type="button"
                        onClick={() => handleNavClick(item.target)}
                        className="py-3 text-left text-[12px] font-medium uppercase tracking-[0.18em] text-white/80 transition hover:text-white"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </header>

          {/* ── HERO BODY ── */}
          <main className="flex flex-1 items-center px-4 py-10 sm:px-6 sm:py-12 md:px-10 md:py-16">
            <div className="mx-auto w-full max-w-screen-xl">
              <div className="flex flex-col gap-8 sm:gap-10 md:flex-row md:items-end md:justify-between md:gap-12">
                <div className="max-w-2xl">
                  <h1
                    className="font-semibold leading-[0.92] tracking-tight opacity-75"
                    style={{ fontSize: 'clamp(2.4rem, 8vw, 5rem)' }}
                  >
                    Capture Life's<br />
                    Moments with<br />
                    One Shot Fotograf
                  </h1>
                </div>
                <div className="flex flex-col items-start gap-4 md:items-end md:pb-1 md:text-right">
                  <p
                    className="font-light leading-relaxed opacity-80"
                    style={{
                      fontSize: 'clamp(11px, 1.4vw, 13px)',
                      maxWidth: 'clamp(220px, 28vw, 320px)',
                    }}
                  >
                    A team of passionate photographers dedicated to capturing life's most precious moments.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleNavClick('contact')}
                    className="rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-[10px] font-medium uppercase tracking-widest backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-black sm:px-7 sm:py-3 sm:text-[11px]"
                  >
                    Book a Session Now
                  </button>
                </div>
              </div>
              <div className="mt-12 hidden items-center gap-2 sm:flex md:mt-16">
                <div className="h-px w-8 bg-white/40" />
                <span className="text-[9px] font-medium uppercase tracking-[0.3em] opacity-50">
                  Scroll to explore
                </span>
              </div>
            </div>
          </main>
        </div>
      </section>

      {/* ── ABOUT SECTION ── */}
      <section id="about" className="w-full bg-[#ebeae6] px-6 py-20 text-[#1a1a18] sm:px-8 md:px-12 lg:px-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">

          {/* Header */}
          <div className="flex flex-col gap-4">
            <h2
              className="text-center text-4xl tracking-tight text-[#3a312c] sm:text-5xl"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
            >
              About One Shot Fotograf
            </h2>
            <hr className="border-t border-[#c8c8be]" />
            <div className="flex w-full flex-wrap items-center justify-between gap-2 text-[11px] uppercase tracking-[0.3em] text-[#8a8a7e]">
              <span>Learn More About the Passion Behind One Shot Fotograf</span>
              <span>One Shot Fotograf / Photography</span>
            </div>
          </div>

          {/* Hero image */}
          <div className="w-full overflow-hidden rounded-sm">
            <img
              src={aboutImg}
              alt="Chavi Studio photography"
              className="h-[260px] w-full object-cover sm:h-[340px] md:h-[420px] lg:h-[500px]"
            />
          </div>

          {/* Values two-column layout */}
          <div className="mt-6 grid grid-cols-1 items-start gap-12 md:grid-cols-[1fr_1.6fr]">
            {/* Left: sticky headline + vertical label */}
            <div className="relative flex flex-col justify-between md:sticky md:top-16 md:h-[480px]">
              <p
                className="max-w-[340px] text-[clamp(1.5rem,2.5vw,2.2rem)] leading-[1.25] text-[#1a1a18]"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
              >
                At One Shot Fotograf, we are committed to upholding the following values
                 in everything we do
              </p>
              <span
                className="hidden md:block"
                style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                  fontSize: '10px',
                  fontWeight: 400,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: '#8a8a7e',
                }}
              >
                PHOTOGRAPHY
              </span>
            </div>

            {/* Right: numbered values list */}
            <div className="flex flex-col">
              {values.map((item) => (
                <div
                  key={item.num}
                  className="group relative cursor-default border-b border-[#c8c8be] py-9 first:border-t"
                >
                  <span className="absolute left-0 top-0 h-px w-0 bg-[#2a2a22] transition-all duration-500 group-hover:w-full" />
                  <div className="grid grid-cols-[48px_1fr] items-baseline">
                    <span
                      className="text-[11px] tracking-[0.08em]"
                      style={{ color: '#8a8a7e', fontFamily: "'Jost', sans-serif", fontWeight: 400 }}
                    >
                      {item.num}
                    </span>
                    <div>
                      <h3
                        className="mb-3 transition-all duration-300 group-hover:tracking-wider"
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontWeight: 400,
                          fontSize: 'clamp(1.25rem, 2vw, 1.75rem)',
                          color: '#1a1a18',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {item.title}
                      </h3>
                      <p
                        className="text-[13px] leading-[1.75]"
                        style={{ color: '#4a4a44', fontFamily: "'Jost', sans-serif", fontWeight: 300 }}
                      >
                        {item.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section id="pricing" className="w-full overflow-hidden bg-[#e8e6e0]">
        <div className="mx-auto grid w-full max-w-none grid-cols-1 md:grid-cols-[45fr_55fr]">

          {/* Left: Stats — padded, vertically centered */}
          <div className="flex flex-col justify-center gap-0 px-10 py-16 sm:px-14 md:px-16 lg:px-24">
            {[{ value: '1,55,386', label: 'Successful Projects' }, { value: '8,567', label: 'Satisfied Clients' }, { value: '8+', label: 'Years of Experience' }, ].map((stat, idx, arr) => (
              <div key={stat.label}>
                <div className="py-7 lg:py-9">
                  <p
                    className="leading-none text-[#1c1a17]"
                    style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 'clamp(2.4rem, 4.5vw, 4.2rem)', letterSpacing: '-0.02em' }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="mt-2.5 text-[10px] uppercase tracking-[0.3em] text-[#8a8a7e]"
                    style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400 }}
                  >
                    {stat.label}
                  </p>
                </div>
                {idx < arr.length - 1 && <hr className="border-t border-[#cbc8be]" />}
              </div>
            ))}
          </div>

          {/* Right: Image — flush to edges, no padding, full height */}
          <div className="relative min-h-[420px] sm:min-h-[520px] md:min-h-0">
            <img
              src={statsImg}
              alt="Photography session"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </div>

        </div>
      </section>

      <PortfolioSection />

      {/* ── EXPECTATIONS SECTION ── */}
      <section id="expect" className="w-full bg-[#ebeae6] px-6 py-20 text-[#1a1a18] sm:px-8 md:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-6xl flex flex-col gap-16">

          {/* ── Top row: heading left, circular badge right ── */}
          <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[1fr_auto]">

            {/* Left: heading + body */}
            <div className="flex flex-col gap-6 max-w-xl">
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 400,
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                  color: '#1c1511',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                }}
              >
                What to Expect When You<br />Choose One Shot Fotograf
              </h2>
              <p
                className="leading-[1.85] text-[#5a5450]"
                style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: '13.5px' }}
              >
                We believe that photography is about more than just taking pictures. It's about capturing the essence of a moment, telling a story, and creating a lasting memory that you can cherish for years to come. When you choose One Shot Fotograf, you're not just choosing a photographer — you're choosing an experience. At One Shot Fotograf, we want your photography experience to be enjoyable, stress-free, and memorable. Here's what you can expect when you choose us for your photography needs:
              </p>
            </div>

            {/* Right: circular rotating badge */}
            <div className="flex items-start justify-center md:justify-end md:pt-2">
              <div className="relative flex h-[130px] w-[130px] items-center justify-center">
                {/* Rotating text ring */}
                <svg
                  className="absolute inset-0 animate-[spin_18s_linear_infinite]"
                  viewBox="0 0 130 130"
                  width="130"
                  height="130"
                >
                  <defs>
                    <path
                      id="circle-path"
                      d="M 65,65 m -47,0 a 47,47 0 1,1 94,0 a 47,47 0 1,1 -94,0"
                    />
                  </defs>
                  <text
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: '10.5px',
                      fontWeight: 400,
                      letterSpacing: '0.18em',
                      fill: '#6b6460',
                    }}
                  >
                    <textPath href="#circle-path">ONE SHOT PHOTOGRAF</textPath>
                  </text>
                </svg>
                {/* Center icon */}
                <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full border border-[#c8c4bc] bg-[#ebeae6]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7ZM2 9.5C2 8.4 2.9 7.5 4 7.5h1.17a2 2 0 0 0 1.66-.9l.96-1.2A2 2 0 0 1 9.45 4.5h5.1a2 2 0 0 1 1.66.9l.96 1.2a2 2 0 0 0 1.66.9H20c1.1 0 2 .9 2 2V18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5Z"
                      stroke="#6b6460"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* ── Bottom row: image left, bullets right ── */}
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">

            {/* Left: photo */}
            <div className="overflow-hidden rounded-sm">
              <img
                src={expectImg}
                alt="Floral photography session"
                className="h-[300px] w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-[360px] md:h-[420px]"
              />
            </div>

            {/* Right: bullet list */}
            <ul className="flex flex-col gap-5">
              {bullets.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  {/* Bullet dot */}
                  <span
                    className="mt-[6px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#1c1511]"
                  />
                  <p
                    className="leading-[1.75] text-[#3a3530]"
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: 300,
                      fontSize: '13.5px',
                    }}
                  >
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      <ContactSection />

    </div>
  )
}

export default App