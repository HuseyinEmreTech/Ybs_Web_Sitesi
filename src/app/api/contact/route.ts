import { NextResponse } from 'next/server'
import { getMessages, saveMessage, markAsRead, deleteMessage } from '@/lib/messages'

export async function GET() {
    try {
        const messages = await getMessages()
        return NextResponse.json(messages)
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Handle "mark as read" or "delete" actions if specified, otherwise strictly create
        // Assuming this route is for both public submission and admin actions for simplicity?
        // Actually, usually POST is for creation.
        // Let's check if the body has an 'action' field.

        if (body.action === 'read' && body.id) {
            await markAsRead(body.id)
            return NextResponse.json({ success: true })
        }

        if (body.action === 'delete' && body.id) {
            await deleteMessage(body.id)
            return NextResponse.json({ success: true })
        }

        // Default: Create new message
        if (!body.name || !body.email || !body.message) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
        }

        await saveMessage({
            name: body.name,
            email: body.email,
            subject: body.subject || 'Diğer',
            message: body.message
        })

        return NextResponse.json({ success: true })

    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}
