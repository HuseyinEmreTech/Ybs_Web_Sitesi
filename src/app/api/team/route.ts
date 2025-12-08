import { NextResponse } from 'next/server'
import { getTeamMembers, saveTeamMembers, generateId, type TeamMember } from '@/lib/data'

export async function GET() {
    try {
        const members = getTeamMembers()
        return NextResponse.json(members)
    } catch (error) {
        console.error('Get team error:', error)
        return NextResponse.json({ error: 'Veriler alınamadı' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const members = getTeamMembers()

        const newMember: TeamMember = {
            id: generateId(),
            name: body.name,
            role: body.role || '',
            department: body.department || '',
            bio: body.bio || '',
            imageUrl: body.imageUrl || '',
            socialLinks: body.socialLinks || {},
            order: body.order ?? members.length,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        members.push(newMember)
        saveTeamMembers(members)

        return NextResponse.json(newMember, { status: 201 })
    } catch (error) {
        console.error('Create member error:', error)
        return NextResponse.json({ error: 'Üye oluşturulamadı' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const members = getTeamMembers()
        const index = members.findIndex(m => m.id === body.id)

        if (index === -1) {
            return NextResponse.json({ error: 'Üye bulunamadı' }, { status: 404 })
        }

        members[index] = {
            ...members[index],
            name: body.name ?? members[index].name,
            role: body.role ?? members[index].role,
            department: body.department ?? members[index].department,
            bio: body.bio ?? members[index].bio,
            imageUrl: body.imageUrl ?? members[index].imageUrl,
            socialLinks: body.socialLinks ?? members[index].socialLinks,
            order: body.order ?? members[index].order,
            updatedAt: new Date().toISOString(),
        }

        saveTeamMembers(members)
        return NextResponse.json(members[index])
    } catch (error) {
        console.error('Update member error:', error)
        return NextResponse.json({ error: 'Üye güncellenemedi' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        const members = getTeamMembers()
        const filtered = members.filter(m => m.id !== id)

        if (filtered.length === members.length) {
            return NextResponse.json({ error: 'Üye bulunamadı' }, { status: 404 })
        }

        saveTeamMembers(filtered)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete member error:', error)
        return NextResponse.json({ error: 'Üye silinemedi' }, { status: 500 })
    }
}
