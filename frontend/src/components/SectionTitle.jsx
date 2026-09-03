import { motion } from 'framer-motion'

export default function SectionTitle({ badge, title, subtitle, align = 'center', className = '' }) {
  const alignClass = align === 'left' ? 'text-left' : 'text-center'

  return (
    <motion.div
      className={`mb-16 ${alignClass} ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {badge && (
        <span className="inline-block mb-4 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg text-gray-600 dark:text-gray-400 max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
