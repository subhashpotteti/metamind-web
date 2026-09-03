import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function Preloader() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const startedAt = Date.now()
    const finish = () => {
      const remaining = Math.max(0, 650 - (Date.now() - startedAt))
      window.setTimeout(() => setVisible(false), remaining)
    }
    if (document.readyState === 'complete') finish()
    else window.addEventListener('load', finish, { once: true })
    return () => window.removeEventListener('load', finish)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-darker" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.45 } }} aria-label="Loading Meta Minds" role="status">
          <div className="text-center">
            <motion.div className="relative mx-auto mb-5 h-16 w-16 rounded-2xl  from-brand-400 to-indigo-600 shadow-[0_0_45px_rgba(51,136,255,0.45)]" animate={{ rotateY: [0, 180, 360], scale: [1, 1.08, 1] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} style={{ transformStyle: 'preserve-3d' }}>
                         <a href="/" className="flex items-center">
  <img
    src="/METAMINDS.png"
    alt="Meta Minds Pvt Ltd"
    className="h-12 w-auto object-contain"
  />
</a>
            </motion.div>
            <p className="font-display text-sm font-semibold tracking-[0.28em] text-white">META MINDS</p>
            <div className="mt-4 h-1 w-32 overflow-hidden rounded-full bg-white/10"><motion.div className="h-full rounded-full bg-brand-400" animate={{ x: ['-100%', '100%'] }} transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }} /></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
