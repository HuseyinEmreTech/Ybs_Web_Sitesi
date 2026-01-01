import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const getAuthSecret = () => {
    const secret = process.env.AUTH_SECRET
    return new TextEncoder().encode(secret || 'development_secret_key_change_in_production')
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // 1. Define protected routes
    const isAdminRoute = pathname.startsWith('/admin')
    const isApiAdminRoute = pathname.startsWith('/api/users') ||
        pathname.startsWith('/api/settings') ||
        pathname.startsWith('/api/messages') ||
        pathname.startsWith('/api/organization')

    // 2. Allow access to login page
    if (pathname === '/admin') {
        return NextResponse.next()
    }

    // 3. Check for auth token
    if (isAdminRoute || isApiAdminRoute) {
        const token = request.cookies.get('admin_token')?.value

        if (!token) {
            if (isApiAdminRoute) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }
            return NextResponse.redirect(new URL('/admin', request.url))
        }

        try {
            // Verify JWT
            await jwtVerify(token, getAuthSecret())
            return NextResponse.next()
        } catch (error) {
            // Token invalid or expired
            if (isApiAdminRoute) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }
            const response = NextResponse.redirect(new URL('/admin', request.url))
            response.cookies.delete('admin_token')
            response.cookies.delete('admin_user_info')
            return response
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public assets
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
