import { NextResponse } from 'next/server'
import { getEvents, createEvent, updateEvent, deleteEvent, generateSlug, type Event } from '@/lib/data'
import { requireAuth } from '@/lib/auth'
import { sanitizeString, validateLength, validateUrl } from '@/lib/validation'
import { logger } from '@/lib/logger'

export async function GET() {
    try {
        const events = await getEvents()
        return NextResponse.json(events)
    } catch (error) {
        logger.error('Get events error', { error })
        return NextResponse.json({ error: 'Veriler alınamadı' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        await requireAuth() // Require authentication
        
        const body = await request.json()

        // Validation
        if (!body.title || !validateLength(body.title, 1, 200)) {
            return NextResponse.json({ error: 'Başlık 1-200 karakter arasında olmalıdır' }, { status: 400 })
        }

        if (!body.date) {
            return NextResponse.json({ error: 'Tarih zorunludur' }, { status: 400 })
        }

        if (body.imageUrl && !validateUrl(body.imageUrl)) {
            return NextResponse.json({ error: 'Geçersiz resim URL\'si' }, { status: 400 })
        }

        // Sanitize inputs
        const sanitizedData = {
            title: sanitizeString(body.title, 200),
            slug: generateSlug(body.title),
            description: sanitizeString(body.description || '', 1000),
            content: sanitizeString(body.content || '', 50000),
            eventType: sanitizeString(body.eventType || 'Etkinlik', 50),
            date: body.date,
            time: sanitizeString(body.time || '', 20),
            location: sanitizeString(body.location || '', 200),
            imageUrl: body.imageUrl ? sanitizeString(body.imageUrl, 500) : '',
        }

        const newEvent = await createEvent(sanitizedData)

        return NextResponse.json(newEvent, { status: 201 })
    } catch (error) {
        logger.error('Create event error', { error })
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Etkinlik oluşturulamadı' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        await requireAuth() // Require authentication
        
        const body = await request.json()

        if (!body.id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        // Validation and sanitization
        const updateData: Partial<Event> = {}
        
        if (body.title) {
            if (!validateLength(body.title, 1, 200)) {
                return NextResponse.json({ error: 'Başlık 1-200 karakter arasında olmalıdır' }, { status: 400 })
            }
            updateData.title = sanitizeString(body.title, 200)
            updateData.slug = generateSlug(body.title)
        }
        
        if (body.description !== undefined) updateData.description = sanitizeString(body.description, 1000)
        if (body.content !== undefined) updateData.content = sanitizeString(body.content, 50000)
        if (body.eventType !== undefined) updateData.eventType = sanitizeString(body.eventType, 50)
        if (body.date !== undefined) updateData.date = body.date
        if (body.time !== undefined) updateData.time = sanitizeString(body.time, 20)
        if (body.location !== undefined) updateData.location = sanitizeString(body.location, 200)
        if (body.imageUrl !== undefined) {
            if (body.imageUrl && !validateUrl(body.imageUrl)) {
                return NextResponse.json({ error: 'Geçersiz resim URL\'si' }, { status: 400 })
            }
            updateData.imageUrl = body.imageUrl ? sanitizeString(body.imageUrl, 500) : ''
        }

        const updatedEvent = await updateEvent(body.id, updateData)

        return NextResponse.json(updatedEvent)
    } catch (error) {
        logger.error('Update event error', { error })
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Etkinlik güncellenemedi' }, { status: 500 })
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

        await deleteEvent(id)
        return NextResponse.json({ success: true })
    } catch (error) {
        logger.error('Delete event error', { error })
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Etkinlik silinemedi' }, { status: 500 })
    }
}
