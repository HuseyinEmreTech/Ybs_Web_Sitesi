'use client'

import { useEffect, useRef } from 'react'
import { useInView, animate } from 'framer-motion'

interface CountUpProps {
    value: number
    suffix?: string
    prefix?: string
}

export default function CountUp({ value, suffix = '', prefix = '' }: CountUpProps) {
    const ref = useRef<HTMLSpanElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })

    useEffect(() => {
        if (isInView && ref.current) {
            const controls = animate(0, value, {
                duration: 2.5,
                ease: "easeOut",
                onUpdate: (latest) => {
                    if (ref.current) {
                        ref.current.textContent = `${prefix}${latest.toFixed(0)}${suffix}`
                    }
                }
            })
            return () => controls.stop()
        }
    }, [isInView, value, suffix, prefix])

    return <span ref={ref}>0</span>
}
