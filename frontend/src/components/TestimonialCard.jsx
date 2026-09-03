import { motion } from 'framer-motion'

export default function TestimonialCard({ testimonial }) {
  return (
    <div className="text-center max-w-3xl mx-auto px-4">
      <svg className="w-10 h-10 text-brand-500/30 mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.432.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>
      <motion.p
        className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 font-light italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        &ldquo;{testimonial.quote}&rdquo;
      </motion.p>
      <div>
        <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {testimonial.position}, {testimonial.company}
        </p>
      </div>
    </div>
  )
}
