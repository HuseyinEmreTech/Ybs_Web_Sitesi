'use client'

import { useEffect, useRef } from 'react'

export default function MatrixRain() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let width = window.innerWidth
        let height = window.innerHeight

        canvas.width = width
        canvas.height = height

        const chars = '01YBS<>[]{}'
        const fontSize = 14
        const columns = Math.floor(width / fontSize)

        const drops: number[] = []
        for (let i = 0; i < columns; i++) {
            drops[i] = 1
        }

        const draw = () => {
            // Detect Dark Mode via class on html element
            const isDark = document.documentElement.classList.contains('dark')

            // Trail effect: paint over with low opacity background
            // Light mode: white trail. Dark mode: dark slate trail.
            ctx.fillStyle = isDark ? 'rgba(2, 6, 23, 0.1)' : 'rgba(248, 250, 252, 0.1)'
            ctx.fillRect(0, 0, width, height)

            // Text color
            ctx.fillStyle = isDark ? '#a78bfa' : '#6366f1' // Light purple / Indigo
            ctx.font = `${fontSize}px monospace`

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)]
                ctx.fillText(text, i * fontSize, drops[i] * fontSize)

                if (drops[i] * fontSize > height && Math.random() > 0.975) {
                    drops[i] = 0
                }
                drops[i]++
            }
        }

        const interval = setInterval(draw, 50)

        const handleResize = () => {
            width = window.innerWidth
            height = window.innerHeight
            canvas.width = width
            canvas.height = height
        }

        window.addEventListener('resize', handleResize)

        return () => {
            clearInterval(interval)
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        />
    )
}
