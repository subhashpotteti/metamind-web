import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import HeroBackground from '../components/HeroBackground'
import SectionBackdrop from '../components/SectionBackdrop'
import Button from '../components/Button'
import SectionTitle from '../components/SectionTitle'
import StatCounter from '../components/StatCounter'
import ServiceCard from '../components/ServiceCard'
import ProjectCard from '../components/ProjectCard'
import TestimonialCard from '../components/TestimonialCard'
import { homeServices } from '../data/services'
import { projects } from '../data/projects'
import { testimonials } from '../data/testimonials'
import { stats, technologies, globalLocations, insights } from '../data/content'
import { images } from '../data/images'

const features = [
  'Innovation First',
  'Scalable Architecture',
  'User-Centered Design',
  'Agile Development',
  'Long-Term Partnership',
]

export default function Home() {
  const navigate = useNavigate()
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const [hoveredTech, setHoveredTech] = useState(null)

  const nextTestimonial = () => setTestimonialIndex((i) => (i + 1) % testimonials.length)
  const prevTestimonial = () => setTestimonialIndex((i) => (i - 1 + testimonials.length) % testimonials.length)

  useEffect(() => {
    const timer = window.setInterval(nextTestimonial, 5000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <main>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <HeroBackground />
        
        {/* Animated floating elements */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 rounded-lg bg-brand-500/10 blur-xl"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-32 right-10 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl"
          animate={{ y: [0, -40, 0], x: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center">
          <motion.span
            className="inline-block mb-6 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, type: 'spring', stiffness: 100 }}
          >
            Premium IT Services
          </motion.span>

          <motion.h1
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.045em] text-gray-900 dark:text-white max-w-5xl mx-auto leading-[1.04] mb-6"
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1], type: 'spring', stiffness: 80 }}
          >
            Building Digital Experiences That{' '}
            <motion.span 
              className="text-gradient inline-block"
              animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              Move Businesses Forward.
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, type: 'spring', stiffness: 100 }}
          >
            Meta Minds delivers innovative technology solutions that help businesses transform, scale, and lead in a digital-first world.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.6, type: 'spring' }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button to="/services" magnetic icon="→">Explore Our Services</Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button to="/contact" variant="secondary" magnetic>Let&apos;s Work Together</Button>
            </motion.div>
          </motion.div>

          {/* Scroll indicator animation */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <motion.section 
        className="py-16 border-y border-gray-200 dark:border-white/5 bg-white dark:bg-surface-dark"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, type: 'spring', stiffness: 100 }}
              >
                <StatCounter {...stat} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* SERVICES */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <SectionBackdrop src={images.homeServices} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Services"
            title="What We Do"
            subtitle="Technology solutions designed to solve real business challenges."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {homeServices.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50, rotateY: -20 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(51,136,255,0.2)' }}
              >
                <ServiceCard
                  service={service}
                  index={i}
                  onNavigate={() => navigate('/services')}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY META MINDS */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <SectionBackdrop src={images.homePurpose} position="center" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
                Technology with a{' '}
                <span className="text-gradient">purpose.</span>
              </h2>
            </motion.div>
            <div>
              <motion.p
                className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                Meta Minds combines technology, creativity and business thinking to build solutions that create measurable impact.
              </motion.p>
              <ul className="space-y-4">
                {features.map((feature, i) => (
                  <motion.li
                    key={feature}
                    className="flex items-center gap-3 text-gray-800 dark:text-gray-200"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <span className="w-6 h-6 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center text-sm">✓</span>
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* TECHNOLOGY ECOSYSTEM */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <SectionBackdrop src={images.homeTechnology} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Technologies"
            title="Our Technology Ecosystem"
            subtitle="A comprehensive stack powering enterprise-grade solutions."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(technologies).map(([category, techs], catIndex) => (
              <motion.div
                key={category}
                className="p-6 rounded-2xl bg-white dark:bg-surface-card border border-gray-200 dark:border-white/10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.1 }}
              >
                <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-500 mb-4">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {techs.map((tech) => (
                    <motion.span
                      key={tech}
                      className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 cursor-default relative"
                      whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(51,136,255,0.2)' }}
                      onHoverStart={() => setHoveredTech(tech)}
                      onHoverEnd={() => setHoveredTech(null)}
                    >
                      {tech}
                      {hoveredTech === tech && (
                        <motion.div
                          className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-brand-600 text-white rounded whitespace-nowrap"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {tech}
                        </motion.div>
                      )}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GLOBAL PRESENCE — temporarily disabled */}
      {false && (
      <section className="relative overflow-hidden py-24 lg:py-32">
        {/* <SectionBackdrop src={images.homeGlobal} /> */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Technology Without Boundaries." />
          <div className="relative max-w-4xl mx-auto aspect-[2/1]">
            <motion.svg 
              viewBox="0 0 100 60" 
              className="w-full h-full"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* Abstract world map dots */}
              {Array.from({ length: 80 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={10 + Math.random() * 80}
                  cy={10 + Math.random() * 40}
                  r="0.3"
                  className="fill-brand-500/20"
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity, delay: Math.random() * 2 }}
                />
              ))}
              {/* Connection lines - animated */}
              {globalLocations.map((loc, i) =>
                globalLocations.slice(i + 1).map((loc2, j) => (
                  <motion.line
                    key={`${i}-${j}`}
                    x1={loc.x} y1={loc.y} x2={loc2.x} y2={loc2.y}
                    stroke="rgba(51,136,255,0.15)"
                    strokeWidth="0.2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  />
                ))
              )}
              {/* Location points */}
              {globalLocations.map((loc, i) => (
                <g key={loc.name}>
                  <motion.circle
                    cx={loc.x} cy={loc.y} r="1.5"
                    className="fill-brand-500"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.3, type: 'spring', stiffness: 100 }}
                  />
                  <motion.circle
                    cx={loc.x} cy={loc.y} r="3"
                    fill="none"
                    stroke="rgba(51,136,255,0.3)"
                    strokeWidth="0.3"
                    animate={{ r: [3, 6, 3], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  />
                  <motion.text 
                    x={loc.x} y={loc.y - 3} textAnchor="middle" 
                    className="fill-gray-600 dark:fill-gray-400 text-[2.5px] font-medium"
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.4 }}
                  >
                    {loc.name}
                  </motion.text>
                </g>
              ))}
            </motion.svg>
            
            {/* Animated India info card */}
            <motion.div
              className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-white dark:bg-surface-card rounded-xl shadow-lg border border-brand-500/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-sm font-semibold text-brand-500">🇮🇳 Proudly Serving India</p>
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {/* PROJECTS */}
      <motion.section 
        className="relative overflow-hidden py-24 lg:py-32"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <SectionBackdrop src={images.homePortfolio} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Portfolio"
            title="Transforming Ideas Into Digital Products."
          />
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, type: 'spring' }}
                whileHover={{ scale: 1.02 }}
              >
                <ProjectCard project={project} index={i} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* TESTIMONIALS */}
      <motion.section 
        className="relative overflow-hidden py-24 lg:py-32"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <SectionBackdrop src={images.homeTestimonials} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle badge="Testimonials" title="What Our Clients Say" />
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, x: 96 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -96 }}
                transition={{ duration: 0.50, ease: [0.22, 1, 0.36, 1] }}
              >
                <TestimonialCard testimonial={testimonials[testimonialIndex]} />
              </motion.div>
            </AnimatePresence>
            <div className="flex items-center justify-center gap-4 mt-10">
              <motion.button
                onClick={prevTestimonial}
                className="w-12 h-12 rounded-full border border-gray-300 dark:border-white/20 flex items-center justify-center hover:bg-brand-500 hover:text-white hover:border-brand-500 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Previous testimonial"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setTestimonialIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === testimonialIndex ? 'bg-brand-500 w-6' : 'bg-gray-300 dark:bg-white/20'}`}
                    whileHover={{ scale: 1.2 }}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
              <motion.button
                onClick={nextTestimonial}
                className="w-12 h-12 rounded-full border border-gray-300 dark:border-white/20 flex items-center justify-center hover:bg-brand-500 hover:text-white hover:border-brand-500 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Next testimonial"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* INSIGHTS */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <SectionBackdrop src={images.homeInsights} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle badge="Insights" title="Latest From Meta Minds" />
          <div className="grid md:grid-cols-3 gap-6">
            {insights.map((item) => (
              <article
                key={item.id}
                className="group p-6 rounded-2xl bg-white dark:bg-surface-card border border-gray-200 dark:border-white/10 hover:border-brand-500/30 hover:shadow-lg transition-colors duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-semibold text-brand-500 uppercase">
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-400">{item.date}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-brand-500 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{item.excerpt}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-500">
                  Read More →
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <motion.section 
        className="py-24 lg:py-32 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 via-transparent to-indigo-600/10" />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-500/5 blur-[100px]"
          animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* Animated orbit elements */}
        <motion.div
          className="absolute top-10 right-20 w-4 h-4 rounded-full bg-brand-500/40"
          animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-6 h-6 rounded-full bg-indigo-500/30"
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 80 }}
          >
            Ready to Build What&apos;s Next?
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-400 mb-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            Let&apos;s turn your ideas into technology that creates real impact.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button to="/contact" magnetic icon="→">Start a Conversation</Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button to="/careers" variant="secondary" magnetic>Explore Careers</Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </main>
  )
}
  
