import { useState } from 'react'
import { motion } from 'framer-motion'
import Button from '../components/Button'
import SectionTitle from '../components/SectionTitle'
import JobCard from '../components/JobCard'
import Modal from '../components/Modal'
import { jobs } from '../data/jobs'
import { whyWorkWithUs } from '../data/content'
import { images } from '../data/images'

export default function Careers() {
  const [selectedJob, setSelectedJob] = useState(null)

  return (
    <main>
      <section className="relative pt-32 pb-20 overflow-hidden">
        <img src={images.careersHero} alt="Creative technology team at work" className="absolute inset-0 h-full w-full object-cover opacity-20 dark:opacity-15" />
        <div className="absolute inset-0 bg-white/75 dark:bg-surface-dark/80" />
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-500/10 rounded-full blur-[120px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            className="inline-block mb-6 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Careers
          </motion.span>
          <motion.h1
            className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Build Your Future With{' '}
            <span className="text-gradient">Meta Minds.</span>
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Join a team of curious minds, engineers, designers and problem solvers building technology that matters.
          </motion.p>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle badge="Culture" title="Why Work With Us" />
          <div className="mb-8 h-52 overflow-hidden rounded-2xl">
            <img src={images.culture} alt="Team collaborating in a modern workspace" className="h-full w-full object-cover" loading="lazy" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {whyWorkWithUs.map((item, i) => (
              <motion.div
                key={item.title}
                className="p-6 rounded-2xl bg-white dark:bg-surface-card border border-gray-200 dark:border-white/10 hover:border-brand-500/30 transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-gray-50 dark:bg-surface-darker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle badge="Open Roles" title="Open Positions" />
          <div className="grid md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} onView={setSelectedJob} />
            ))}
          </div>
        </div>
      </section>

      {/* Job Modal */}
      <Modal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title={selectedJob?.title}
      >
        {selectedJob && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-brand-500/10 text-brand-500">{selectedJob.location}</span>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-brand-500/10 text-brand-500">{selectedJob.type}</span>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-brand-500/10 text-brand-500">{selectedJob.experience}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{selectedJob.description}</p>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Responsibilities</h4>
              <ul className="space-y-2">
                {selectedJob.responsibilities.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-brand-500 mt-0.5">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Requirements</h4>
              <ul className="space-y-2">
                {selectedJob.requirements.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-brand-500 mt-0.5">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {selectedJob.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300">{skill}</span>
                ))}
              </div>
            </div>
            <Button to="/contact" className="w-full" magnetic icon="→">Apply Now</Button>
          </div>
        )}
      </Modal>
    </main>
  )
}
