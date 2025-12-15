'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface HeroLogoProps {
    logoUrl: string
    siteName: string
}

export default function HeroLogo({ logoUrl, siteName }: HeroLogoProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.2
            }}
            className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 mx-auto"
        >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-indigo-500/30 dark:bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />

            {/* Glass Container */}
            <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="relative w-full h-full rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-2xl flex items-center justify-center p-6 sm:p-8"
            >
                <div className="relative w-full h-full rounded-full overflow-hidden shadow-inner ring-1 ring-white/30 dark:ring-white/10">
                    <Image
                        src={logoUrl}
                        alt={siteName}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </motion.div>

            {/* Orbiting Elements (Decorative) */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 -m-4 border border-indigo-500/20 rounded-full border-dashed"
            />
        </motion.div>
    )
}
