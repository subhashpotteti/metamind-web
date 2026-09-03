import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const variants = {
  primary: 'bg-brand-600 text-white hover:bg-brand-500 shadow-lg shadow-brand-600/25 hover:shadow-brand-500/40',
  secondary: 'bg-transparent border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white hover:border-brand-500 hover:text-brand-500 dark:hover:border-brand-400 dark:hover:text-brand-400',
  ghost: 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm',
  outline: 'border-2 border-brand-500 text-brand-500 hover:bg-brand-500 hover:text-white',
}

export default function Button({
  children,
  variant = 'primary',
  to,
  href,
  className = '',
  magnetic = false,
  icon,
  onClick,
  type = 'button',
  disabled = false,
}) {
  const baseClasses = `inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold tracking-wide rounded-lg transition-all duration-300 ${variants[variant]} ${className}`

  const content = (
    <>
      {children}
      {icon && (
        <motion.span
          className="inline-block"
          initial={false}
          whileHover={{ x: 4 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          {icon}
        </motion.span>
      )}
    </>
  )

  const motionProps = magnetic
    ? {
        whileHover: { scale: 1.03 },
        whileTap: { scale: 0.97 },
        'data-magnetic': true,
      }
    : {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
      }

  if (to) {
    return (
      <motion.div {...motionProps} className="inline-block">
        <Link to={to} className={baseClasses}>
          {content}
        </Link>
      </motion.div>
    )
  }

  if (href) {
    return (
      <motion.a href={href} className={baseClasses} {...motionProps}>
        {content}
      </motion.a>
    )
  }

  return (
    <motion.button
      type={type}
      className={baseClasses}
      onClick={onClick}
      disabled={disabled}
      {...motionProps}
    >
      {content}
    </motion.button>
  )
}
