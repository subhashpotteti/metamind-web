import { motion } from 'framer-motion'
import Button from '../components/Button'
import SectionTitle from '../components/SectionTitle'
import { services } from '../data/services'
import { images, serviceImages } from '../data/images'

const iconMap = {
  globe: '🌐', mobile: '📱', cloud: '☁️', brain: '🧠', chart: '📊',
  transform: '🔄', design: '🎨', test: '✅', consult: '💼', devops: '⚙️',
}

export default function Services() {
  return (
    <main>
      <motion.section 
        className="relative pt-32 pb-20 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <img src={images.servicesHero} alt="Technology team collaborating in a modern office" className="absolute inset-0 h-full w-full object-cover opacity-20 dark:opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/65 to-white dark:from-surface-dark/80 dark:via-surface-dark/75 dark:to-surface-dark" />
        <div className="absolute inset-0 grid-bg opacity-40" />
        <motion.div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-500/10 rounded-full blur-[150px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            className="inline-block mb-6 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            Our Services
          </motion.span>
          <motion.h1
            className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 80 }}
          >
            Technology Solutions Built For{' '}
            <motion.span 
              className="text-gradient inline-block"
              animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              What&apos;s Next.
            </motion.span>
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            Comprehensive technology services designed to accelerate your digital transformation journey.
          </motion.p>
        </div>
      </motion.section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              id={service.id}
              className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              initial={{ opacity: 0, y: 60, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, type: 'spring', stiffness: 80 }}
            >
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <motion.span 
                  className="text-6xl font-black text-brand-500/10"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, type: 'spring' }}
                >
                  {service.number}
                </motion.span>
                <div className="flex items-center gap-4 mb-4 -mt-4">
                  <motion.span 
                    className="text-3xl"
                    animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {iconMap[service.icon]}
                  </motion.span>
                  <motion.h2 
                    className="text-3xl font-bold text-gray-900 dark:text-white"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    {service.title}
                  </motion.h2>
                </div>
                <motion.p 
                  className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  {service.description}
                </motion.p>
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-500 mb-3">Key Capabilities</h4>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {service.capabilities.map((cap, idx) => (
                      <motion.li 
                        key={cap} 
                        className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + idx * 0.05 }}
                      >
                        <span className="text-brand-500">✓</span> {cap}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
                <motion.div 
                  className="flex flex-wrap gap-2 mb-6"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  {service.technologies.map((tech) => (
                    <motion.span 
                      key={tech} 
                      className="px-3 py-1 text-xs rounded-full bg-brand-500/10 text-brand-500 font-medium"
                      whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(51,136,255,0.3)' }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button to="/contact" magnetic icon="→">Get Started</Button>
                </motion.div>
              </div>
              <motion.div 
                className={`relative h-72 lg:h-96 rounded-2xl overflow-hidden ${index % 2 === 1 ? 'lg:order-1' : ''}`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <img src={serviceImages[index]} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-slate-950/45" />
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  index % 4 === 0 ? 'from-brand-600/30 to-indigo-900/30' :
                  index % 4 === 1 ? 'from-emerald-600/30 to-teal-900/30' :
                  index % 4 === 2 ? 'from-purple-600/30 to-violet-900/30' :
                  'from-orange-600/30 to-red-900/30'
                }`} />
                <div className="absolute inset-0 grid-bg opacity-30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="text-8xl opacity-20"
                    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  >
                    {iconMap[service.icon]}
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      <motion.section 
        className="py-20 bg-gray-50 dark:bg-surface-darker"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <SectionTitle title="Need a Custom Solution?" subtitle="We tailor our services to meet your unique business requirements." />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button to="/contact" magnetic icon="→">Contact Our Team</Button>
          </motion.div>
        </div>
      </motion.section>
    </main>
  )
}
