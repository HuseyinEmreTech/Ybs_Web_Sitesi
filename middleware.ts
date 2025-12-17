import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// Secret for JWT signing
// In production, this should be a strong secret in env variables
const AUTH_SECRET = new TextEncoder().encode(
    process.env.AUTH_SECRET || 'development_secret_key_change_in_production'
)

export async function middleware(request: NextRequest) {
    const response = NextResponse.next()

    // 1. Add Security Headers
    const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://cdn.sanity.io https://lh3.googleusercontent.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
`

    response.headers.set('Content-Security-Policy', cspHeader.replace(/\s{2,}/g, ' ').trim())
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')

    // 2. Authentication Check for Admin Routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Allow public access to login page
        if (request.nextUrl.pathname === '/admin') {
            // If already logged in, redirect to dashboard
            const token = request.cookies.get('admin_token')?.value
            if (token) {
                try {
                    await jwtVerify(token, AUTH_SECRET)
                    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
                } catch (error) {
                    // Invalid token, stay on login page
                }
            }
            return response
        }

        // Check authentication for protected routes
        const token = request.cookies.get('admin_token')?.value

        if (!token) {
            return NextResponse.redirect(new URL('/admin', request.url))
        }

        try {
            await jwtVerify(token, AUTH_SECRET)
        } catch (error) {
            // Invalid token
            return NextResponse.redirect(new URL('/admin', request.url))
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
