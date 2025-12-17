// Simple in-memory rate limiter for API routes
// For production, consider using Upstash Redis or similar

interface RateLimitStore {
    [key: string]: {
        count: number
        resetAt: number
    }
}

const store: RateLimitStore = {}

// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now()
    for (const key in store) {
        if (store[key].resetAt < now) {
            delete store[key]
        }
    }
}, 5 * 60 * 1000)

export interface RateLimitConfig {
    uniqueTokenPerInterval?: number
    interval?: number
}

export async function rateLimit(
    identifier: string,
    config: RateLimitConfig = {}
): Promise<{ success: boolean; remaining: number; resetAt: number }> {
    const { uniqueTokenPerInterval = 5, interval = 60 * 1000 } = config
    const now = Date.now()
    const resetAt = now + interval

    if (!store[identifier] || store[identifier].resetAt < now) {
        store[identifier] = {
            count: 1,
            resetAt,
        }
        return {
            success: true,
            remaining: uniqueTokenPerInterval - 1,
            resetAt,
        }
    }

    store[identifier].count++

    const remaining = uniqueTokenPerInterval - store[identifier].count

    if (remaining < 0) {
        return {
            success: false,
            remaining: 0,
            resetAt: store[identifier].resetAt,
        }
    }

    return {
        success: true,
        remaining,
        resetAt: store[identifier].resetAt,
    }
}
