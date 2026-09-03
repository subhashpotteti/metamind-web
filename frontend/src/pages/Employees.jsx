import { motion } from 'framer-motion'

export default function Employees() {
  return (
    <main className="min-h-screen pt-32 pb-20">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-500/10 blur-[110px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-5 inline-block rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-500">People</span>
            <h1 className="font-display text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-6xl">Our <span className="text-gradient">Employees</span></h1>
            <p className="mt-5 text-lg leading-relaxed text-gray-600 dark:text-gray-400">Meet the people who bring meaningful technology to life.</p>
          </motion.div>

          <motion.div
            className="mx-auto mt-14 max-w-3xl rounded-3xl border border-gray-200 bg-white/80 p-10 text-center shadow-xl shadow-brand-950/5 backdrop-blur-sm dark:border-white/10 dark:bg-surface-card/80 sm:p-16"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12, duration: 0.45 }}
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-500">
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2m18 0v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M12 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">No employees to display</h2>
            <p className="mx-auto mt-3 max-w-md text-gray-600 dark:text-gray-400">Employee profiles will appear here once they are added.</p>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
