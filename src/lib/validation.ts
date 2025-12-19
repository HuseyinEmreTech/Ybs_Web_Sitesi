// Input validation and sanitization utilities

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) && email.length <= 255
}

export function sanitizeString(input: string, maxLength: number = 1000): string {
    if (typeof input !== 'string') return ''
    // Remove potentially dangerous characters but keep Turkish characters
    return input
        .trim()
        .slice(0, maxLength)
        .replace(/[<>]/g, '') // Remove < and > to prevent XSS
}

export function sanitizeHtml(input: string): string {
    if (typeof input !== 'string') return ''
    // Basic HTML sanitization - remove script tags and event handlers
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        .replace(/javascript:/gi, '')
}

export function validateSlug(slug: string): boolean {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    return slugRegex.test(slug) && slug.length >= 1 && slug.length <= 100
}

export function validateUrl(url: string): boolean {
    if (!url) return true // Optional field
    try {
        const urlObj = new URL(url)
        return ['http:', 'https:'].includes(urlObj.protocol)
    } catch {
        return false
    }
}

export function validateLength(input: string, min: number, max: number): boolean {
    return input.length >= min && input.length <= max
}

