
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollPosition } from '../hooks/useScrollPosition'
import { useTheme } from '../context/ThemeContext'
import Button from './Button'
const employeeLoginUrl =
  'http://localhost/metamind-web/backend/frontend/employee/login.php'

const adminLoginUrl =
  'http://localhost/metamind-web/backend/frontend/admin/login.php'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Careers', path: '/careers' },
  {
    name: 'Employees',
    path: 'http://localhost/metamind-web/backend/frontend/employee/login.php'
  },
  { name: 'Contact', path: '/contact' },
]


export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const scrollY = useScrollPosition()
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const isScrolled = scrollY > 50

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  // Admin login - double click logo
  const handleLogoDoubleClick = () => {
    window.location.href =
      '/metamind-web/backend/frontend/admin/login.php'
  }

  // Employee login
  const employeeLoginUrl =
'http://localhost/metamind-web/backend/frontend/employee/login.php'
  return (
    <>
      {/* Header */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'glass dark:glass-dark shadow-lg shadow-black/5 py-3'
            : 'bg-transparent py-5'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* ================= LOGO ================= */}
            <div
  className="group flex items-center gap-3 cursor-pointer select-none"
  onDoubleClick={() => {
    window.location.href = adminLoginUrl
  }}
  title="Double-click for Admin Login"
>
  <motion.div
    className="w-13 h-13 rounded-lg flex items-center justify-center"
    whileHover={{ scale: 1.05, rotate: 3 }}
    transition={{ type: 'spring', stiffness: 400 }}
  >
    <img
      src="/METAMINDS.png"
      alt="Meta Minds Pvt Ltd"
      className="h-12 w-auto object-contain"
    />
  </motion.div>

  <div>
    <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors">
      META MINDS
    </span>
  </div>
</div>

            {/* ================= DESKTOP NAV ================= */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
  const isEmployee = link.name === 'Employees'
  const isActive = location.pathname === link.path

  if (isEmployee) {
    return (
      <a
        key={link.name}
        href={employeeLoginUrl}
        className="relative px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
      >
        {link.name}
      </a>
    )
  }

  return (
    <Link
      key={link.path}
      to={link.path}
      className="relative px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
    >
      {link.name}

      {isActive && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand-500 rounded-full"
          transition={{
            type: 'spring',
            stiffness: 380,
            damping: 30
          }}
        />
      )}
    </Link>
  )
})}
            </nav>

            {/* ================= RIGHT SIDE ================= */}
            <div className="hidden lg:flex items-center gap-4">

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                    />
                  </svg>
                )}
              </button>

              {/* Let's Talk */}
              <Button to="/contact" magnetic>
                Let&apos;s Talk
              </Button>
            </div>

            {/* ================= MOBILE BUTTON ================= */}
            <button
              className="lg:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <motion.span
                className="w-6 h-0.5 bg-gray-900 dark:bg-white block"
                animate={
                  mobileOpen
                    ? { rotate: 45, y: 4 }
                    : { rotate: 0, y: 0 }
                }
              />

              <motion.span
                className="w-6 h-0.5 bg-gray-900 dark:bg-white block"
                animate={
                  mobileOpen
                    ? { opacity: 0 }
                    : { opacity: 1 }
                }
              />

              <motion.span
                className="w-6 h-0.5 bg-gray-900 dark:bg-white block"
                animate={
                  mobileOpen
                    ? { rotate: -45, y: -4 }
                    : { rotate: 0, y: 0 }
                }
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* ================= MOBILE MENU ================= */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Menu */}
            <motion.nav
              className="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-surface-dark shadow-2xl p-8 pt-24"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 200,
              }}
            >
              <div className="flex flex-col gap-2">

                {navLinks.map((link, i) => {
  const isEmployee = link.name === 'Employees'

  return (
    <motion.div
      key={link.path}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: i * 0.05 }}
    >
      {isEmployee ? (
        <a
          href={employeeLoginUrl}
          className="block px-4 py-3 text-lg font-medium rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
        >
          {link.name}
        </a>
      ) : (
        <Link
          to={link.path}
          className={`block px-4 py-3 text-lg font-medium rounded-lg transition-colors ${
            location.pathname === link.path
              ? 'text-brand-500 bg-brand-500/10'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
          }`}
        >
          {link.name}
        </Link>
      )}
    </motion.div>
  )
})}
              </div>

              {/* Mobile Bottom Actions */}
              <div className="mt-8 flex items-center gap-4">

                <button
                  onClick={toggleTheme}
                  className="p-3 rounded-lg bg-gray-100 dark:bg-white/10"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? '☀️' : '🌙'}
                </button>

                <Button
                  to="/contact"
                  className="flex-1"
                >
                  Let&apos;s Talk
                </Button>

              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

