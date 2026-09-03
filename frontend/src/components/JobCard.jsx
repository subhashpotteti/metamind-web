import { useState } from 'react'
import { motion } from 'framer-motion'

export default function JobCard({ job, onView }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientY - rect.top - rect.height / 2) / 25
    const y = -(e.clientX - rect.left - rect.width / 2) / 25
    setTilt({ x, y })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="group p-6 rounded-2xl bg-white dark:bg-surface-card border border-gray-200 dark:border-white/10 hover:border-brand-500/30 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-300 cursor-pointer"
      onClick={() => onView(job)}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors">
            {job.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{job.department}</p>
        </div>
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-brand-500/10 text-brand-500">
          {job.type}
        </span>
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          {job.location}
        </span>
        <span>{job.experience}</span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{job.description}</p>
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-500 group-hover:gap-3 transition-all">
        View Position
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </span>
    </motion.div>
  )
}
