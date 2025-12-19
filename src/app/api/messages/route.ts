// Admin-only endpoint for message management
import { NextResponse } from 'next/server'
import { getMessages, markAsRead, deleteMessage } from '@/lib/messages'
import { requireAuth } from '@/lib/auth'
import { logger } from '@/lib/logger'

export async function GET() {
    try {
        await requireAuth() // Require authentication
        const messages = await getMessages()
        return NextResponse.json(messages)
    } catch (error) {
        logger.error('Get messages error', { error })
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        await requireAuth() // Require authentication
        const body = await request.json()

        if (body.action === 'read' && body.id) {
            await markAsRead(body.id)
            return NextResponse.json({ success: true })
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    } catch (error) {
        logger.error('Mark as read error', { error })
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        await requireAuth() // Require authentication
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        await deleteMessage(id)
        return NextResponse.json({ success: true })
    } catch (error) {
        logger.error('Delete message error', { error })
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}

