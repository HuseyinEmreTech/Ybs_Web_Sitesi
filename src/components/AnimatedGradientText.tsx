'use client'

import { clsx } from "clsx"

interface AnimatedGradientTextProps {
    children: React.ReactNode
    className?: string
    from?: string
    via?: string
    to?: string
}

export default function AnimatedGradientText({
    children,
    className,
    from = "from-indigo-500",
    via = "via-purple-500",
    to = "to-pink-500",
}: AnimatedGradientTextProps) {
    return (
        <span
            className={clsx(
                "bg-clip-text text-transparent bg-gradient-to-r bg-300% animate-gradient",
                from,
                via,
                to,
                className
            )}
        >
            {children}
        </span>
    )
}
