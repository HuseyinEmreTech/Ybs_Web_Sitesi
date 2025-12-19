// Authentication helper for API routes
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const getAuthSecret = () => {
    const secret = process.env.AUTH_SECRET
    if (!secret && process.env.NODE_ENV === 'production') {
        throw new Error('AUTH_SECRET environment variable is required in production')
    }
    return new TextEncoder().encode(secret || 'development_secret_key_change_in_production')
}

export async function getAuthenticatedUser() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('admin_token')?.value

        if (!token) {
            return null
        }

        const { payload } = await jwtVerify(token, getAuthSecret())
        return payload as {
            email: string
            name: string
            imageUrl?: string | null
            role: string
        }
    } catch {
        return null
    }
}

export async function requireAuth() {
    const user = await getAuthenticatedUser()
    if (!user) {
        throw new Error('Unauthorized')
    }
    return user
}

