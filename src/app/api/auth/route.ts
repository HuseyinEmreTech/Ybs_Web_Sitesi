import { NextResponse } from 'next/server'
import { validateUser } from '@/lib/data'
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import { rateLimit } from '@/lib/rateLimit'

// Secret for JWT signing - MUST be set in production
const getAuthSecret = () => {
    const secret = process.env.AUTH_SECRET
    if (!secret && process.env.NODE_ENV === 'production') {
        throw new Error('AUTH_SECRET environment variable is required in production')
    }
    return new TextEncoder().encode(secret || 'development_secret_key_change_in_production')
}

const AUTH_SECRET = getAuthSecret()

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: 'E-posta ve şifre gerekli' },
                { status: 400 }
            )
        }

        // Rate limiting: 5 attempts per minute per IP
        const forwarded = request.headers.get('x-forwarded-for')
        const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
        const identifier = `login:${ip}`

        const { success, remaining, resetAt } = await rateLimit(identifier, {
            uniqueTokenPerInterval: 5,
            interval: 60 * 1000 // 1 minute
        })

        if (!success) {
            return NextResponse.json(
                { error: 'Çok fazla deneme. Lütfen daha sonra tekrar deneyin.' },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': new Date(resetAt).toISOString()
                    }
                }
            )
        }

        const user = await validateUser(email, password)

        if (!user) {
            return NextResponse.json(
                { error: 'Geçersiz e-posta veya şifre' },
                { status: 401 }
            )
        }

        // Create JWT
        const token = await new SignJWT({
            email: user.email,
            name: user.name,
            imageUrl: user.imageUrl,
            role: user.role
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('7d')
            .sign(AUTH_SECRET)

        // Set cookie
        const cookieStore = await cookies()
        cookieStore.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        })

        // Also set a user info cookie for client-side usage (NOT for auth verification)
        // This is safe because the actual verification happens via the httpOnly signed token
        cookieStore.set('admin_user_info', JSON.stringify({
            email: user.email,
            name: user.name,
            imageUrl: user.imageUrl,
            role: user.role,
        }), {
            httpOnly: false, // Accessible by JS for UI
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        })

        return NextResponse.json({
            success: true,
            user: {
                email: user.email,
                name: user.name,
                imageUrl: user.imageUrl,
                role: user.role,
            },
        })
    } catch (error) {
        console.error('Auth error:', error)
        return NextResponse.json(
            { error: 'Bir hata oluştu' },
            { status: 500 }
        )
    }
}

export async function DELETE() {
    try {
        const cookieStore = await cookies()
        cookieStore.delete('admin_token')
        cookieStore.delete('admin_user_info')
        // Clean up legacy cookies if they exist
        cookieStore.delete('admin_session')
        cookieStore.delete('admin_user')

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Logout error:', error)
        return NextResponse.json(
            { error: 'Çıkış yapılırken hata oluştu' },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('admin_token')?.value

        if (!token) {
            return NextResponse.json({ authenticated: false })
        }

        try {
            const { payload } = await jwtVerify(token, AUTH_SECRET)
            return NextResponse.json({
                authenticated: true,
                user: payload,
            })
        } catch (err) {
            return NextResponse.json({ authenticated: false })
        }
    } catch (error) {
        console.error('Session check error:', error)
        return NextResponse.json({ authenticated: false })
    }
}
