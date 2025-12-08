'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import { ThemeToggle } from '@/components/ThemeToggle'

const navigation = [
  { name: 'Ana Sayfa', href: '/' },
  { name: 'Hakkımızda', href: '/hakkimizda' },
  { name: 'Ekibimiz', href: '/ekip' },
  { name: 'Etkinlikler', href: '/etkinlikler' },
  { name: 'Blog', href: '/blog' },
  { name: 'Projeler', href: '/projeler' },
  { name: 'İletişim', href: '/iletisim' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

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
          : 'bg-transparent h-20'
      )}
    >
      <nav className="mx-auto max-w-7xl px-6 lg:px-8 h-full">
        <div className="flex h-full items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-background font-bold text-sm">İSTE</span>
            </div>
            <span className={clsx(
              "font-bold text-lg hidden sm:block transition-colors text-foreground"
            )}>
              YBS Kulübü
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:gap-x-8 items-center">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-sm font-bold text-foreground hover:text-slate-600 dark:hover:text-slate-300 transition-colors group"
              >
                {item.name}
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            ))}
            {/* Theme Toggle Desktop */}
            <div className="pl-4 border-l border-slate-200 dark:border-slate-700 ml-4">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex items-center gap-4 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="p-2 text-slate-600 dark:text-slate-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Menüyü aç</span>
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden glass dark:bg-slate-900/90 rounded-b-2xl border-t border-slate-200/50 dark:border-white/10"
            >
              <div className="flex flex-col gap-2 p-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="px-4 py-3 text-base font-bold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-xl transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}


