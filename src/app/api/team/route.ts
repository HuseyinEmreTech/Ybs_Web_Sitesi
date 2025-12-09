import { NextResponse } from 'next/server'
import { getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember, type TeamMember } from '@/lib/data'

export async function GET() {
    try {
        const members = await getTeamMembers()
        return NextResponse.json(members)
    } catch (error) {
        console.error('Get team error:', error)
        return NextResponse.json({ error: 'Veriler alınamadı' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const members = await getTeamMembers()

        const newMember = await createTeamMember({
            name: body.name,
            role: body.role || '',
            department: body.department || '',
            bio: body.bio || '',
            imageUrl: body.imageUrl || '',
            socialLinks: body.socialLinks || {},
            order: body.order ?? members.length,
        })

        return NextResponse.json(newMember, { status: 201 })
    } catch (error) {
        console.error('Create member error:', error)
        return NextResponse.json({ error: 'Üye oluşturulamadı' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()

        if (!body.id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        const updatedMember = await updateTeamMember(body.id, {
            name: body.name,
            role: body.role,
            department: body.department,
            bio: body.bio,
            imageUrl: body.imageUrl,
            socialLinks: body.socialLinks,
            order: body.order,
        })

        return NextResponse.json(updatedMember)
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

        await deleteTeamMember(id)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete member error:', error)
        return NextResponse.json({ error: 'Üye silinemedi' }, { status: 500 })
    }
}
