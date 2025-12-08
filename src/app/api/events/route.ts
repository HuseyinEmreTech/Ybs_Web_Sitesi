import { NextResponse } from 'next/server'
import { getEvents, saveEvents, generateId, generateSlug, type Event } from '@/lib/data'

export async function GET() {
    try {
        const events = getEvents()
        return NextResponse.json(events)
    } catch (error) {
        console.error('Get events error:', error)
        return NextResponse.json({ error: 'Veriler alınamadı' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const events = getEvents()

        const newEvent: Event = {
            id: generateId(),
            title: body.title,
            slug: generateSlug(body.title),
            description: body.description || '',
            content: body.content || '',
            eventType: body.eventType || 'Etkinlik',
            date: body.date,
            time: body.time || '',
            location: body.location || '',
            imageUrl: body.imageUrl || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        events.push(newEvent)
        saveEvents(events)

        return NextResponse.json(newEvent, { status: 201 })
    } catch (error) {
        console.error('Create event error:', error)
        return NextResponse.json({ error: 'Etkinlik oluşturulamadı' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const events = getEvents()
        const index = events.findIndex(e => e.id === body.id)

        if (index === -1) {
            return NextResponse.json({ error: 'Etkinlik bulunamadı' }, { status: 404 })
        }

        events[index] = {
            ...events[index],
            title: body.title ?? events[index].title,
            slug: body.title ? generateSlug(body.title) : events[index].slug,
            description: body.description ?? events[index].description,
            content: body.content ?? events[index].content,
            eventType: body.eventType ?? events[index].eventType,
            date: body.date ?? events[index].date,
            time: body.time ?? events[index].time,
            location: body.location ?? events[index].location,
            imageUrl: body.imageUrl ?? events[index].imageUrl,
            updatedAt: new Date().toISOString(),
        }

        saveEvents(events)
        return NextResponse.json(events[index])
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

        const events = getEvents()
        const filtered = events.filter(e => e.id !== id)

        if (filtered.length === events.length) {
            return NextResponse.json({ error: 'Etkinlik bulunamadı' }, { status: 404 })
        }

        saveEvents(filtered)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete event error:', error)
        return NextResponse.json({ error: 'Etkinlik silinemedi' }, { status: 500 })
    }
}
