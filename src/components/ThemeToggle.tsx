'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="w-10 h-10" /> // Placeholder
    }

    const isDark = resolvedTheme === 'dark'

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={clsx(
                "relative rounded-full p-2.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            )}
            aria-label={isDark ? "Aydınlık moda geç" : "Karanlık moda geç"}
        >
            <div className="relative w-6 h-6 overflow-hidden">
                {/* Sun Icon (Visible in Dark Mode -> Action: Go Light) */}
                <motion.div
                    animate={{
                        y: isDark ? 0 : 30,
                        opacity: isDark ? 1 : 0,
                        rotate: isDark ? 0 : 90
                    }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 text-yellow-500"
                >
                    <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.591a.75.75 0 101.06 1.061l1.591-1.591zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.591-1.591a.75.75 0 10-1.06 1.061l1.591 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.591a.75.75 0 001.06 1.061l1.591-1.591zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                    </svg>
                </motion.div>

                {/* Moon Icon (Visible in Light Mode -> Action: Go Dark) */}
                <motion.div
                    animate={{
                        y: isDark ? -30 : 0,
                        opacity: isDark ? 0 : 1,
                        rotate: isDark ? -90 : 0
                    }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 text-indigo-600 dark:text-indigo-400"
                >
                    <svg fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                    </svg>
                </motion.div>
            </div>
        </button>
    )
}
