'use client'

import { useEffect, useRef } from 'react'

export default function MatrixRain() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

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
        const columns = Math.ceil(width / fontSize)

        const drops: number[] = []
        for (let i = 0; i < columns; i++) {
            drops[i] = 1
        }

        let animationFrameId: number
        let lastTime = 0
        const fps = 30 // Limit to 30fps for "vintage" feel and performance
        const interval = 1000 / fps

        const draw = (currentTime: number) => {
            if (currentTime - lastTime < interval) {
                animationFrameId = requestAnimationFrame(draw)
                return
            }
            lastTime = currentTime

            // Detect Dark Mode via class on html element
            const isDark = document.documentElement.classList.contains('dark')

            // Trail effect: paint over with low opacity background
            ctx.fillStyle = isDark ? 'rgba(2, 6, 23, 0.1)' : 'rgba(248, 250, 252, 0.1)'
            ctx.fillRect(0, 0, width, height)

            // Text color
            ctx.fillStyle = isDark ? '#a78bfa' : '#6366f1' // Light purple / Indigo
            ctx.font = `${fontSize}px monospace`

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)]
                const x = i * fontSize
                const y = drops[i] * fontSize

                ctx.fillText(text, x, y)

                if (y > height && Math.random() > 0.975) {
                    drops[i] = 0
                }
                drops[i]++
            }
            animationFrameId = requestAnimationFrame(draw)
        }

        const handleResize = () => {
            width = window.innerWidth
            height = window.innerHeight
            canvas.width = width
            canvas.height = height
            const newColumns = Math.ceil(width / fontSize)
            // Preserve existing drops if possible, or reset if growing too much
            if (newColumns > drops.length) {
                for (let i = drops.length; i < newColumns; i++) {
                    drops[i] = 1
                }
            }
        }

        window.addEventListener('resize', handleResize)

        // Intersection Observer to pause when not visible
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                lastTime = performance.now()
                animationFrameId = requestAnimationFrame(draw)
            } else {
                cancelAnimationFrame(animationFrameId)
            }
        })

        if (containerRef.current) {
            observer.observe(containerRef.current)
        } else {
            // Fallback if no container ref (shouldn't happen with current setup but safe)
            animationFrameId = requestAnimationFrame(draw)
        }

        return () => {
            cancelAnimationFrame(animationFrameId)
            window.removeEventListener('resize', handleResize)
            observer.disconnect()
        }
    }, [])

    return (
        <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full opacity-20"
            />
        </div>
    )
}
