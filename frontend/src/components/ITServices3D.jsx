import { motion } from 'framer-motion'

export default function ITServices3D() {
  const services = [
    {
      id: 1,
      icon: '💻',
      title: 'Web Development',
      description: 'Modern, scalable web applications',
      color: 'from-blue-500 to-cyan-500',
      delay: 0,
    },
    {
      id: 2,
      icon: '📱',
      title: 'Mobile Apps',
      description: 'Native & cross-platform solutions',
      color: 'from-purple-500 to-pink-500',
      delay: 0.1,
    },
    {
      id: 3,
      icon: '☁️',
      title: 'Cloud Solutions',
      description: 'Secure cloud infrastructure',
      color: 'from-green-500 to-emerald-500',
      delay: 0.2,
    },
    {
      id: 4,
      icon: '🤖',
      title: 'AI & Automation',
      description: 'Intelligent automation systems',
      color: 'from-orange-500 to-red-500',
      delay: 0.3,
    },
  ]

  return (
    <div className="relative w-full perspective">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, idx) => (
          <motion.div
            key={service.id}
            className="group relative h-64"
            initial={{ opacity: 0, y: 50, rotateX: 45 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ delay: service.delay, duration: 0.8, type: 'spring' }}
          >
            {/* 3D Card Container */}
            <motion.div
              className="relative w-full h-full rounded-2xl bg-white dark:bg-surface-card border border-gray-200 dark:border-white/10 p-6 overflow-hidden shadow-lg"
              whileHover={{
                scale: 1.05,
                rotateY: 10,
                z: 100,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Gradient Background */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              {/* Light reflection effect */}
              <motion.div
                className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl opacity-0 group-hover:opacity-20"
                animate={{
                  x: [0, 20, -20, 0],
                  y: [0, 20, -20, 0],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon with 3D rotation */}
                <motion.div
                  className="text-5xl mb-4"
                  animate={{
                    rotateX: [0, 10, -10, 0],
                    rotateY: [0, 10, -10, 0],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  {service.icon}
                </motion.div>

                {/* Title and Description */}
                <motion.h3
                  className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-transparent bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-500 group-hover:to-indigo-600 transition-all"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  {service.title}
                </motion.h3>
                <motion.p
                  className="text-sm text-gray-600 dark:text-gray-400"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  {service.description}
                </motion.p>

                {/* Bottom accent line */}
                <motion.div
                  className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${service.color}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ delay: service.delay + 0.3, duration: 0.6 }}
                />
              </div>
            </motion.div>

            {/* Floating particles around card */}
            <motion.div
              className="absolute -top-2 -right-2 w-4 h-4 bg-brand-500 rounded-full opacity-0 group-hover:opacity-100"
              animate={{
                scale: [0, 1, 0],
                y: [0, -30, -60],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
