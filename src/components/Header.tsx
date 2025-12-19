'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import { ThemeToggle } from '@/components/ThemeToggle'
import AnimatedGradientText from '@/components/AnimatedGradientText'

import { createPortal } from 'react-dom'

function MobileMenuPortal({ children, isOpen }: { children: React.ReactNode, isOpen: boolean }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && children}
    </AnimatePresence>,
    document.body
  )
}

const navigation = [
  { name: 'Ana Sayfa', href: '/' },
  { name: 'Hakkımızda', href: '/hakkimizda' },
  { name: 'Yönetim Kurulu', href: '/ekip' },
  { name: 'Koordinatörlükler', href: '/koordinatorlukler' },
  { name: 'Etkinlikler', href: '/etkinlikler' },
  { name: 'Blog', href: '/blog' },
  { name: 'Projeler', href: '/projeler' },
  { name: 'İletişim', href: '/iletisim' },
  { name: 'Geliştirici', href: '/emegi-gecenler' },
]

interface HeaderProps {
  initialSiteName?: string
}

export default function Header({ initialSiteName = 'İste YBS Topluluğu' }: HeaderProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [siteName, setSiteName] = useState(initialSiteName)

  // Optionally update site name client-side if it changes (for admin updates)
  // This runs after initial render, so no delay for first paint
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.siteName && data.siteName !== siteName) {
          setSiteName(data.siteName)
        }
      })
      .catch(() => { })
  }, [siteName])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'glass dark:glass shadow-sm'
          : 'bg-transparent'
      )}
    >
      <nav className={clsx(
        'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8',
        scrolled ? 'h-16' : 'h-20 sm:h-24'
      )}>
        <div className="flex h-full items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <AnimatedGradientText className="font-bold text-lg sm:text-xl md:text-2xl tracking-tight hover:scale-105 transition-transform duration-300">
              {siteName}
            </AnimatedGradientText>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:gap-x-6 xl:gap-x-8 items-center">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    "relative text-sm xl:text-base font-semibold transition-colors group whitespace-nowrap",
                    isActive ? "text-indigo-600 dark:text-indigo-400" : "text-foreground hover:text-slate-600 dark:hover:text-slate-300"
                  )}
                >
                  {item.name}
                  <span className={clsx(
                    "absolute inset-x-0 -bottom-1 h-0.5 bg-indigo-600 dark:bg-indigo-400 transition-transform origin-left",
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )} />
                </Link>
              )
            })}
            {/* Theme Toggle Desktop */}
            <div className="pl-4 border-l border-slate-200 dark:border-slate-700 ml-4">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex items-center gap-3 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="p-2 -mr-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menüyü aç"
            >
              {mobileMenuOpen ? (
                <svg
                  suppressHydrationWarning
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  suppressHydrationWarning
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileMenuPortal isOpen={mobileMenuOpen}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-[9999] bg-white dark:bg-slate-950 flex flex-col pt-20 sm:pt-24 px-4 sm:px-6 overflow-y-auto"
          >
            {/* Close Button at top right explicitly */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              aria-label="Menüyü kapat"
            >
              <svg className="h-7 w-7 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <motion.div
              className="flex flex-col gap-3 sm:gap-4 mt-6 sm:mt-8"
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
                closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
              }}
            >
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <motion.div
                    key={item.name}
                    variants={{
                      open: { y: 0, opacity: 1 },
                      closed: { y: 20, opacity: 0 }
                    }}
                  >
                    <Link
                      href={item.href}
                      className={clsx(
                        "block px-4 py-3 sm:py-4 text-lg sm:text-xl font-semibold rounded-xl transition-all",
                        isActive
                          ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                          : "text-foreground hover:bg-slate-100 dark:hover:bg-slate-800/50"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>
        </MobileMenuPortal>
      </nav>
    </motion.header >
  )
}
