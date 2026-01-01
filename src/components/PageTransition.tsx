'use client'

import { m, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface PageTransitionProps {
    children: ReactNode
}

// Premium slide-from-left animation variants
const pageVariants = {
    initial: {
        opacity: 0,
        x: -80,
        filter: 'blur(8px)',
    },
    enter: {
        opacity: 1,
        x: 0,
        filter: 'blur(0px)',
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1] as const,
            staggerChildren: 0.08,
        },
    },
    exit: {
        opacity: 0,
        x: 60,
        filter: 'blur(4px)',
        transition: {
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1] as const,
        },
    },
}

// Child element animation variants for staggered reveal
export const childVariants = {
    initial: {
        opacity: 0,
        x: -40,
        y: 10,
    },
    enter: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1] as const,
        },
    },
}

// Container variant for staggered children
export const containerVariants = {
    initial: {},
    enter: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.15,
        },
    },
}

export default function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname()

    return (
        <AnimatePresence mode="wait">
            <m.div
                key={pathname}
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
                className="page-transition-wrapper"
            >
                {children}
            </m.div>
        </AnimatePresence>
    )
}
