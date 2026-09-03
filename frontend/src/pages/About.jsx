import { motion } from 'framer-motion'
import Button from '../components/Button'
import SectionTitle from '../components/SectionTitle'
import { coreValues } from '../data/content'
import { images } from '../data/images'

const timeline = [
  { year: '2016', title: 'Foundation', description: 'Meta Minds was founded with a vision to deliver enterprise-grade technology solutions.' },
  { year: '2018', title: 'Global Expansion', description: 'Expanded operations to serve clients across India, USA, and UK markets.' },
  { year: '2020', title: 'Cloud & AI Focus', description: 'Launched dedicated Cloud and AI practice areas to meet evolving market demands.' },
  { year: '2023', title: '500+ Projects', description: 'Crossed 500 successful project deliveries across multiple industries.' },
  { year: '2026', title: 'Innovation Hub', description: 'Established innovation labs focusing on AI, automation, and next-gen digital products.' },
]

export default function About() {
  return (
    <main>
      {/* Hero */}
      <motion.section 
        className="relative pt-32 pb-20 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="absolute inset-0 grid-bg opacity-40" />
        <motion.div 
          className="absolute top-1/4 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-[120px]"
          animate={{ scale: [1, 1.15, 1], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            className="inline-block mb-6 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            About Us
          </motion.span>
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 80 }}
          >
            Technology. Talent.{' '}
            <motion.span 
              className="text-gradient inline-block"
              animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              Transformation.
            </motion.span>
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            We are a global technology company helping businesses navigate digital transformation with confidence and clarity.
          </motion.p>
        </div>
      </motion.section>

      {/* Introduction */}
      <motion.section 
        className="py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 80 }}
            >
              <motion.h2 
                className="text-3xl font-bold text-gray-900 dark:text-white mb-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Who We Are
              </motion.h2>
              <motion.p 
                className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Meta Minds is a premium IT services company specializing in web development, mobile applications, cloud solutions, AI automation, and digital transformation. With over a decade of experience, we partner with forward-thinking organizations to build technology that drives measurable business outcomes.
              </motion.p>
              <motion.p 
                className="text-gray-600 dark:text-gray-400 leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                Our team of 25+ technology experts combines deep technical expertise with strategic business thinking to deliver solutions that are scalable, secure, and user-centered.
              </motion.p>
            </motion.div>
            <motion.div
              className="relative h-80 rounded-2xl bg-gradient-to-br from-brand-600/20 to-indigo-600/20 overflow-hidden"
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 80 }}
            >
              <img src={images.aboutTeam} alt="Meta Minds team collaborating in a bright office" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-950/75 via-brand-900/25 to-transparent" />
              <div className="absolute inset-0 grid-bg opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  className="text-8xl font-black text-brand-500/10"
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 2, -2, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  MM
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Timeline */}
      <motion.section 
        className="py-20 bg-gray-50 dark:bg-surface-darker"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle badge="Our Story" title="A Decade of Innovation" align="left" />
          <div className="relative">
            <motion.div 
              className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-brand-500/20 md:-translate-x-px"
              initial={{ height: 0 }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
            />
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                className={`relative flex items-center gap-8 mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, type: 'spring', stiffness: 80 }}
              >
                <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'} pl-12 md:pl-0`}>
                  <motion.span 
                    className="text-brand-500 font-bold text-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                  >
                    {item.year}
                  </motion.span>
                  <motion.h3 
                    className="text-xl font-bold text-gray-900 dark:text-white mt-1 mb-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 + 0.1 }}
                  >
                    {item.title}
                  </motion.h3>
                  <motion.p 
                    className="text-gray-600 dark:text-gray-400 text-sm"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 + 0.2 }}
                  >
                    {item.description}
                  </motion.p>
                </div>
                <motion.div 
                  className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-brand-500 md:-translate-x-1/2 ring-4 ring-brand-500/20"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, type: 'spring' }}
                  animate={{ boxShadow: ['0 0 0 0 rgba(51,136,255,0.3)', '0 0 0 10px rgba(51,136,255,0)'] }}
                />
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Mission & Vision */}
      <motion.section 
        className="py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
          {[
            { title: 'Our Mission', text: 'To empower businesses with innovative technology solutions that drive growth, efficiency, and competitive advantage in the digital economy.' },
            { title: 'Our Vision', text: 'To be the most trusted technology partner for organizations seeking to transform, innovate, and lead in their industries.' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              className="p-8 rounded-2xl bg-white dark:bg-surface-card border border-gray-200 dark:border-white/10"
              initial={{ opacity: 0, y: 50, rotateY: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, type: 'spring', stiffness: 80 }}
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(51,136,255,0.15)' }}
            >
              <motion.h3 
                className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 + 0.1 }}
              >
                {item.title}
              </motion.h3>
              <motion.p 
                className="text-gray-600 dark:text-gray-400 leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 + 0.2 }}
              >
                {item.text}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Core Values */}
      <motion.section 
        className="py-20 bg-gray-50 dark:bg-surface-darker"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle badge="Values" title="What Drives Us" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {coreValues.map((value, i) => (
              <motion.div
                key={value.title}
                className="p-6 rounded-2xl bg-white dark:bg-surface-card border border-gray-200 dark:border-white/10 text-center hover:border-brand-500/30 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 40, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, type: 'spring', stiffness: 100 }}
                whileHover={{ y: -8, scale: 1.05 }}
              >
                <motion.div 
                  className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto mb-4 text-xl font-bold"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {value.title[0]}
                </motion.div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section 
        className="py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Ready to Partner With Meta Minds?
          </motion.h2>
          <motion.p 
            className="text-gray-600 dark:text-gray-400 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Let&apos;s discuss how we can help transform your business with technology.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button to="/contact" magnetic icon="→">Get In Touch</Button>
          </motion.div>
        </div>
      </motion.section>
    </main>
  )
}
