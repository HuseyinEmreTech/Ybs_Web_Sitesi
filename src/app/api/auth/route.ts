import { NextResponse } from 'next/server'
import { validateUser } from '@/lib/data'
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

// Secret for JWT signing
const AUTH_SECRET = new TextEncoder().encode(
    process.env.AUTH_SECRET || 'development_secret_key_change_in_production'
)

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: 'E-posta ve şifre gerekli' },
                { status: 400 }
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
