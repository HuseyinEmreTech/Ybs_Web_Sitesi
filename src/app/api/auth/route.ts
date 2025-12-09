import { NextResponse } from 'next/server'
import { validateUser } from '@/lib/data'
import { cookies } from 'next/headers'

// Simple session token generation
function generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

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

        // Create session token
        const token = generateToken()

        // Set cookie
        const cookieStore = await cookies()
        cookieStore.set('admin_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        })

        // Store session info in cookie as well (simplified approach)
        cookieStore.set('admin_user', JSON.stringify({
            email: user.email,
            name: user.name,
            imageUrl: user.imageUrl,
            role: user.role,
        }), {
            httpOnly: true,
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
        const session = cookieStore.get('admin_session')
        const userCookie = cookieStore.get('admin_user')

        if (!session || !userCookie) {
            return NextResponse.json({ authenticated: false })
        }

        const user = JSON.parse(userCookie.value)
        return NextResponse.json({
            authenticated: true,
            user,
        })
    } catch (error) {
        console.error('Session check error:', error)
        return NextResponse.json({ authenticated: false })
    }
}
