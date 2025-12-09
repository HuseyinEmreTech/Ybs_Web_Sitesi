import { NextResponse } from 'next/server'
import { getEvents, createEvent, updateEvent, deleteEvent, generateSlug, type Event } from '@/lib/data'

export async function GET() {
    try {
        const events = await getEvents()
        return NextResponse.json(events)
    } catch (error) {
        console.error('Get events error:', error)
        return NextResponse.json({ error: 'Veriler alınamadı' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()

        const newEvent = await createEvent({
            title: body.title,
            slug: generateSlug(body.title),
            description: body.description || '',
            content: body.content || '',
            eventType: body.eventType || 'Etkinlik',
            date: body.date,
            time: body.time || '',
            location: body.location || '',
            imageUrl: body.imageUrl || '',
        })

        return NextResponse.json(newEvent, { status: 201 })
    } catch (error) {
        console.error('Create event error:', error)
        return NextResponse.json({ error: 'Etkinlik oluşturulamadı' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()

        if (!body.id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        const updatedEvent = await updateEvent(body.id, {
            title: body.title,
            slug: body.title ? generateSlug(body.title) : undefined,
            description: body.description,
            content: body.content,
            eventType: body.eventType,
            date: body.date,
            time: body.time,
            location: body.location,
            imageUrl: body.imageUrl,
        })

        return NextResponse.json(updatedEvent)
    } catch (error) {
        console.error('Update event error:', error)
        return NextResponse.json({ error: 'Etkinlik güncellenemedi' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        await deleteEvent(id)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete event error:', error)
        return NextResponse.json({ error: 'Etkinlik silinemedi' }, { status: 500 })
    }
}
