'use client'

import { m, useInView, Variant } from 'framer-motion'
import { useRef, ReactNode } from 'react'

type AnimationDirection = 'up' | 'down' | 'left' | 'right' | 'fade'

interface ScrollRevealProps {
    children: ReactNode
    direction?: AnimationDirection
    delay?: number
    duration?: number
    className?: string
    once?: boolean
    amount?: number
}

const getVariants = (direction: AnimationDirection) => {
    const directions: Record<AnimationDirection, { initial: Variant; animate: Variant }> = {
        up: {
            initial: { opacity: 0, y: 60 },
            animate: { opacity: 1, y: 0 },
        },
        down: {
            initial: { opacity: 0, y: -60 },
            animate: { opacity: 1, y: 0 },
        },
        left: {
            initial: { opacity: 0, x: -60 },
            animate: { opacity: 1, x: 0 },
        },
        right: {
            initial: { opacity: 0, x: 60 },
            animate: { opacity: 1, x: 0 },
        },
        fade: {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
        },
    }
    return directions[direction]
}

export default function ScrollReveal({
    children,
    direction = 'up',
    delay = 0,
    duration = 0.6,
    className = '',
    once = true,
    amount = 0.3,
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once, amount })
    const variants = getVariants(direction)

    return (
        <m.div
            ref={ref}
            initial="initial"
            animate={isInView ? 'animate' : 'initial'}
            variants={variants}
            transition={{
                duration,
                delay,
                ease: [0.22, 1, 0.36, 1],
            }}
            className={className}
        >
            {children}
        </m.div>
    )
}

// Staggered container for multiple children
interface StaggerContainerProps {
    children: ReactNode
    className?: string
    staggerDelay?: number
    once?: boolean
}

export function StaggerContainer({
    children,
    className = '',
    staggerDelay = 0.1,
    once = true,
}: StaggerContainerProps) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once, amount: 0.2 })

    return (
        <m.div
            ref={ref}
            initial="initial"
            animate={isInView ? 'animate' : 'initial'}
            variants={{
                initial: {},
                animate: {
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
            className={className}
        >
            {children}
        </m.div>
    )
}

// Stagger item to be used inside StaggerContainer
interface StaggerItemProps {
    children: ReactNode
    direction?: AnimationDirection
    className?: string
}

export function StaggerItem({
    children,
    direction = 'up',
    className = '',
}: StaggerItemProps) {
    const variants = getVariants(direction)

    return (
        <m.div
            variants={{
                initial: variants.initial,
                animate: {
                    ...variants.animate,
                    transition: {
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                    },
                },
            }}
            className={className}
        >
            {children}
        </m.div>
    )
}
