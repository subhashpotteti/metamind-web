import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useMousePosition, useReducedMotion } from '../hooks/useScrollPosition'
import { images } from '../data/images'

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: (i * 17 + 7) % 100,
  top: (i * 23 + 13) % 100,
  duration: 3 + (i % 4),
  delay: (i % 5) * 0.6,
}))

export default function HeroBackground() {
  const mouse = useMousePosition()
  const reducedMotion = useReducedMotion()

  const mouseX = reducedMotion ? 0 : (mouse.x / (typeof window !== 'undefined' ? window.innerWidth : 1) - 0.5) * 30
  const mouseY = reducedMotion ? 0 : (mouse.y / (typeof window !== 'undefined' ? window.innerHeight : 1) - 0.5) * 30

  const particles = useMemo(() => PARTICLES, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      <img src={images.heroOffice} alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-95 dark:opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/65 to-white/25 dark:from-surface-dark/55 dark:via-surface-dark/25 dark:to-surface-dark/25" />

      <motion.div
        className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-brand-600/20 blur-[120px]"
        animate={reducedMotion ? {} : {
          x: [0, 50, -30, 0],
          y: [0, -40, 30, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        style={{ x: mouseX * 0.5, y: mouseY * 0.5 }}
      />
      <motion.div
        className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[100px]"
        animate={reducedMotion ? {} : {
          x: [0, -40, 30, 0],
          y: [0, 30, -20, 0],
          scale: [1, 0.95, 1.05, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        style={{ x: -mouseX * 0.3, y: -mouseY * 0.3 }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-[80px]"
        animate={reducedMotion ? {} : {
          x: [0, 20, -15, 0],
          y: [0, -25, 15, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />

      {!reducedMotion && (
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(51,136,255,0.08) 0%, transparent 70%)',
            left: mouse.x - 200,
            top: mouse.y - 200,
          }}
          transition={{ type: 'spring', damping: 30, stiffness: 200 }}
        />
      )}

      {!reducedMotion && particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 rounded-full bg-brand-400/40"
          style={{ left: `${p.left}%`, top: `${p.top}%` }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {!reducedMotion && (
        <>
          <motion.div
            className="absolute top-1/4 left-[15%] w-16 h-16 border border-brand-500/20 rounded-lg"
            animate={{ rotate: 360, y: [0, -20, 0] }}
            transition={{ rotate: { duration: 30, repeat: Infinity, ease: 'linear' }, y: { duration: 6, repeat: Infinity } }}
            style={{ x: mouseX * 0.8, y: mouseY * 0.8 }}
          />
          <motion.div
            className="absolute bottom-1/3 right-[20%] w-12 h-12 border border-indigo-500/20 rounded-full"
            animate={{ rotate: -360, y: [0, 15, 0] }}
            transition={{ rotate: { duration: 25, repeat: Infinity, ease: 'linear' }, y: { duration: 5, repeat: Infinity } }}
            style={{ x: -mouseX * 0.6, y: -mouseY * 0.6 }}
          />
          <motion.div
            className="absolute top-[60%] left-[40%] w-8 h-8 bg-brand-500/10 rounded-sm"
            animate={{ rotate: 180, scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
            style={{ x: mouseX * 0.4 }}
          />
          <motion.svg
            className="absolute top-[20%] right-[30%] w-20 h-20 text-brand-500/10"
            viewBox="0 0 100 100"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            style={{ x: mouseX * 0.5, y: mouseY * 0.5 }}
          >
            <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="none" stroke="currentColor" strokeWidth="1" />
          </motion.svg>
        </>
      )}

      {/* Floating 3D service network: cloud, data, and automation in motion. */}
      <motion.div
        className="absolute hidden lg:block right-[5%] top-1/2 -translate-y-1/2 w-[34rem] h-[34rem] pointer-events-none"
        initial={{ opacity: 0, scale: 0.85, rotateX: 18 }}
        animate={reducedMotion ? { opacity: 0.88, scale: 1 } : { opacity: 1, scale: [1, 1.035, 1], y: [0, -18, 0], rotateZ: [0, 1.5, 0] }}
        transition={{ opacity: { duration: 1.2 }, scale: { duration: 1.2 }, y: { duration: 6, repeat: Infinity, ease: 'easeInOut' }, rotateZ: { duration: 9, repeat: Infinity, ease: 'easeInOut' } }}
        style={{ perspective: 1200, x: mouseX * 0.25, y: mouseY * 0.25 }}
      >
        <motion.div
          className="absolute inset-[16%] rounded-[2.25rem] border border-brand-400/35 bg-white/10 dark:bg-brand-500/10 shadow-[0_28px_90px_rgba(26,104,245,0.3)] backdrop-blur-sm"
          animate={reducedMotion ? {} : { rotateY: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="absolute inset-5 rounded-3xl border border-indigo-400/20" />
          <div className="absolute inset-0 m-auto w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-400 to-indigo-600 shadow-[0_18px_45px_rgba(51,136,255,0.45)] flex items-center justify-center text-white text-3xl font-bold" style={{ transform: 'translateZ(42px)' }}>
            &lt;/&gt;
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-2 rounded-full border border-brand-400/25"
          animate={reducedMotion ? {} : { rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        >
          <ServiceNode className="-top-4 left-1/2 -translate-x-1/2" label="AI" />
          <ServiceNode className="top-1/2 -right-4 -translate-y-1/2" label="☁" />
          <ServiceNode className="-bottom-4 left-1/2 -translate-x-1/2" label="{}" />
          <ServiceNode className="top-1/2 -left-4 -translate-y-1/2" label="⌁" />
        </motion.div>

        <motion.div
          className="absolute inset-12 rounded-full border border-dashed border-indigo-400/30"
          animate={reducedMotion ? {} : { rotate: -360 }}
          transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute left-0 top-1/2 w-full h-px bg-gradient-to-r from-transparent via-brand-400/30 to-transparent" />
        <div className="absolute top-0 left-1/2 h-full w-px bg-gradient-to-b from-transparent via-brand-400/20 to-transparent" />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-surface-dark" />
    </div>
  )
}

function ServiceNode({ className, label }) {
  return (
    <div className={`absolute ${className} w-10 h-10 rounded-xl border border-brand-300/40 bg-white/80 dark:bg-surface-card/90 shadow-lg flex items-center justify-center text-xs font-bold text-brand-600 dark:text-brand-300`}>
      {label}
    </div>
  )
}
