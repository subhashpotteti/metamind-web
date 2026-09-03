import { motion } from 'framer-motion'
import { useScrollPosition } from '../hooks/useScrollPosition'

export default function ScrollProgress() {
  const scrollY = useScrollPosition()
  const docHeight = typeof document !== 'undefined'
    ? document.documentElement.scrollHeight - window.innerHeight
    : 1
  const progress = Math.min((scrollY / docHeight) * 100, 100)

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] bg-brand-500/20 z-[60]">
      <motion.div
        className="h-full bg-brand-500 origin-left"
        style={{ scaleX: progress / 100, width: '100%' }}
      />
    </div>
  )
}
