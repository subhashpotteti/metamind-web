import { useState } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '../hooks/useScrollPosition'

export default function ProjectCard({ project, index }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const reducedMotion = useReducedMotion()

  const handleMouseMove = (e) => {
    if (reducedMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientY - rect.top - rect.height / 2) / 25
    const y = -(e.clientX - rect.left - rect.width / 2) / 25
    setTilt({ x, y })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      style={{
        transform: reducedMotion ? 'none' : `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setIsHovered(false) }}
      className="group relative overflow-hidden rounded-2xl cursor-pointer"
    >
      <div className={`relative h-80 bg-gradient-to-br ${project.gradient} overflow-hidden`}>
        <img src={project.image} alt={`${project.title} project preview`} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
        <div className="absolute inset-0 bg-slate-950/35" />
        {/* Abstract visual */}
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border border-white/20 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border border-white/30 animate-pulse-glow" />
          </div>
        </div>

        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col justify-end p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-brand-400 text-xs font-semibold uppercase tracking-wider mb-2">
            {project.category}
          </span>
          <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
          <p className="text-gray-300 text-sm mb-4 line-clamp-2">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech) => (
              <span key={tech} className="px-2 py-1 text-xs bg-white/10 rounded-md text-white/80">
                {tech}
              </span>
            ))}
          </div>
          <motion.span
            className="inline-flex items-center gap-2 text-sm font-semibold text-white"
            animate={isHovered ? { x: 4 } : { x: 0 }}
          >
            View Project
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.span>
        </motion.div>

        {/* Default info */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
          <span className="text-brand-400 text-xs font-semibold uppercase tracking-wider">{project.category}</span>
          <h3 className="text-xl font-bold text-white mt-1">{project.title}</h3>
        </div>
      </div>
    </motion.div>
  )
}
