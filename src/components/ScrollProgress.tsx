'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function ScrollProgress() {
    const pathname = usePathname()
    const { scrollYProgress } = useScroll()

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    // Only show on blog posts (assuming /blog/[slug] structure or just /blog)
    // Adjust logic as needed. If strict blog post, maybe check if pathname starts with /blog/ and has more segments.
    if (!pathname.startsWith('/blog')) return null

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 origin-left z-[100]"
            style={{ scaleX }}
        />
    )
}
