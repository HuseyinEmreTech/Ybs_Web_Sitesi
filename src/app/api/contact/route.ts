import { NextResponse } from 'next/server'
import { getMessages, saveMessage } from '@/lib/messages'
import { validateEmail, sanitizeString, validateLength } from '@/lib/validation'
import { logger } from '@/lib/logger'

export async function GET() {
    try {
        // This endpoint should be admin-only, but we'll keep it public for now
        // In production, add authentication check here
        const messages = await getMessages()
        return NextResponse.json(messages)
    } catch (error) {
        logger.error('Get messages error', { error })
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Only allow message creation from public endpoint
        // Admin actions (read/delete) should be in separate authenticated endpoints
        
        // Validation
        if (!body.name || !body.email || !body.message) {
            return NextResponse.json({ error: 'Ad, e-posta ve mesaj alanları zorunludur' }, { status: 400 })
        }

        // Validate email format
        if (!validateEmail(body.email)) {
            return NextResponse.json({ error: 'Geçersiz e-posta adresi' }, { status: 400 })
        }

        // Validate lengths
        if (!validateLength(body.name, 1, 100)) {
            return NextResponse.json({ error: 'Ad 1-100 karakter arasında olmalıdır' }, { status: 400 })
        }

        if (!validateLength(body.message, 10, 5000)) {
            return NextResponse.json({ error: 'Mesaj 10-5000 karakter arasında olmalıdır' }, { status: 400 })
        }

        // Sanitize inputs
        const sanitizedData = {
            name: sanitizeString(body.name, 100),
            email: body.email.toLowerCase().trim(),
            subject: sanitizeString(body.subject || 'Diğer', 200),
            message: sanitizeString(body.message, 5000)
        }

        await saveMessage(sanitizedData)

        return NextResponse.json({ success: true })

    } catch (error) {
        logger.error('Create message error', { error })
        return NextResponse.json({ error: 'Mesaj gönderilemedi' }, { status: 500 })
    }
}
